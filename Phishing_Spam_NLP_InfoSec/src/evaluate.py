"""
Academic Evaluation Script for InfoSec & NLP Project Presentations
Evaluates models strictly on held-out test splits (preventing data leakage),
computes comprehensive security metrics (FPR, FNR, Precision, Recall, F1, ROC-AUC),
and outputs feature attributions for course reports.
"""

import sys
import os
import pickle
import pandas as pd

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report, confusion_matrix, 
    roc_auc_score, precision_score, recall_score, f1_score
)

URL_MODEL_PATH = "models/url_model.pkl"
EMAIL_MODEL_PATH = "models/email_model.pkl"
URL_DATA_PATH = "data/processed/urls_processed.csv"
EMAIL_DATA_PATH = "data/processed/emails_processed.csv"
SUMMARY_OUTPUT_PATH = "models/academic_evaluation_report.txt"

def evaluate_url_model():
    print("\n" + "="*50)
    print("📊 [INFOSEC] URL PHISHING MODEL ACADEMIC EVALUATION")
    print("="*50)
    
    if not os.path.exists(URL_MODEL_PATH) or not os.path.exists(URL_DATA_PATH):
        print("❌ URL Model or Dataset not found.")
        return ""

    url_model = pickle.load(open(URL_MODEL_PATH, "rb"))
    df = pd.read_csv(URL_DATA_PATH)
    
    X = df.drop(columns=["label"])
    y = df["label"]
    
    # Strictly evaluate on held-out test split (20%)
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    y_pred = url_model.predict(X_test)
    y_proba = url_model.predict_proba(X_test)[:, 1] if hasattr(url_model, "predict_proba") else y_pred
    
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    fnr = fn / (fn + tp) if (fn + tp) > 0 else 0.0
    auc = roc_auc_score(y_test, y_proba)

    report_lines = [
        "--- URL Security Model Performance (Held-out Test Split: 20%) ---",
        f"Total Test Samples: {len(y_test)} (Benign: {tn+fp}, Phishing: {fn+tp})",
        f"Accuracy:  {((tp+tn)/len(y_test))*100:.2f}%",
        f"Precision: {precision_score(y_test, y_pred)*100:.2f}%",
        f"Recall:    {recall_score(y_test, y_pred)*100:.2f}%",
        f"F1-Score:  {f1_score(y_test, y_pred)*100:.2f}%",
        f"ROC-AUC:   {auc:.4f}",
        f"False Positive Rate (FPR - False Alarms): {fpr*100:.2f}%",
        f"False Negative Rate (FNR - Missed Attacks): {fnr*100:.2f}%",
        "\n--- Confusion Matrix ---",
        f"  TN: {tn:<6} | FP: {fp:<6} (False Alarms)",
        f"  FN: {fn:<6} | TP: {tp:<6} (Detected Attacks)",
        "\n--- Classification Report ---",
        classification_report(y_test, y_pred, digits=4, zero_division=0)
    ]
    
    if hasattr(url_model, "feature_importances_"):
        report_lines.append("--- Top Information Security Features (Gini Importance) ---")
        importances = pd.Series(url_model.feature_importances_, index=X.columns)
        for feat, val in importances.sort_values(ascending=False).head(8).items():
            report_lines.append(f"  • {feat:<25}: {val:.4f}")

    output_str = "\n".join(report_lines)
    print(output_str)
    return output_str

def evaluate_email_model():
    print("\n" + "="*50)
    print("📊 [NLP] EMAIL SPAM/PHISHING MODEL ACADEMIC EVALUATION")
    print("="*50)
    
    if not os.path.exists(EMAIL_MODEL_PATH) or not os.path.exists(EMAIL_DATA_PATH):
        print("❌ Email Model or Dataset not found.")
        return ""

    email_model = pickle.load(open(EMAIL_MODEL_PATH, "rb"))
    df = pd.read_csv(EMAIL_DATA_PATH)
    
    df["email_text"] = df["email_text"].fillna("")
    X = df["email_text"]
    y = df["label"]
    
    # Strictly evaluate on held-out test split (20%)
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    y_pred = email_model.predict(X_test)
    y_proba = email_model.predict_proba(X_test)[:, 1] if hasattr(email_model, "predict_proba") else y_pred
    
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    fnr = fn / (fn + tp) if (fn + tp) > 0 else 0.0
    auc = roc_auc_score(y_test, y_proba)

    report_lines = [
        "--- Email NLP Model Performance (Held-out Test Split: 20%) ---",
        f"Total Test Samples: {len(y_test)} (Ham: {tn+fp}, Spam/Phish: {fn+tp})",
        f"Accuracy:  {((tp+tn)/len(y_test))*100:.2f}%",
        f"Precision: {precision_score(y_test, y_pred)*100:.2f}%",
        f"Recall:    {recall_score(y_test, y_pred)*100:.2f}%",
        f"F1-Score:  {f1_score(y_test, y_pred)*100:.2f}%",
        f"ROC-AUC:   {auc:.4f}",
        f"False Positive Rate (FPR - Legitimate Blocked): {fpr*100:.2f}%",
        f"False Negative Rate (FNR - Missed Threats):     {fnr*100:.2f}%",
        "\n--- Confusion Matrix ---",
        f"  TN: {tn:<6} | FP: {fp:<6} (Legitimate Blocked)",
        f"  FN: {fn:<6} | TP: {tp:<6} (Threats Caught)",
        "\n--- Classification Report ---",
        classification_report(y_test, y_pred, digits=4, zero_division=0)
    ]

    try:
        tfidf = email_model.named_steps["tfidf"]
        clf = email_model.named_steps["clf"]
        feature_names = tfidf.get_feature_names_out()
        
        if hasattr(clf, "feature_importances_"):
            report_lines.append("--- Top Influential NLP N-Gram Features (Gradient Boosting) ---")
            top_words = pd.Series(clf.feature_importances_, index=feature_names)
            for word, val in top_words.sort_values(ascending=False).head(10).items():
                report_lines.append(f"  • {word:<25}: {val:.4f}")
    except Exception as e:
        report_lines.append(f"Could not extract top features: {e}")

    output_str = "\n".join(report_lines)
    print(output_str)
    return output_str

def generate_full_academic_report():
    url_report = evaluate_url_model()
    email_report = evaluate_email_model()
    
    full_report = f"""=====================================================
CYBERSECURITY & NLP COURSE PROJECT: ACADEMIC EVALUATION REPORT
=====================================================

{url_report}

=====================================================

{email_report}

=====================================================
ACADEMIC DISCUSSION NOTES FOR PROJECT DEFENSE:
1. Tradeoff Between False Positives (FPR) and False Negatives (FNR):
   - In production security, a high FPR degrades user trust and can block critical
     business emails. Security analysts tune decision thresholds to minimize FPR.
2. N-Gram Context in TF-IDF:
   - Using (1, 3) n-grams allows the model to capture multi-word social engineering
     cues (e.g. 'verify account', 'wire transfer') rather than isolated unigrams.
3. Why ML Alone is Insufficient (Defense-in-Depth):
   - Phishing attacks that bypass TF-IDF (e.g. clean spear-phishing text) can be
     caught by embedded URL inspection and email authentication headers (SPF/DKIM).
=====================================================
"""
    with open(SUMMARY_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(full_report)
    print(f"\n✅ Complete Academic Evaluation Report saved to: {SUMMARY_OUTPUT_PATH}")

if __name__ == "__main__":
    generate_full_academic_report()