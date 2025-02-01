const { apiResponse } = require('../utils/apiResponse');
// Middleware for catching errors and returning a consistent error response
exports.errorHandler = (err, req, res, next) => {
    console.error('Error in errorHandler middleware:', err);

     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json(
        apiResponse({ message: err.message || 'Internal Server Error', error: err }, statusCode, false)
    );
};