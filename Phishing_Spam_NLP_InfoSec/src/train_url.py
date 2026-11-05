import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Ensure models directory exists
os.makedirs("models", exist_ok=True)

data_path = "data/processed/urls_processed.csv"

if not os.path.exists(data_path):
    raise FileNotFoundError(f"Processed file not found at {data_path}. Run dataset_prep.py first.")

df = pd.read_csv(data_path)

X = df.drop(columns=["label"])
y = df["label"]

# Handle small dummy dataset edge cases safely
if len(df) < 10:
    X_train, y_train = X, y
else:
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

# Train Random Forest Classifier
url_model = RandomForestClassifier(n_estimators=200, random_state=42)
url_model.fit(X_train, y_train)

# Save model
model_path = "models/url_model.pkl"
pickle.dump(url_model, open(model_path, "wb"))
print(f"✅ URL Security Model successfully trained and saved to {model_path}")