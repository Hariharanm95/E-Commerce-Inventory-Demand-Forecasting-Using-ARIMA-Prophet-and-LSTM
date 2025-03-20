import React, { useEffect, useState } from "react";
import StatsCard from "../../components/dashboard/StatsCard";
import classes from "./dashboard.module.scss";
import { useSelector } from "react-redux";
import API from "api";
import LatestOrders from "components/dashboard/LatestOrders/index.jsx";
import SkeletonLoader from "components/SkeletonLoader";
import LatestUsers from "components/dashboard/LatestUsers/index.jsx";
import ForecastTable from "components/dashboard/ForecastTable/index.jsx"; // Import ForecastTable

const Dashboard = () => {
    const user = useSelector((state) => state.user);

    API.defaults.headers.token = `Bearer ${user.currentUser.token}`;

    useEffect(() => {
        fetchAll();
        fetchForecastData(); // Fetch forecast data on component mount
    }, [user]);

    const [isFetching, setIsFetching] = useState(true);
    const [allUsers, setAllUsers] = useState();
    const [allOrders, setAllOrders] = useState();
    const [allProducts, setAllProducts] = useState();

    const [forecastData, setForecastData] = useState(null);
    const [forecastLoading, setForecastLoading] = useState(true);
    const [forecastError, setForecastError] = useState(null);


    const fetchAll = async () => {
        setIsFetching(true);

        const fetchAllProducts = API.get("/products");
        const fetchAllUsers = API.get("/");
        const fetchAllOrders = API.get("/order");

        const [productsResponse, ordersResponse, usersResponse] = await Promise.all(
            [fetchAllProducts, fetchAllOrders, fetchAllUsers]
        );

        setAllOrders(ordersResponse?.data.data);
        setAllUsers(usersResponse?.data.data);
        setAllProducts(productsResponse?.data.data);

        setIsFetching(false);
    };

    const fetchForecastData = async () => {
        setForecastLoading(true);
        setForecastError(null);

        try {
            const response = await API.get("/forecast/run-forecast"); // Using API.get() instead of fetch()
            setForecastData(response.data); // Accessing response data
        } catch (e) {
            setForecastError(e.message);
            console.error("Failed to fetch forecast data:", e);
        } finally {
            setForecastLoading(false);
        }
    };


    return (
        <div className={classes.dashboard}>
            {!isFetching ? (
                <StatsCard
                    allUsers={allUsers}
                    allProducts={allProducts}
                    allOrders={allOrders}
                />
            ) : (
                <SkeletonLoader />
            )}

            <div className={classes.dashboardTables}>
                <LatestOrders allOrders={allOrders?.slice(0, 4)} />
                <LatestUsers allUsers={allUsers?.slice(0, 4)} />
            </div>
            {/* Forecast Data Section */}
            <div className={classes.forecastSection}>
                <h2>Demand Forecast</h2>
                <ForecastTable data={forecastData} loading={forecastLoading} error={forecastError} />
            </div>

        </div>
    );
};

export default Dashboard;