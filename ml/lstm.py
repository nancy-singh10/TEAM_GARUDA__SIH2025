import torch
import torch.nn as nn
import numpy as np

class EnergyLSTM(nn.Module):
    def __init__(self, input_size=1, hidden_size=50, output_size=1):
        super(EnergyLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        # x shape: (batch_size, sequence_length, input_size)
        # Initialize hidden state and cell state
        h0 = torch.zeros(1, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(1, x.size(0), self.hidden_size).to(x.device)

        # Forward propagate LSTM
        out, _ = self.lstm(x, (h0, c0))
        
        # Decode the hidden state of the last time step
        out = self.fc(out[:, -1, :])
        return out

def generate_synthetic_data(days=100, points_per_day=24):
    """Generates synthetic solar-like data (sine wave with noise)."""
    total_points = days * points_per_day
    x = np.linspace(0, days * 2 * np.pi, total_points)
    # Solar pattern: max at noon, zero at night.
    # sin(x) goes -1 to 1. We want only positive parts mimicking day.
    # But simple sin wave is fine for demo. Let's make it more solar-like.
    base = np.sin(x)
    base[base < 0] = 0 # Night time
    noise = np.random.normal(0, 0.1, total_points)
    return base + noise

def train_model():
    """Trains the LSTM on synthetic data and returns the model."""
    print("Training LSTM model on synthetic data...")
    # Hyperparameters
    sequence_length = 24 # Use past 24 hours to predict next hour
    hidden_size = 32
    learning_rate = 0.01
    epochs = 50 

    # Prepare data
    data = generate_synthetic_data()
    # Normalize (already roughly 0-1) but good practice
    
    # Create sequences
    X = []
    y = []
    for i in range(len(data) - sequence_length):
        X.append(data[i:i+sequence_length])
        y.append(data[i+sequence_length])
    
    X = np.array(X).reshape(-1, sequence_length, 1)
    y = np.array(y).reshape(-1, 1)

    # Convert to PyTorch tensors
    X_tensor = torch.FloatTensor(X)
    y_tensor = torch.FloatTensor(y)

    model = EnergyLSTM(input_size=1, hidden_size=hidden_size, output_size=1)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

    model.train()
    for epoch in range(epochs):
        outputs = model(X_tensor)
        optimizer.zero_grad()
        loss = criterion(outputs, y_tensor)
        loss.backward()
        optimizer.step()
        
        if (epoch+1) % 10 == 0:
            print(f'Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}')

    print("Training complete.")
    return model

# Global model instance (lazy loaded)
_model = None

def get_model():
    global _model
    if _model is None:
        _model = train_model()
    return _model

def predict_next(values: list[float]):
    """
    Predicts the next value given a list of float values.
    The list should ideally be length 24 (past 24 hours).
    If shorter/longer, we handle it.
    """
    model = get_model()
    model.eval()
    
    # Prepare input
    # If list is too short, pad with 0. If too long, truncate.
    seq_len = 24
    if len(values) < seq_len:
        # Pad with 0s at the start
        padded = [0] * (seq_len - len(values)) + values
        input_seq = np.array(padded)
    else:
        input_seq = np.array(values[-seq_len:])
    
    input_tensor = torch.FloatTensor(input_seq).reshape(1, seq_len, 1)
    
    with torch.no_grad():
        prediction = model(input_tensor)
    
    return float(prediction.item())
