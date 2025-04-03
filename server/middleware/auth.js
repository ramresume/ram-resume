const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  /**
   * Middleware to ensure user is authenticated through either session or JWT
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  authenticate: async (req, res, next) => {
    // First check if user is authenticated via session
    if (req.isAuthenticated()) {
      return next();
    }

    // If not authenticated via session, check for JWT token
    try {
      const token = extractToken(req);

      if (!token) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Attach user to request for use in route handlers
      req.user = user;
      return next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(500).json({ error: "Authentication error" });
    }
  },

  /**
   * Middleware to ensure user has accepted terms
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  requireTerms: (req, res, next) => {
    if (!req.user || !req.user.hasAcceptedTerms) {
      return res.status(403).json({ error: "Terms acceptance required", requiresTerms: true });
    }
    next();
  },

  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {String} JWT token
   */
  generateToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  },
};

/**
 * Extract JWT token from request
 * @param {Object} req - Express request object
 * @returns {String|null} JWT token or null if not found
 */
const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};
