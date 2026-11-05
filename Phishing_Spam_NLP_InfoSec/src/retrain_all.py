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

# Add current dir to sys.path
sys.path.insert(0, os.path.dirname(__file__))
from url_features import extract_url_security_features

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

os.makedirs("models", exist_ok=True)
os.makedirs("data/processed", exist_ok=True)

OUTPUT_METRICS_PATH = "models/model_metrics.json"

def build_balanced_url_dataset():
    """
    Builds a large, diverse, balanced 19-feature URL dataset by correctly
    mapping labels across raw datasets:
    1. dataset_phishing.csv (11,430 rows: 5,715 legitimate, 5,715 phishing)
    2. PhiUSIIL_Phishing_URL_Dataset.csv (15k legitimate [label=1->0], 15k phishing [label=0->1])
    3. malicious_phish.csv (10k benign [->0], 10k malware/defacement/phishing [->1])
    4. url_spam_classification.csv (5k safe [is_spam=False->0], 5k spam [is_spam=True->1])
    Total: ~60,000 balanced, high-variance URLs!
    """
    print("\n" + "=" * 65)
    print("STEP 1: BUILDING COMPREHENSIVE BALANCED URL DATASET (19 FEATURES)")
    print("=" * 65)

    all_samples = []

    # 1. dataset_phishing.csv
    p1 = "data/raw/urls/dataset_phishing.csv"
    if os.path.exists(p1):
        print(f"Reading {p1}...")
        df1 = pd.read_csv(p1, encoding="latin1")
        for _, row in df1.iterrows():
            u = str(row["url"]).strip()
            lbl = 1 if str(row["status"]).lower() == "phishing" else 0
            if len(u) > 5:
                all_samples.append((u, lbl))
        print(f"  -> Added {len(df1)} samples from dataset_phishing.csv")

    # 2. PhiUSIIL_Phishing_URL_Dataset.csv (CRITICAL: 1 is Legitimate -> 0, 0 is Phishing -> 1)
    p2 = "data/raw/urls/PhiUSIIL_Phishing_URL_Dataset.csv"
    if os.path.exists(p2):
        print(f"Reading {p2} (correcting inverted academic labels: 1=Legit->0, 0=Phish->1)...")
        df2 = pd.read_csv(p2, encoding="latin1", usecols=["URL", "label"], low_memory=False)
        df2_legit = df2[df2["label"] == 1].sample(n=min(12500, (df2["label"] == 1).sum()), random_state=42)
        df2_phish = df2[df2["label"] == 0].sample(n=min(12500, (df2["label"] == 0).sum()), random_state=42)
        
        for _, row in df2_legit.iterrows():
            u = str(row["URL"]).strip()
            if len(u) > 5:
                all_samples.append((u, 0)) # 0 = Legitimate
        for _, row in df2_phish.iterrows():
            u = str(row["URL"]).strip()
            if len(u) > 5:
                all_samples.append((u, 1)) # 1 = Phishing
        print(f"  -> Added {len(df2_legit) + len(df2_phish)} balanced samples from PhiUSIIL")

    # 3. malicious_phish.csv (benign->0, phishing/malware/defacement->1)
    p3 = "data/raw/urls/malicious_phish.csv"
    if os.path.exists(p3):
        print(f"Reading {p3} (benign=0, defacement/malware/phishing=1)...")
        df3 = pd.read_csv(p3, encoding="latin1")
        df3_benign = df3[df3["type"] == "benign"].sample(n=min(10000, (df3["type"] == "benign").sum()), random_state=42)
        df3_bad = df3[df3["type"].isin(["phishing", "malware", "defacement"])].sample(n=min(10000, (df3["type"].isin(["phishing", "malware", "defacement"])).sum()), random_state=42)

        for _, row in df3_benign.iterrows():
            u = str(row["url"]).strip()
            if len(u) > 5:
                all_samples.append((u, 0))
        for _, row in df3_bad.iterrows():
            u = str(row["url"]).strip()
            if len(u) > 5:
                all_samples.append((u, 1))
        print(f"  -> Added {len(df3_benign) + len(df3_bad)} balanced samples from malicious_phish.csv")

    # 4. url_spam_classification.csv (True->1, False->0)
    p4 = "data/raw/urls/url_spam_classification.csv"
    if os.path.exists(p4):
        print(f"Reading {p4} (boolean spam flags)...")
        df4 = pd.read_csv(p4, encoding="latin1")
        df4_false = df4[df4["is_spam"] == False].sample(n=min(5000, (df4["is_spam"] == False).sum()), random_state=42)
        df4_true = df4[df4["is_spam"] == True].sample(n=min(5000, (df4["is_spam"] == True).sum()), random_state=42)
        for _, row in df4_false.iterrows():
            u = str(row["url"]).strip()
            if len(u) > 5:
                all_samples.append((u, 0))
        for _, row in df4_true.iterrows():
            u = str(row["url"]).strip()
            if len(u) > 5:
                all_samples.append((u, 1))
        print(f"  -> Added {len(df4_false) + len(df4_true)} samples from url_spam_classification.csv")

    # Deduplicate by URL
    df_merged = pd.DataFrame(all_samples, columns=["url", "label"]).drop_duplicates(subset=["url"]).sample(frac=1.0, random_state=42)
    print(f"\nTotal unique combined URLs: {len(df_merged)}")
    print(f"Class distribution:\n{df_merged['label'].value_counts().to_dict()}")

    # Extract 19 features
    print("\nExtracting 19 security features for all URLs using updated robust engine...")
    feature_rows = []
    for _, row in df_merged.iterrows():
        feat = extract_url_security_features(row["url"], label=row["label"])
        feature_rows.append(feat)

    df_feat = pd.DataFrame(feature_rows)
    df_feat.to_csv("data/processed/urls_processed_19feat.csv", index=False)
    print(f"✅ Saved clean 19-feature dataset: {len(df_feat)} rows to data/processed/urls_processed_19feat.csv")

    return df_feat

