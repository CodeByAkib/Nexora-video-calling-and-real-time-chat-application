import "dotenv/config";

/**
 * Central place that reads and validates every environment variable the backend uses.
 *
 * Nothing in here ever prints a variable's VALUE - only its name - so it is safe to run
 * on a hosting platform whose logs other people can read.
 */

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";
const isTest = NODE_ENV === "test";

const problems = [];
const warnings = [];

const clean = (value) => (typeof value === "string" ? value.trim() : "");

/**
 * Read a variable. `legacy` is an old (misspelled) name that is still accepted so existing
 * .env files keep working, but a warning asks the owner to rename it.
 */
function read(name, { legacy } = {}) {
  const value = clean(process.env[name]);
  if (value) return value;

  if (legacy && clean(process.env[legacy])) {
    warnings.push(`${legacy} is deprecated - rename it to ${name}.`);
    return clean(process.env[legacy]);
  }
  return "";
}

function require_(name, value) {
  if (!value) problems.push(`${name} is required but is missing or empty.`);
  return value;
}

// ---- Core ---------------------------------------------------------------------------------
const port = Number(process.env.PORT) || 5001;
const mongoUri = require_("MONGO_URI", read("MONGO_URI"));

const jwtSecret = require_("JWT_SECRET_KEY", read("JWT_SECRET_KEY"));
if (jwtSecret && jwtSecret.length < 32) {
  const message = "JWT_SECRET_KEY should be at least 32 characters long.";
  if (isProd) problems.push(message);
  else warnings.push(message);
}

// ---- Stream (STEAM_* was a typo in earlier versions; still accepted) ------------------------
const streamApiKey = require_(
  "STREAM_API_KEY",
  read("STREAM_API_KEY", { legacy: "STEAM_API_KEY" })
);
const streamApiSecret = require_(
  "STREAM_API_SECRET",
  read("STREAM_API_SECRET", { legacy: "STEAM_API_SECRET" })
);

// ---- Browser origins that may call this API (CORS + CSRF origin check) -----------------------
const DEV_ORIGINS = ["http://localhost:5173", "http://localhost:5174"];

const clientOrigins = clean(process.env.CLIENT_URL)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

for (const origin of clientOrigins) {
  let ok = false;
  try {
    ok = new URL(origin).origin === origin;
  } catch {
    ok = false;
  }
  if (!ok) {
    problems.push(
      "CLIENT_URL must be a comma-separated list of origins such as https://app.example.com (no path)."
    );
    break;
  }
}

if (isProd && clientOrigins.length === 0) {
  problems.push("CLIENT_URL is required in production (the public URL of the frontend).");
}

const allowedOrigins = [...new Set([...clientOrigins, ...(isProd ? [] : DEV_ORIGINS)])];

// ---- Cookies --------------------------------------------------------------------------------
// "strict" suits a frontend and API served from the same site (e.g. Vercel rewrite to the API).
// Use "none" only for a cross-site setup; it forces the Secure flag and relies on the
// Origin check in security.middleware.js for CSRF protection.
const sameSite = (clean(process.env.COOKIE_SAME_SITE) || "strict").toLowerCase();
if (!["strict", "lax", "none"].includes(sameSite)) {
  problems.push("COOKIE_SAME_SITE must be one of: strict, lax, none.");
}

// ---- Reverse proxy (Render, Vercel rewrites, ...) ---------------------------------------------
const trustProxyRaw = clean(process.env.TRUST_PROXY);
const trustProxy = trustProxyRaw !== "" ? Number(trustProxyRaw) : isProd ? 1 : 0;
if (!Number.isInteger(trustProxy) || trustProxy < 0) {
  problems.push("TRUST_PROXY must be a whole number of proxy hops (0, 1, 2, ...).");
}

export const config = {
  nodeEnv: NODE_ENV,
  isProd,
  isTest,
  port,
  mongoUri,
  jwtSecret,
  stream: { apiKey: streamApiKey, apiSecret: streamApiSecret },
  allowedOrigins,
  cookie: {
    sameSite,
    secure: isProd || sameSite === "none",
  },
  trustProxy,
};

/** Names-only list of configuration problems (empty when everything required is present). */
export const getConfigProblems = () => [...problems];
export const getConfigWarnings = () => [...warnings];
