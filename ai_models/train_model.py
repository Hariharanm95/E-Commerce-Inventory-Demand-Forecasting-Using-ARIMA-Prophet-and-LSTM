import json
import os
import pandas as pd
from data_preprocessing import preprocess_data
from lstm_model import train_model as lstm_train, load_model as lstm_load, predict as lstm_predict
from arima_model import train_arima_model, load_arima_model, predict as arima_predict
from prophet_model import train_prophet_model, load_prophet_model, predict as prophet_predict
import numpy as np
from datetime import datetime


def train_and_predict(data):
  """
    Trains and predicts using LSTM, ARIMA, and Prophet models.

    Parameters:
       data (dict): A dictionary containing product names as keys and a list of dicts with 'date', 'stockLevel', 'saleCount'.

    Returns:
        dict: A dictionary containing the predicted values and future dates for each product.
    """
  try:
      preprocessed_data = preprocess_data(data)
      prediction_results = {}
      for product_name, values in preprocessed_data.items():
          print(f'Predicting for: {product_name}')
          x_train = values['x_train']
          y_train = values['y_train']
          scaler = values['scaler']
          dates = values['dates']
          model_dir = f"trained_models/{product_name}/"
          lstm_model_path = model_dir + f"lstm_model_{product_name}"
          arima_model_path = model_dir + f"arima_model_{product_name}.pkl"
          prophet_model_path = model_dir + f"prophet_model_{product_name}.pkl"

          # LSTM Model Prediction
          lstm_model = lstm_load(lstm_model_path)
          if lstm_model is None:
            lstm_model = lstm_train(x_train, y_train, lstm_model_path)
          if lstm_model is not None:
             last_data = x_train[-1].reshape(1, x_train.shape[1], x_train.shape[2])
             predicted_sales = lstm_predict(lstm_model, last_data, scaler)
          else:
              predicted_sales = None

          # ARIMA Model Prediction
          df = pd.DataFrame(data[product_name])
          df['date'] = pd.to_datetime(df['date'])
          df = df.sort_values(by="date").set_index("date")
          arima_model = load_arima_model(arima_model_path)
          if arima_model is None:
             arima_model = train_arima_model(df['saleCount'], arima_model_path)
          if arima_model:
              predicted_arima_sales = arima_predict(arima_model, steps=1)
          else:
            predicted_arima_sales = None

          # Prophet Model Prediction
          df_prophet = pd.DataFrame(data[product_name])
          df_prophet['date'] = pd.to_datetime(df_prophet['date'])
          df_prophet = df_prophet.sort_values(by="date")
          df_prophet_data = df_prophet[['date', 'saleCount']].rename(columns={'date': 'ds', 'saleCount': 'y'})
          prophet_model = load_prophet_model(prophet_model_path)
          if prophet_model is None:
              prophet_model = train_prophet_model(df_prophet_data, prophet_model_path)
          if prophet_model is not None:
            last_date = df_prophet_data['ds'].iloc[-1]
            future_dates = pd.DataFrame({'ds': [last_date + pd.Timedelta(days=1)]})
            predicted_prophet = prophet_predict(prophet_model, future_dates)
            predicted_prophet_sales = predicted_prophet['yhat'].iloc[0]
          else:
               predicted_prophet_sales = None

          prediction_results[product_name] = []
          if predicted_sales is not None:
            prediction_results[product_name].append({
                'predicted_sales': predicted_sales.item(), # Convert np.float to float
                'predicted_stock_level': predicted_sales.item()  # Use the predicted_sales also as predicted_stock_level.
              })
          if predicted_arima_sales is not None:
                prediction_results[product_name].append({
                   'predicted_sales':  predicted_arima_sales.item(), # Convert np.float to float
                    'predicted_stock_level': None  # No stock predicted with ARIMA
                })
          if predicted_prophet_sales is not None:
               prediction_results[product_name].append({
                    'predicted_sales': predicted_prophet_sales.item(), # Convert np.float to float
                    'predicted_stock_level': None #No stock prediction with Prophet
               })

      return prediction_results
  except Exception as e:
       print(f"Error during model prediction: {e}")
       return None

if __name__ == '__main__':
    # Example Usage:
    example_data = {
        "productA": [
             {"date": "2024-01-01", "stockLevel": 100, "saleCount": 10},
            {"date": "2024-01-02", "stockLevel": 90, "saleCount": 15},
            {"date": "2024-01-03", "stockLevel": 75, "saleCount": 20},
             {"date": "2024-01-04", "stockLevel": 60, "saleCount": 5},
             {"date": "2024-01-05", "stockLevel": 55, "saleCount": 12},
        ],
        "productB": [
             {"date": "2024-01-01", "stockLevel": 50, "saleCount": 5},
            {"date": "2024-01-02", "stockLevel": 40, "saleCount": 8},
            {"date": "2024-01-03", "stockLevel": 32, "saleCount": 10},
             {"date": "2024-01-04", "stockLevel": 22, "saleCount": 2},
              {"date": "2024-01-05", "stockLevel": 20, "saleCount": 10}
        ]
    }

    prediction = train_and_predict(example_data)

    if prediction:
        print("Prediction Result: ", prediction)
    else:
      print("Model Prediction Failed")