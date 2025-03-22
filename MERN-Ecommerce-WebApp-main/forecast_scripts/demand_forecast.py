import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppresses TF warnings & logs
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
import requests
import json
import pandas as pd
import numpy as np
import tensorflow as tf
import xgboost as xgb
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
from skopt import gp_minimize
from skopt.space import Integer, Real

try:
    API_URL = "http://localhost:5000/api/v1/forecast/monthly-sales"
    response = requests.get(API_URL)
    response.raise_for_status()
    data = response.json()

    df = pd.DataFrame(data)
    df.columns = ["ds", "top_product", "y"]  # Ensure top_product is included

    if df.isnull().values.any():
        print(json.dumps({"error": "Data contains missing values"}))
        exit()

    # Normalize the target variable
    scaler = MinMaxScaler()
    df["y_scaled"] = scaler.fit_transform(df[["y"]])

    train = df.iloc[:-12]
    test = df.iloc[-12:]

    # ARIMA Model
    def arima_rmse(params):
        p, d, q = params
        try:
            model = ARIMA(train["y"], order=(p, d, q))
            fit = model.fit()
            pred = fit.forecast(steps=len(test))
            return np.sqrt(mean_squared_error(test["y"], pred))
        except:
            return float("inf")

    space = [Integer(0, 5, name="p"), Integer(0, 2, name="d"), Integer(0, 5, name="q")]
    res_arima = gp_minimize(arima_rmse, space, n_calls=20, random_state=42)
    p, d, q = res_arima.x
    arima_model = ARIMA(df["y"], order=(p, d, q)).fit()
    arima_forecast = arima_model.forecast(steps=12)

    # Prophet Model
    prophet_model = Prophet()
    prophet_model.fit(df[["ds", "y"]])
    future = prophet_model.make_future_dataframe(periods=12, freq="M")
    prophet_forecast = prophet_model.predict(future)["yhat"].iloc[-12:].values

    # LSTM Model
    sequence_length = 12
    X, y = [], []
    for i in range(len(df) - sequence_length):
        X.append(df["y_scaled"].iloc[i:i+sequence_length].values)
        y.append(df["y_scaled"].iloc[i+sequence_length])

    X, y = np.array(X), np.array(y)

    def lstm_rmse(params):
        lstm_units, dropout_rate = int(params[0]), params[1]
        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(lstm_units, activation="relu", return_sequences=True, input_shape=(sequence_length, 1)),
            tf.keras.layers.Dropout(dropout_rate),
            tf.keras.layers.LSTM(lstm_units, activation="relu"),
            tf.keras.layers.Dense(1)
        ])
        model.compile(optimizer="adam", loss="mse")
        model.fit(X, y, epochs=30, batch_size=16, verbose=0)

        lstm_pred = scaler.inverse_transform(model.predict(X[-12:]).reshape(-1, 1)).flatten()
        return np.sqrt(mean_squared_error(df["y"][-12:], lstm_pred))

    space = [Integer(20, 100, name="lstm_units"), Real(0.1, 0.5, name="dropout_rate")]
    res_lstm = gp_minimize(lstm_rmse, space, n_calls=30, random_state=42)

    lstm_units = int(res_lstm.x[0])
    dropout_rate = float(res_lstm.x[1])
    lstm_model = tf.keras.Sequential([
        tf.keras.layers.LSTM(lstm_units, activation="relu", return_sequences=True, input_shape=(sequence_length, 1)),
        tf.keras.layers.Dropout(dropout_rate),
        tf.keras.layers.LSTM(lstm_units, activation="relu"),
        tf.keras.layers.Dense(1)
    ])
    lstm_model.compile(optimizer="adam", loss="mse")
    lstm_model.fit(X, y, epochs=50, batch_size=16, verbose=0)

    lstm_forecast = []
    lstm_input = df["y_scaled"].iloc[-sequence_length:].values.reshape(1, sequence_length, 1)

    for _ in range(12):
        next_pred = lstm_model.predict(lstm_input, verbose=0)
        lstm_forecast.append(next_pred[0, 0])
        lstm_input = np.roll(lstm_input, -1, axis=1)
        lstm_input[0, -1, 0] = next_pred

    lstm_forecast = scaler.inverse_transform(np.array(lstm_forecast).reshape(-1, 1)).flatten()

    # Compute RMSE for weighting
    arima_rmse = np.sqrt(mean_squared_error(df["y"][-12:], arima_forecast))
    prophet_rmse = np.sqrt(mean_squared_error(df["y"][-12:], prophet_forecast))
    lstm_rmse = np.sqrt(mean_squared_error(df["y"][-12:], lstm_forecast))

    weights = {
        "arima": 1 / arima_rmse,
        "prophet": 1 / prophet_rmse,
        "lstm": 1 / lstm_rmse
    }

    total_weight = sum(weights.values())
    for model in weights:
        weights[model] /= total_weight

    final_forecast_rmse = (
        weights["arima"] * arima_forecast +
        weights["prophet"] * prophet_forecast +
        weights["lstm"] * lstm_forecast
    )

    # XGBoost to optimize weighting
    train_X = np.array([[arima_rmse, prophet_rmse, lstm_rmse]])
    train_y = np.array([[weights["arima"], weights["prophet"], weights["lstm"]]])
    xgb_model = xgb.XGBRegressor(objective="reg:squarederror")
    xgb_model.fit(train_X, train_y)
    optimal_weights = xgb_model.predict(train_X)

    final_forecast_xgb = (
        np.array(optimal_weights).reshape(-1, 1) * np.array([arima_forecast, prophet_forecast, lstm_forecast])
    ).sum(axis=0)

    # MAPE Calculation
    def mean_absolute_percentage_error(y_true, y_pred):
        y_true = np.array(y_true)
        y_pred = np.array(y_pred)

        y_true[y_true == 0] = 1e-9  # Avoid division by zero
        return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

    arima_mape = mean_absolute_percentage_error(df["y"][-12:], arima_forecast)
    prophet_mape = mean_absolute_percentage_error(df["y"][-12:], prophet_forecast)
    lstm_mape = mean_absolute_percentage_error(df["y"][-12:], lstm_forecast)


    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
    # Prepare output
    forecast_output = []
    for i in range(12):
        forecast_output.append({
            "month": future["ds"].iloc[i + len(train)].strftime('%Y-%m'),
            "top_product": df["top_product"].iloc[-12:].values[i] if i < len(df["top_product"].iloc[-12:]) else "Unknown",
            "estimated_sales": round(final_forecast_xgb[i], 2)  # XGBoost-weighted forecast
        })

    print(json.dumps({
        "forecast": forecast_output,
    }))

except Exception as e:
    print(json.dumps({"error": str(e)}))
