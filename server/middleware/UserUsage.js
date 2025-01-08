// server/middleware/usageMiddleware.js
const { checkUsage, resetIfNeeded } = require("../controllers/UserUsage.controller.js");

const checkUsageLimit = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    let usage = await checkUsage(req.user._id);
    if (!usage) {
      return res.status(500).json({ error: "Failed to retrieve usage data" });
    }

    usage = await resetIfNeeded(usage);
    if (!usage) {
      return res.status(500).json({ error: "Failed to reset usage data" });
    }

    if (usage.remainingUses <= 0) {
      return res.status(403).json({
        error: "Weekly usage limit reached",
        resetDate: usage.resetDate,
        remainingUses: 0,
      });
    }

    req.userUsage = usage;
    next();
  } catch (error) {
    console.error("Usage limit check error:", error);
    res.status(500).json({ error: "Error checking usage limit" });
  }
};
module.exports = checkUsageLimit;
