const User = require("../models/User");
const UserUsage = require("../models/UserUsage");
const FileModel = require("../models/File");
const ScanHistory = require("../models/ScanHistory");

const updateUser = async (userId, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

const deleteUser = async (userId) => {
  try {
    // Delete all related data first
    await UserUsage.deleteOne({ userId });
    await FileModel.deleteMany({ userId });
    await ScanHistory.deleteMany({ userId });

    // Finally delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new Error("User not found");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

module.exports = {
  updateUser,
  deleteUser,
};
