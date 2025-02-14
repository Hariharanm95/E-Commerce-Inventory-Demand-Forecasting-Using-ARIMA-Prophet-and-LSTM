import pandas as pd
from prophet import Prophet
import os
import pickle

def train_prophet_model(data, model_path):
   """
    Trains the Prophet model.

    Parameters:
        data (pd.DataFrame): Time series data with 'ds' (datetime) and 'y' (value) columns.
        model_path (str): Path to save the trained model.

    Returns:
        prophet.forecaster.Prophet: Trained Prophet model.
    """
   try:
        model = Prophet()
        model.fit(data)
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        with open(model_path, 'wb') as file:
           pickle.dump(model, file)
        print('Prophet model saved at: ',model_path)
        return model
   except Exception as e:
         print(f"Error during prophet model training: {e}")
         return None


def load_prophet_model(model_path):
  """
   Loads a pre-trained prophet model.
   Parameters:
       model_path (str): Path to the trained model.

    Returns:
        prophet.forecaster.Prophet: Trained Prophet model or None if model not found.
   """
  if not os.path.exists(model_path):
        return None
  with open(model_path, 'rb') as file:
       model = pickle.load(file)
  return model


def predict(model, future_dates):
    """
    Make predictions using a trained Prophet model.

    Parameters:
        model (prophet.forecaster.Prophet): Trained Prophet model.
        future_dates (pd.DataFrame): DataFrame containing future dates for predictions.

    Returns:
        np.array: Predicted values.
    """
    try:
        forecast = model.predict(future_dates)
        return forecast[['ds', 'yhat']]
    except Exception as e:
         print(f"Error during prophet prediction: {e}")
         return None

if __name__ == '__main__':
     # Example Usage:
    example_data = pd.DataFrame({
        'ds': pd.to_datetime(pd.date_range('2024-01-01', periods=100)),
        'y': np.random.rand(100)
    })
    model_path = "trained_models/prophet_model_example"
    trained_model = train_prophet_model(example_data, model_path)

    if trained_model:
       print("Prophet Model trained Successfully")
      # Test model
       future_dates = pd.DataFrame({
           'ds': pd.to_datetime(pd.date_range('2024-04-10', periods=5))
       })
       predicted = predict(trained_model, future_dates)
       print('Prediction result:', predicted)
    else:
         print("Prophet Model training failed")