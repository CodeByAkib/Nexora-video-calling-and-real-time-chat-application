import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { config } from "./lib/env.js";
import {
  createLoginLimiter,
  createSignupLimiter,
  requireTrustedOrigin,
} from "./middleware/security.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Builds the Express app. Kept separate from server.js so tests can run it in-process. */
export function createApp({ loginLimit, signupLimit } = {}) {
  const app = express();

  app.disable("x-powered-by");
  if (config.trustProxy > 0) app.set("trust proxy", config.trustProxy);

  app.use(
    cors({
      origin: config.allowedOrigins,
      credentials: true, // allow frontend to send cookies
    })
  );

  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use("/api", requireTrustedOrigin(config.allowedOrigins));

  // Lightweight liveness probe for hosting platforms (no secrets, no database access).
  app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

  app.use("/api/auth/login", createLoginLimiter({ limit: loginLimit }));
  app.use("/api/auth/signup", createSignupLimiter({ limit: signupLimit }));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/chat", chatRoutes);

  // Unknown API paths get JSON, never the SPA page.
  app.use("/api", (req, res) => res.status(404).json({ message: "Not found" }));

  // Optional single-host deployment: serve the built frontend if it is present.
  const distPath = path.resolve(__dirname, "../../frontend/dist");
  if (config.isProd && fs.existsSync(path.join(distPath, "index.html"))) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  // Central error handler: malformed JSON etc. become clean JSON, never a stack trace.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err?.type === "entity.parse.failed") {
      return res.status(400).json({ message: "Malformed JSON body" });
    }
    if (err?.type === "entity.too.large") {
      return res.status(413).json({ message: "Request body too large" });
    }
    console.error("Unhandled error:", err?.message);
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
}
