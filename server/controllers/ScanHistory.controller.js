const ScanHistory = require("../models/ScanHistory");

exports.createScanHistory = async (userId, scanData) => {
  try {
    const scanHistory = await ScanHistory.create({
      userId,
      ...scanData,
    });
    return scanHistory._id;
  } catch (error) {
    console.error("Error creating scan history:", error);
    throw error;
  }
};

exports.getUserScanHistory = async (userId) => {
  try {
    const history = await ScanHistory.find({
      userId,
      isComplete: true,
    })
      .sort({ createdAt: -1 })
      .limit(10);
    return history;
  } catch (error) {
    console.error("Error fetching scan history:", error);
    throw error;
  }
};

exports.updateScanHistory = async (scanId, updateData) => {
  try {
    const scanHistory = await ScanHistory.findByIdAndUpdate(
      scanId,
      {
        ...updateData,
        isComplete: updateData.enhancedBullets ? true : false,
      },
      { new: true }
    );
    return scanHistory;
  } catch (error) {
    console.error("Error updating scan history:", error);
    throw error;
  }
};
