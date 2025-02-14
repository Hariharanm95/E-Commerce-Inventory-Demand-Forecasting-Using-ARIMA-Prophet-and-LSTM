import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import numpy as np

def preprocess_data(data, lookback=60):
    """
    Preprocesses time series data for LSTM.

    Parameters:
        data (dict): A dictionary containing product names as keys and a list of dicts with 'date', 'stockLevel', 'saleCount'.
        lookback (int): Number of time steps to look back.

    Returns:
        dict: A dictionary containing preprocessed time series data for each product
            with training data(x_train, y_train), scaler for inverse transform
            and dates for future prediction
    """
    preprocessed_data = {}

    for product_name, values in data.items():
      df = pd.DataFrame(values)
      df['date'] = pd.to_datetime(df['date'])
      df = df.sort_values(by="date").set_index("date")

      if df.empty:
        print(f"Skipping {product_name} - empty data after filtering date")
        continue
      
      #Use only saleCount and stockLevel as features
      features = ['saleCount', 'stockLevel']
      #Fill NaN salesCount with 0
      df['saleCount'].fillna(0, inplace=True)
      df = df[features]
      
      scaler = MinMaxScaler()
      scaled_data = scaler.fit_transform(df)

      # Create sequences for training
      x, y = [], []
      for i in range(lookback, len(scaled_data)):
          x.append(scaled_data[i - lookback:i])
          y.append(scaled_data[i, 0]) #Predict the saleCount

      x_train = np.array(x)
      y_train = np.array(y)
      preprocessed_data[product_name] = {'x_train': x_train, 'y_train': y_train, 'scaler': scaler, 'dates': df.index[lookback:]}

    return preprocessed_data

if __name__ == '__main__':
    # Example Usage:
    example_data = {
        "productA": [
             {"date": "2024-01-01", "stockLevel": 100, "saleCount": 10},
            {"date": "2024-01-02", "stockLevel": 90, "saleCount": 15},
            {"date": "2024-01-03", "stockLevel": 75, "saleCount": 20},
            {"date": "2024-01-04", "stockLevel": 60, "saleCount": 5}
        ],
        "productB": [
          {"date": "2024-01-01", "stockLevel": 50, "saleCount": 5},
            {"date": "2024-01-02", "stockLevel": 40, "saleCount": 8},
            {"date": "2024-01-03", "stockLevel": 32, "saleCount": 10},
            {"date": "2024-01-04", "stockLevel": 22, "saleCount": 2},
        ]
    }
    processed = preprocess_data(example_data)
    for product_name, processed_values in processed.items():
         print(f"Processed data for {product_name}:")
         print(f"X_train shape: {processed_values['x_train'].shape}")
         print(f"Y_train shape: {processed_values['y_train'].shape}")
         print(f"Scaler: {processed_values['scaler']}")
         print(f"Dates shape: {processed_values['dates'].shape}")