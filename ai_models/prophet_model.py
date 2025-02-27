import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv('/content/sample_data/sales.csv', parse_dates=['date'])

# Filter data for a specific product, e.g., 'Widget A'
product_data = df[df['product_name'] == 'Widget A']

# Aggregate daily sales
daily_sales = product_data.groupby('date').agg({'units_sold': 'sum'}).reset_index()

# Rename columns to fit Prophet's requirements
daily_sales.rename(columns={'date': 'ds', 'units_sold': 'y'}, inplace=True)

# Initialize and fit the Prophet model
model = Prophet()
model.fit(daily_sales)

# Create a dataframe to hold predictions for the next 10 days
future = model.make_future_dataframe(periods=10)

# Predict future sales
forecast = model.predict(future)
print(forecast)
# Plot the forecast
fig = model.plot(forecast)
plt.title('Sales Forecast for Widget A')
plt.xlabel('Date')
plt.ylabel('Units Sold')
plt.show()
