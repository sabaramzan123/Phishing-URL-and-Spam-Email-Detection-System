# 🛡️ PhishGuard — Intelligent Phishing URL & Spam Email Detection System

[![Python Version](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4%2B-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![AWS ECS Fargate](https://img.shields.io/badge/AWS-ECS%20Fargate%20Spot-FF9900.svg?logo=amazonaws&logoColor=white)](https://aws.amazon.com/ecs/)
[![Terraform](https://img.shields.io/badge/Terraform-1.7%2B-7B42BC.svg?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![DevSecOps](https://img.shields.io/badge/DevSecOps-Semgrep%20%7C%20Trivy-2088FF.svg?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**PhishGuard** is an enterprise-grade cybersecurity intelligence platform combining **Natural Language Processing (NLP)**, **19 Lexical & Structural Security Features**, and **Supervised Machine Learning Classifiers** (Linear SVM, Random Forest, Multinomial Naive Bayes, and Logistic Regression) to detect malicious phishing URLs and deceptive spam emails in real time with human-explainable threat diagnostics.

The system is deployed on **Amazon Web Services (AWS)** using **Infrastructure as Code (Terraform)**, containerized via **Docker Multi-Stage Builds**, orchestrated with **AWS ECS Fargate Spot microservices**, routed through an **Application Load Balancer (ALB)** with path-based routing, and secured via a fully automated **GitHub Actions DevSecOps CI/CD pipeline**.

---

## 📑 Table of Contents

- [⚡ Key Features](#-key-features)
- [🏗️ End-to-End System Architecture](#️-end-to-end-system-architecture)
- [☁️ AWS Cloud Infrastructure Architecture](#️-aws-cloud-infrastructure-architecture)
  - [AWS Component Breakdown](#aws-component-breakdown)
  - [Zero-Trust Security & Network Isolation](#zero-trust-security--network-isolation)
  - [Cost Optimization with Fargate Spot](#cost-optimization-with-fargate-spot)
- [🔄 DevSecOps CI/CD Automation](#-devsecops-cicd-automation)
- [🔬 Core Machine Learning & NLP Methodology](#-core-machine-learning--nlp-methodology)
  - [1. Email NLP Threat Analysis Pipeline](#1-email-nlp-threat-analysis-pipeline)
  - [2. URL Lexical & Structural Feature Engineering](#2-url-lexical--structural-feature-engineering)
  - [3. 4-Tier Risk Categorization Framework](#3-4-tier-risk-categorization-framework)
- [📊 Model Performance & Benchmarks](#-model-performance--benchmarks)
- [💻 Technology Stack](#-technology-stack)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 AWS Deployment Guide (Terraform & CI/CD)](#-aws-deployment-guide-terraform--cicd)
  - [Prerequisites](#prerequisites)
  - [1. S3 & DynamoDB Remote Backend Setup](#1-s3--dynamodb-remote-backend-setup)
  - [2. GitHub Actions Secrets Configuration](#2-github-actions-secrets-configuration)
  - [3. Deploying via GitHub Actions (One-Click)](#3-deploying-via-github-actions-one-click)
  - [4. Manual Deployment via Terraform CLI](#4-manual-deployment-via-terraform-cli)
- [🛠️ Local Development & Setup](#️-local-development--setup)
- [🔌 REST API Reference](#-rest-api-reference)
- [🤝 Contributing & License](#-contributing--license)

---

## ⚡ Key Features

- **Dual Detection Engine**: Real-time analysis for both raw email text (headers + body) and target web URLs.
- **5-Stage Explainable NLP Pipeline**: Step-by-step text transformation showcasing raw text ingestion, regex tokenization, stopword elimination, Porter stemming, and TF-IDF feature weighting.
- **19 Lexical & Structural Security Indicators**: Evaluates URL length, domain entropy, directory depth, token counts, homoglyphs, IP address usage, and shortener redirection.
- **Recursive Hyperlink Inspection**: Automatically extracts all URLs embedded within an email body and runs them through the URL feature extraction classifier simultaneously.
- **Explainable Threat Attribution**: Replaces opaque black-box outputs with human-readable security indicators ranked by severity (*Critical, High, Medium, Safe*).
- **Academic Light UI/UX Design**: Clean, minimal, distraction-free interface engineered for security analysts and researchers. Features responsive layout, touch-friendly buttons (`9px` radius), smooth micro-transitions, and zero horizontal page overflow.
- **Production AWS Cloud Architecture**: Fully automated cloud deployment utilizing Terraform IaC, AWS ECS Fargate Spot, ECR, Multi-AZ VPC, and Application Load Balancer with path routing.
- **DevSecOps Pipeline**: Automated vulnerability scanning with Semgrep (SAST) and Aqua Security Trivy (SCA & Container scanning) prior to infrastructure provisioning.

---

## 🏗️ End-to-End System Architecture

The following diagram illustrates the complete end-to-end data processing and machine learning classification pipeline:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT / PRESENTATION LAYER                                │
│                                                                                        │
│     Web Browser / Security Analyst ───> Next.js 16 App Router (Port 3000 / 3002)       │
│     - Email Analysis Form (Subject + Body)                                             │
│     - URL Analysis Form (Target Link)                                                  │
│     - Real-Time Verdict Card, Horizontal Risk Bar, 5-Stage Stepper, 19-Feature Table   │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           │ HTTP REST Requests (/api/analyze-*)
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION / INGRESS LAYER                             │
│                                                                                        │
│     AWS Application Load Balancer (ALB) on Port 80                                     │
│     ├── Path: /api/*  ──────> Forward to FastAPI Backend Service (Port 8000)           │
│     └── Path: Default ──────> Forward to Next.js Frontend Service (Port 3000)          │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           │ Internal Microservice Request
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND & THREAT DETECTION ENGINES                       │
│                                                                                        │
│  ┌──────────────────────────────────────────┐ ┌──────────────────────────────────────┐ │
│  │       EMAIL THREAT DETECTION ENGINE      │ │        URL THREAT DETECTION ENGINE   │ │
│  │                                          │ │                                      │ │
│  │ 1. Text Normalization & Cleaning         │ │ 1. Lexical Feature Extractor         │ │
│  │    (HTML Stripping, Entity Masking)      │ │    (19 Structural & Syntactic Flags) │ │
│  │ 2. Regex Tokenization & Lowercasing      │ │ 2. Shannon Domain Entropy Calculator │ │
│  │ 3. English Stopwords Filtering           │ │ 3. Brand Typosquatting & Homoglyphs  │ │
│  │ 4. Porter Morphological Stemming         │ │ 4. Suspicious TLD & IP Host Checker  │ │
│  │ 5. TF-IDF N-Gram Vectorizer (1-3 Grams)  │ │ 5. Random Forest (150 Trees)         │ │
│  │ 6. Linear SVM Classifier (98.42% Acc)    │ │    (90.85% Accuracy)                 │ │
│  │ 7. Pragmatic Urgency Intent Detector     │ │ 6. Heuristic Defense Overlays        │ │
│  └────────────────────┬─────────────────────┘ └──────────────────┬───────────────────┘ │
│                       │                                          │                     │
│                       └───────────┬──────────────────────────────┘                     │
│                                   │                                                    │
│                                   ▼                                                    │
│               ┌───────────────────────────────────────┐                                │
│               │     RECURSIVE HYPERLINK INSPECTION    │                                │
│               │  Extracts embedded links from emails  │                                │
│               │  and triggers URL classifier engine   │                                │
│               └───────────────────┬───────────────────┘                                │
│                                   │                                                    │
│                                   ▼                                                    │
│               ┌───────────────────────────────────────┐                                │
│               │   4-TIER RISK CALIBRATION FRAMEWORK   │                                │
│               │   Low (<30%) | Medium (30-59%)        │                                │
│               │   High (60-84%) | Critical (>=85%)    │                                │
│               └───────────────────┬───────────────────┘                                │
└───────────────────────────────────┼────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               OUTPUT DIAGNOSTIC REPORT                                 │
│  - Verdict (SAFE, SUSPICIOUS, PHISHING / SPAM)                                         │
│  - Probability Score (0.0% - 100.0%)                                                   │
│  - Severity-Ranked Security Indicators (Typosquatting, IP host, Urgent coercion)       │
│  - Intermediate NLP Step Diffs & 19 Lexical Metrics Table                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ☁️ AWS Cloud Infrastructure Architecture

PhishGuard is architected as a high-availability, cloud-native deployment on **Amazon Web Services (AWS)** provisioned via **Terraform (Infrastructure as Code)**.

```
                                  INTERNET
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │ Internet Gateway (IGW) │
                        └───────────┬────────────┘
                                    │
════════════════════════════════════╪══════════════════════════════════════════════════
 AWS VIRTUAL PRIVATE CLOUD (VPC)   │  10.0.0.0/16
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    PUBLIC APPLICATION LOAD BALANCER (ALB)                           │
│                    Security Group: Port 80 Inbound from 0.0.0.0/0                   │
│                                                                                     │
│    Path: /api/* ──────────────────────────────────┐                                │
│    Default / Root ──────────────┐                 │                                │
└─────────────────────────────────┼─────────────────┼─────────────────────────────────┘
                                  │                 │
         ┌────────────────────────┴────────┐        └────────────────┐
         │                                 │                         │
         ▼                                 ▼                         ▼
┌─────────────────────────────────┐       ┌──────────────────────────────────────────┐
│ Public Subnet 1 (us-east-1a)    │       │ Public Subnet 2 (us-east-1b)             │
│ CIDR: 10.0.1.0/24               │       │ CIDR: 10.0.2.0/24                        │
│                                 │       │                                          │
│  ┌───────────────────────────┐  │       │  ┌───────────────────────────┐           │
│  │ ECS FARGATE SPOT TASK     │  │       │  │ ECS FARGATE SPOT TASK     │           │
│  │                           │  │       │  │                           │           │
│  │ 🔹 Next.js Frontend       │  │       │  │ 🔹 Next.js Frontend       │           │
│  │    Container (Port 3000)  │  │       │  │    Container (Port 3000)  │           │
│  │                           │  │       │  │                           │           │
│  │ 🔹 FastAPI Backend        │  │       │  │ 🔹 FastAPI Backend        │           │
│  │    Container (Port 8000)  │  │       │  │    Container (Port 8000)  │           │
│  │    + Serialized ML Models │  │       │  │    + Serialized ML Models │           │
│  └───────────────────────────┘  │       │  └───────────────────────────┘           │
└─────────────────────────────────┘       └──────────────────────────────────────────┘
                 │                                              │
                 └──────────────────────┬───────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                             SUPPORTING AWS CLOUD SERVICES                           │
│                                                                                     │
│  📦 Amazon ECR                   📊 Amazon CloudWatch        🗄️ Terraform S3 Backend │
│  - phishguard-frontend:latest    - Task log streaming        - State file storage    │
│  - phishguard-backend:latest     - Metric alarms             - DynamoDB state lock   │
│  - Vulnerability scan on push                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### AWS Component Breakdown

| AWS Resource | Service | Configuration Details | Security & Architectural Role |
| :--- | :--- | :--- | :--- |
| **VPC** | `aws_vpc` | `10.0.0.0/16` across `us-east-1` | Isolated cloud network boundary. |
| **Public Subnets** | `aws_subnet` | Multi-AZ: `10.0.1.0/24` (1a), `10.0.2.0/24` (1b) | High availability and automated zone failover. |
| **Internet Gateway** | `aws_internet_gateway` | Attached to VPC with public route tables | Enables external ingress/egress for web traffic. |
| **Load Balancer** | `aws_lb` (ALB) | Internet-facing Application Load Balancer | Distributes inbound traffic across healthy container instances. |
| **ALB Routing Rules** | `aws_lb_listener_rule` | Port 80: `/api/*` $\rightarrow$ Backend, Default $\rightarrow$ Frontend | Path-based routing eliminating CORS and extra hostnames. |
| **Container Engine** | `aws_ecs_cluster` | Amazon ECS with Fargate & Fargate Spot | Serverless container execution; zero EC2 management. |
| **Container Registry**| `aws_ecr_repository` | `phishguard-frontend` & `phishguard-backend` | Private Docker registries with automated vulnerability scanning on push. |
| **State Storage** | `aws_s3_bucket` | `phishguard-tfstate-*` (AES-256 Encrypted) | Remote backend maintaining immutable Terraform state. |
| **Distributed Lock** | `aws_dynamodb_table`| `phishguard-tfstate-lock` (`LockID` Hash Key) | Prevents concurrent pipeline executions from corrupting state. |
| **Observability** | `aws_cloudwatch_log_group` | `/ecs/phishguard-prod` with 14-day retention | Real-time container stdout/stderr log aggregation. |

### Zero-Trust Security & Network Isolation

- **No Public Container Binding**: The ECS task containers do not accept direct connections from the internet.
- **Strict Security Group Ingress**:
  - `alb-sg`: Accepts HTTP (Port 80) and HTTPS (Port 443) from `0.0.0.0/0`.
  - `ecs-sg`: Accepts connections on Port 3000 and Port 8000 **strictly from `alb-sg`**. Direct access attempts bypass the load balancer and are rejected.
- **Least-Privilege IAM Roles**: The ECS execution role (`ecsTaskExecutionRole`) is scoped strictly to ECR image pulling and CloudWatch log streaming.
- **Non-Root Docker Containers**: Both frontend (`nextjs:nodejs` UID 1001) and backend (`appuser` UID 1001) execute as non-privileged users inside lightweight Alpine / Slim base images.

### Cost Optimization with Fargate Spot

By setting `enable_fargate_spot = true` in Terraform (`terraform.tfvars`), ECS tasks utilize surplus AWS computing capacity. This provides **up to 70% cost reduction** compared to on-demand pricing, while maintaining container auto-recovery and multi-AZ redundancy.

---

## 🔄 DevSecOps CI/CD Automation

The project includes an enterprise-grade GitHub Actions CI/CD suite consisting of 4 automated workflows located in `.github/workflows/`:

```
 Git Push (main)
       │
       ├──> 01 - Security Scan (Semgrep SAST & Trivy SCA Container Scan)
       │
       ├──> 02 - Terraform Validate (TFLint, Formatting & Syntax Check)
       │
       └──> 03 - Terraform Apply (ECR Build & Push ──> Terraform Apply ──> Rolling ECS Deploy)
                                                                                  │
                                                                                  ▼
                                                                     Live Application URL
```

1. **`01-security-scan.yml`**:
   - Executes **Semgrep SAST** to detect static code flaws, secret leakage, and insecure patterns.
   - Executes **Aqua Security Trivy** to identify Software Composition Analysis (SCA) CVEs and container vulnerabilities.
2. **`02-terraform-validate.yml`**:
   - Runs `terraform fmt -check`, `tflint`, and `terraform validate` across all root and environment modules on every pull request.
3. **`03-terraform-apply.yml`**:
   - Authenticates to AWS via GitHub Secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
   - Connects to S3 remote state and DynamoDB state lock.
   - Builds multi-stage Docker images for Frontend and Backend.
   - Pushes tagged images to Amazon ECR.
   - Provisions/updates AWS infrastructure via `terraform apply -auto-approve`.
   - Forces zero-downtime rolling service deployment on ECS Fargate.
   - Outputs the live Application Load Balancer URL (`http://<alb-dns-name>`).
4. **`04-terraform-destroy.yml`**:
   - Manual teardown workflow guarded by explicit safety confirmation inputs to destroy all AWS infrastructure cleanly.

---

## 🔬 Core Machine Learning & NLP Methodology

### 1. Email NLP Threat Analysis Pipeline

The email classification engine evaluates the textual content of emails through a sequential 5-stage NLP pipeline:

1. **Text Ingestion & Normalization**: Strips HTML markup, extracts embedded hyperlinks (`http[s]?://...`), masks entities (`__url__`, `__email__`, `__num__`), removes escape characters, and standardizes text to lowercase.
2. **Regex Tokenization**: Utilizes `nltk.tokenize.word_tokenize` to isolate alphanumeric tokens while stripping non-printable characters.
3. **Stopword Elimination**: Filters high-frequency, low-semantic English stopwords using `nltk.corpus.stopwords` to retain diagnostic threat keywords.
4. **Porter Stemming**: Reduces morphological variations of words to their base linguistic root forms (e.g., `"suspension"`, `"suspended"` $\rightarrow$ `"suspend"`).
5. **TF-IDF Vectorization**: Projects cleaned tokens into an 8,000-dimensional numerical space using unigrams, bigrams, and trigrams $(1, 3)$ with sublinear term-frequency scaling.

```
Raw Email ──> Tokenization ──> Stopword Removal ──> Porter Stemming ──> TF-IDF Vectorizer ──> Linear SVM (98.42% Acc)
```

In addition to classification, the email engine performs **Recursive Cross-Inspection & Pragmatic Analysis**:
- Evaluates psychological coercion keywords (*"urgent"*, *"immediate suspension"*, *"unauthorized access"*).
- Recursively extracts all embedded hyperlinks inside the email body and runs each through the 19-feature URL extraction engine.

---

### 2. URL Lexical & Structural Feature Engineering

Phishing URLs often exhibit distinct structural anomalies designed to evade filters. The URL feature extractor extracts **19 quantitative vectors**:

| # | Feature Name | Description & Security Relevance |
|---|:---|:---|
| 1 | `url_length` | Total character count (phishing links often use long queries). |
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

## 📊 Model Performance & Benchmarks

Models were evaluated on stratified held-out test splits (**80% Train, 20% Test**):
- **Email Corpus**: 5,171 processed samples (Enron, SpamAssassin, Nigerian Fraud, SMS Spam).
- **URL Corpus**: 11,430 multi-source benchmark URLs.

### Benchmark Results

| Model | Domain | Accuracy | Precision | Recall | F1-Score |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Linear SVM** *(Production)* | Email Spam / Phishing | **98.42%** | **98.21%** | **98.64%** | **98.42%** |
| **Logistic Regression** | Email Spam / Phishing | 98.13% | 97.70% | 98.58% | 98.14% |
| **Multinomial Naive Bayes** | Email Spam / Phishing | 96.15% | 97.61% | 94.62% | 96.09% |
| **Random Forest (150 Trees)** *(Production)* | URL Lexical Scanner | **90.85%** | **88.76%** | **92.21%** | **90.45%** |

---

## 💻 Technology Stack

### Cloud Infrastructure & DevSecOps
- **Amazon Web Services (AWS)**: ECS Fargate Spot, ALB, ECR, VPC, S3, DynamoDB, CloudWatch.
- **Terraform (v1.7+)**: Modular Infrastructure as Code (VPC, Security, ECR, ALB, ECS modules).
- **Docker**: Multi-stage, non-root hardened production containers.
- **GitHub Actions**: Automated CI/CD pipeline, DevSecOps SAST (Semgrep) & Container SCA (Trivy).

### Backend & Machine Learning
- **Python 3.11+**: Core programming language.
- **FastAPI**: Asynchronous high-performance REST API.
- **Uvicorn**: ASGI web server implementation.
- **Scikit-Learn**: Linear SVM, Random Forest, TF-IDF vectorization, evaluation metrics.
- **NLTK (Natural Language Toolkit)**: Tokenization, stopword corpora, Porter stemmer.
- **Pandas & NumPy**: Tabular data manipulation and numerical vector processing.

### Frontend User Interface
- **Next.js 16 (App Router)**: Server-side rendering, client hydration, API proxy rewrites.
- **React 19**: Modern component lifecycle, state management, and hooks.
- **TypeScript**: Strict compile-time type safety.
- **Tailwind CSS v4**: Minimalist academic design tokens, zero-layout-shift responsive styles.
- **Lucide React**: Clean, accessible iconography.

---

## 📂 Project Directory Structure

```
Phishing-URL-and-Spam-Email-Detection-System/
├── .github/
│   └── workflows/
│       ├── 01-security-scan.yml          # Semgrep SAST & Trivy container scanner
│       ├── 02-terraform-validate.yml     # TFLint & Terraform syntax validation
│       ├── 03-terraform-apply.yml        # Automated ECR push & AWS deploy
│       └── 04-terraform-destroy.yml      # Clean infrastructure teardown
├── terraform/
│   ├── environments/
│   │   └── prod/
│   │       ├── main.tf                   # Root composition of all modules
│   │       ├── variables.tf              # Input variable declarations
│   │       ├── terraform.tfvars          # Production variable assignments
│   │       └── outputs.tf                # ALB DNS and ECR endpoints
│   └── modules/
│       ├── vpc/                          # VPC, Subnets, IGW, Route Tables
│       ├── security/                     # Security Groups & IAM execution roles
│       ├── ecr/                          # Amazon ECR container repositories
│       ├── alb/                          # Application Load Balancer & /api/* routing
│       └── ecs/                          # ECS Cluster, Fargate Spot Service & Tasks
├── Phishing_Spam_NLP_InfoSec/
│   ├── Dockerfile.backend                # Multi-stage Python 3.11 FastAPI container
│   ├── server.py                         # FastAPI REST application
│   ├── app.py                            # Streamlit standalone demonstrator
│   ├── requirements.txt                  # Python runtime dependencies
│   ├── models/
│   │   ├── email_model.pkl               # Serialized Linear SVM + TF-IDF Pipeline
│   │   ├── url_model.pkl                 # Serialized Random Forest URL Model
│   │   └── model_metrics.json            # Model benchmark evaluation metrics
│   ├── src/
│   │   ├── email_preprocessing.py        # 5-Stage NLP pipeline, stemmer, stopwords
│   │   ├── url_features.py               # 19 Lexical features, entropy, typosquatting
│   │   ├── dataset_prep.py               # Raw corpus cleaning and preprocessing
│   │   ├── train_email.py                # Email classifier trainer
│   │   ├── train_url.py                  # URL Random Forest trainer
│   │   └── train_and_evaluate_models.py  # Model benchmark evaluation runner
│   └── frontend/
│       ├── Dockerfile                    # Multi-stage Node 20 Next.js container
│       ├── package.json                  # Next.js 16 dependencies
│       ├── next.config.ts                # Standalone output & /api/* proxy rewrites
│       └── src/
│           ├── app/
│           │   ├── globals.css           # Academic light design tokens
│           │   ├── layout.tsx            # Root layout & font injection
│           │   ├── page.tsx              # Main dual-scanner dashboard
│           │   └── api/                  # Native Next.js API route handlers
│           └── components/               # Modular UI components & tables
└── README.md
```

---

## 🚀 AWS Deployment Guide (Terraform & CI/CD)

### Prerequisites

1. An active **AWS Account** with administrative permissions.
2. **AWS CLI** installed and configured locally (`aws configure`).
3. **Terraform CLI (>= 1.7.0)** installed locally.
4. **Docker** installed (for building container images locally).

---

### 1. S3 & DynamoDB Remote Backend Setup

Before running Terraform, ensure the remote state S3 bucket and DynamoDB lock table exist in AWS (Region: `us-east-1`):

```bash
# 1. Create S3 Bucket for Terraform State (replace with your unique bucket name)
aws s3api create-bucket \
  --bucket phishguard-tfstate-562825149788 \
  --region us-east-1

# 2. Enable Bucket Versioning (Protects state from corruption)
aws s3api put-bucket-versioning \
  --bucket phishguard-tfstate-562825149788 \
  --versioning-configuration Status=Enabled

# 3. Create DynamoDB Table for Distributed State Locking
aws dynamodb create-table \
  --table-name phishguard-tfstate-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

---

### 2. GitHub Actions Secrets Configuration

To use the automated DevSecOps CI/CD pipeline, add the following secrets in your GitHub repository (**Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions**):

| Secret Name | Value Description |
| :--- | :--- |
| `AWS_ACCESS_KEY_ID` | IAM User Access Key with ECS, ECR, VPC, ALB, and S3 permissions. |
| `AWS_SECRET_ACCESS_KEY` | Corresponding IAM User Secret Access Key. |
| `AWS_REGION` | Target AWS region (Default: `us-east-1`). |

---

### 3. Deploying via GitHub Actions (One-Click)

1. Navigate to the **Actions** tab in your GitHub repository.
2. Select **`03 - Terraform Deploy Infrastructure & Auto-Push ECR (AWS)`**.
3. Click **Run workflow** $\rightarrow$ Select branch `main`.
4. The pipeline will automatically:
   - Validate security with Semgrep and Trivy.
   - Build and push Docker images to Amazon ECR.
   - Run `terraform apply` to provision the VPC, ALB, and ECS Fargate Spot services.
   - Print the live **Application Load Balancer URL** at the end of the deployment log.

---

### 4. Manual Deployment via Terraform CLI

If you prefer to deploy directly from your local terminal:

```bash
# 1. Navigate to the production Terraform environment
cd terraform/environments/prod

# 2. Initialize Terraform and download AWS provider modules
terraform init

# 3. Plan the infrastructure changes
terraform plan

# 4. Apply and provision the AWS cloud resources
terraform apply -auto-approve

# 5. Retrieve the public Application Load Balancer URL
terraform output application_url
```

---

## 🛠️ Local Development & Setup

### 1. Clone Repository

```bash
git clone https://github.com/sabaramzan123/Phishing-URL-and-Spam-Email-Detection-System.git
cd Phishing-URL-and-Spam-Email-Detection-System
```

### 2. Backend Setup (FastAPI)

```bash
cd Phishing_Spam_NLP_InfoSec

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download required NLTK corpora
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt'); nltk.download('punkt_tab')"

# Start FastAPI backend
python server.py
```
*FastAPI server will be running on `http://127.0.0.1:8000` (Swagger docs: `http://127.0.0.1:8000/docs`).*

### 3. Frontend Setup (Next.js 16)

Open a new terminal:

```bash
cd Phishing_Spam_NLP_InfoSec/frontend

# Install node dependencies
npm install

# Start Next.js development server
npm run dev
```
*Next.js application will open on `http://localhost:3002`.*

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/status` | Health check returning model load status and classifier architectures. |
| `POST` | `/api/analyze-email` | Analyzes raw email text, extracts embedded URLs, and returns threat scores. |
| `POST` | `/api/analyze-url` | Extracts 19 lexical features and classifies URL legitimacy. |
| `GET` | `/api/model-performance` | Returns accuracy, precision, recall, F1, and confusion matrices. |
| `POST` | `/api/reload-models` | Hot-reloads serialized `.pkl` models from disk into memory. |

---

## 🤝 Contributing & License

Distributed under the **MIT License**. See `LICENSE` for more information.

<p align="center">
  <b>PhishGuard Security Intelligence</b> — Developed for Information Security, NLP, and Cloud DevSecOps.
</p>
