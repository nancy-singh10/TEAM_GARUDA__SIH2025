from fastapi import FastAPI, HTTPException
import random

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "ML Simulation API is running"}

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
