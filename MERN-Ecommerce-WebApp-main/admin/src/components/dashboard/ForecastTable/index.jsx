import React from 'react';
import styles from './ForecastTable.module.scss';

const ForecastTable = ({ data, loading, error }) => {
    if (loading) {
        return <p>Loading forecast data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!data) {
        return null;
    }

    return (
        <div className={styles.forecastTableContainer}>
            <h3>Final Hybrid Forecast (RMSE)</h3>
            <table className={styles.forecastTable}>
                <thead>
                    <tr className={styles.tableHeaderRow}>
                        <th className={styles.tableHeader}>Month</th>
                        <th className={styles.tableHeader}>RMSE Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.final_forecast_rmse.map((value, index) => (
                        <tr key={index} className={styles.tableRow}>
                            <td className={styles.tableCell}>Month {index + 1}</td>
                            <td className={styles.tableCell}>{value.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Final Hybrid Forecast (XGBoost Weighted)</h3>
            <table className={styles.forecastTable}>
                <thead>
                    <tr className={styles.tableHeaderRow}>
                        <th className={styles.tableHeader}>Month</th>
                        <th className={styles.tableHeader}>XGBoost Weighted Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.final_forecast_xgb.map((value, index) => (
                        <tr key={index} className={styles.tableRow}>
                            <td className={styles.tableCell}>Month {index + 1}</td>
                            <td className={styles.tableCell}>{value.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Individual Model RMSEs</h3>
            <table className={styles.forecastTable}>
                <thead>
                    <tr className={styles.tableHeaderRow}>
                        <th className={styles.tableHeader}>Model</th>
                        <th className={styles.tableHeader}>RMSE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.tableCell}>ARIMA</td>
                        <td className={styles.tableCell}>{data.arima_rmse.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className={styles.tableCell}>Prophet</td>
                        <td className={styles.tableCell}>{data.prophet_rmse.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className={styles.tableCell}>LSTM</td>
                        <td className={styles.tableCell}>{data.lstm_rmse.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <h3>Individual Model MAPEs</h3>
            <table className={styles.forecastTable}>
                <thead>
                    <tr className={styles.tableHeaderRow}>
                        <th className={styles.tableHeader}>Model</th>
                        <th className={styles.tableHeader}>MAPE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.tableCell}>ARIMA</td>
                        <td className={styles.tableCell}>{data.arima_mape !== null ? data.arima_mape.toFixed(2) + "%" : "N/A"}</td>
                    </tr>
                    <tr>
                        <td className={styles.tableCell}>Prophet</td>
                        <td className={styles.tableCell}>{data.prophet_mape !== null ? data.prophet_mape.toFixed(2) + "%" : "N/A"}</td>
                    </tr>
                    <tr>
                        <td className={styles.tableCell}>LSTM</td>
                        <td className={styles.tableCell}>{data.lstm_mape !== null ? data.lstm_mape.toFixed(2) + "%" : "N/A"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ForecastTable;