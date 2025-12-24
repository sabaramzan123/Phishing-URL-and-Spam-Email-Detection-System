import pandas as pd

# Load existing emails
emails_df = pd.read_csv("data/processed/emails_merged.csv", encoding='latin1')

# Load your custom spam emails
custom_df = pd.read_csv("data/custom/custom_spam.csv", encoding='latin1')

# Merge datasets
merged_df = pd.concat([emails_df, custom_df], ignore_index=True)

# Optional: Shuffle the dataset
merged_df = merged_df.sample(frac=1, random_state=42).reset_index(drop=True)

# Save merged dataset (optional)
merged_df.to_csv("data/processed/emails_merged_updated.csv", index=False)
print("✅ Merged dataset saved!")
