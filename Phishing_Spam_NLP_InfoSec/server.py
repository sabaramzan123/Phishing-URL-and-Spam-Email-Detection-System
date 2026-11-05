import os
import re
import json
import pickle
import pandas as pd
from urllib.parse import urlparse
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import core feature extractors and helpers from src
from src.url_features import (
    extract_url_security_features,
    classify_risk_level,
    generate_security_indicators,
    generate_url_explanation,
    is_verified_legitimate_brand_domain,
    get_url_full_nlp_pipeline
)
from src.email_preprocessing import (
    preprocess_email_nlp,
    extract_urls_from_text,
    extract_email_security_indicators,
    get_email_full_nlp_pipeline
)

app = FastAPI(
    title="Phishing & Spam Detection API",
    description="Undergraduate InfoSec Lexical URL Analyzer (19 Features) and NLP Email Classifier (TF-IDF 1-3 Grams).",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model Loading Paths
URL_MODEL_PATH = "models/url_model.pkl"
EMAIL_MODEL_PATH = "models/email_model.pkl"
METRICS_PATH = "models/model_metrics.json"

url_model = None
email_model = None
cached_metrics = None

def init_resources(force_reload: bool = False):
    """Loads models and metrics into memory."""
    global url_model, email_model, cached_metrics
    try:
        if os.path.exists(URL_MODEL_PATH) and (url_model is None or force_reload):
            with open(URL_MODEL_PATH, "rb") as f:
                url_model = pickle.load(f)
            print("[INFO] URL Security Model loaded successfully.")
    except Exception as e:
        print(f"[ERROR] Could not load URL model: {e}")

    try:
        if os.path.exists(EMAIL_MODEL_PATH) and (email_model is None or force_reload):
            with open(EMAIL_MODEL_PATH, "rb") as f:
                email_model = pickle.load(f)
            print("[INFO] Email NLP Model loaded successfully.")
    except Exception as e:
        print(f"[ERROR] Could not load Email model: {e}")

    try:
        if os.path.exists(METRICS_PATH) and (cached_metrics is None or force_reload):
            with open(METRICS_PATH, "r", encoding="utf-8") as f:
                cached_metrics = json.load(f)
            print("[INFO] Model Performance Metrics loaded successfully.")
    except Exception as e:
        print(f"[ERROR] Could not load metrics: {e}")

# Load once when module starts
init_resources()

# Verified official apex domains
VERIFIED_SAFE_APEX = [
    "google.com", "youtube.com", "gmail.com", "microsoft.com", "github.com", "github.io",
    "apple.com", "amazon.com", "wikipedia.org", "facebook.com", "instagram.com",
    "whatsapp.com", "twitter.com", "x.com", "linkedin.com", "reddit.com",
    "netflix.com", "spotify.com", "stackoverflow.com", "yahoo.com",
    "medium.com", "coursera.org", "substack.com", "adobe.com", "zoom.us", 
    "docusign.com", "telegram.org", "t.me", "paypal.com", "ebay.com", 
    "walmart.com", "cnn.com", "bbc.com", "nytimes.com", "reuters.com", 
    "bloomberg.com", "gitlab.com", "w3schools.com"
]

def is_trusted_official_domain(domain: str) -> bool:
    d = domain.lower().replace("www.", "")
    for legit in VERIFIED_SAFE_APEX:
        if d == legit or d.endswith("." + legit):
            return True
    from src.url_features import POPULAR_BRANDS, is_verified_legitimate_brand_domain
    for b in POPULAR_BRANDS:
        if is_verified_legitimate_brand_domain(d, b):
            return True
    return False

# Request Schemas
class URLRequest(BaseModel):
    url: str

class EmailRequest(BaseModel):
    subject: str = ""
    body: str = ""
    email_text: str = ""

def evaluate_url_security(raw_url: str):
    """
    Evaluates a URL using:
    - 19 Lexical Security Features
    - Random Forest Machine Learning Model
    - Heuristic Defense Overlays (Typosquatting & IP Host checks)
    - Project-defined Risk Level classification
    """
    url_clean = str(raw_url).strip()
    if not url_clean:
        raise ValueError("URL cannot be empty.")

    features = extract_url_security_features(url_clean)
    df_feat = pd.DataFrame([features])

    # 1. Base ML model probability
    rf_phish_prob = 0.5
    if url_model and hasattr(url_model, "predict_proba"):
        try:
            rf_phish_prob = float(url_model.predict_proba(df_feat)[0][1])
        except Exception:
            rf_phish_prob = 0.5
    elif url_model:
        try:
            rf_phish_prob = float(url_model.predict(df_feat)[0])
        except Exception:
            rf_phish_prob = 0.5

    try:
        parsed = urlparse(url_clean if "://" in url_clean else "http://" + url_clean)
        domain = parsed.netloc.split(":")[0].lower().replace("www.", "")
    except Exception:
        domain = ""

    is_trusted = is_trusted_official_domain(domain)
    has_ip = bool(features.get("has_ip") == 1)
    login_kw = bool(features.get("login_keyword") == 1)
    verify_kw = bool(features.get("verify_keyword") == 1)
    pwd_kw = bool(features.get("password_keyword") == 1)
    sec_kw = bool(features.get("secure_keyword") == 1)
    no_https = bool(features.get("https") == 0)

    domain_tld = domain.split(".")[-1] if "." in domain else ""
    is_suspicious_tld = domain_tld in ["xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "monster", "icu", "cam", "fit", "sbs", "cfd"]
    financial_billing_kw = bool(re.search(r"(bill|pay|invoice|wallet|crypto|banking|checkout|refund)", url_clean.lower()))

    # Hybrid Defense Integration
    # Rule 1: Brand impersonation / typosquatting
    if features.get("suspicious_patterns") == 1 and not is_trusted:
        final_prob = max(rf_phish_prob, 0.94)
    # Rule 2: IP host with login/verify keywords
    elif has_ip and (login_kw or verify_kw or pwd_kw):
        final_prob = max(rf_phish_prob, 0.96)
    # Rule 3: Multiple credential or billing keywords on unrecognized unencrypted or suspicious TLD domain
    elif not is_trusted and (login_kw or verify_kw or pwd_kw or sec_kw or financial_billing_kw) and (no_https or is_suspicious_tld or domain.count("-") >= 2):
        final_prob = max(rf_phish_prob, 0.89)
    # Rule 4: Trusted apex domain whitelist override
    elif is_trusted and not has_ip and not features.get("has_at"):
        final_prob = min(rf_phish_prob, 0.08)
    else:
        final_prob = rf_phish_prob

    # Classification
    is_suspicious = final_prob >= 0.50
    prediction = "SUSPICIOUS" if is_suspicious else "SAFE"
    phishing_probability_pct = round(final_prob * 100, 1)

    # Risk Level & Indicators
    risk_level = classify_risk_level(final_prob)
    security_indicators = generate_security_indicators(features)
    explanation = generate_url_explanation(prediction, risk_level, security_indicators)

    return {
        "url": url_clean,
        "prediction": prediction,
        "phishing_probability": phishing_probability_pct,
        "risk_level": risk_level,
        "risk_level_disclaimer": "Project-defined risk classification (LOW: <30%, MEDIUM: 30-59%, HIGH: 60-84%, CRITICAL: >=85%), not an industry universal standard.",
        "security_indicators": security_indicators,
        "features": features,
        "explanation": explanation
    }

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Phishing & Spam Detection API is running.",
        "docs": "http://localhost:8000/docs",
        "frontend": "http://localhost:3000"
    }

@app.get("/api/status")
def get_status():
    """Returns system status and model loading availability."""
    if url_model is None or email_model is None:
        init_resources()
    return {
        "status": "online",
        "url_model_loaded": bool(url_model is not None),
        "email_model_loaded": bool(email_model is not None),
        "url_model_type": type(url_model).__name__ if url_model else None,
        "email_model_type": type(email_model).__name__ if email_model else None,
    }

@app.get("/api/reload-models")
@app.post("/api/reload-models")
def reload_models():
    """Forces reloading of latest trained models and performance metrics from disk."""
    init_resources(force_reload=True)
    return {
        "status": "reloaded",
        "url_model_loaded": bool(url_model is not None),
        "email_model_loaded": bool(email_model is not None),
        "url_model_type": type(url_model).__name__ if url_model else None,
        "email_model_type": type(email_model).__name__ if email_model else None,
        "metrics_loaded": bool(cached_metrics is not None)
    }

@app.post("/api/analyze-url")
def analyze_url(req: URLRequest):
    """Analyzes a URL with 19 features, Random Forest, risk level, and security indicators."""
    if url_model is None:
        init_resources()

    raw_url = req.url.strip()
    if not raw_url:
        raise HTTPException(status_code=400, detail="URL cannot be empty.")
    
    if not url_model:
        raise HTTPException(status_code=503, detail="URL Security Model is not loaded.")

    try:
        base_res = evaluate_url_security(raw_url)
        url_pipeline = get_url_full_nlp_pipeline(raw_url, url_model, cached_metrics)
        base_res["nlp_pipeline"] = url_pipeline["pipeline_stages"]
        base_res["linguistics"] = url_pipeline.get("linguistics", {})
        base_res["ambiguities"] = url_pipeline.get("ambiguities", [])
        return base_res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing URL: {str(e)}")

@app.post("/api/analyze-email")
def analyze_email(req: EmailRequest):
    """
    Analyzes an email using:
    - Subject and Body input
    - NLP Preprocessing Pipeline (clean, lowercase, tokens, TF-IDF 1-3 grams)
    - ML Classification & Probability
    - Supporting Security Indicators (Urgent language, verification requests, etc.)
    - Automated Deep URL Security Inspection
    - Combined Security Report
    - Complete 5-Stage NLP Pipeline Inspection
    """
    if email_model is None:
        init_resources()

    subject = str(req.subject or "").strip()
    body = str(req.body or "").strip()
    
    if not subject and not body and req.email_text:
        body = req.email_text.strip()

    if not subject and not body:
        raise HTTPException(status_code=400, detail="Email subject or body cannot be empty.")

    if not email_model:
        raise HTTPException(status_code=503, detail="Email NLP Model is not loaded.")

    try:
        # 1. NLP Preprocessing Pipeline
        full_text = f"{subject} {body}".strip()
        cleaned_text = preprocess_email_nlp(subject, body)

        # 2. ML Classification & Probability
        if hasattr(email_model, "predict_proba"):
            spam_prob = float(email_model.predict_proba([cleaned_text])[0][1])
        else:
            spam_prob = float(email_model.predict([cleaned_text])[0])

        # 3. Extract Embedded URLs
        extracted_urls = extract_urls_from_text(full_text)
        urls_results = []
        has_suspicious_url = False

        for u in extracted_urls:
            u_eval = evaluate_url_security(u)
            if u_eval["prediction"] == "SUSPICIOUS":
                has_suspicious_url = True
            urls_results.append({
                "url": u,
                "prediction": u_eval["prediction"],
                "risk_level": u_eval["risk_level"],
                "phishing_probability": u_eval["phishing_probability"],
                "security_indicators": u_eval["security_indicators"][:3]
            })

        # 4. Extract Supporting NLP Security Indicators
        nlp_indicators = extract_email_security_indicators(subject, body, extracted_urls)

        # 5. Integrated Decision
        if has_suspicious_url:
            final_spam_prob = max(spam_prob, 0.93)
        elif len(nlp_indicators) >= 2 and spam_prob >= 0.30:
            final_spam_prob = max(spam_prob, 0.85)
        elif len(nlp_indicators) >= 3:
            final_spam_prob = max(spam_prob, 0.88)
        elif any("verification" in ind.lower() or "password" in ind.lower() or "payment" in ind.lower() or "financial" in ind.lower() for ind in nlp_indicators) and len(extracted_urls) > 0:
            final_spam_prob = max(spam_prob, 0.86)
        else:
            final_spam_prob = spam_prob

        is_spam = final_spam_prob >= 0.50
        email_prediction = "PHISHING / SPAM" if is_spam else "LEGITIMATE / HAM"
        spam_probability_pct = round(final_spam_prob * 100, 1)

        # 6. Combined Security Summary
        if has_suspicious_url:
            combined_summary = f"CRITICAL THREAT: Email was classified as {email_prediction} ({spam_probability_pct}%) and contains {len(urls_results)} embedded URL(s), including confirmed SUSPICIOUS links. Immediate quarantine recommended."
        elif is_spam:
            combined_summary = f"THREAT DETECTED: Email was classified as {email_prediction} ({spam_probability_pct}%) based on NLP vector analysis and detected security triggers: {', '.join(nlp_indicators[:3]) if nlp_indicators else 'spam patterns'}."
        else:
            combined_summary = f"CLEAN MESSAGE: Email was classified as {email_prediction} ({round(100 - spam_probability_pct, 1)}% benign confidence). Message conforms to legitimate interpersonal or business patterns."

        # 7. Generate Full 5-Stage NLP Pipeline
        email_pipeline_data = get_email_full_nlp_pipeline(subject, body, email_model, cached_metrics)

        return {
            "email_prediction": email_prediction,
            "is_spam": is_spam,
            "spam_probability": spam_probability_pct,
            "nlp_security_indicators": nlp_indicators,
            "urls_found_count": len(extracted_urls),
            "urls_results": urls_results,
            "combined_summary": combined_summary,
            "preprocessed_text": cleaned_text[:200],
            "nlp_pipeline": email_pipeline_data["pipeline_stages"],
            "linguistics": email_pipeline_data.get("linguistics", {}),
            "ambiguities": email_pipeline_data.get("ambiguities", [])
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing email: {str(e)}")

@app.get("/api/model-performance")
def get_model_performance():
    """Returns actual performance numbers and confusion matrices calculated on project datasets."""
    global cached_metrics
    if cached_metrics is None:
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, "r", encoding="utf-8") as f:
                cached_metrics = json.load(f)
        else:
            raise HTTPException(status_code=404, detail="Model metrics file not found.")

    return cached_metrics

if __name__ == "__main__":
    import uvicorn
    # Single worker process, no reload loops, binds to 0.0.0.0 for universal reachability
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
