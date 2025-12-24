import pandas as pd
import os

INPUT_FILE = "data/urls/malicious_phish.csv"
OUTPUT_FILE = "data/processed/malicious_phish_processed.csv"

os.makedirs("data/processed", exist_ok=True)

df = pd.read_csv(INPUT_FILE)

# Standardize column names
df.columns = [c.lower() for c in df.columns]

if "url" not in df.columns or "type" not in df.columns:
    raise ValueError("Dataset must contain 'url' and 'type' columns")

# Convert to binary label
df["label"] = df["type"].apply(
    lambda x: 0 if str(x).lower() == "benign" else 1
)

df = df[["url", "label"]].drop_duplicates()

print("📊 Label distribution:")
print(df["label"].value_counts())

df.to_csv(OUTPUT_FILE, index=False)
print(f"✅ Saved to {OUTPUT_FILE}")
