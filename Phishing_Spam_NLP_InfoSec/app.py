import os
import json
import pickle
import streamlit as st
import pandas as pd

# Core modules for InfoSec and NLP
from src.url_features import get_url_full_nlp_pipeline, extract_url_security_features
from src.email_preprocessing import get_email_full_nlp_pipeline, extract_urls_from_text

# Page Configuration
st.set_page_config(
    page_title="NLP Phishing & Spam Intelligence System",
    page_icon="🛡️",
    layout="wide"
)

# Custom CSS for clean styling
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1.05rem;
        color: #475569;
        margin-bottom: 1.5rem;
    }
    .stage-card {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
    }
    .token-chip {
        display: inline-block;
        background-color: #e0e7ff;
        color: #3730a3;
        padding: 2px 8px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 0.85rem;
        margin: 2px;
        border: 1px solid #c7d2fe;
    }
    .token-chip.special {
        background-color: #f3e8ff;
        color: #6b21a8;
        border-color: #d8b4fe;
    }
    .token-chip.trigger {
        background-color: #fee2e2;
        color: #991b1b;
        border-color: #fca5a5;
    }
</style>
""", unsafe_allow_html=True)

# Load Machine Learning Models and Metrics
@st.cache_resource
def load_resources():
    url_model_path = "models/url_model.pkl"
    email_model_path = "models/email_model.pkl"
    metrics_path = "models/model_metrics.json"
    
    url_model = None
    email_model = None
    metrics = None
    
    if os.path.exists(url_model_path):
        url_model = pickle.load(open(url_model_path, "rb"))
    if os.path.exists(email_model_path):
        email_model = pickle.load(open(email_model_path, "rb"))
    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            metrics = json.load(f)
        
    return url_model, email_model, metrics

url_model, email_model, cached_metrics = load_resources()

# Header
st.markdown('<div class="main-title">🛡️ NLP Phishing & Spam Detection System</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">End-to-End NLP Architecture: Text Acquisition ➜ Preprocessing ➜ Vectorization ➜ Modeling ➜ Evaluation</div>', unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.header("NLP Engine Status")
    if url_model:
        st.success("✅ URL Lexical Model (Random Forest)")
    else:
        st.error("❌ URL Model Missing")
        
    if email_model:
        st.success("✅ Email NLP Model (TF-IDF + Calibrated Classifier)")
    else:
        st.error("❌ Email Model Missing")

    st.markdown("---")
    st.markdown("### 5-Stage NLP Pipeline")
    st.markdown("""
    1. **Text Acquisition**: Raw input ingest, schema parsing, character counts
    2. **Preprocessing**: HTML strip, lowercasing, tokenization, noise removal
    3. **Vectorization**: TF-IDF 1-3 Grams / 19 Lexical features, Shannon entropy
    4. **Modeling**: Posterior class probabilities & decision boundaries
    5. **Evaluation**: Test set accuracy, precision, recall, confusion matrix
    """)

# Navigation Tabs
tab1, tab2 = st.tabs([
    "🔗 URL Lexical NLP Pipeline", 
    "📧 Email Text NLP Pipeline"
])

# =========================================================================
# TAB 1: URL DETECTION (LEXICAL SEQUENCE ANALYSIS)
# =========================================================================
with tab1:
    st.header("URL Lexical Sequence Analysis")
    st.markdown("Inspect URL text through syntactic parsing, delimiter tokenization, character n-grams, and lexical feature vectorization.")

    user_url = st.text_input(
        "Enter Target URL:", 
        value="http://paypa1-account-verify.com/login.php?user=account"
    )
    
    col_btn, _ = st.columns([1, 4])
    with col_btn:
        analyze_url_btn = st.button("🔍 Execute URL NLP Pipeline", use_container_width=True)

    if analyze_url_btn and user_url.strip():
        pipeline_res = get_url_full_nlp_pipeline(user_url.strip(), url_model, cached_metrics)
        stages = pipeline_res["pipeline_stages"]

        st.markdown("---")
        # Executive Banner
        if pipeline_res["prediction"] == "SUSPICIOUS":
            st.error(f"🚨 **PREDICTION: SUSPICIOUS / PHISHING** (Probability: **{pipeline_res['phishing_probability']}%** | Risk Level: **{pipeline_res['risk_level']}**)")
        else:
            st.success(f"✅ **PREDICTION: SAFE / BENIGN** (Probability: **{pipeline_res['phishing_probability']}%** | Risk Level: **{pipeline_res['risk_level']}**)")

        st.info(f"**Explanation:** {pipeline_res['explanation']}")

        st.markdown("### 🔬 Complete 5-Stage NLP Pipeline Walkthrough")
        s1, s2, s3, s4, s5 = st.tabs([
            "Stage 1: Text Acquisition",
            "Stage 2: Preprocessing & Tokens",
            "Stage 3: Vectorization & Entropy",
            "Stage 4: Modeling & Inference",
            "Stage 5: Evaluation & Metrics"
        ])

        with s1:
            st.subheader("Stage 1: Text Acquisition & URI Parsing")
            d = stages[0]["data"]
            c1, c2, c3, c4 = st.columns(4)
            c1.metric("Character Length", d["character_telemetry"]["total_length"])
            c2.metric("Alphabetic Chars", d["character_telemetry"]["alphabetic"])
            c3.metric("Digits Count", d["character_telemetry"]["digits"])
            c4.metric("Special Characters", d["character_telemetry"]["special_chars"])

            st.markdown("**Parsed RFC 3986 Components:**")
            st.json({
                "Scheme": d["parsed_scheme"],
                "Host / Apex": d["parsed_domain"] or d["parsed_host"],
                "Path": d["parsed_path"],
                "Query": d["parsed_query"] or "(none)",
                "SSL Encrypted": d["has_ssl_protocol"]
            })

        with s2:
            st.subheader("Stage 2: Preprocessing & Lexical Tokenization Pipeline")
            steps = stages[1]["steps"]
            for step in steps:
                with st.expander(f"Step {step['step_number']}: {step['step_name']}", expanded=True):
                    st.markdown(f"**Purpose:** {step['description']}")
                    col_b, col_a = st.columns(2)
                    with col_b:
                        st.markdown("**Input State:**")
                        st.code(step["before_text"])
                    with col_a:
                        st.markdown("**Output State:**")
                        st.code(step["after_text"])
                    if step.get("tokens"):
                        st.markdown("**Tokens Generated:**")
                        st.write(step["tokens"])

        with s3:
            st.subheader("Stage 3: Feature Extraction & Vectorization")
            st3 = stages[2]
            ent = st3.entropy_analysis
            col_e1, col_e2 = st.columns(2)
            col_e1.metric("URL Shannon Entropy", f"{ent['url_shannon_entropy']} bits")
            col_e2.metric("Domain Shannon Entropy", f"{ent['domain_shannon_entropy']} bits")
            st.caption(ent["entropy_interpretation"])

            st.markdown("**19-Dimensional Lexical Feature Vector:**")
            st.dataframe(pd.DataFrame([st3["features_map"]]))

        with s4:
            st.subheader("Stage 4: Modeling & Posterior Inference")
            st4 = stages[3]
            arch = st4["model_architecture"]
            st.write(f"**Classifier Pipeline:** {arch['model_name']}")
            st.write(f"**Decision Threshold:** τ = {arch['decision_threshold']}")
            col_p1, col_p2 = st.columns(2)
            col_p1.metric("Phishing Probability", f"{arch['final_phishing_probability']}%")
            col_p2.metric("Safe Probability", f"{arch['safe_probability']}%")

        with s5:
            st.subheader("Stage 5: Held-Out Test Evaluation & Metrics")
            st5 = stages[4]
            bm = st5["benchmark_metrics"]
            m1, m2, m3, m4 = st.columns(4)
            m1.metric("Accuracy", f"{bm['accuracy']*100:.1f}%")
            m2.metric("Precision", f"{bm['precision']*100:.1f}%")
            m3.metric("Recall", f"{bm['recall']*100:.1f}%")
            m4.metric("F1-Score", f"{bm['f1_score']*100:.1f}%")

            st.markdown("**Test Set Confusion Matrix:**")
            st.json(bm["confusion_matrix"])

# =========================================================================
# TAB 2: EMAIL DETECTION (NLP PREPROCESSING & TF-IDF PIPELINE)
# =========================================================================
with tab2:
    st.header("Email NLP Preprocessing & TF-IDF Vectorization Pipeline")
    st.markdown("Inspect email text through full NLP stages: HTML stripping, entity masking, Punkt tokenization, stopword removal, and TF-IDF n-grams.")

    user_subject = st.text_input("Email Subject:", value="URGENT: Your account has been suspended")
    user_email = st.text_area(
        "Email Body Text:", 
        height=160, 
        value="Your account access has been restricted due to unauthorized login attempts. Please verify your identity immediately at: http://paypa1-account-verify.com/login.php to avoid permanent closure."
    )
    
    col_ebtn, _ = st.columns([1, 4])
    with col_ebtn:
        analyze_email_btn = st.button("📧 Execute Email NLP Pipeline", use_container_width=True)

    if analyze_email_btn and (user_subject.strip() or user_email.strip()):
        pipeline_res = get_email_full_nlp_pipeline(user_subject, user_email, email_model, cached_metrics)
        stages = pipeline_res["pipeline_stages"]

        st.markdown("---")
        # Executive Banner
        if pipeline_res["is_spam"]:
            st.error(f"🚨 **PREDICTION: PHISHING / SPAM** (Probability: **{pipeline_res['spam_probability']}%** | Risk Level: **{pipeline_res['risk_level']}**)")
        else:
            st.success(f"✅ **PREDICTION: LEGITIMATE / HAM** (Probability: **{pipeline_res['spam_probability']}%** | Risk Level: **{pipeline_res['risk_level']}**)")

        st.markdown("### 🔬 Complete 5-Stage NLP Pipeline Walkthrough")
        s1, s2, s3, s4, s5 = st.tabs([
            "Stage 1: Text Acquisition",
            "Stage 2: Preprocessing & Tokens",
            "Stage 3: TF-IDF Vectorization",
            "Stage 4: Modeling & Inference",
            "Stage 5: Evaluation & Metrics"
        ])

        with s1:
            st.subheader("Stage 1: Text Acquisition & Telemetry")
            d = stages[0]["data"]
            c1, c2, c3, c4 = st.columns(4)
            c1.metric("Character Count", d["full_text_length"])
            c2.metric("Word Count", d["word_count"])
            c3.metric("Line Count", d["line_count"])
            c4.metric("Embedded URLs Found", len(d["embedded_urls_found"]))

            st.markdown("**Character Distribution:**")
            st.json(d["char_distribution"])

        with s2:
            st.subheader("Stage 2: Preprocessing & Tokenization Pipeline (9 Steps)")
            steps = stages[1]["steps"]
            for step in steps:
                with st.expander(f"Step {step['step_number']}: {step['step_name']}", expanded=False):
                    st.markdown(f"**Purpose:** {step['description']}")
                    col_b, col_a = st.columns(2)
                    with col_b:
                        st.markdown("**Input State:**")
                        st.code(step["before_text"])
                    with col_a:
                        st.markdown("**Output State:**")
                        st.code(step["after_text"])
                    if step.get("tokens"):
                        st.markdown("**Tokens Generated:**")
                        st.write(step["tokens"])

            st.markdown("**Final Cleaned Document Text:**")
            st.code(stages[1]["cleaned_document"])

        with s3:
            st.subheader("Stage 3: Feature Extraction & TF-IDF Vectorization")
            vec = stages[2]["vectorizer"]
            c1, c2, c3 = st.columns(3)
            c1.metric("Active N-Grams in Document", vec["active_features_in_document"])
            c2.metric("Vocabulary Dimensions", vec["max_features"])
            c3.metric("Vector Sparsity", f"{vec['vector_sparsity_percentage']}%")

            st.markdown("**Top Activated N-Grams (TF-IDF Weights):**")
            if vec["top_activated_ngrams"]:
                df_ng = pd.DataFrame(vec["top_activated_ngrams"])
                st.dataframe(df_ng)
            else:
                st.info("No matching vocabulary terms found in document.")

        with s4:
            st.subheader("Stage 4: Modeling & Posterior Inference")
            st4 = stages[3]
            arch = st4["model_architecture"]
            st.write(f"**Classifier Pipeline:** {arch['pipeline']}")
            col_p1, col_p2 = st.columns(2)
            col_p1.metric("Spam Probability", f"{arch['final_phishing_probability']}%")
            col_p2.metric("Ham Probability", f"{arch['benign_probability']}%")

        with s5:
            st.subheader("Stage 5: Held-Out Test Evaluation & Metrics")
            st5 = stages[4]
            bm = st5["benchmark_metrics"]
            m1, m2, m3, m4 = st.columns(4)
            m1.metric("Accuracy", f"{bm['accuracy']*100:.1f}%")
            m2.metric("Precision", f"{bm['precision']*100:.1f}%")
            m3.metric("Recall", f"{bm['recall']*100:.1f}%")
            m4.metric("F1-Score", f"{bm['f1_score']*100:.1f}%")

            st.markdown("**Test Set Confusion Matrix:**")
            st.json(bm["confusion_matrix"])

            st.markdown("**Security Verdict:**")
            st.info(st5["security_verdict"]["recommendation"])