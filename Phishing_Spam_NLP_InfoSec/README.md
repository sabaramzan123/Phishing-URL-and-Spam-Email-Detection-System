# 🛡️ PhishGuard — Intelligent Phishing URL & Spam Email Detection System

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4%2B-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**PhishGuard** is an enterprise-grade cybersecurity intelligence platform combining **Natural Language Processing (NLP)**, **19 Lexical & Structural Security Features**, and **Supervised Machine Learning Classifiers** (Linear SVM, Random Forest, Multinomial Naive Bayes, and Logistic Regression) to detect malicious phishing URLs and deceptive spam emails in real time with human-explainable threat diagnostics.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Core Methodology](#-core-methodology)
  - [1. Email NLP Threat Analysis Pipeline](#1-email-nlp-threat-analysis-pipeline)
  - [2. URL Lexical & Structural Feature Engineering](#2-url-lexical--structural-feature-engineering)
  - [3. 4-Tier Risk Categorization Framework](#3-4-tier-risk-categorization-framework)
- [Model Performance & Evaluation](#-model-performance--evaluation)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Step-by-Step Installation & Setup](#-step-by-step-installation--setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup (FastAPI)](#2-backend-setup-fastapi)
  - [3. Frontend Setup (Next.js 16)](#3-frontend-setup-nextjs-16)
  - [4. Optional: Streamlit Standalone UI](#4-optional-streamlit-standalone-ui)
- [REST API Reference](#-rest-api-reference)
- [Contributing & License](#-contributing--license)

---

## ⚡ Key Features

- **Dual Detection Engine**: Real-time analysis for both raw email text (headers + body) and target web URLs.
- **5-Stage Explainable NLP Pipeline**: Step-by-step text transformation showcasing raw text ingestion, regex tokenization, stopword elimination, Porter stemming, and TF-IDF feature weighting.
- **19 Lexical & Structural Security Indicators**: Evaluates URL length, domain entropy, directory depth, token counts, homoglyphs, IP address usage, and shortener redirection.
- **Recursive Hyperlink Inspection**: Automatically extracts all URLs embedded within an email body and runs them through the URL feature extraction classifier simultaneously.
- **Explainable Threat Attribution**: Replaces opaque black-box outputs with human-readable security indicators ranked by severity (*Critical, High, Medium, Safe*).
- **Enterprise SaaS Dashboard**: Modern, distraction-free interface inspired by CrowdStrike, Linear, and Vercel. Features dark/light themes, keyboard shortcuts (`Ctrl+Enter`), live backend status monitoring, and responsive layout.
- **Integrated Model Benchmark Suite**: Built-in `/api/model-performance` dashboard displaying confusion matrices, accuracy, precision, recall, and F1 comparisons across multiple models.

---

## 🏗️ System Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │               User Input (Email / URL)                 │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           Next.js 16 App Router Frontend (Port 3002)                            │
│  - Segmented Mode Switcher (Email Intelligence / URL Lexical Scanner)                          │
│  - Reactive Dashboard, Animated Gauges, KPI Stat Tiles, Preprocessing Comparison Diffs         │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │ Reverse Proxy (/api/*)
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                FastAPI REST Backend (Port 8000)                                │
├───────────────────────────────────────────────┬────────────────────────────────────────────────┤
│             URL Analysis Engine               │            Email Analysis Engine               │
│  • 19 Lexical & Structural Feature Extractor  │  • 5-Stage NLP Preprocessing Pipeline          │
│  • Typosquatting & Brand Spoofing Detector    │  • Recursive Embedded URL Extractor            │
│  • Random Forest Classifier (150 Trees)       │  • Linear SVM Classifier + TF-IDF Vectorizer   │
│  • Calibrated Risk Score (0 - 100%)           │  • Urgent Linguistic Manipulation Detector     │
└───────────────────────────────────────────────┴────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Structured JSON Response                                    │
│  { prediction, risk_score, risk_tier, security_indicators, nlp_pipeline, model_confidence }    │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Core Methodology

### 1. Email NLP Threat Analysis Pipeline

The email classification engine evaluates the textual content of emails through a sequential 5-stage NLP pipeline:

1. **Text Ingestion & Normalization**: Strips HTML markup, extracts embedded hyperlinks (`http[s]?://...`), removes escape characters, and standardizes text to lowercase.
2. **Regex Tokenization**: Utilizes `nltk.tokenize.RegexpTokenizer(r'\w+')` to isolate alphanumeric tokens while stripping extraneous punctuation and non-printable characters.
3. **Stopword Elimination**: Filters high-frequency, low-semantic English stopwords using `nltk.corpus.stopwords` to retain high-information keywords.
4. **Porter Stemming**: Reduces morphological variations of words to their base linguistic root forms (e.g., `"suspension"`, `"suspended"` → `"suspend"`).
5. **TF-IDF Vectorization**: Projects cleaned tokens into an 8,000-dimensional numerical space using unigrams and bigrams $(1, 2)$ with sublinear term-frequency scaling.

```
Raw Email  ──>  Tokenization  ──>  Stopword Removal  ──>  Stemming  ──>  TF-IDF Vectorization  ──>  Linear SVM (98.42%)
```

In addition to classification, the email engine performs **Recursive Cross-Inspection**:
- Detects psychological coercion keywords (*"urgent"*, *"immediate suspension"*, *"unauthorized access"*).
- Extracts every embedded link in the email and executes the full URL feature extraction model on each link to establish a holistic verdict.

---

### 2. URL Lexical & Structural Feature Engineering

Phishing URLs often exhibit distinct structural anomalies designed to evade security filters or deceive users. The URL feature extractor extracts **19 quantitative vectors**:

| # | Feature Name | Description & Security Relevance |
|---|:---|:---|
| 1 | `url_length` | Total character count of the URL (phishing links often use long queries). |
| 2 | `hostname_length` | Length of the fully qualified domain name. |
| 3 | `path_length` | Character length of the resource path hierarchy. |
| 4 | `fd_length` | Length of the primary directory immediately after the domain. |
| 5 | `tld_length` | Top-Level Domain length (e.g., `.com`, `.accountants`). |
| 6 | `count_dots` | Total period (`.`) count; elevated counts indicate subdomain nesting. |
| 7 | `count_hyphens` | Hyphens (`-`) used to synthesize brand lookalikes (e.g., `paypal-verify`). |
| 8 | `count_at` | Symbol `@` causes browsers to ignore preceding credentials in user-info format. |
| 9 | `count_question` | Query delimiter count (`?`). |
| 10 | `count_percent` | Percentage (`%`) indicating URL hex encoding and obfuscation. |
| 11 | `count_equal` | Parameter assignment operator (`=`) count. |
| 12 | `count_http` | Unencrypted cleartext protocol count in URL string. |
| 13 | `count_https` | Encrypted protocol occurrences. |
| 14 | `count_www` | Count of `www` substrings (often repeated in subdomains). |
| 15 | `count_digits` | Numeric digit count across the URL string. |
| 16 | `count_letters` | Alphabetic character count. |
| 17 | `count_dir` | Total directory slash (`/`) depth. |
| 18 | `use_of_ip` | Boolean flag (1/0) checking if the host is a raw IPv4 address rather than a domain. |
| 19 | `short_url` | Boolean flag (1/0) detecting known URL shortening services (e.g., `bit.ly`, `tinyurl`). |

#### Brand Impersonation & Typosquatting Detection
The system compares the target domain against verified consumer brand authorities (PayPal, Google, Apple, Microsoft, Amazon, Netflix, Chase, etc.) using Levenshtein edit distance and homoglyph substitution tables to catch subtle brand lookalikes (e.g., `paypa1`, `micros0ft`).

---

### 3. 4-Tier Risk Categorization Framework

Every scan generates a calibrated risk probability score ($0\%$ to $100\%$) mapped to four risk tiers:

```
0% ──────────── 29% ──────────────── 59% ──────────────── 84% ──────────── 100%
   [  LOW RISK  ]    [  MEDIUM RISK  ]    [   HIGH RISK   ]    [ CRITICAL RISK ]
   Legitimate, clean  Insecure HTTP,       Typosquatting,       Raw IP host,
   standard patterns  subdomain depth      credential prompt    confirmed lure
```

- **Low Risk (< 30%)**: Classified as **SAFE**. Conforms to standard structural lengths and exhibits no deceptive triggers.
- **Medium Risk (30% - 59%)**: Classified as **SUSPICIOUS / ELEVATED RISK**. Displays minor anomalies such as lack of SSL transport encryption or abnormal directory nesting.
- **High Risk (60% - 84%)**: Classified as **THREAT / PHISHING**. Strong indicators detected (brand typosquatting, credential harvesting prompts, urgent coercion).
- **Critical Risk (≥ 85%)**: Classified as **CONFIRMED MALICIOUS**. Severe threat signatures identified (bare IP host, homoglyph lookalike, known credential interception kit).

---

## 📊 Model Performance & Evaluation

Models were evaluated on stratified held-out test splits (**80% Train, 20% Test**):
- **Email Corpus**: 50,000 processed samples (Enron, SpamAssassin, Nigerian Fraud, SMS Spam).
- **URL Corpus**: 62,528 multi-source benchmark URLs.

### Benchmark Results

| Model | Domain | Accuracy | Precision | Recall | F1-Score |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Linear SVM** *(Production)* | Email Spam / Phishing | **98.42%** | **98.21%** | **98.64%** | **98.42%** |
| **Logistic Regression** | Email Spam / Phishing | 98.13% | 97.70% | 98.58% | 98.14% |
| **Multinomial Naive Bayes** | Email Spam / Phishing | 96.15% | 97.61% | 94.62% | 96.09% |
| **Random Forest (150 Trees)** *(Production)* | URL Lexical Scanner | **90.85%** | **88.76%** | **92.21%** | **90.45%** |

### Confusion Matrix Breakdown

#### Linear SVM (Email Model - 10,000 Test Samples)
- **True Negatives (TN)**: 4,910 | **False Positives (FP)**: 90
- **False Negatives (FN)**: 68 | **True Positives (TP)**: 4,932

#### Random Forest (URL Model - 12,506 Test Samples)
- **True Negatives (TN)**: 5,944 | **False Positives (FP)**: 686
- **False Negatives (FN)**: 458 | **True Positives (TP)**: 5,418

---

## 💻 Technology Stack

### Backend & Machine Learning
- **Python 3.10+**: Core programming language.
- **FastAPI**: Asynchronous high-performance REST API.
- **Uvicorn**: ASGI web server implementation.
- **Scikit-Learn**: Classification estimators, pipelines, TF-IDF vectorization, evaluation metrics.
- **NLTK (Natural Language Toolkit)**: Tokenization, stopword corpora, Porter stemmer.
- **Pandas & NumPy**: Tabular data manipulation and numerical vector processing.
- **Joblib / Pickle**: Serialized model artifact persistence.

### Frontend SaaS Interface
- **Next.js 16 (App Router)**: Server-side rendering, client hydration, API rewrites proxy.
- **React 19**: Modern component lifecycle, state management, and hooks.
- **TypeScript**: Strict compile-time type safety.
- **Tailwind CSS v4**: Utility-first CSS engine with customized cybersecurity semantic color tokens.
- **Framer Motion**: Smooth spring physics, tab indicators, and micro-interactions.
- **Lucide React**: Clean, accessible iconography.

### Rapid Prototyping
- **Streamlit**: Alternative lightweight dashboard for standalone testing.

---

## 📁 Project Directory Structure

```text
Phishing-URL-and-Spam-Email-Detection-System/
├── .gitignore                          # Global root gitignore
├── README.md                           # Comprehensive documentation
├── requirements.txt                    # Root backend dependency specifications
├── Phishing_Spam_NLP_InfoSec/
│   ├── .gitignore                      # Project-level gitignore
│   ├── README.md                       # Subfolder documentation
│   ├── app.py                          # Streamlit interactive dashboard
│   ├── server.py                       # FastAPI production REST backend (port 8000)
│   ├── requirements.txt                # Subfolder backend dependencies
│   │
│   ├── models/
│   │   ├── email_model.pkl             # Trained Linear SVM email pipeline (Ignored in git)
│   │   ├── url_model.pkl               # Trained Random Forest URL model (Ignored in git)
│   │   └── model_metrics.json          # Benchmarking metrics & confusion matrix metadata
│   │
│   ├── src/
│   │   ├── dataset_prep.py             # Raw data preprocessing & cleaning
│   │   ├── email_preprocessing.py      # 5-stage NLP pipeline & embedded URL extractor
│   │   ├── url_features.py             # 19 lexical features & typosquatting detection
│   │   ├── train_email.py              # Script to train and persist email model
│   │   ├── train_url.py                # Script to train and persist URL model
│   │   ├── train_and_evaluate_models.py# Multi-model benchmarking suite
│   │   ├── retrain_all.py              # End-to-end retraining script
│   │   └── evaluate.py                 # Cross-validation & classification reports
│   │
│   └── frontend/
│       ├── .gitignore                  # Frontend gitignore (node_modules, .next)
│       ├── package.json                # Next.js scripts & npm dependencies
│       ├── next.config.ts              # Next.js config with backend /api/* reverse proxy
│       ├── tsconfig.json               # TypeScript strict configuration
│       │
│       └── src/
│           ├── app/
│           │   ├── layout.tsx          # Root HTML layout, font injection, theme hydration
│           │   ├── page.tsx            # Central dashboard (Scanner, Tabs, Results, Views)
│           │   └── globals.css         # Design tokens, semantic colors, typography scale
│           │
│           ├── components/
│           │   ├── Navbar.tsx          # Sticky header with live API status pill & theme toggle
│           │   ├── ScannerTabs.tsx     # Centered hero header with segmented mode switcher
│           │   ├── EmailScanner.tsx    # Email input form, example injectors, char counters
│           │   ├── URLScanner.tsx      # URL input form with protocol indicators
│           │   ├── EmptyState.tsx      # Awaiting inspection placeholder card
│           │   ├── ResultCard.tsx      # Semicircular risk gauge, verdict, confidence
│           │   ├── DetectionReasons.tsx# Severity-ranked findings & human-readable indicators
│           │   ├── NLPSummary.tsx      # 4 KPI security metric tiles
│           │   ├── PreprocessingComparison.tsx # Step-by-step NLP diff and token view
│           │   ├── URLFeaturesView.tsx # 19 Lexical features matrix table
│           │   ├── HowItWorksView.tsx  # Interactive educational pipeline visualizer
│           │   ├── ModelPerformanceView.tsx # Benchmarking suite with confusion matrices
│           │   └── AboutView.tsx       # System overview, tech stack, and documentation
│           │
│           └── components/ui/          # Modular UI primitives (Button, Card, Badge, Stat, etc.)
```

---

## 🚀 Step-by-Step Installation & Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Python**: Version 3.10 or higher ([Download Python](https://www.python.org/downloads/))
- **Node.js**: Version 18.18 or higher ([Download Node.js](https://nodejs.org/))
- **Git**: ([Download Git](https://git-scm.com/))

---

### 1. Clone Repository

```bash
git clone https://github.com/sabaramzan123/Phishing-URL-and-Spam-Email-Detection-System.git
cd Phishing-URL-and-Spam-Email-Detection-System/Phishing_Spam_NLP_InfoSec
```

---

### 2. Backend Setup (FastAPI)

1. **Create and activate a virtual environment**:
   ```bash
   # Windows (PowerShell)
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Download required NLTK corpora**:
   ```bash
   python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt'); nltk.download('punkt_tab')"
   ```

4. **Verify / Train ML Models**:
   - The pre-evaluated metrics are stored in `models/model_metrics.json`.
   - If model binary files (`models/*.pkl`) are not present, train them using:
     ```bash
     python src/retrain_all.py
     ```

5. **Start the FastAPI backend server**:
   ```bash
   python server.py
   ```
   *The FastAPI server will start at `http://127.0.0.1:8000`. You can inspect the interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

---

### 3. Frontend Setup (Next.js 16)

Open a new terminal window:

1. **Navigate to the frontend folder**:
   ```bash
   cd Phishing-URL-and-Spam-Email-Detection-System/Phishing_Spam_NLP_InfoSec/frontend
   ```

2. **Install npm packages**:
   ```bash
   npm install
   ```

3. **Start the Next.js development server on port 3002**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Open **[http://localhost:3002](http://localhost:3002)** in your browser.

> [!NOTE]  
> The Next.js frontend has built-in API proxy rewrites configured in `next.config.ts`. All requests to `http://localhost:3002/api/*` are automatically forwarded to `http://127.0.0.1:8000/api/*`, eliminating any CORS or IPv6 localhost routing issues.

---

### 4. Optional: Streamlit Standalone UI

If you want to run the lightweight Streamlit demo without starting the Next.js frontend:

```bash
cd Phishing-URL-and-Spam-Email-Detection-System/Phishing_Spam_NLP_InfoSec
streamlit run app.py
```
*Access the Streamlit application at `http://localhost:8501`.*

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/status` | Health check returning model load status and classifier architectures. |
| `POST` | `/api/analyze-email` | Analyzes raw email text, extracts embedded URLs, and returns risk scores. |
| `POST` | `/api/analyze-url` | Extracts 19 lexical features and classifies URL legitimacy. |
| `GET` | `/api/model-performance` | Returns accuracy, precision, recall, F1, and confusion matrices. |
| `POST` | `/api/reload-models` | Hot-reloads serialized `.pkl` models from disk into memory. |

### Example 1: Email Inspection Request
```bash
POST /api/analyze-email
Content-Type: application/json

{
  "subject": "URGENT: Your PayPal account has been suspended",
  "body": "Your account access has been restricted. Please verify your identity immediately at: http://paypa1-account-verify.com/login.php to avoid permanent closure."
}
```

#### Response (200 OK)
```json
{
  "email_prediction": "PHISHING / SPAM",
  "is_spam": true,
  "spam_probability": 98.4,
  "nlp_security_indicators": [
    "Urgent / Pressure Language (Pragmatic manipulation detected)",
    "Authentication / Credential Harvesting Trigger",
    "Embedded suspicious link: http://paypa1-account-verify.com/login.php"
  ],
  "urls_found_count": 1,
  "urls_results": [
    {
      "url": "http://paypa1-account-verify.com/login.php",
      "prediction": "SUSPICIOUS",
      "risk_level": "CRITICAL",
      "phishing_probability": 94.2,
      "security_indicators": [
        "Deceptive Brand Lookalike / Typosquatting (mimics paypal)",
        "Insecure Cleartext Transport (HTTP)"
      ]
    }
  ],
  "combined_summary": "THREAT DETECTED: Email was classified as PHISHING / SPAM with 98.4% model confidence.",
  "preprocessed_text": "urgent paypal account suspend account access restrict verify identity..."
}
```

---

### Example 2: URL Inspection Request
```bash
POST /api/analyze-url
Content-Type: application/json

{
  "url": "http://192.168.1.105/admin-login/verify.html"
}
```

#### Response (200 OK)
```json
{
  "url": "http://192.168.1.105/admin-login/verify.html",
  "prediction": "SUSPICIOUS",
  "phishing_probability": 89.5,
  "risk_level": "CRITICAL",
  "security_indicators": [
    "Raw IP Address Used as Host (Circumvents DNS reputation)",
    "Authentication / Credential Harvesting Trigger (login/verify keyword)",
    "Insecure Cleartext Transport (HTTP)"
  ],
  "explanation": "This URL was classified as SUSPICIOUS (Risk Level: CRITICAL). It directly routes to an IP address without domain resolution and lacks TLS transport encryption.",
  "features": {
    "url_length": 42,
    "hostname_length": 13,
    "use_of_ip": 1,
    "count_dots": 4,
    "count_http": 1,
    "count_https": 0
  }
}
```

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>PhishGuard Security Intelligence</b> — Developed for Information Security & Natural Language Processing.
</p>
