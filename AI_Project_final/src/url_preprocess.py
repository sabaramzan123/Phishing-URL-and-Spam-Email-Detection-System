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

SHORTENERS = ["bit.ly", "tinyurl", "t.co", "goo.gl"]

# -----------------------------
# UTIL
# -----------------------------
def ensure_scheme(url: str) -> str:
    if not isinstance(url, str):
        return ""
    if not url.lower().startswith(("http://", "https://")):
        return "http://" + url
    return url

def is_ip(domain: str) -> bool:
    parts = domain.split(".")
    if len(parts) != 4:
        return False
    try:
        return all(0 <= int(p) <= 255 for p in parts)
    except ValueError:
        return False

def extract_url_features(url: str, label: int) -> dict | None:
    try:
        url = ensure_scheme(url)
        parsed = urlparse(url)
    except Exception:
        return None  # ⬅ skip broken URLs safely

    domain = parsed.netloc.split(":")[0].lower()
    domain = domain.replace("www.", "")

    if not domain:
        return None

    return {
        "URL_Length": len(url),
        "Num_Dots": domain.count("."),
        "Has_At": int("@" in url),
        "Has_Hyphen": int("-" in domain),
        "Has_IP": int(is_ip(domain)),
        "HTTPS": int(parsed.scheme == "https"),
        "Shortening_Service": int(any(s in url.lower() for s in SHORTENERS)),
        "Contains_Login_Word": int(
            bool(re.search(r"(login|verify|account|secure|confirm)", url, re.I))
        ),
        "label": label,
    }


# -----------------------------
# SAFE CSV READ
# -----------------------------
def safe_read_csv(path: str) -> pd.DataFrame:
    for enc in ["utf-8", "latin1", "ISO-8859-1", "cp1252"]:
        try:
            print(f"📄 Reading {path} [{enc}]")
            return pd.read_csv(path, encoding=enc, on_bad_lines="skip")
        except Exception:
            continue
    print(f"❌ Failed to read {path}")
    return pd.DataFrame()

# -----------------------------
# MAIN
# -----------------------------
# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":

    INPUT_FILE = "data/processed/malicious_phish_processed.csv"
    OUTPUT_FILE = "data/processed/phishing_urls_merged.csv"

    df = safe_read_csv(INPUT_FILE)

    if "url" not in df.columns or "label" not in df.columns:
        raise ValueError("Dataset must contain 'url' and 'label' columns")

    rows = []
    seen = set()
    skipped = 0

    for _, row in df.iterrows():
        url = str(row["url"]).strip()
        label = int(row["label"])

        if not url or url in seen:
            continue

        seen.add(url)

        features = extract_url_features(url, label)
        if features is None:
            skipped += 1
            continue

        rows.append(features)

    final_df = pd.DataFrame(rows)

    os.makedirs("data/processed", exist_ok=True)
    final_df.to_csv(OUTPUT_FILE, index=False)

    print("\n✅ URL dataset created successfully")
    print("📊 Label distribution:")
    print(final_df["label"].value_counts())
    print(f"🚫 Skipped bad URLs: {skipped}")
    print(f"💾 Saved to: {OUTPUT_FILE}")