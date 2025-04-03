# Middleware Documentation

## Authentication Middleware

The application uses a standardized authentication middleware that supports both session-based authentication (via Passport) and JWT token-based authentication. This middleware is defined in `auth.js`.

### Usage

Import the necessary middleware components:

```javascript
const { authenticate, requireTerms, generateToken } = require("../middleware/auth");
```

#### `authenticate`

Ensures that a user is authenticated before accessing a protected route. It checks for authentication in this order:
1. Session-based authentication via Passport
2. JWT token-based authentication (from Authorization header or cookies)

Example usage:

```javascript
router.get("/protected-route", authenticate, (req, res) => {
  // This route is protected and only accessible to authenticated users
  // req.user is available with the user's information
  res.json({ data: "Protected data" });
});
```

#### `requireTerms`

Ensures that a user has accepted the terms of service before accessing a route.
This should be used after the authenticate middleware.

Example usage:

```javascript
router.post("/resource", authenticate, requireTerms, (req, res) => {
  // This route requires the user to be authenticated AND have accepted terms
  // ...
});
```

#### `generateToken`

Generates a JWT token for a user. Used primarily after authentication to provide a token to the client.

Example usage:

```javascript
const token = generateToken(user);
res.json({ token });
```

### JWT Token Format

The JWT token contains the following claims:
- `id`: The user's ID in the database
- `email`: The user's email address
- Expiration time: 7 days from issuance

### Environment Variables

The authentication system requires the following environment variables:
- `JWT_SECRET`: Secret key for signing JWT tokens
- `SESSION_SECRET`: Secret key for session cookies (for Passport)

### Security Recommendations

1. Always use HTTPS in production to prevent token interception
2. Keep the JWT_SECRET secure and rotate it periodically
3. Use short expiration times for sensitive operations
4. Consider implementing token refresh mechanisms for long-lived sessions

## Rate Limiting Middleware

The application implements API rate limiting to prevent abuse and ensure fair usage of resources. This middleware is defined in `rateLimiter.js`.

### Rate Limiter Types

The following rate limiters are available:

#### `standard`

General API rate limiter applied to all routes by default.
- 100 requests per 15 minutes per IP address
- Skips rate limiting for Google OAuth callback

#### `auth`

Applied to authentication routes.
- 30 requests per hour per IP address
- Prevents brute force login attempts

#### `aiProcessing`

Applied to AI processing routes (resume enhancement, keyword extraction, cover letter generation).
- 10 requests per hour per IP address
- Skips rate limiting for authenticated users with remaining usage credits

#### `fileUpload`

Applied to file upload routes.
- 20 file uploads per hour per IP address

### Implementation

Rate limiters are applied in the server.js file:

```javascript
// Apply standard rate limiter to all routes by default
app.use(limiters.standard);

// Routes with specific rate limits
app.use("/auth", limiters.auth, require("../routes/auth"));
app.use("/api", limiters.aiProcessing, require("../routes/extract-keywords"));
app.use("/api", limiters.aiProcessing, require("../routes/resume"));
app.use("/api", limiters.aiProcessing, require("../routes/cover-letter"));
app.use("/api", limiters.fileUpload, require("../routes/file"));
```

### Customization

You can modify the rate limits in `rateLimiter.js` by adjusting:
- `windowMs`: The time window in milliseconds
- `max`: The maximum number of requests allowed in the time window
- `skip`: A function that determines whether to skip rate limiting for a request 