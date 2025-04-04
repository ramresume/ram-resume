const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          // Restrict authentication to Fordham emails only
          if (!email.endsWith("@fordham.edu")) {
            return done(null, false, {
              message: "Only Fordham University personnel are allowed.",
            });
          }

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // New user - they'll need to accept terms later
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: email,
              profilePicture: profile.photos[0].value.replace(/=s\d+-c/, "=s400-c"),
              hasAcceptedTerms: false,
              onboardingCompleted: false,
            });
          } else {
            // Update existing user's profile picture
            user.profilePicture = profile.photos[0].value.replace(/=s\d+-c/, "=s400-c");
            await user.save();
          }

          // Update user's name if it's not set
          if (!user?.firstName || !user?.lastName) {
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
