import os
import sys
import json
import pickle
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

from url_features import extract_url_security_features
from email_preprocessing import preprocess_email_nlp

# Ensure stdout supports utf-8 in Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure directories exist
os.makedirs("models", exist_ok=True)
os.makedirs("data/processed", exist_ok=True)

URL_DATA_RAW = "data/raw/urls/dataset_phishing.csv"
EMAIL_DATA_RAW = "data/raw/emails/spam_ham_dataset.csv"
OUTPUT_METRICS_PATH = "models/model_metrics.json"

def train_and_evaluate_url_model():
    print("=" * 60)
    print("TRAINING & EVALUATING URL RANDOM FOREST MODEL (19 Features)")
    print("=" * 60)

    if not os.path.exists(URL_DATA_RAW):
        raise FileNotFoundError(f"URL dataset not found at {URL_DATA_RAW}")

    df_raw = pd.read_csv(URL_DATA_RAW)
    print(f"Loaded raw URL dataset: {len(df_raw)} samples.")

    # Convert status to label (1 for phishing, 0 for legitimate)
    df_raw["label"] = df_raw["status"].apply(lambda s: 1 if str(s).lower() == "phishing" else 0)

    # Extract 19 security features for all URLs
    features_list = []
    print("Extracting 19 security features for all URLs...")
    for idx, row in df_raw.iterrows():
        u = str(row["url"]).strip()
        feat = extract_url_security_features(u, label=row["label"])
        features_list.append(feat)

    df_features = pd.DataFrame(features_list)
    df_features.to_csv("data/processed/urls_processed_19feat.csv", index=False)
    print(f"Saved 19-feature dataset: {len(df_features)} rows.")

    X = df_features.drop(columns=["label"])
    y = df_features["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    url_model = RandomForestClassifier(n_estimators=100, max_depth=16, random_state=42, n_jobs=-1)
    url_model.fit(X_train, y_train)

    y_pred = url_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = int(cm[0, 0]), int(cm[0, 1]), int(cm[1, 0]), int(cm[1, 1])

    print(f"URL Model -> Accuracy: {acc*100:.2f}%, Precision: {prec*100:.2f}%, Recall: {rec*100:.2f}%, F1: {f1*100:.2f}%")
    print(f"Confusion Matrix: TN={tn}, FP={fp}, FN={fn}, TP={tp}")

    pickle.dump(url_model, open("models/url_model.pkl", "wb"))
    print("Saved URL model to models/url_model.pkl")

    return {
        "model_name": "Random Forest Classifier (19 Features)",
        "test_samples": int(len(y_test)),
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "confusion_matrix": {
            "tn": tn,
            "fp": fp,
            "fn": fn,
            "tp": tp
        }
    }

def train_and_evaluate_email_classifiers():
    print("\n" + "=" * 60)
    print("TRAINING & EVALUATING NLP EMAIL CLASSIFIERS (TF-IDF 1-3 Grams)")
    print("=" * 60)

    if not os.path.exists(EMAIL_DATA_RAW):
        raise FileNotFoundError(f"Email dataset not found at {EMAIL_DATA_RAW}")

    df_raw = pd.read_csv(EMAIL_DATA_RAW)
    print(f"Loaded raw Email dataset: {len(df_raw)} samples.")

    # Use label_num (1 = spam, 0 = ham)
    label_col = "label_num" if "label_num" in df_raw.columns else "label"
    text_col = "text" if "text" in df_raw.columns else "email_text"

    df_raw["label"] = df_raw[label_col].apply(lambda x: 1 if str(x) in ["1", "spam"] else 0)

    print("Running NLP Preprocessing Pipeline (Subject/Body text cleaning, HTML removal, URL/email token replacement, stopwords)...")
    cleaned_texts = []
    for t in df_raw[text_col]:
        cleaned_texts.append(preprocess_email_nlp("", str(t)))

    df_raw["cleaned_text"] = cleaned_texts
    df_raw = df_raw[df_raw["cleaned_text"].str.len() > 0]

    X = df_raw["cleaned_text"]
    y = df_raw["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 3))
    X_train_tfidf = tfidf.fit_transform(X_train)
    X_test_tfidf = tfidf.transform(X_test)

    classifiers = {
        "Multinomial Naive Bayes": MultinomialNB(alpha=0.1),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Linear SVM": CalibratedClassifierCV(LinearSVC(random_state=42, dual=False))
    }

    results = []
    best_clf = None
    best_f1 = -1.0
    best_name = ""

    for name, clf in classifiers.items():
        print(f"\nTraining {name}...")
        clf.fit(X_train_tfidf, y_train)
        y_pred = clf.predict(X_test_tfidf)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred)
        tn, fp, fn, tp = int(cm[0, 0]), int(cm[0, 1]), int(cm[1, 0]), int(cm[1, 1])

        print(f" -> {name}: Accuracy: {acc*100:.2f}%, Precision: {prec*100:.2f}%, Recall: {rec*100:.2f}%, F1: {f1*100:.2f}%")
        print(f"    Confusion Matrix: TN={tn}, FP={fp}, FN={fn}, TP={tp}")

        results.append({
            "name": name,
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "confusion_matrix": {
                "tn": tn,
                "fp": fp,
                "fn": fn,
                "tp": tp
            }
        })

        if f1 > best_f1:
            best_f1 = f1
            best_clf = clf
            best_name = name

    # Save the best NLP pipeline as models/email_model.pkl
    best_pipeline = Pipeline([
        ("tfidf", tfidf),
        ("clf", best_clf)
    ])
    pickle.dump(best_pipeline, open("models/email_model.pkl", "wb"))
    print(f"\n[OK] Selected best performing model ({best_name}) saved to models/email_model.pkl")

    return results

def main():
    url_results = train_and_evaluate_url_model()
    email_results = train_and_evaluate_email_classifiers()

    full_metrics = {
        "url_model": url_results,
        "nlp_classifiers": email_results,
        "dataset_info": {
            "url_dataset": "dataset_phishing.csv (11,430 samples)",
            "email_dataset": "spam_ham_dataset.csv (5,171 samples)",
            "tfidf_config": "Unigrams, Bigrams, Trigrams (1, 3), max_features=5000",
            "test_split": "80% Training, 20% Held-out Test (Stratified)"
        }
    }

    with open(OUTPUT_METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(full_metrics, f, indent=2)

    print("\n" + "=" * 60)
    print(f"[OK] Complete Actual Performance Metrics saved to: {OUTPUT_METRICS_PATH}")
    print("=" * 60)

if __name__ == "__main__":
    main()
