const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Example auth middleware

// POST /auth/signup: Register a new user
router.post('/signup', authController.signup);

// POST /auth/login: Log in an existing user
router.post('/login', authController.login);

// GET /auth/me: Get authenticated user's information (requires JWT)
router.get('/me', authMiddleware.protect, authController.getMe);


module.exports = router;