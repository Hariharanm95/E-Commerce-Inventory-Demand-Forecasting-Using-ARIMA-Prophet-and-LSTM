const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /cart: Get user's cart (requires JWT)
router.get('/', authMiddleware.protect, cartController.getCart);

// POST /cart/add: Add a product to cart (requires JWT)
router.post('/add', authMiddleware.protect, cartController.addItemToCart);

// POST /cart/remove: Remove a product from cart (requires JWT)
router.post('/remove', authMiddleware.protect, cartController.removeItemFromCart);

// POST /cart/update/:id: Update cart item quantity (requires JWT)
router.post('/update/:id', authMiddleware.protect, cartController.updateCartItem);

// DELETE /cart: Clear all products from cart (requires JWT)
router.delete('/', authMiddleware.protect, cartController.clearCart);

module.exports = router;