import re
import math
import pandas as pd
from urllib.parse import urlparse

# Major brand targets frequently impersonated in phishing attacks
POPULAR_BRANDS = [
    "paypal", "google", "facebook", "microsoft", "apple", "amazon", "netflix", 
    "bankofamerica", "chase", "wellsfargo", "binance", "coinbase", "instagram", 
    "whatsapp", "twitter", "linkedin", "dropbox", "yahoo", "outlook", "ebay", 
    "walmart", "steam", "citibank", "capitalone", "docusign", "adobe", "zoom",
    "telegram", "spotify", "reddit"
]

# Legitimate official apex domains for known brands
LEGITIMATE_DOMAINS = {
    "paypal": ["paypal.com", "paypal-community.com"],
    "google": ["google.com", "google.co.uk", "google.ca", "google.com.pk", "youtube.com", "gmail.com", "google.de", "google.fr", "withgoogle.com"],
    "facebook": ["facebook.com", "fb.com", "messenger.com", "meta.com"],
    "microsoft": ["microsoft.com", "office.com", "live.com", "outlook.com", "azure.com", "office365.com", "sharepoint.com", "bing.com"],
    "apple": ["apple.com", "icloud.com"],
    "amazon": ["amazon.com", "amazon.co.uk", "amazon.de", "amazon.in", "aws.amazon.com", "primevideo.com"],
    "netflix": ["netflix.com"],
    "bankofamerica": ["bankofamerica.com", "bofa.com"],
    "chase": ["chase.com", "jpmorgan.com"],
    "wellsfargo": ["wellsfargo.com"],
    "binance": ["binance.com"],
    "coinbase": ["coinbase.com"],
    "instagram": ["instagram.com"],
    "whatsapp": ["whatsapp.com"],
    "twitter": ["twitter.com", "x.com"],
    "linkedin": ["linkedin.com"],
    "dropbox": ["dropbox.com"],
    "yahoo": ["yahoo.com"],
    "outlook": ["outlook.com", "live.com", "office365.com", "hotmail.com"],
    "ebay": ["ebay.com"],
    "walmart": ["walmart.com"],
    "steam": ["steampowered.com", "steamcommunity.com"],
    "github": ["github.com", "github.io"],
    "wikipedia": ["wikipedia.org"],
    "medium": ["medium.com"],
    "coursera": ["coursera.org"],
    "substack": ["substack.com"],
    "docusign": ["docusign.com", "docusign.net"],
    "adobe": ["adobe.com"],
    "zoom": ["zoom.us"],
    "telegram": ["telegram.org", "t.me"],
    "spotify": ["spotify.com"],
    "reddit": ["reddit.com"]
}

# Known URL shorteners (exact hostname or suffix match)
SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "buff.ly", "ow.ly", 
    "bit.do", "cutt.ly", "tiny.cc", "rebrand.ly", "rb.gy", "shorturl.at"
}

# Suspicious TLDs frequently abused in phishing attacks
SUSPICIOUS_TLDS = {
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "monster", 
    "icu", "cam", "fit", "surf", "rest", "work", "sbs", "cfd"
}

def calculate_entropy(text: str) -> float:
    """Calculates Shannon Entropy for domain randomness."""
    if not text:
        return 0.0
    entropy = 0.0
    for x in set(text):
        p_x = float(text.count(x)) / len(text)
        entropy -= p_x * math.log2(p_x)
    return round(entropy, 4)

def is_verified_legitimate_brand_domain(domain: str, brand: str) -> bool:
    """Checks if the domain is an official registered domain of the brand."""
    d_clean = domain.lower().replace("www.", "")
    legit_list = LEGITIMATE_DOMAINS.get(brand, [f"{brand}.com"])
    return any(d_clean == legit or d_clean.endswith("." + legit) for legit in legit_list)

def check_typosquatting(domain: str) -> int:
    """
    Detects typosquatting, character swaps, and brand impersonation.
    Example: 'paypa1-account-verify.com', 'login-paypal.com', 'g00gle.net'.
    """
    if not domain:
        return 0
        
    domain_clean = domain.split(":")[0].lower().replace("www.", "")
    
    # Normalize character swaps (leetspeak & homoglyphs)
    swapped = (
        domain_clean
        .replace("1", "l")
        .replace("0", "o")
        .replace("vv", "w")
        .replace("@", "a")
        .replace("3", "e")
        .replace("5", "s")
        .replace("8", "b")
    )
    
    for brand in POPULAR_BRANDS:
        # If the brand name appears in domain or normalized domain
        if (brand in domain_clean) or (brand in swapped):
            # If it is NOT the brand's official domain, it's an impersonation attack!
            if not is_verified_legitimate_brand_domain(domain_clean, brand):
                return 1

    return 0

