const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
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