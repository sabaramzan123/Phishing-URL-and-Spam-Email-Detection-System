import { NextResponse } from "next/server";

export async function GET() {
  const metrics = {
    url_model: {
      model_name: "Random Forest Classifier (19 Features)",
      test_samples: 12506,
      accuracy: 0.9085,
      precision: 0.8876,
      recall: 0.9221,
      f1_score: 0.9045,
      confusion_matrix: {
        tn: 5944,
        fp: 686,
        fn: 458,
        tp: 5418
      }
    },
    nlp_classifiers: [
      {
        name: "Multinomial Naive Bayes",
        accuracy: 0.9615,
        precision: 0.9761,
        recall: 0.9462,
        f1_score: 0.9609,
        confusion_matrix: {
          tn: 4884,
          fp: 116,
          fn: 269,
          tp: 4731
        }
      },
      {
        name: "Logistic Regression",
        accuracy: 0.9813,
        precision: 0.977,
        recall: 0.9858,
        f1_score: 0.9814,
        confusion_matrix: {
          tn: 4884,
          fp: 116,
          fn: 71,
          tp: 4929
        }
      },
      {
        name: "Linear SVM",
        accuracy: 0.9842,
        precision: 0.9821,
        recall: 0.9864,
        f1_score: 0.9842,
        confusion_matrix: {
          tn: 4910,
          fp: 90,
          fn: 68,
          tp: 4932
        }
      }
    ],
    dataset_info: {
      url_dataset: "Multi-Source Benchmark (62,528 samples)",
      email_dataset: "Comprehensive Processed Emails (50,000 samples, 50% Spam / 50% Ham)",
      tfidf_config: "Unigrams & Bigrams (1, 2), max_features=8000, sublinear_tf",
      test_split: "80% Training, 20% Held-out Test (Stratified)"
    }
  };

  return NextResponse.json(metrics);
}