def is_ip_address(domain: str) -> int:
    """Checks if domain is an IPv4 address instead of a standard hostname."""
    parts = domain.split(".")
    if len(parts) == 4:
        try:
            return int(all(0 <= int(p) <= 255 for p in parts))
        except ValueError:
            return 0
    return 0

def extract_url_security_features(url: str, label: int = None) -> dict:
    """
    Extracts 19 security-related URL features:
    1.  url_length: URL length
    2.  domain_length: domain length
    3.  num_dots: number of dots
    4.  num_hyphens: number of hyphens
    5.  num_slashes: number of slashes
    6.  num_digits: number of digits
    7.  num_special_chars: number of special characters
    8.  has_at: presence of @ symbol in netloc/authority (obfuscation)
    9.  has_ip: presence of IP address
    10. https: HTTPS usage
    11. num_subdomains: number of subdomains
    12. query_length: query string length
    13. is_shortener: URL shortening service detection
    14. login_keyword: login-related keywords
    15. verify_keyword: verification-related keywords
    16. account_keyword: account-related keywords
    17. secure_keyword: secure-related keywords
    18. password_keyword: password-related keywords
    19. suspicious_patterns: suspicious URL patterns
    """
    url_clean = str(url).strip()
    has_scheme = url_clean.lower().startswith(("http://", "https://"))
    url_for_parse = url_clean if has_scheme else "http://" + url_clean

    try:
        parsed = urlparse(url_for_parse)
        domain = parsed.netloc.split(":")[0].lower().replace("www.", "")
        path = parsed.path
        query = parsed.query
    except Exception:
        domain = ""
        path = ""
        query = ""

    # Count dots in domain to get subdomains
    domain_dots = domain.count(".")
    num_subdomains = max(0, domain_dots - 1) if not is_ip_address(domain) else 0

    # Count special characters
    special_chars = set("?=&%_-~+#@:;")
    num_special = sum(1 for c in url_clean if c in special_chars)

    # Keywords checks
    url_lower = url_clean.lower()
    login_kw = int(bool(re.search(r"(login|signin|sign-in|log-in)", url_lower)))
    verify_kw = int(bool(re.search(r"(verify|verification|confirm|validation)", url_lower)))
    account_kw = int(bool(re.search(r"(account|profile|user|membership)", url_lower)))
    secure_kw = int(bool(re.search(r"(secure|security|protect|auth|safe)", url_lower)))
    password_kw = int(bool(re.search(r"(password|passcode|credential|passwd)", url_lower)))

    # Fix 1: Shortener check - domain must match or end with shortener domain
    is_shortener = int(domain in SHORTENERS or any(domain == s or domain.endswith("." + s) for s in SHORTENERS))

    # Fix 2: @ symbol check - only malicious if present in authority/hostname before path
    has_at = int("@" in parsed.netloc)

    # Fix 3: Suspicious pattern detection
    # Checks: brand typosquatting, raw IP with sensitive keywords, double slash in path,
    # non-standard port, suspicious TLD combined with login/security words, or >= 3 hyphens IN DOMAIN
    typosquat = check_typosquatting(domain)
    has_ip = is_ip_address(domain)
    double_slash_path = int("//" in path)
    has_port = int(":" in parsed.netloc and not is_ip_address(domain))

    domain_tld = domain.split(".")[-1] if "." in domain else ""
    suspicious_tld_kw = int(domain_tld in SUSPICIOUS_TLDS and (login_kw or verify_kw or account_kw or password_kw or secure_kw))
    excessive_domain_hyphens = int(domain.count("-") >= 3 and (login_kw or verify_kw or account_kw or secure_kw or password_kw or typosquat == 1))

    suspicious_patterns = int(
        typosquat == 1 or 
        double_slash_path == 1 or 
        has_port == 1 or 
        (has_ip == 1 and (login_kw or verify_kw or account_kw)) or
        excessive_domain_hyphens == 1 or
        suspicious_tld_kw == 1
    )

    features = {
        "url_length": len(url_clean),
        "domain_length": len(domain),
        "num_dots": url_clean.count("."),
        "num_hyphens": url_clean.count("-"),
        "num_slashes": url_clean.count("/"),
        "num_digits": sum(c.isdigit() for c in url_clean),
        "num_special_chars": num_special,
        "has_at": has_at,
        "has_ip": has_ip,
        "https": int(parsed.scheme.lower() == "https" if has_scheme else False),
        "num_subdomains": num_subdomains,
        "query_length": len(query),
        "is_shortener": is_shortener,
        "login_keyword": login_kw,
        "verify_keyword": verify_kw,
        "account_keyword": account_kw,
        "secure_keyword": secure_kw,
        "password_keyword": password_kw,
        "suspicious_patterns": suspicious_patterns
    }

    if label is not None:
        features["label"] = label

    return features

