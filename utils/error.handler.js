const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log the error for debugging purposes
    console.error(error);

    if (error.isOperational) {
        // Operational error, send a user-friendly response
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }

    // Programming or unknown errors, send a generic response
    return res.status(500).json({
        status: 'error',
        message:  'Something went wrong!: ' + error.message,
    });
};

module.exports = errorHandler;