from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np


# =====================================================
# NWC SMART NETWORK MONITORING AI API
# =====================================================

app = FastAPI(
    title="NWC Smart Network Monitoring AI",
    description="AI-powered network anomaly detection API",
    version="1.0"
)


# =====================================================
# CORS
# Allow GitHub Pages to communicate with Render
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# LOAD TRAINED AI MODEL
# =====================================================

model = joblib.load(
    "nwc_isolation_forest.pkl"
)


FEATURES = [
    "cpu_usage",
    "memory_usage",
    "bandwidth_mbps",
    "latency_ms",
    "packet_loss_percent",
    "interface_errors"
]


# =====================================================
# NETWORK DATA MODEL
# =====================================================

class NetworkData(BaseModel):

    cpu_usage: float

    memory_usage: float

    bandwidth_mbps: float

    latency_ms: float

    packet_loss_percent: float

    interface_errors: float


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {

        "system":
            "NWC Smart Network Monitoring",

        "status":
            "online",

        "ai_model":
            "Isolation Forest",

        "model_status":
            "loaded"

    }


# =====================================================
# AI PREDICTION
# =====================================================

@app.post("/predict")
def predict(
    data: NetworkData
):

    # -----------------------------------------------
    # Prepare input data
    # -----------------------------------------------

    values = pd.DataFrame([{

        "cpu_usage":
            data.cpu_usage,

        "memory_usage":
            data.memory_usage,

        "bandwidth_mbps":
            data.bandwidth_mbps,

        "latency_ms":
            data.latency_ms,

        "packet_loss_percent":
            data.packet_loss_percent,

        "interface_errors":
            data.interface_errors

    }])


    # -----------------------------------------------
    # Isolation Forest prediction
    # -----------------------------------------------

    prediction = model.predict(
        values[FEATURES]
    )[0]


    # -----------------------------------------------
    # AI decision score
    # -----------------------------------------------

    decision_score = model.decision_function(
        values[FEATURES]
    )[0]


    # -----------------------------------------------
    # Convert score to risk percentage
    # -----------------------------------------------

    risk_score = float(

        np.clip(

            (0.5 - decision_score) * 100,

            0,

            100

        )

    )


    # -----------------------------------------------
    # Determine status
    # -----------------------------------------------

    if prediction == -1:

        status = "ANOMALY"

    else:

        status = "NORMAL"


    # -----------------------------------------------
    # Determine risk level
    # -----------------------------------------------

    if risk_score >= 75:

        risk_level = "HIGH"

    elif risk_score >= 45:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"


    # -----------------------------------------------
    # Return AI result
    # -----------------------------------------------

    return {

        "status":
            status,

        "risk_score":
            round(
                risk_score,
                2
            ),

        "risk_level":
            risk_level,

        "ai_model":
            "Isolation Forest",

        "features": {

            "cpu_usage":
                data.cpu_usage,

            "memory_usage":
                data.memory_usage,

            "bandwidth_mbps":
                data.bandwidth_mbps,

            "latency_ms":
                data.latency_ms,

            "packet_loss_percent":
                data.packet_loss_percent,

            "interface_errors":
                data.interface_errors

        }

    }
