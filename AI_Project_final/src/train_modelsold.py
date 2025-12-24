import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from preprocess import extract_url_features
import os

# Create models folder if it doesn't exist
os.makedirs("models", exist_ok=True)

# ----------- TRAIN URL MODEL -----------
url_csv = "data/processed/phishing_urls_merged.csv"

if os.path.exists(url_csv):
    print(f"📄 Reading URL dataset: {url_csv}")
    url_df = pd.read_csv(url_csv)

    if "url" not in url_df.columns or "label" not in url_df.columns:
        raise ValueError("URL CSV must have 'url' and 'label' columns.")

    # Extract URL features
    X_url = url_df['url'].apply(extract_url_features).apply(pd.Series)
    y_url = url_df['label']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_url, y_url, test_size=0.2, random_state=42)

    # RandomForest for URL classification
    url_model = RandomForestClassifier(n_estimators=300, random_state=42)
    url_model.fit(X_train, y_train)

    # Save model
    pickle.dump(url_model, open("models/url_model.pkl", "wb"))
    print("✅ URL model trained and saved to models/url_model.pkl")
else:
    print(f"❌ URL CSV not found: {url_csv}")

# ----------- TRAIN EMAIL MODEL -----------
email_csv = "data/processed/emails_merged_updated.csv"

if os.path.exists(email_csv):
    print(f"📄 Reading Email dataset: {email_csv}")
    email_df = pd.read_csv(email_csv)

    if "email_text" not in email_df.columns or "label" not in email_df.columns:
        raise ValueError("Email CSV must have 'email_text' and 'label' columns.")

    X_train, X_test, y_train, y_test = train_test_split(
        email_df["email_text"], email_df["label"], test_size=0.2, random_state=42
    )

    # Pipeline with TF-IDF + GradientBoosting
    email_model = Pipeline([
        ("tfidf", TfidfVectorizer(max_features=8000, ngram_range=(1,3))),
        ("clf", GradientBoostingClassifier(n_estimators=200, random_state=42))
    ])
    email_model.fit(X_train, y_train)

    # Save model
    pickle.dump(email_model, open("models/email_model.pkl", "wb"))
    print("✅ Email model trained and saved to models/email_model.pkl")
else:
    print(f"❌ Email CSV not found: {email_csv}")