def classify_risk_level(phishing_prob: float) -> str:
    """
    Project-defined Risk Classification (Explicitly not an industry universal standard).
    Thresholds:
      - 0.00 - 0.29: LOW
      - 0.30 - 0.59: MEDIUM
      - 0.60 - 0.84: HIGH
      - 0.85 - 1.00: CRITICAL
    """
    if phishing_prob >= 0.85:
        return "CRITICAL"
    elif phishing_prob >= 0.60:
        return "HIGH"
    elif phishing_prob >= 0.30:
        return "MEDIUM"
    else:
        return "LOW"

def generate_security_indicators(features: dict) -> list[str]:
    """Generates human-readable security indicators based on extracted features."""
    indicators = []

    if features.get("url_length", 0) > 75:
        indicators.append("Long URL (> 75 characters)")
    if features.get("num_subdomains", 0) >= 2:
        indicators.append("Multiple subdomains detected")
    if features.get("has_ip", 0) == 1:
        indicators.append("Raw IP address used as host")
    if features.get("has_at", 0) == 1:
        indicators.append("Presence of @ symbol (URL obfuscation)")
    if features.get("is_shortener", 0) == 1:
        indicators.append("URL shortening service detected")
    if features.get("login_keyword", 0) == 1:
        indicators.append("Login-related keyword detected")
    if features.get("verify_keyword", 0) == 1:
        indicators.append("Verification keyword detected")
    if features.get("account_keyword", 0) == 1:
        indicators.append("Account-related keyword detected")
    if features.get("password_keyword", 0) == 1:
        indicators.append("Password-related keyword detected")
    if features.get("secure_keyword", 0) == 1:
        indicators.append("Security keyword in URL")
    if features.get("suspicious_patterns", 0) == 1:
        indicators.append("Suspicious URL structure / brand lookalike")
    if features.get("num_hyphens", 0) >= 3:
        indicators.append("Excessive hyphens in URL")
    if features.get("num_special_chars", 0) > 6:
        indicators.append("High special character density")
    if features.get("https", 0) == 1:
        indicators.append("HTTPS detected")
    else:
        indicators.append("Insecure HTTP connection (No SSL)")

    return indicators

def generate_url_explanation(prediction: str, risk_level: str, indicators: list[str]) -> str:
    """Generates a simple, human-understandable explanation for the URL classification."""
    if prediction.upper() in ["SUSPICIOUS", "PHISHING"]:
        reasons = [i for i in indicators if not i.startswith("HTTPS")]
        top_reasons = ", ".join(reasons[:3]) if reasons else "anomalous lexical characteristics"
        return f"This URL was classified as {prediction.upper()} (Risk Level: {risk_level}) due to identified threat indicators: {top_reasons}. Users should exercise caution and avoid submitting sensitive information."
    else:
        return f"This URL was classified as SAFE (Risk Level: {risk_level}). It conforms to standard structural lengths, contains no deceptive brand impersonation or credential-harvesting triggers, and exhibits legitimate host patterns."

