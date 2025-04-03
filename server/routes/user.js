// routes/user.js
const express = require("express");
const router = express.Router();
const { checkUsage, resetIfNeeded } = require("../controllers/UserUsage.controller.js");
const { updateUser, deleteUser } = require("../controllers/User.controller.js");
const { authenticate } = require("../middleware/auth.js");

// User route to get user data
router.get("/user", authenticate, (req, res) => {
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
router.get("/usage", authenticate, async (req, res) => {
  try {
    // Get initial usage data
    let usage = await checkUsage(req.user._id);

    // Check if tokens need to be reset based on date
    usage = await resetIfNeeded(usage);

    res.json({
      remainingUses: usage.remainingUses,
      resetDate: usage.resetDate,
      totalScans: usage.totalScans,
    });
  } catch (err) {
    console.error("Error fetching usage data:", err);
    res.status(500).json({ error: "Error fetching usage data" });
  }
});

// PUT route to update user profile
router.put("/user", authenticate, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gradYear,
      major,
      interestedPositions,
      onboardingCompleted,
      onboardingPartiallyCompleted,
    } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (gradYear) updateData.gradYear = gradYear;
    if (major) updateData.major = major;
    if (interestedPositions) updateData.interestedPositions = interestedPositions;

    // Handle onboarding states
    if (onboardingPartiallyCompleted) {
      updateData.onboardingPartiallyCompleted = true;
    }
    if (onboardingCompleted) {
      updateData.onboardingCompleted = true;
      updateData.onboardingPartiallyCompleted = false;
    }

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
      onboardingCompleted: updatedUser.onboardingCompleted,
      onboardingPartiallyCompleted: updatedUser.onboardingPartiallyCompleted,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// DELETE route to delete user account and all associated data
router.delete("/user", authenticate, async (req, res) => {
  try {
    await deleteUser(req.user._id);
    
    // Clear session and cookies
    req.logout(function(err) {
      if (err) {
        console.error("Error during logout process:", err);
        return res.status(500).json({ error: "Error during account deletion process" });
      }
      
      req.session.destroy();
      
      // Send success response
      res.status(200).json({ success: true, message: "Account successfully deleted" });
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Failed to delete user account" });
  }
});

module.exports = router;
