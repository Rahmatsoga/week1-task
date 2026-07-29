const multer = require("multer");

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
 * errors, duplicate-key errors, and Multer file-upload errors into
 * consistent, readable JSON responses with correct HTTP status codes.
 */
const errorHandler = (err, req, res, next) => {
  // If a controller already called res.status(xxx) before throwing,
  // res.statusCode holds that value here. Fall back to err.statusCode, then 500.
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

  // Multer-specific upload errors (file too large, wrong field name, etc.)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image file is too large. Maximum size is 5MB.";
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // Our own custom file-type rejection (thrown from the multer fileFilter)
  if (err.code === "INVALID_FILE_TYPE") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
  });
};

module.exports = { notFound, errorHandler };
