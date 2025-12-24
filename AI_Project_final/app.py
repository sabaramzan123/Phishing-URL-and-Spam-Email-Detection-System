import os
import re
import pickle
import pandas as pd
from urllib.parse import urlparse
import streamlit as st

# ==============================
# CONFIG
# ==============================
URL_MODEL_PATH = "models/url_model.pkl"
EMAIL_MODEL_PATH = "models/email_model.pkl"

URL_COLUMNS = [
    "URL_Length",
    "Num_Dots",
    "Has_At",
    "Has_Hyphen",
    "Has_IP",
    "HTTPS",
    "Shortening_Service",
    "Contains_Login_Word",
]

PHISH_THRESHOLD = 0.70

SAFE_DOMAINS = {
    "youtube.com", "google.com", "facebook.com",
    "amazon.com", "microsoft.com", "apple.com",
    "linkedin.com", "twitter.com", "github.com"
}

st.set_page_config(
    page_title="Phishing & Email Spam Detector",
    layout="wide"
)

# ==============================
# STYLING
# ==============================
def inject_css():
    css = """
    <style>
    .stApp { background: #f1f5f9; color:#111827; }
    .stButton>button { background-color:#2563eb; color:white; border-radius:6px; }
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

inject_css()

# ==============================
# UTILITIES
# ==============================
def clean_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", str(text))
    return re.sub(r"\s+", " ", text).strip()

def extract_url_features(url: str) -> dict | None:
    try:
        parsed = urlparse(url if "://" in url else "http://" + url)
    except Exception:
        return None

    domain = parsed.netloc.lower().replace("www.", "").split(":")[0]

    if not domain:
        return None

    return {
        "URL_Length": len(url),
        "Num_Dots": domain.count("."),
        "Has_At": int("@" in url),
        "Has_Hyphen": int("-" in domain),
        "Has_IP": int(bool(re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain))),
        "HTTPS": int(parsed.scheme == "https"),
        "Shortening_Service": int(
            any(s in url.lower() for s in ["bit.ly", "tinyurl", "t.co", "goo.gl"])
        ),
        "Contains_Login_Word": int(
            bool(re.search(r"(login|verify|account|secure|confirm)", url, re.I))
        ),
    }

# ==============================
# LOAD MODELS
# ==============================
@st.cache_resource
def load_models():
    if not os.path.exists(URL_MODEL_PATH) or not os.path.exists(EMAIL_MODEL_PATH):
        st.error("❌ Model files not found. Train the models first.")
        return None, None

    with open(URL_MODEL_PATH, "rb") as f:
        url_model = pickle.load(f)

    with open(EMAIL_MODEL_PATH, "rb") as f:
        email_model = pickle.load(f)

    return url_model, email_model

url_model, email_model = load_models()

# ==============================
# APP UI
# ==============================
st.title("🛡 Phishing URL & Email Spam Detector")

tabs = st.tabs(["🔗 URL Detector", "✉️ Email Scanner"])

# ==============================
# URL DETECTOR
# ==============================
with tabs[0]:
    st.header("🔗 URL Phishing Detector")

    url_input = st.text_input(
        "Enter URL:",
        placeholder="https://example.com/login"
    )

    if st.button("Analyze URL"):
        if not url_input.strip():
            st.warning("Please enter a URL.")
        elif url_model is None:
            st.error("URL model not loaded.")
        else:
            parsed = urlparse(url_input if "://" in url_input else "http://" + url_input)
            domain = parsed.netloc.lower().replace("www.", "").split(":")[0]

            # ✅ Trusted domain shortcut
            if domain in SAFE_DOMAINS:
                st.success("✅ Legitimate (Trusted Domain)")
                st.caption("This domain is widely trusted.")
            else:
                features = extract_url_features(url_input)

                if features is None:
                    st.error("Invalid URL format.")
                else:
                    X_input = pd.DataFrame([features])[URL_COLUMNS]

                    prob = url_model.predict_proba(X_input)[0][1]

                    if prob >= PHISH_THRESHOLD:
                        verdict = "🚨 Phishing"
                    elif prob >= 0.40:
                        verdict = "⚠️ Suspicious"
                    else:
                        verdict = "✅ Legitimate"

                    st.success(f"Verdict: **{verdict}**")
                    st.write(f"Phishing Probability: `{prob:.2f}`")

# ==============================
# EMAIL SCANNER
# ==============================
with tabs[1]:
    st.header("✉️ Email Spam Detector")

    email_text = st.text_area(
        "Paste email text:",
        height=250,
        placeholder="Dear user, your account needs verification..."
    )

    if st.button("Analyze Email"):
        if not email_text.strip():
            st.warning("Please paste email content.")
        elif email_model is None:
            st.error("Email model not loaded.")
        else:
            cleaned = clean_html(email_text)

            prob = email_model.predict_proba([cleaned])[0][1]

            if prob >= 0.7:
                verdict = "🚨 Spam / Phishing"
            elif prob >= 0.4:
                verdict = "⚠️ Likely Spam"
            else:
                verdict = "✅ Safe / Ham"

            st.success(f"Verdict: **{verdict}**")
            st.write(f"Spam Probability: `{prob:.2f}`")

# ==============================
# FOOTER
# ==============================
st.markdown("---")

