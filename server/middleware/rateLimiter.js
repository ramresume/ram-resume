const rateLimit = require("express-rate-limit");

/**
 * Rate limiter configurations for different API endpoints
 */
const limiters = {
  // General API rate limiter - 100 requests per 15 minutes
  standard: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    standardHeaders: true, // Send standard rate limit headers
    legacyHeaders: false, // Disable legacy X-RateLimit headers
    message: { error: "Too many requests, please try again later." },
    skip: (req) => req.path === "/auth/google/callback", // Skip auth callback
  }),

  // Auth routes - more lenient rate limiting
  auth: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 30 requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many login attempts, please try again later." },
  }),

  // AI processing routes - stricter rate limiting
  aiProcessing: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Rate limit exceeded for AI processing. Please try again later." },
    skip: (req) => {
      // Skip rate limit if user is authenticated and has remaining usage credits
      return req.user && req.userUsage && req.userUsage.remainingUses > 0;
    },
  }),

  // File upload - prevent abuse
  fileUpload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 file uploads per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many file uploads. Please try again later." },
  }),
};

module.exports = limiters;
