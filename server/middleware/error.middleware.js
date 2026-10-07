import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  console.error('[AgriPilot Server Error]:', err.message || err);

  // Handle Zod Validation Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed on submitted data.',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Handle explicit status errors
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal agricultural advisor service error occurred. Please try again.'
  });
}
