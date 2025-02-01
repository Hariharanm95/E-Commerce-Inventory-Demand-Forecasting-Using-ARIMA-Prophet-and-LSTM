const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { apiResponse } = require('../utils/apiResponse');


// Middleware to protect routes (JWT Authentication)
exports.protect = async (req, res, next) => {
  let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');

         if (!req.user){
           return res.status(401).json(apiResponse({ message: 'Not authorized, user not found' }, 401, false));
         }
         next(); // Call next middleware if token is verified

      } catch (error) {
          console.error('Error during JWT verification:', error);
          return res.status(401).json(apiResponse({ message: 'Not authorized, invalid token' }, 401, false));
      }
    }

    if (!token) {
      return res.status(401).json(apiResponse({ message: 'Not authorized, no token' }, 401, false));
    }

};

// Middleware to check if user is admin
exports.admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // Call next middleware if user is an admin
    } else {
        return res.status(403).json(apiResponse({ message: 'Not authorized, Admin privileges required' }, 403, false));
    }
};