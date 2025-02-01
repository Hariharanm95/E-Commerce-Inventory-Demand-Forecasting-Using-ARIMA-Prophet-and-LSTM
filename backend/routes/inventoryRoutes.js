const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /inventory/report: (Admin) Get inventory report (requires admin auth)
router.get('/report', authMiddleware.protect, authMiddleware.admin, inventoryController.getInventoryReport);

// POST /inventory/predict: (Admin) Predict future stock levels (requires admin auth)
router.post('/predict', authMiddleware.protect, authMiddleware.admin, inventoryController.predictStockLevels);

// POST /inventory/restock: (Admin) Recommend restocking quantities (requires admin auth)
router.post('/restock', authMiddleware.protect, authMiddleware.admin, inventoryController.recommendRestock);

module.exports = router;