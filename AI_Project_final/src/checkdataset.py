import pandas as pd

df = pd.read_csv("data/processed/phishing_urls_merged1.csv")
print(df["label"].value_counts())
