import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "online",
    url_model_loaded: true,
    email_model_loaded: true,
    url_model_type: "RandomForestClassifier",
    email_model_type: "Linear SVM + TF-IDF Pipeline",
    platform: "Vercel Edge & Serverless Intelligence Engine"
  });
}
