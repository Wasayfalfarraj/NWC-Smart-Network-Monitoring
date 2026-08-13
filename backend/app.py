from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np

app = FastAPI(
    title="NWC Smart Network Monitoring AI",
    description="AI-powered network anomaly detection API",
    version="1.0"
)

# Allow the frontend (hosted on a different origin) to call this API.
# Replace "*" with your actual frontend domain(s) for tighter security in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained Isolation Forest model
model = joblib.load("nwc_isolation_forest.pkl")

FEATURES = [
    "cpu_usage",
    "memory_usage",
    "bandwidth_mbps",
    "latency_ms",
    "packet_loss_percent",
    "interface_errors"
]


class NetworkData(BaseModel):
    cpu_usage: float
    memory_usage: float
    bandwidth_mbps: float
    latency_ms: float
    packet_loss_percent: float
    interface_errors: float


@app.get("/")
def home():
    return {
        "system": "NWC Smart Network Monitoring",
        "status": "online",
        "ai_model": "Isolation Forest",
        "model_status": "loaded"
    }


@app.post("/predict")
def predict(data: NetworkData):

    values = pd.DataFrame([{
        "cpu_usage": data.cpu_usage,
        "memory_usage": data.memory_usage,
        "bandwidth_mbps": data.bandwidth_mbps,
        "latency_ms": data.latency_ms,
        "packet_loss_percent": data.packet_loss_percent,
        "interface_errors": data.interface_errors
    }])

    # AI prediction
    prediction = model.predict(values[FEATURES])[0]

    # Isolation Forest decision score
    decision_score = model.decision_function(values[FEATURES])[0]

    # Convert score to a simple risk percentage
    risk_score = float(
        np.clip(
            (0.5 - decision_score) * 100,
            0,
            100
        )
    )

    if prediction == -1:
        status = "ANOMALY"
    else:
        status = "NORMAL"

    if risk_score >= 75:
        risk_level = "HIGH"
    elif risk_score >= 45:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "status": status,
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "ai_model": "Isolation Forest",
        "features": {
            "cpu_usage": data.cpu_usage,
            "memory_usage": data.memory_usage,
            "bandwidth_mbps": data.bandwidth_mbps,
            "latency_ms": data.latency_ms,
            "packet_loss_percent": data.packet_loss_percent,
            "interface_errors": data.interface_errors
        }
    }