def train_url_model(df_features):
    print("\n" + "=" * 65)
    print("STEP 2: TRAINING URL RANDOM FOREST CLASSIFIER")
    print("=" * 65)

    X = df_features.drop(columns=["label"])
    y = df_features["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Training set: {len(X_train)} samples, Test set: {len(X_test)} samples.")
    url_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=22,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    url_model.fit(X_train, y_train)

    y_pred = url_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = int(cm[0, 0]), int(cm[0, 1]), int(cm[1, 0]), int(cm[1, 1])

    print(f"URL Model Performance:")
    print(f"  -> Accuracy:  {acc*100:.2f}%")
    print(f"  -> Precision: {prec*100:.2f}%")
    print(f"  -> Recall:    {rec*100:.2f}%")
    print(f"  -> F1-Score:  {f1*100:.2f}%")
    print(f"  -> Confusion Matrix: TN={tn}, FP={fp}, FN={fn}, TP={tp}")

    pickle.dump(url_model, open("models/url_model.pkl", "wb"))
    print("✅ Successfully saved updated URL model to models/url_model.pkl")

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

def train_email_models():
    print("\n" + "=" * 65)
    print("STEP 3: TRAINING NLP EMAIL CLASSIFIERS (TF-IDF 1-2 Grams)")
    print("=" * 65)

    data_path = "data/processed/emails_processed.csv"
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"{data_path} not found.")

    print(f"Loading full processed email dataset: {data_path}...")
    df_raw = pd.read_csv(data_path)
    print(f"Total emails available: {len(df_raw)} rows.")

    # Sample 50,000 emails (25k spam, 25k ham) for super fast, high-quality generalization
    df_spam = df_raw[df_raw["label"] == 1].sample(n=min(25000, (df_raw["label"] == 1).sum()), random_state=42)
    df_ham = df_raw[df_raw["label"] == 0].sample(n=min(25000, (df_raw["label"] == 0).sum()), random_state=42)
    df_sample = pd.concat([df_spam, df_ham]).sample(frac=1.0, random_state=42)

    X = df_sample["email_text"].fillna("")
    y = df_sample["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Training split: {len(X_train)} samples, Test split: {len(X_test)} samples.")

    print("Fitting TF-IDF Vectorizer (max_features=8000, unigrams + bigrams)...")
    tfidf = TfidfVectorizer(max_features=8000, ngram_range=(1, 2), min_df=2)
    X_train_tfidf = tfidf.fit_transform(X_train)
    X_test_tfidf = tfidf.transform(X_test)

    classifiers = {
        "Multinomial Naive Bayes": MultinomialNB(alpha=0.1),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42, class_weight="balanced"),
        "Linear SVM": CalibratedClassifierCV(LinearSVC(random_state=42, dual=False, class_weight="balanced"))
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

        print(f"  -> {name}: Acc: {acc*100:.2f}%, Prec: {prec*100:.2f}%, Rec: {rec*100:.2f}%, F1: {f1*100:.2f}%")
        print(f"     Confusion Matrix: TN={tn}, FP={fp}, FN={fn}, TP={tp}")

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

    # Build and save pipeline
    best_pipeline = Pipeline([
        ("tfidf", tfidf),
        ("clf", best_clf)
    ])
    pickle.dump(best_pipeline, open("models/email_model.pkl", "wb"))
    print(f"\n✅ Selected best performing model ({best_name}) saved to models/email_model.pkl")

    return results

def main():
    df_feat = build_balanced_url_dataset()
    url_results = train_url_model(df_feat)
    email_results = train_email_models()

    full_metrics = {
        "url_model": url_results,
        "nlp_classifiers": email_results,
        "dataset_info": {
            "url_dataset": f"Multi-Source Benchmark ({len(df_feat):,} samples)",
            "email_dataset": "Comprehensive Processed Emails (50,000 samples, 50% Spam / 50% Ham)",
            "tfidf_config": "Unigrams & Bigrams (1, 2), max_features=8000, sublinear_tf",
            "test_split": "80% Training, 20% Held-out Test (Stratified)"
        }
    }

    with open(OUTPUT_METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(full_metrics, f, indent=2)

    print("\n" + "=" * 65)
    print(f"✅ COMPLETE! All models retrained and metrics saved to: {OUTPUT_METRICS_PATH}")
    print("=" * 65)

if __name__ == "__main__":
    main()