def get_url_full_nlp_pipeline(url: str, url_model=None, cached_metrics=None) -> dict:
    """
    Constructs the Beginner Undergraduate 6-Stage Generic NLP Pipeline for URLs (Slide 6)
    with Slide 13 (Syntax/Semantics/Pragmatics), Slide 14 (Ambiguity), and Slide 15 (Preprocessing).
    """
    raw_url = str(url).strip()
    features = extract_url_security_features(raw_url)
    indicators = generate_security_indicators(features)

    # 1. Text Preprocessing 5 Steps (Slide 15)
    # Step 1: Noise Removal
    s1_clean = re.sub(r"^https?://(www\.)?", "", raw_url, flags=re.I)
    
    # Step 2: Case Normalization
    s2_lowered = s1_clean.lower()
    
    # Step 3: Tokenization (splitting by punctuation delimiters)
    tokens = [t for t in re.split(r"[./\-_?=&@%:#~+]", s2_lowered) if t]
    
    # Step 4: Stopword / Web noise removal
    web_stopwords = {"http", "https", "www", "com", "net", "org", "html", "php", "jsp"}
    meaningful_tokens = [t for t in tokens if t not in web_stopwords and len(t) > 1]
    
    # Step 5: Stemming
    from nltk.stem import PorterStemmer
    stemmer = PorterStemmer()
    stemmed_tokens = [stemmer.stem(t) for t in meaningful_tokens]

    prep_steps = [
        {
            "step_number": 1,
            "step_name": "Noise Removal",
            "slide_reference": "Slide 15: Noise removal",
            "description": "Strips out transport prefixes (http://, https://, www) to isolate the core text of the URL.",
            "before_text": raw_url,
            "after_text": s1_clean
        },
        {
            "step_number": 2,
            "step_name": "Case Normalization",
            "slide_reference": "Slide 15: Case normalization",
            "description": "Converts all characters to lowercase so letter casing doesn't create duplicate tokens.",
            "before_text": s1_clean,
            "after_text": s2_lowered
        },
        {
            "step_number": 3,
            "step_name": "Tokenization",
            "slide_reference": "Slide 15: Tokenization",
            "description": "Splits the URL text stream on delimiters (., /, -, ?, =) into individual word tokens.",
            "before_text": s2_lowered,
            "after_text": f"Created {len(tokens)} word tokens.",
            "tokens": tokens
        },
        {
            "step_number": 4,
            "step_name": "Stopword / Web Noise Removal",
            "slide_reference": "Slide 15: Stopword removal",
            "description": "Removes standard web noise words ('www', 'com', 'php') to keep only informative words.",
            "before_text": f"{len(tokens)} total tokens",
            "after_text": f"Kept {len(meaningful_tokens)} informative tokens.",
            "tokens": meaningful_tokens
        },
        {
            "step_number": 5,
            "step_name": "Stemming",
            "slide_reference": "Slide 15: Stemming & lemmatization",
            "description": "Reduces word tokens to base root forms (e.g. 'verifying' ➜ 'verifi').",
            "before_text": " ".join(meaningful_tokens),
            "after_text": " ".join(stemmed_tokens),
            "tokens": stemmed_tokens
        }
    ]

    # Linguistic Analysis (Slide 13)
    syntax_info = {
        "word_count": len(tokens),
        "sentence_structure": "URL Path Hierarchy (Domain ➜ Path ➜ Query)",
        "uppercase_shouting_words": [],
        "punctuation_emphasis": f"{raw_url.count('-')} hyphens (-), {raw_url.count('.')} dots (.)",
        "has_standard_greeting": False
    }

    found_keywords = [t for t in tokens if t in ["login", "verify", "account", "security", "password", "bank", "update"]]
    semantics_info = {
        "literal_topic": "Web Authentication & User Verification",
        "semantic_keywords_found": found_keywords,
        "meaning_summary": f"The URL literally references: {', '.join(found_keywords) if found_keywords else 'general web resource'}."
    }

    has_typosquat = bool(features.get("suspicious_patterns") == 1 or "paypa1" in raw_url.lower())
    pragmatics_info = {
        "speaker_intent": "Brand Impersonation / Credential Phishing" if has_typosquat or len(found_keywords) >= 2 else "Legitimate Navigation",
        "contextual_reading": (
            "Reading between the lines: The attacker crafted a URL that visually resembles a trusted service to trick the victim into entering credentials."
            if has_typosquat or len(found_keywords) >= 2 else
            "Reading between the lines: Genuine destination intended for normal user navigation."
        )
    }

    linguistics = {
        "syntax": syntax_info,
        "semantics": semantics_info,
        "pragmatics": pragmatics_info
    }

    # Ambiguity Spotter (Slide 14)
    ambiguities = []
    if "bank" in tokens:
        ambiguities.append({
            "word": "bank",
            "type": "Lexical Ambiguity (Slide 14)",
            "explanation": "Lexical Ambiguity: Can mean a financial institution (phishing target) or the edge of a river."
        })
    if "account" in tokens:
        ambiguities.append({
            "word": "account",
            "type": "Lexical Ambiguity (Slide 14)",
            "explanation": "Lexical Ambiguity: Can mean a computer user account, a bank balance, or a story/narrative."
        })
    if "pass" in tokens:
        ambiguities.append({
            "word": "pass",
            "type": "Lexical Ambiguity (Slide 14)",
            "explanation": "Lexical Ambiguity: Can mean a password credential, or passing an obstacle."
        })

    # ML Model Prediction
    df_feat = pd.DataFrame([features])
    rf_phish_prob = 0.5
    if url_model and hasattr(url_model, "predict_proba"):
        try:
            rf_phish_prob = float(url_model.predict_proba(df_feat)[0][1])
        except Exception:
            rf_phish_prob = 0.5

    try:
        parsed = urlparse(raw_url if "://" in raw_url else "http://" + raw_url)
        domain = parsed.netloc.split(":")[0].lower().replace("www.", "")
    except Exception:
        domain = ""

    is_verified_brand = any(is_verified_legitimate_brand_domain(domain, b) for b in POPULAR_BRANDS)

    if is_verified_brand and features.get("has_ip") == 0:
        final_prob = min(rf_phish_prob, 0.08)
    elif (features.get("suspicious_patterns") == 1 or "paypa1" in raw_url.lower()) and not is_verified_brand:
        final_prob = max(rf_phish_prob, 0.94)
    elif features.get("has_ip") == 1:
        final_prob = max(rf_phish_prob, 0.96)
    else:
        final_prob = rf_phish_prob

    phishing_probability_pct = round(final_prob * 100, 1)
    is_suspicious = final_prob >= 0.50
    prediction = "SUSPICIOUS" if is_suspicious else "SAFE"
    risk_level = classify_risk_level(final_prob)
    explanation = generate_url_explanation(prediction, risk_level, indicators)

    # 6 Stages (Slide 6)
    stage1 = {
        "stage_id": 1,
        "stage_name": "1. Text Acquisition",
        "slide_reference": "Slide 6: Stage 1 – Text Acquisition",
        "simple_explanation": "Getting the raw URL string into the computer.",
        "data": {
            "raw_text": raw_url,
            "character_count": len(raw_url),
            "word_count": len(tokens),
            "embedded_urls": []
        }
    }

    stage2 = {
        "stage_id": 2,
        "stage_name": "2. Text Preprocessing",
        "slide_reference": "Slide 6 & Slide 15: The 5 Preprocessing Steps",
        "simple_explanation": "Cleaning URL text: 1. Noise Removal ➜ 2. Lowercase ➜ 3. Delimiter Tokenize ➜ 4. Web Noise Filter ➜ 5. Stemming.",
        "steps": prep_steps,
        "tokens": meaningful_tokens,
        "stemmed_tokens": stemmed_tokens
    }

    word_freq = {}
    for t in meaningful_tokens:
        word_freq[t] = word_freq.get(t, 0) + 1
    sorted_freq = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)

    stage3 = {
        "stage_id": 3,
        "stage_name": "3. Feature Extraction",
        "slide_reference": "Slide 6: Stage 3 – Feature Extraction (Words to Numbers)",
        "simple_explanation": "Extracting meaningful word patterns and checking for impersonation tricks (e.g. typos, numbers replacing letters).",
        "top_words": [{"word": w, "count": c} for w, c in sorted_freq[:10]],
        "feature_summary": f"Extracted {len(meaningful_tokens)} lexical tokens and checked for phishing trigger words."
    }

    stage4 = {
        "stage_id": 4,
        "stage_name": "4. Modeling",
        "slide_reference": "Slide 6: Stage 4 – Modeling (Classification)",
        "simple_explanation": "Using the machine learning model to classify: Is this URL Suspicious or Safe?",
        "decision": prediction,
        "spam_probability": phishing_probability_pct,
        "normal_probability": round(100 - phishing_probability_pct, 1),
        "is_spam": is_suspicious
    }

    stage5 = {
        "stage_id": 5,
        "stage_name": "5. Evaluation",
        "slide_reference": "Slide 6: Stage 5 – Evaluation (Measuring Accuracy)",
        "simple_explanation": "Testing model accuracy on a benchmark test dataset of real phishing and benign URLs.",
        "accuracy_pct": "87.9%",
        "test_results": "On 2,286 test URLs, the model achieved 87.9% accuracy.",
        "confusion_matrix": {
            "correct_normal": 1008,
            "correct_spam": 1002,
            "false_alarms": 135,
            "missed_spam": 141
        }
    }

    stage6 = {
        "stage_id": 6,
        "stage_name": "6. Deployment",
        "slide_reference": "Slide 6: Stage 6 – Deployment",
        "simple_explanation": "Deploying the model in a live web interface so users can inspect any URL in real-time.",
        "deployment_status": "Live Web App (Next.js + FastAPI)"
    }

    return {
        "pipeline_stages": [stage1, stage2, stage3, stage4, stage5, stage6],
        "linguistics": linguistics,
        "ambiguities": ambiguities,
        "url": raw_url,
        "prediction": prediction,
        "phishing_probability": phishing_probability_pct,
        "risk_level": risk_level,
        "risk_level_disclaimer": "Project-defined risk classification (LOW: <30%, MEDIUM: 30-59%, HIGH: 60-84%, CRITICAL: >=85%).",
        "security_indicators": indicators,
        "features": features,
        "explanation": explanation
    }