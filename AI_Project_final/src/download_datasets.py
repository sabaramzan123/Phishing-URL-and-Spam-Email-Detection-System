import os
import requests
import zipfile

# Make directories
os.makedirs("data/urls", exist_ok=True)
os.makedirs("data/emails", exist_ok=True)

# ---------- URL DATASETS ----------
# Phishing Dataset for ML (Kaggle link for manual download)
print("Please download Kaggle URL datasets manually and place in data/urls/")

# ---------- EMAIL DATASETS ----------
# Phishing Email Dataset
hf_url = "https://huggingface.co/datasets/zefang-liu/phishing-email-dataset/resolve/main/phishing_email_dataset.csv"
r = requests.get(hf_url)
with open("data/emails/phishing_email_dataset.csv", "wb") as f:
    f.write(r.content)
print("Downloaded Phishing Email Dataset from HuggingFace")

# SpamAssassin dataset
spam_url = "https://www2.aueb.gr/users/ion/data/enron-spam/preprocessed/enron1.tar.gz"
r = requests.get(spam_url)
with open("data/emails/enron1.tar.gz", "wb") as f:
    f.write(r.content)
print("Downloaded Enron1 spam dataset (tar.gz). Extract manually to data/emails/")

# Enron Ham Emails (subset)
enron_url = "https://www.kaggle.com/datasets/wcukierski/enron-email-dataset/download?datasetVersionNumber=2"
print("Please download Enron dataset manually and place CSVs in data/emails/")
