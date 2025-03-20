const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { runDemandForecast } = require('../services/forecastService'); // Import the forecast service

// Helper function to calculate total sales for a given period
async function calculateTotalSales(startDate, endDate) {
    try {
        const orders = await Order.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('cartId'); // Populate the cart to get the product details

        let totalSales = 0;
        orders.forEach(order => {
            order.cartId.products.forEach(product => {
                totalSales += product.quantity * product.price;
            });
        });

        return totalSales;
    } catch (error) {
        console.error("Error calculating total sales:", error);
        throw error;
    }
}

// GET route to fetch monthly sales data for forecasting
router.get('/monthly-sales', async (req, res) => {
    try {
        const salesData = [];
        const currentDate = new Date();
        const monthsToFetch = 36; // Fetch data for the last 36 months

        for (let i = 0; i < monthsToFetch; i++) {
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i - 1, 1);
            const totalSales = await calculateTotalSales(startDate, endDate);
            salesData.push({
                ds: endDate.toISOString().slice(0, 7), // Date string in 'YYYY-MM' format
                y: totalSales
            });
        }

        res.json(salesData.reverse()); // Send the sales data as JSON
    } catch (error) {
        console.error("Error fetching monthly sales data:", error);
        res.status(500).json({ message: "Error fetching sales data" });
    }
});


// GET route to run the demand forecast and return results
router.get('/run-forecast', async (req, res) => {
    try {
        const forecastData = await runDemandForecast();
        console.log("Forecast Response:", forecastData); // Log output

        res.json(forecastData);
    } catch (error) {
        console.error("Error running demand forecast:", error);
        res.status(500).json({
            message: "Error running demand forecast",
            error: error.message,  // Provide actual error details
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});


module.exports = router;