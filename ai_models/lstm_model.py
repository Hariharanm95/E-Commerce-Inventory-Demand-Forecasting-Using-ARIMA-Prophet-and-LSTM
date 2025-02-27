import torch
import torch.nn as nn
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from torch.utils.data import DataLoader, TensorDataset

# Load data
df = pd.read_csv('/content/sample_data/sales2.csv', parse_dates=['date'])

# Encode categorical variables
label_encoder = LabelEncoder()
df['product_name'] = label_encoder.fit_transform(df['product_name'])
df['store_type'] = label_encoder.fit_transform(df['store_type'])
df['day_of_week'] = label_encoder.fit_transform(df['day_of_week'])

# Select features and target
features = ['product_name', 'unit_price', 'store_id', 'store_type', 'promotion', 'day_of_week', 'temperature']
target = 'units_sold'

# Normalize data
scaler = MinMaxScaler()
df[features + [target]] = scaler.fit_transform(df[features + [target]])

# Convert to numpy arrays
X = df[features].values
y = df[target].values

# Convert to tensors
X_tensor = torch.tensor(X, dtype=torch.float32)
y_tensor = torch.tensor(y, dtype=torch.float32).unsqueeze(1)

# Create dataset and dataloader
dataset = TensorDataset(X_tensor, y_tensor)
dataloader = DataLoader(dataset, batch_size=4, shuffle=True)

# Define LSTNet model
class LSTNet(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(LSTNet, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out, _ = self.lstm(x.unsqueeze(1))  # Adding sequence dimension
        out = self.fc(out[:, -1, :])
        return out

# Initialize model
input_size = len(features)
hidden_size = 64
output_size = 1
model = LSTNet(input_size, hidden_size, output_size)

# Define loss function and optimizer
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# Training loop
for epoch in range(100):
    for batch_x, batch_y in dataloader:
        optimizer.zero_grad()
        output = model(batch_x)
        loss = criterion(output, batch_y)
        loss.backward()
        optimizer.step()

# Forecasting
with torch.no_grad():
    pred = model(X_tensor)
    pred = scaler.inverse_transform(np.hstack((X, pred.numpy())))[:, -1]  # Reverse normalization for predictions
    print("Predicted Sales:", pred)
