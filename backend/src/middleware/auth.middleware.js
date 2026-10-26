import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token || typeof token !== "string") {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    let decoded;
    try {
      // Pin the algorithm so a token can never pick a weaker one for itself.
      decoded = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
    } catch {
      // Expired, malformed or wrongly-signed tokens are the CLIENT's problem: 401, not 500.
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
