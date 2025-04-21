const HTTP_STATUS = require('http-status-codes');

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  serializeErrors() {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

class JoiRequestValidationError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS.BAD_REQUEST;
    this.status = 'error';
    this.isOperational = true;
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS.BAD_REQUEST;
    this.status = 'error';
    this.isOperational = true;
  }
}

class DuplicateEntityError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS.CONFLICT;
    this.status = 'error';
    this.isOperational = true;
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS.NOT_FOUND;
    this.status = 'error';
    this.isOperational = true;
  }
}

class FileTooLargeError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
    this.status = 'error';
    this.isOperational = true;
  }
}

class ServerError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
    this.status = 'error';
    this.isOperational = true;
  }
}

module.exports = {
  CustomError,
  JoiRequestValidationError,
  BadRequestError,
  DuplicateEntityError,
  NotFoundError,
  FileTooLargeError,
  ServerError
};
