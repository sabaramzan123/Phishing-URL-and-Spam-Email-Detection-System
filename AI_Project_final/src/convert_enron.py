import os
import pandas as pd

# Use raw strings with r"" or forward slashes
spam_folder = r"C:\Users\Raees\Downloads\AI_project\data\emails\enron1\spam"
ham_folder = r"C:\Users\Raees\Downloads\AI_project\data\emails\enron1\ham"

data = []

def process_folder(folder_path, label):
    for root, dirs, files in os.walk(folder_path):
        print("Entering folder:", root)
        for filename in files:
            if filename.endswith(".txt"):
                filepath = os.path.join(root, filename)
                print("Found file:", filepath)
                try:
                    with open(filepath, 'r', encoding='latin1') as f:
                        content = f.read().replace('\n', ' ')
                        data.append({"email_text": content, "label": label})
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

print("Processing spam emails...")
process_folder(spam_folder, 1)

print("Processing ham emails...")
process_folder(ham_folder, 0)

print(f"Total emails processed: {len(data)}")

df = pd.DataFrame(data)
df.to_csv(r"data/emails/enron_emails.csv", index=False)
print("Enron emails converted to CSV successfully!")
