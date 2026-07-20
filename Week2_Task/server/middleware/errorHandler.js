/**
 * Catches 404s for unmatched routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Centralized error handler. Normalizes Mongoose validation/cast
 * errors and duplicate-key errors into consistent, readable
 * JSON responses with correct HTTP status codes.
 */
const errorHandler = (err, req, res, next) => {
  // If a controller already called res.status(xxx) before throwing (e.g.
  // res.status(404); throw new Error(...)), res.statusCode holds that
  // value here. Fall back to err.statusCode, then 500.
  let statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongo duplicate key (e.g. duplicate SKU)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field '${field}': ${err.keyValue[field]}`;
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
  });
};

module.exports = { notFound, errorHandler };
