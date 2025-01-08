const User = require("../models/User");

const updateUser = async (userId, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

module.exports = {
  updateUser,
};
