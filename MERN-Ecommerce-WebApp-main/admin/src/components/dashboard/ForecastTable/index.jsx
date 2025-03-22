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

    // Function to generate upcoming 12 months
    const getUpcomingMonths = () => {
        const months = [];
        const now = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        for (let i = 0; i < 12; i++) {
            const futureMonth = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const formattedMonth = `${monthNames[futureMonth.getMonth()]} ${futureMonth.getFullYear()}`;
            months.push(formattedMonth);
        }
        return months;
    };

    const upcomingMonths = getUpcomingMonths();

    return (
        <div className={styles.forecastTableContainer}>
            <h3>Predicted Top product & Sales</h3>
            <table className={styles.forecastTable}>
                <thead>
                    <tr className={styles.tableHeaderRow}>
                        <th className={styles.tableHeader}>Month</th>
                        <th className={styles.tableHeader}>Top Product</th>
                        <th className={styles.tableHeader}>Estimated Sales</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className={styles.tableRow}>
                            <td className={styles.tableCell}>{upcomingMonths[index]}</td>
                            <td className={styles.tableCell}>{item.topProduct}</td>
                            <td className={styles.tableCell}>${item.y.toFixed(2)}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
};

export default ForecastTable;
