import os
import pandas as pd
import re
from urllib.parse import urlparse

# -----------------------------
# CONFIG
# -----------------------------
URL_COLUMNS = [
    "URL_Length",
    "Num_Dots",
    "Has_At",
    "Has_Hyphen",
    "Has_IP",
    "HTTPS",
    "Shortening_Service",
    "Contains_Login_Word",
    "label",
]

# -----------------------------
# UTIL
# -----------------------------
def ensure_scheme(url):
    if not isinstance(url, str):
        return ""
    if not url.lower().startswith(("http://", "https://")):
        return "http://" + url
    return url

def extract_url_features(url: str, label: int) -> dict:
    url = ensure_scheme(url)
    parsed = urlparse(url)
    domain = parsed.netloc.split(":")[0].lower().replace("www.", "")

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
        "label": label,
    }

# -----------------------------
# SAFE CSV READ
# -----------------------------
def safe_read_csv(path):
    encodings = ["utf-8", "latin1", "ISO-8859-1", "cp1252"]
    for enc in encodings:
        try:
            print(f"🔍 Reading {path} with encoding {enc}")
            return pd.read_csv(path, encoding=enc, on_bad_lines="skip")
        except Exception:
            continue
    print(f"❌ Failed to read {path}")
    return pd.DataFrame()

# -----------------------------
# MERGE DATASETS
# -----------------------------
def merge_url_datasets(phishing_files, legit_files):
    rows = []

    # Phishing URLs → label = 1
    for f in phishing_files:
        df = safe_read_csv(f)
        if df.empty:
            continue
        url_col = next((c for c in df.columns if "url" in c.lower()), None)
        if not url_col:
            continue
        for u in df[url_col].dropna():
            rows.append(extract_url_features(str(u), label=1))

    # Legitimate URLs → label = 0
    for f in legit_files:
        df = safe_read_csv(f)
        if df.empty:
            continue
        url_col = next((c for c in df.columns if "url" in c.lower()), None)
        if not url_col:
            continue
        for u in df[url_col].dropna():
            rows.append(extract_url_features(str(u), label=0))

    return pd.DataFrame(rows, columns=URL_COLUMNS)

# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":
    phishing_files = [
        "data/urls/phishing.csv",
        "data/urls/phishing1.csv",
        "data/urls/phishing2.csv",
        "data/urls/phishing3.csv",
        "data/urls/phishing4.csv",
        "data/urls/phishing5.csv",
        "data/urls/phishing6.csv",
    ]

    legit_files = [
        "data/urls/legitimate.csv"  # YOU MUST CREATE THIS
    ]

    os.makedirs("data/processed", exist_ok=True)

    df = merge_url_datasets(phishing_files, legit_files)
    df.to_csv("data/processed/phishing_urls_merged.csv", index=False)

    print("✅ URL dataset created")
    print(df["label"].value_counts())
