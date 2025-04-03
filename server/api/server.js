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

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

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
