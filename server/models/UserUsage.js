// server/models/UserUsage.js
const mongoose = require("mongoose");

const UserUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  resetDate: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // One week from now
    },
  },
  remainingUses: {
    type: Number,
    default: 20,
  },
  totalScans: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("UserUsage", UserUsageSchema);
