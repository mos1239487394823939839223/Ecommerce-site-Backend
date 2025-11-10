const ApiError = require('../utils/apiError');

const globalError =(err , req , res , next)=>{
  if (err.name === 'CastError') {
    err = new ApiError(`Invalid ${err.path}: ${err.value}`, 400);
  }
  if (err && err.code === 11000) {
    err = new ApiError('Duplicate key value', 400);
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err , res);
  } else {
    sendErrorForProd(err , res);
  }
}
const sendErrorForDev = (err , res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};
const sendErrorForProd = (err , res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
module.exports = globalError ;