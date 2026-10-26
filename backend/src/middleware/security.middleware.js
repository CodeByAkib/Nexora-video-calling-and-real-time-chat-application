import rateLimit from "express-rate-limit";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * CSRF defence for cookie authentication.
 *
 * Browsers always attach an Origin header to cross-site POST/PUT/DELETE requests. If one is
 * present and is not an allowed frontend origin, the request is refused. Requests with no
 * Origin (curl, server-to-server) cannot ride on a victim's browser cookies, so they pass.
 */
export const requireTrustedOrigin = (allowedOrigins) => (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get("origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: "Origin not allowed" });
  }
  next();
};

const tooMany = { message: "Too many attempts. Please wait a few minutes and try again." };

/** Throttles repeated FAILED logins per IP; successful logins are not counted. */
export const createLoginLimiter = ({ limit = 10, windowMs = 15 * 60 * 1000 } = {}) =>
  rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooMany,
  });

/** Limits account creation per IP. */
export const createSignupLimiter = ({ limit = 20, windowMs = 60 * 60 * 1000 } = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooMany,
  });
