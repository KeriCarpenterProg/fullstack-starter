"""
FastAPI server for ML model predictions
"""

from fastapi import FastAPI, HTTPException, Header, Query, Body, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
from pathlib import Path

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

# Get API key from environment
ML_API_KEY = os.getenv("ML_API_KEY", "")
if not ML_API_KEY:
    print("⚠️  Warning: ML_API_KEY not set. API will accept any requests!")
else:
    print("✅ API key authentication enabled")

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
    version: str  # Added version field to the response model


class PredictionInput(BaseModel):
    input: str


@app.get("/")
def root():
    return {
        "message": "Project Category Classifier API",
        "status": "ready" if model else "model not loaded",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, version: str = "v1"):
    # Validate available versions dynamically
    valid_versions = [
        f.stem.split("_")[-1] for f in script_dir.glob("category_classifier_*.pkl")
    ]
    if version not in valid_versions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid model version: {version}. Valid versions are: {', '.join(valid_versions)}",
        )

    # Load the appropriate model for the version
    model_path = script_dir / f"category_classifier_{version}.pkl"
    if not model_path.exists():
        raise HTTPException(
            status_code=400, detail=f"Model file for version {version} not found"
        )

    try:
        model = joblib.load(str(model_path))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading model for version {version}: {str(e)}",
        )

    # Make prediction
    try:
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
            all_probabilities=all_probs,
            version=version,  # Include version in the response
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/predict")
async def predict(
    data: PredictionInput = Body(...),
    version: str = Query("v1", description="Model version to use"),
):
    """
    Predict endpoint that accepts a version parameter to specify the model version.
    """
    # Load the appropriate model based on the version
    if version == "v1":
        # Load version 1 of the model
        model = load_model_v1()
    elif version == "v2":
        # Load version 2 of the model
        model = load_model_v2()
    else:
        raise HTTPException(status_code=400, detail="Invalid model version")

    # Perform prediction using the loaded model
    prediction = model.predict(data.dict())
    return {"version": version, "prediction": prediction}


# Example functions to load models
def load_model_v1():
    # Placeholder for loading version 1 of the model
    return MockModel("v1")


def load_model_v2():
    # Placeholder for loading version 2 of the model
    return MockModel("v2")


class MockModel:
    def __init__(self, version):
        self.version = version

    def predict(self, data):
        return {"data": data, "model_version": self.version}


if __name__ == "__main__":
    import uvicorn, os

    port = int(os.getenv("PORT", "5002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
