const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /orders/checkout: Create a new order (requires JWT, handles payment processing)
router.post('/checkout', authMiddleware.protect, orderController.createOrder);

// GET /orders: Get user's order history (requires JWT)
router.get('/', authMiddleware.protect, orderController.getUserOrders);

// GET /orders/:id: Get a specific order (requires JWT)
router.get('/:id', authMiddleware.protect, orderController.getOrderById);

// POST /orders/:id/updateStatus: (Admin) Update order status by ID (requires admin auth)
router.post('/:id/updateStatus', authMiddleware.protect, authMiddleware.admin, orderController.updateOrderStatus);

module.exports = router;