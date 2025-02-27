import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv('/content/sample_data/sales.csv', parse_dates=['date'], index_col='date')

# Filter data for a specific product, e.g., 'Widget A'
product_data = df[df['product_name'] == 'Widget A']

# Resample data to daily frequency, filling missing dates with 0 sales
daily_sales = product_data['units_sold'].resample('D').sum().fillna(0)

# Fit ARIMA model
model = ARIMA(daily_sales, order=(5,1,0))  # (p,d,q)
model_fit = model.fit()

# Forecast the next 10 days
forecast = model_fit.forecast(steps=10)
print(forecast)

# Plot the historical sales and forecast
plt.figure(figsize=(10,5))
plt.plot(daily_sales, label='Historical Sales')
plt.plot(forecast, label='Forecast', color='red')
plt.title('Sales Forecast for Widget A')
plt.xlabel('Date')
plt.ylabel('Units Sold')
plt.legend()
plt.show()
