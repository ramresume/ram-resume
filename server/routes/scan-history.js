const express = require("express");
const router = express.Router();
const { getUserScanHistory } = require("../controllers/ScanHistory.controller");
const { authenticate } = require("../middleware/auth");

router.get("/scan-history", authenticate, async (req, res) => {
  try {
    const history = await getUserScanHistory(req.user._id);
    res.json(history);
  } catch (error) {
    console.error("Error fetching scan history:", error);
    res.status(500).json({ error: "Failed to fetch scan history" });
  }
});

module.exports = router;
