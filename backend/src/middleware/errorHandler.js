const { error } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error('[Error Pipeline]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : (process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message);

  return error(res, message, statusCode, err.errors || null);
}

function notFoundHandler(req, res) {
  return error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

module.exports = {
  errorHandler,
  notFoundHandler
};
