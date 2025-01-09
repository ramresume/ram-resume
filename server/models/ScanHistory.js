const mongoose = require("mongoose");

const BulletPointsSchema = new mongoose.Schema(
  {
    company: String,
    bullets: [String],
  },
  { _id: false }
);

const ScanHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobTitle: {
    type: String,
  },
  company: {
    type: String,
  },
  // Keyword scan data
  keywords: [
    {
      type: String,
    },
  ],
  // Resume scan data
  originalResume: {
    type: String,
  },
  enhancedBullets: [BulletPointsSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Track completion status
  isComplete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ScanHistory", ScanHistorySchema);
