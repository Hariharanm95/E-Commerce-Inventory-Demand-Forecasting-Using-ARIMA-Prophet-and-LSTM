// Utility function to create standard API responses
exports.apiResponse = (
    { message = "", data = null, error = null },
    statusCode = 200,
    success = true
  ) => {
    return {
      success,
      statusCode,
      message,
      data,
      error,
    };
  };