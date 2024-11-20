const AppError = require('../utils/appError');

function cloneError(err) {
    const errorClone = Object.create(
        Object.getPrototypeOf(err), // Keep the same prototype (e.g., Error)
        Object.getOwnPropertyDescriptors(err) // Copy all properties, including non-enumerable
    );
    return errorClone;
}

const handleCastError = (err) => {
    const message = `Invalid: ${err.path}: ${err.value}`;

    return new AppError(message, 400);
};
const handleDuplicateError = (err) => {
    const message = `Invalid: The value: ${err.keyValue.name} already exists`;

    return new AppError(message, 400);
};
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid: ${errors.join('. ')}`;

    return new AppError(message, 400);
};

const sendErrorDevelopment = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProduction = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        return;
    }
    console.error('ERROR ', err);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong.',
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.message = err.message || 'Internal server error';
    const errorName = err.constructor.name;

    if (process.env.NODE_ENV === 'development') {
        sendErrorDevelopment(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = cloneError(err);
        if (errorName === 'CastError') {
            error = handleCastError(error);
        } else if (err.errorResponse?.errmsg?.includes('duplicate')) {
            error = handleDuplicateError(error);
        } else if (errorName === 'ValidationError') {
            error = handleValidationError(error);
        }

        sendErrorProduction(error, res);
    }
};
