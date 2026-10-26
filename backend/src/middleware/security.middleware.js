import rateLimit from "express-rate-limit";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);


export const requireTrustedOrigin = (allowedOrigins) => (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get("origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: "Origin not allowed" });
  }
  next();
};

const tooMany = { message: "Too many attempts. Please wait a few minutes and try again." };


export const createLoginLimiter = ({ limit = 10, windowMs = 15 * 60 * 1000 } = {}) =>
  rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooMany,
  });


export const createSignupLimiter = ({ limit = 20, windowMs = 60 * 60 * 1000 } = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: tooMany,
  });
