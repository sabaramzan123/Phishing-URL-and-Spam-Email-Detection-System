import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline

# Ensure models directory exists
os.makedirs("models", exist_ok=True)

data_path = "data/processed/emails_processed.csv"

if not os.path.exists(data_path):
    raise FileNotFoundError(f"Processed file not found at {data_path}. Run dataset_prep.py first.")

df = pd.read_csv(data_path)

df["email_text"] = df["email_text"].fillna("")

X = df["email_text"]
y = df["label"]

# Handle small dummy dataset edge cases safely
if len(df) < 10:
    X_train, y_train = X, y
else:
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

# Build NLP Pipeline (TF-IDF + Classifier)
email_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=5000, ngram_range=(1, 3))),
    ("clf", GradientBoostingClassifier(n_estimators=150, random_state=42))
])

# Train model
email_pipeline.fit(X_train, y_train)

# Save model
model_path = "models/email_model.pkl"
pickle.dump(email_pipeline, open(model_path, "wb"))
print(f"✅ Email NLP Model successfully trained and saved to {model_path}")