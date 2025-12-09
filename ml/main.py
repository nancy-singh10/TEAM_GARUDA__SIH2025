from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random
import lstm  # Import our new module
import pandas as pd
import joblib
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load Random Forest Model
rf_model = None
model_load_error = None
model_path = os.path.join(os.path.dirname(__file__), "modelRF.pkl")

try:
    if os.path.exists(model_path):
        rf_model = joblib.load(model_path)
        print("Random Forest model loaded successfully.")
    else:
        model_load_error = f"Model file not found at {model_path}"
        print(model_load_error)
except Exception as e:
    model_load_error = str(e)
    print(f"Failed to load Random Forest model: {e}")


# Load Day Wise Model
day_wise_model = None
day_wise_model_load_error = None
day_wise_model_path = os.path.join(os.path.dirname(__file__), "dayWiseModel.pkl")

try:
    if os.path.exists(day_wise_model_path):
        day_wise_model = joblib.load(day_wise_model_path)
        print("Day Wise model loaded successfully.")
    else:
        day_wise_model_load_error = f"Model file not found at {day_wise_model_path}"
        print(day_wise_model_load_error)
except Exception as e:
    day_wise_model_load_error = str(e)
    print(f"Failed to load Day Wise model: {e}")

class PredictionRequest(BaseModel):
    past_values: List[float]

class DayPredictionRequest(BaseModel):
    year: int
    month: int
    day: int


class DayWisePredictionRequest(BaseModel):
    month: int
    day: int

@app.get("/")
def read_root():
    return {"message": "ML Simulation API is running"}

@app.post("/predict/lstm")
def predict_energy(request: PredictionRequest):
    """
    Predicts the next energy value using an LSTM model.
    """
    try:
        prediction = lstm.predict_next(request.past_values)
        return {
            "prediction": prediction,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/day")
def get_future_day_prediction(request: DayPredictionRequest):
    """
    Predicts weather/energy parameters for a specific day (24 hours).
    Returns an array of 24 objects containing Hour, SRAD, WS, TM, HU.
    """
    if rf_model is None:
        raise HTTPException(status_code=503, detail=f"Random Forest model is not available (failed to load). Error: {model_load_error}")

    try:
        year = request.year
        month = request.month
        day = request.day

        # Create a list of 24 rows (one for each hour of the day)
        future_data = []
        for hour in range(24):
            future_data.append([year, month, day, hour])

        # Convert to DataFrame so it matches the training format
        prediction_input = pd.DataFrame(future_data, columns=['YEAR', 'MO', 'DY', 'HR'])

        # Get predictions
        predictions = rf_model.predict(prediction_input)

        # Structure the results
        results = []
        # predictions is expected to be a numpy array with 4 columns
        for i, row in enumerate(predictions):
            results.append({
                "Hour": i,
                "Predicted_SRAD": float(row[0]),
                "Predicted_WS": float(row[1]),
                "Predicted_TM": float(row[2]),
                "Predicted_HU": float(row[3])
            })

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/day-wise")
def predict_day_wise(request: DayWisePredictionRequest):
    """
    Predicts values for a specific day and month using the dayWiseModel.
    Returns an array of 24 objects.
    """
    if day_wise_model is None:
        raise HTTPException(status_code=503, detail=f"Day Wise model is not available. Error: {day_wise_model_load_error}")

    try:
        # User defined inputs
        month = request.month
        day = request.day
        year = 2025 # Default year as model likely expects it
        
        # Create a list of 24 rows (one for each hour of the day)
        future_data = []
        for hour in range(24):
            future_data.append([ month, day, hour])

        # Convert to DataFrame
        prediction_input = pd.DataFrame(future_data, columns=[ 'MO', 'DY', 'HR'])

        # Get predictions
        predictions = day_wise_model.predict(prediction_input)

        # Structure the results
        results = []
        for i, row in enumerate(predictions):
            results.append({
                "Hour": i,
                "Predicted_SRAD": float(row[0]),
                "Predicted_WS": float(row[1]),
                "Predicted_TM": float(row[2]),
                "Predicted_HU": float(row[3])
            })

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/simulate")
def simulate(current_value: float, max_variance: float):
    """
    Simulates a new value based on the current value and a maximum variance.
    
    Args:
        current_value (float): The current numerical value.
        max_variance (float): The maximum percentage variance (e.g., 0.1 for 10%).
        
    Returns:
        dict: A dictionary containing the simulated new value.
    """
    try:
        # Calculate random variance factor between 0 and max_variance
        variance_factor = random.uniform(0, max_variance)
        
        # Determine direction (+ or -)
        direction = random.choice([-1, 1])
        
        # Calculate the change
        change = current_value * variance_factor * direction
        
        # Calculate new value
        new_value = current_value + change
        
        return {
            "original_value": current_value,
            "variance_applied": variance_factor,
            "direction": "increase" if direction == 1 else "decrease",
            "new_value": new_value
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
