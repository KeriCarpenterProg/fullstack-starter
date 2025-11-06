"""
FastAPI server for ML model predictions
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os

app = FastAPI(title="Project Category Classifier API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4000",
        "https://fullstack-starter-rose.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
import sys
from pathlib import Path

# Get the directory where this script is located
script_dir = Path(__file__).parent
model_path = script_dir / "category_classifier.pkl"

model = None

if model_path.exists():
    model = joblib.load(str(model_path))
    print("✅ Model loaded successfully")
else:
    print(f"⚠️  Model not found at {model_path}. Run train_model.py first!")

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    category: str
    confidence: float
    all_probabilities: dict

@app.get("/")
def root():
    return {
        "message": "Project Category Classifier API",
        "status": "ready" if model else "model not loaded",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Make prediction
        prediction = model.predict([request.text])[0]
        probabilities = model.predict_proba([request.text])[0]
        
        # Get all class probabilities
        classes = model.classes_
        all_probs = {cls: float(prob) for cls, prob in zip(classes, probabilities)}
        
        # Get confidence for predicted class
        confidence = float(max(probabilities))
        
        return PredictionResponse(
            category=prediction,
            confidence=confidence,
            all_probabilities=all_probs
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn, os
    port = int(os.getenv("PORT", "5002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
