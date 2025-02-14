import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import numpy as np
import os


def build_lstm_model(input_shape):
    """
    Builds an LSTM model for time series forecasting.

    Parameters:
        input_shape (tuple): The shape of the input data (lookback, features).

    Returns:
        tf.keras.models.Sequential: Compiled LSTM model.
    """
    model = Sequential([
        LSTM(units=50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(units=50, return_sequences=False),
        Dropout(0.2),
        Dense(units=1)  # Output one value (predicted sales)
    ])

    model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    return model

def train_model(x_train, y_train, model_path, epochs=20, batch_size=32):
    """
    Trains the LSTM model.

    Parameters:
        x_train (np.array): Training input data.
        y_train (np.array): Training output data.
        model_path (str): Path to save the trained model.
        epochs (int): Number of training epochs.
        batch_size (int): Batch size.

    Returns:
        tf.keras.models.Sequential: Trained LSTM model.
    """
    if x_train.size == 0 or y_train.size ==0:
      print('No data to train model')
      return None;
    input_shape = (x_train.shape[1], x_train.shape[2]) if len(x_train.shape) > 2 else (x_train.shape[1], 1)
    model = build_lstm_model(input_shape)

    model.fit(x_train, y_train, epochs=epochs, batch_size=batch_size, verbose=0)

    # Create the model directory if it doesn't exist
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    model.save(model_path)
    print('model saved at:',model_path)
    return model


def load_model(model_path):
   """
   Loads a pre-trained Keras model.
   Parameters:
       model_path (str): Path to the trained model.

    Returns:
        tf.keras.models.Sequential: Trained LSTM model or None if model not found.
   """
   if not os.path.exists(model_path):
        return None
   model = tf.keras.models.load_model(model_path)
   return model;

def predict(model, input_data, scaler, lookback=60):
    """
    Make predictions using a trained LSTM model.

    Parameters:
        model (tf.keras.models.Sequential): The trained LSTM model.
        input_data (np.array): Input sequence for prediction.
        scaler (sklearn.preprocessing.MinMaxScaler): Scaler object for inverse transform.
        lookback (int): Number of time steps to look back.

    Returns:
        np.array: Predicted values
    """
    if model is None or input_data.size == 0:
      return None
    # Predict next sales value based on the last `lookback` values in data
    prediction = model.predict(input_data)

    #Inverse transform the predicted value to get original scale
    predicted_sale = scaler.inverse_transform(np.concatenate((prediction, np.zeros_like(prediction)), axis=1))[:, 0]
    return predicted_sale

if __name__ == '__main__':
     # Example Usage:
    lookback = 3
    input_shape = (lookback, 2)
    #Example train data
    x_train = np.random.rand(100, lookback, 2)
    y_train = np.random.rand(100)

    #Train model
    model_path = 'trained_models/lstm_model_example'
    trained_model = train_model(x_train, y_train, model_path)

    if trained_model:
        print("LSTM Model trained Successfully")
        # Test model
        input_test = np.random.rand(1, lookback, 2) # test on one data point
        #Example Scaler
        class ExampleScaler:
            def inverse_transform(self, data):
               # Simple scaler for testing, replace with actual scaler
                return data
        scaler = ExampleScaler()
        predicted = predict(trained_model, input_test, scaler)
        print('Prediction result:', predicted)
    else:
         print("LSTM Model training failed")