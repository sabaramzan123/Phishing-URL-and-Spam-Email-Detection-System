import os
import glob
import pandas as pd
from url_features import extract_url_security_features
from email_preprocessing import preprocess_email_text

URL_RAW_DIR = "data/raw/urls"
EMAIL_RAW_DIR = "data/raw/emails"
PROCESSED_DIR = "data/processed"

os.makedirs(PROCESSED_DIR, exist_ok=True)

def find_text_and_label_cols(df):
    """Dynamically finds URL/Text and Label columns across various dataset formats."""
    cols = list(df.columns)
    
    # Text / URL column search
    text_col = None
    for c in cols:
        if any(k in c.lower() for k in ["url", "text", "body", "email", "message", "content"]):
            text_col = c
            break
    if not text_col:
        text_col = cols[0]  # Fallback to first column

    # Label column search
    label_col = None
    for c in cols:
        if any(k in c.lower() for k in ["label", "type", "class", "target", "spam", "phishing", "category"]):
            label_col = c
            break
    if not label_col and len(cols) > 1:
        label_col = cols[1]  # Fallback to second column

    return text_col, label_col

def prepare_url_dataset():
    """Reads ALL CSV files in data/raw/urls and merges them."""
    output_path = os.path.join(PROCESSED_DIR, "urls_processed.csv")
    csv_files = glob.glob(os.path.join(URL_RAW_DIR, "*.csv"))
    
    if not csv_files:
        print("⚠️ No URL CSV files found in data/raw/urls/")
        return

    print(f"📄 Found {len(csv_files)} URL CSV file(s). Processing & combining...")
    all_rows = []

    for file in csv_files:
        print(f"   -> Processing {file}...")
        try:
            df = pd.read_csv(file, encoding="latin1", on_bad_lines="skip")
            url_col, label_col = find_text_and_label_cols(df)
            
            if url_col and label_col:
                for _, row in df.iterrows():
                    u = str(row[url_col]).strip()
                    lbl_raw = str(row[label_col]).lower().strip()
                    
                    # Convert label to 1 (Phishing/Malicious) or 0 (Safe/Benign)
                    label = 1 if any(k in lbl_raw for k in ["1", "phish", "malicious", "definement", "spam", "bad"]) else 0
                    
                    if len(u) > 5 and not u.startswith("nan"):
                        feat = extract_url_security_features(u, label)
                        all_rows.append(feat)
        except Exception as e:
            print(f"⚠️ Error reading {file}: {e}")

    if all_rows:
        processed_df = pd.DataFrame(all_rows).drop_duplicates()
        processed_df.to_csv(output_path, index=False)
        print(f"✅ Total {len(processed_df)} processed URL samples saved to {output_path}")

def prepare_email_dataset():
    """Reads ALL CSV files in data/raw/emails and merges them."""
    output_path = os.path.join(PROCESSED_DIR, "emails_processed.csv")
    csv_files = glob.glob(os.path.join(EMAIL_RAW_DIR, "*.csv"))
    
    if not csv_files:
        print("⚠️ No Email CSV files found in data/raw/emails/")
        return

    print(f"📄 Found {len(csv_files)} Email CSV file(s). Processing & combining...")
    combined_dfs = []

    for file in csv_files:
        print(f"   -> Processing {file}...")
        try:
            df = pd.read_csv(file, encoding="latin1", on_bad_lines="skip")
            text_col, label_col = find_text_and_label_cols(df)
            
            if text_col and label_col:
                sub_df = pd.DataFrame()
                sub_df["email_text"] = df[text_col].astype(str).apply(preprocess_email_text)
                sub_df["label"] = df[label_col].astype(str).apply(
                    lambda x: 1 if any(k in x.lower() for k in ["1", "spam", "phish", "fraud", "bad"]) else 0
                )
                combined_dfs.append(sub_df)
        except Exception as e:
            print(f"⚠️ Error reading {file}: {e}")

    if combined_dfs:
        final_df = pd.concat(combined_dfs, ignore_index=True)
        final_df = final_df[final_df["email_text"].str.strip() != ""].drop_duplicates()
        final_df.to_csv(output_path, index=False)
        print(f"✅ Total {len(final_df)} processed Email samples saved to {output_path}")

if __name__ == "__main__":
    prepare_url_dataset()
    prepare_email_dataset()