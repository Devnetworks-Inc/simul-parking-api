const { CustomError } = require('./custom-error');
const HTTP_STATUS = require('http-status-codes');

class ErrorHandler {
  async handleError(err, res) {
    console.error('Error message from centralized error handler:', err);

    if (err instanceof CustomError) {
      const { message, statusCode, status } = err.serializeErrors();
      return res.status(statusCode).json({ status, message });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'error',
        message: 'Duplicate entry detected',
        keyValue: err.keyValue
      });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return this.handleMongooseValidationError(err, res);
    }

    if (err.code === 'invalid_token') {
      return res.status(HTTP_STATUS.StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: 'Invalid token',
      });
    }

    // Unknown server error
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }

  isTrustedError(error) {
    return error instanceof CustomError && error.isOperational;
  }

  handleMongooseValidationError(error, res) {
    let formattedErrors = [];

    if (Array.isArray(error.errors)) {
      formattedErrors = error.errors.map(err => ({
        path: err.path,
        message: err.message,
        type: err.type,
      }));
    } else if (typeof error.errors === 'object') {
      formattedErrors = Object.values(error.errors).map(err => ({
        path: err.path,
        message: err.message,
        type: err.kind || 'ValidationError',
      }));
    }

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Validation error',
      errors: formattedErrors,
    });
  }
}

const errorHandler = new ErrorHandler();
module.exports = { errorHandler };
