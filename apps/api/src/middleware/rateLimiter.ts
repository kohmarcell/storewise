import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Skip rate limiting for health checks and documentation
const skipSuccessfulRequests = (req: Request, res: Response): boolean => {
  return req.path === '/health' || req.path === '/api-docs';
};

// General rate limiter
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Rate limit exceeded',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests,
  skipFailedRequests: false,
});

// Strict rate limiter for sensitive endpoints (auth, payments)
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many attempts, please try again later.',
    error: {
      code: 'STRICT_RATE_LIMIT_EXCEEDED',
      message: 'Strict rate limit exceeded',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});