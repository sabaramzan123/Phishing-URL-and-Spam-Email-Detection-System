import os
import pandas as pd
import re
from urllib.parse import urlparse

def clean_html(text):
    text = re.sub(r"<[^>]+>", " ", str(text))
    return re.sub(r"\s+", " ", text).strip()

def ensure_scheme(url):
    if not url.lower().startswith(("http://", "https://")):
        return "https://" + url
    return url

def extract_url_features(url):
    url = ensure_scheme(url)
    parsed = urlparse(url)
    domain = parsed.netloc
    return {
        "URL_Length": len(url),
        "Num_Dots": domain.count("."),
        "Has_At": int("@" in url),
        "Has_Hyphen": int("-" in domain),
        "Has_IP": int(bool(re.match(r"^\d+\.\d+\.\d+\.\d+$", domain))),
        "HTTPS": int(parsed.scheme == "https"),
        "Shortening_Service": int(any(s in url for s in ["bit.ly","tinyurl","t.co","goo.gl"])),
        "Contains_Login_Word": int(bool(re.search(r"(login|verify|account|secure|confirm)", url, re.I)))
    }

def safe_read_csv(path):
    encodings = ["utf-8", "latin1", "ISO-8859-1", "cp1252"]
    for enc in encodings:
        try:
            print(f"🔍 Trying to read {path} with encoding: {enc}")
            return pd.read_csv(path, encoding=enc, on_bad_lines='skip')
        except Exception as e:
            print(f"⚠ Failed with encoding {enc}: {e}")
    print(f"❌ Could not read: {path}")
    return pd.DataFrame()

def merge_email_datasets(files):
    df_list = []
    for f in files:
        print(f"📄 Reading: {f}")
        df = safe_read_csv(f)
        if df.empty:
            print(f"⚠ Skipped unreadable file: {f}")
            continue

        if "email_text" not in df.columns:
            df.rename(columns={df.columns[0]: "email_text"}, inplace=True)

        if "label" not in df.columns:
            df["label"] = 0

        df_list.append(df)

    df = pd.concat(df_list, ignore_index=True)
    df["email_text"] = df["email_text"].apply(clean_html)
    df["label"] = df["label"].apply(lambda x: 1 if str(x).lower() in ["spam", "phishing", "1"] else 0)

    return df

if __name__ == "__main__":

    email_files = [
        "data/emails/emails.csv",
        "data/emails/verified_online.csv",
        "data/emails/enron_emails.csv",
        "data/emails/Email scam.csv",
        "data/emails/phishing_email_dataset.csv",
        "data/custom/custom_spam.csv"
    ]

    os.makedirs("data/processed", exist_ok=True)

    merged_emails = merge_email_datasets(email_files)

    merged_emails.to_csv("data/processed/emails_merged.csv", index=False)

    print("✅ DONE — Saved to data/processed/emails_merged.csv")
