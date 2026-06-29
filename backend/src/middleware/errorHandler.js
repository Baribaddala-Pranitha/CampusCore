/**
 * Centralized error handler middleware.
 * Formats errors and returns consistent JSON responses to prevent server crashes.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error encountered:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    // Include stack trace in development mode only
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
