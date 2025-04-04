const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const { generateToken, authenticate } = require("../middleware/auth");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login-failed" }),
  (req, res) => {
    // Generate JWT token for the authenticated user
    const token = generateToken(req.user);

    // Get client URL from environment
    const clientUrl = process.env.CLIENT_URL;

    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ 
              type: "LOGIN_SUCCESS",
              requiresTerms: ${!req.user.hasAcceptedTerms},
              token: "${token}"
            }, "${clientUrl}");
            window.close();
          </script>
        </body>
      </html>
    `);
  }
);

router.get("/login-failed", (req, res) => {
  const clientUrl = process.env.CLIENT_URL;
  res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage(
            { 
              type: "LOGIN_ERROR", 
              message: "Only Fordham University personnel are allowed." 
            }, 
            "${clientUrl}"
          );
          window.close();
        </script>
      </body>
    </html>
  `);
});

router.post("/accept-terms", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.hasAcceptedTerms = true;
    user.acceptedTermsAt = new Date();
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: `Failed to accept terms: ${error.message}` });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ success: true });
  });
});

// Endpoint to refresh JWT token
router.get("/refresh-token", authenticate, (req, res) => {
  const token = generateToken(req.user);
  res.json({ token });
});

module.exports = router;
