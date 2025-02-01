const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /analytics/sales: (Admin) Get sales data for graphs and reports (requires admin auth)
router.get('/sales', authMiddleware.protect, authMiddleware.admin, analyticsController.getSalesData);

// GET /analytics/bestselling: (Admin) Get data about best selling products (requires admin auth)
router.get('/bestselling', authMiddleware.protect, authMiddleware.admin, analyticsController.getBestSellingProducts);

// GET /analytics/trends: (Admin) Get sales trends data (requires admin auth)
router.get('/trends', authMiddleware.protect, authMiddleware.admin, analyticsController.getSalesTrends);

module.exports = router;