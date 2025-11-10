// @desc  This class represents operational errors (errors we can anticipate).
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // used to distinguish operational errors from programming/runtime errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
