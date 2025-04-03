const rateLimit = require("express-rate-limit");

/**
 * Rate limiter configurations for different API endpoints
 */
const limiters = {
  // General API rate limiter - 200 requests per 5 minutes
  // Only applies to unauthenticated users
  standard: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 200, // 200 requests per windowMs
    standardHeaders: true, // Send standard rate limit headers
    legacyHeaders: false, // Disable legacy X-RateLimit headers
    message: { error: "Too many requests, please try again later." },
    skip: (req) => {
      // Skip for authenticated users or OAuth callback
      return req.isAuthenticated() || req.user || req.path === "/auth/google/callback";
    },
  }),

  // Auth routes - protect from brute force attempts
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 requests per 15 minutes
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
    // Skip rate limits for authenticated users
    skip: (req) => {
      // Skip rate limit for any authenticated user
      // The UserUsage middleware will handle usage limits separately
      return req.isAuthenticated() || req.user;
    },
  }),

  // File upload - prevent abuse
  fileUpload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 file uploads per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many file uploads. Please try again later." },
    // Skip authenticated users
    skip: (req) => req.isAuthenticated() || req.user,
  }),
};

module.exports = limiters;
