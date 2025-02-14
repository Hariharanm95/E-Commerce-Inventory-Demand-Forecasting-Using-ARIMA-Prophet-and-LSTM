import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import os
import pickle

def train_arima_model(data, model_path, order=(5,1,0)):
    """
    Trains the ARIMA model.

    Parameters:
        data (pd.Series): Time series data.
        model_path (str): Path to save the trained model.
        order (tuple): ARIMA (p, d, q) order.

    Returns:
        statsmodels.tsa.arima.model.ARIMAResultsWrapper: Trained ARIMA model.
    """
    try:
      model = ARIMA(data, order=order)
      model_fit = model.fit()
       # Create the model directory if it doesn't exist
      os.makedirs(os.path.dirname(model_path), exist_ok=True)
      with open(model_path, 'wb') as file:
          pickle.dump(model_fit, file)
      print('Arima model saved to: ', model_path)
      return model_fit
    except Exception as e:
        print(f"Error training ARIMA model: {e}")
        return None;

def load_arima_model(model_path):
   """
   Loads a pre-trained arima model.
   Parameters:
        model_path (str): Path to the trained model.

    Returns:
        statsmodels.tsa.arima.model.ARIMAResultsWrapper: Trained ARIMA model or None if model not found.
   """
   if not os.path.exists(model_path):
        return None
   with open(model_path, 'rb') as file:
         model = pickle.load(file)
   return model;

def predict(model, steps=1):
   """
    Make predictions using trained ARIMA model.

    Parameters:
        model (statsmodels.tsa.arima.model.ARIMAResultsWrapper): The trained ARIMA model.
        steps (int): Number of steps for future forecast.

    Returns:
        np.array: Predicted values
    """
   try:
        forecast = model.forecast(steps=steps)
        return forecast
   except Exception as e:
        print(f"Error during arima prediction: {e}")
        return None

if __name__ == '__main__':
   # Example Usage:
    example_data = pd.Series(np.random.rand(100)) # example series data
    model_path = "trained_models/arima_model_example"
    trained_model = train_arima_model(example_data, model_path)

    if trained_model:
        print("Arima Model trained Successfully")
        # Test model
        predicted = predict(trained_model, steps=5)
        print('Prediction result:', predicted)
    else:
         print("Arima Model training failed")