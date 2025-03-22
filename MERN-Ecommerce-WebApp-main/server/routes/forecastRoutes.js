const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Forecast = require('../models/forecastModel');
const { runDemandForecast } = require('../services/forecastService'); // Import the forecast service

// Helper function to calculate top-selling product for a given month
async function calculateTopProductSales(startDate, endDate) {
    try {
        const orders = await Order.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).populate('cartId');

        const productSales = {}; // Store product-wise sales

        orders.forEach(order => {
            order.cartId.products.forEach(product => {
                const productId = product.productId.toString();
                const revenue = product.quantity * product.price;

                if (!productSales[productId]) {
                    productSales[productId] = { name: product.name, totalSales: 0 };
                }
                productSales[productId].totalSales += revenue;
            });
        });

        let topProduct = Object.values(productSales).reduce((max, product) =>
            product.totalSales > max.totalSales ? product : max, { totalSales: 0 }
        );

        if (!topProduct.name) {
            const randomProducts = await Product.aggregate([{ $sample: { size: 1 } }]);
            if (randomProducts.length > 0) {
                topProduct = {
                    name: randomProducts[0].name,
                    totalSales: Math.floor(Math.random() * 500) + 50 // Assigning random sales (50-500)
                };
            } else {
                topProduct = { name: "No Products Available", totalSales: 0 };
            }
        }

        return {
            ds: endDate.toISOString().slice(0, 7), // 'YYYY-MM' format
            topProduct: topProduct.name,
            y: topProduct.totalSales
        };
    } catch (error) {
        console.error("Error calculating top product sales:", error);
        throw error;
    }
}

// Updated API route
router.get('/monthly-sales', async (req, res) => {
    try {
        const salesData = [];
        const currentDate = new Date();
        const monthsToFetch = 36; // Fetch data for the last 36 months

        for (let i = 0; i < monthsToFetch; i++) {
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i - 1, 1);
            const topProductData = await calculateTopProductSales(startDate, endDate);
            salesData.push(topProductData);
        }

        res.json(salesData.reverse()); // Send in ascending order
    } catch (error) {
        console.error("Error fetching monthly sales data:", error);
        res.status(500).json({ message: "Error fetching sales data" });
    }
});

router.get('/run-forecast', async (req, res) => {
    try {
        const forecastData = await runDemandForecast();

        if (!forecastData || !forecastData.forecast || !Array.isArray(forecastData.forecast)) {
            return res.status(400).json({ message: "Invalid forecast data format." });
        }

        const forecastEntries = forecastData.forecast.map(entry => ({
            ds: entry.month, // Update key to match the Python script output
            topProduct: entry.top_product, // Update key
            y: entry.estimated_sales // Update key
        }));

        await Forecast.deleteMany({});
        console.log("Old forecast data deleted.");

        await Forecast.insertMany(forecastEntries);
        console.log("Forecast data saved successfully:", forecastEntries);

        res.json({ message: "Forecast data generated and saved.", data: forecastEntries });
    } catch (error) {
        console.error("Error running demand forecast:", error);
        res.status(500).json({ message: "Error running demand forecast", error: error.message });
    }
});

router.get('/get-forecast', async (req, res) => {
    try {
        const forecastData = await Forecast.find().sort({ ds: 1 }); // Sort by month

        if (!forecastData.length) {
            return res.status(404).json({ message: "No forecast data available" });
        }

        res.json(forecastData);
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        res.status(500).json({ message: "Error fetching forecast data", error: error.message });
    }
});


module.exports = router;