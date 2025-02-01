const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /products: Get all products (with optional filters: category, price range, sort options)
router.get('/', productController.getProducts);

// GET /products/:id: Get a specific product by ID
router.get('/:id', productController.getProductById);

// POST /products: (Admin) Add a new product (requires admin auth)
router.post('/', authMiddleware.protect, authMiddleware.admin, productController.addProduct);

// PUT /products/:id: (Admin) Update a product by ID (requires admin auth)
router.put('/:id', authMiddleware.protect, authMiddleware.admin, productController.updateProduct);

// DELETE /products/:id: (Admin) Delete a product by ID (requires admin auth)
router.delete('/:id', authMiddleware.protect, authMiddleware.admin, productController.deleteProduct);

module.exports = router;