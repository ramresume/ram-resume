require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const limiters = require("../middleware/rateLimiter");
mongoose.set("strictQuery", true);

// Database connection
require("../config/db");

// Enhanced CORS configuration with multiple allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://ram-resume-client.vercel.app",
  "http://localhost:3000",
];

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) {
        console.log("Allowing request with no origin");
        return callback(null, true);
      }

      // Clean up origin by removing any trailing slashes
      const cleanOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;

      if (allowedOrigins.includes(cleanOrigin)) {
        console.log(`Allowed origin: ${cleanOrigin}`);
        return callback(null, true);
      }

      console.warn(`Blocked origin: ${cleanOrigin}`);
      return callback(new Error(`Origin ${cleanOrigin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Add this before your routes to handle trailing slashes
app.use((req, res, next) => {
  // Remove trailing slashes from URL to avoid redirects
  if (req.path.length > 1 && req.path.endsWith("/")) {
    const query = req.url.slice(req.path.length);
    const safePath = req.path.slice(0, -1).replace(/\/+/g, "/");
    return res.redirect(301, safePath + query);
  }
  next();
});

// Trust the first proxy to enable cookie sharing between the client and the server
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
// Middleware
app.use(express.json());
app.use(cookieParser());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require("../config/passport")(passport);

// Apply standard rate limiter to all routes as a general protection
// This will only affect unauthenticated users (bots, etc.)
app.use(limiters.standard);

// Routes
app.use("/auth", limiters.auth, require("../routes/auth"));
app.use("/api", require("../routes/user"));
app.use("/api", require("../routes/test"));
app.use("/api", require("../routes/extract-keywords"));
app.use("/api", require("../routes/resume"));
app.use("/api", require("../routes/cover-letter"));
app.use("/api", require("../routes/file"));
app.use("/api", require("../routes/scan-history"));

// Test route
app.get("/", (req, res) => {
  res.send("AI Career Toolbox server is running!");
});

// Debug route to check environment variables
app.get("/debug-env", (req, res) => {
  res.json({
    clientUrl: process.env.CLIENT_URL,
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET ? "Set" : "Not set",
  });
});

// Error handling middleware (move this to the end)
app.use(require("../utils/errorHandler"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

module.exports = app;
