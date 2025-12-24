import pandas as pd
import os

# -----------------------------
# CONFIG
# -----------------------------
TRANC0_FILE = "data/legit/top-1m.csv"
MAJESTIC_FILE = "data/legit/majestic_million.csv"
OUTPUT_FILE = "data/urls/legitimate.csv"

LIMIT_EACH = 20000  # balance size

os.makedirs("data/urls", exist_ok=True)

# -----------------------------
# LOAD TRANCO
# -----------------------------
tranco = pd.read_csv(TRANC0_FILE)
tranco_domains = tranco.iloc[:LIMIT_EACH, 1]  # domain column
tranco_urls = "https://" + tranco_domains.astype(str)

# -----------------------------
# LOAD MAJESTIC
# -----------------------------
majestic = pd.read_csv(MAJESTIC_FILE)
majestic_domains = majestic["Domain"].head(LIMIT_EACH)
majestic_urls = "https://" + majestic_domains.astype(str)

# -----------------------------
# COMBINE
# -----------------------------
legit_urls = pd.concat([tranco_urls, majestic_urls]).drop_duplicates()

df_legit = pd.DataFrame({
    "url": legit_urls,
    "label": 0
})

df_legit.to_csv(OUTPUT_FILE, index=False)

print("✅ Legitimate dataset created")
print(df_legit.shape)
