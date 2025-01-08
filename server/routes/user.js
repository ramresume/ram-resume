// routes/user.js
const express = require("express");
const router = express.Router();
const { checkUsage } = require("../controllers/UserUsage.controller.js");
const { updateUser } = require("../controllers/User.controller.js");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // console.log("isAuthenticated:", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};

// User route to get user data
router.get("/user", isAuthenticated, (req, res) => {
  // console.log("Session:", req.session);
  // console.log("User:", req.user);
  // console.log("User route accessed, user:", req.user);
  res.json({
    id: req.user.id,
    email: req.user.email,
    profilePicture: req.user.profilePicture,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    hasAcceptedTerms: req.user.hasAcceptedTerms,
    acceptedTermsAt: req.user.acceptedTermsAt,
    gradYear: req.user.gradYear,
    major: req.user.major,
    interestedPositions: req.user.interestedPositions,
    onboardingCompleted: req.user.onboardingCompleted,
  });
});

// Add usage endpoint
router.get("/usage", isAuthenticated, async (req, res) => {
  try {
    const usage = await checkUsage(req.user._id);
    res.json({
      remainingUses: usage.remainingUses,
      resetDate: usage.resetDate,
      totalScans: usage.totalScans,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching usage data" });
  }
});

// PUT route to update user profile
router.put("/user", isAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, gradYear, major, interestedPositions, onboardingCompleted } =
      req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (gradYear) updateData.gradYear = gradYear;
    if (major) updateData.major = major;
    if (interestedPositions) updateData.interestedPositions = interestedPositions;
    if (onboardingCompleted) updateData.onboardingCompleted = true;

    const updatedUser = await updateUser(req.user._id, updateData);
    res.json({
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      gradYear: updatedUser.gradYear,
      major: updatedUser.major,
      interestedPositions: updatedUser.interestedPositions,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

module.exports = router;
