import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";
import { config } from "../lib/env.js";
import { describeStreamError, upsertStreamUser } from "../lib/stream.js";
import {
  ALLOWED_INTERESTS,
  ALLOWED_ROLES,
  buildDefaultAvatarUrl,
  isString,
  normalizeProfilePicUrl,
} from "../lib/validation.js";

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN = 6;
// bcrypt only looks at the first 72 bytes of a password, so longer passwords would be
// silently truncated. Refuse them instead of pretending they are stronger.
const PASSWORD_MAX = 72;
const NAME_MAX = 100;
const EMAIL_MAX = 254;

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: config.cookie.sameSite,
  secure: config.cookie.secure,
});

function setAuthCookie(res, userId) {
  const token = jwt.sign({ userId: String(userId) }, config.jwtSecret, {
    expiresIn: "7d",
    algorithm: "HS256",
  });

  res.cookie("jwt", token, { ...cookieOptions(), maxAge: COOKIE_MAX_AGE_MS });
}

const toStreamUser = (user) => ({
  id: user._id.toString(),
  name: user.fullName,
  image: user.profilePic || "",
});

// ==================== SIGNUP ====================

export async function signup(req, res) {
  try {
    const { email, password, fullName } = req.body ?? {};

    // Every field must be a real string - objects/arrays/numbers are rejected up front.
    if (
      !isString(email) ||
      !isString(password) ||
      !isString(fullName) ||
      !email.trim() ||
      !password ||
      !fullName.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
      return res.status(400).json({
        message: `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters`,
      });
    }

    const cleanName = fullName.trim();
    if (cleanName.length > NAME_MAX) {
      return res
        .status(400)
        .json({ message: `Full name must be ${NAME_MAX} characters or fewer` });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail.length > EMAIL_MAX || !EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists, please use a different one",
      });
    }

    // The id is generated first so the default avatar can be seeded with it (never the email).
    const userId = new mongoose.Types.ObjectId();

    const newUser = await User.create({
      _id: userId,
      email: normalizedEmail,
      fullName: cleanName,
      password,
      profilePic: buildDefaultAvatarUrl(userId),
    });

    // Mirror the user into Stream. A Stream outage must not block signup.
    try {
      await upsertStreamUser(toStreamUser(newUser));
    } catch (error) {
      console.error("Could not create Stream user at signup:", describeStreamError(error));
    }

    setAuthCookie(res, newUser._id);

    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        message: "Email already exists, please use a different one",
      });
    }

    console.error("Error in signup controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ==================== LOGIN ====================

export async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (!isString(email) || !isString(password) || !email.trim() || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // The password hash is excluded by default (select:false); login is the one place that asks for it.
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    setAuthCookie(res, user._id);

    // Best-effort, non-blocking: heals a Stream profile that failed to sync earlier, so other
    // users can always be added to a channel with this user.
    upsertStreamUser(toStreamUser(user)).catch((error) => {
      console.error("Stream sync at login failed:", describeStreamError(error));
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ==================== LOGOUT ====================

export function logout(req, res) {
  res.clearCookie("jwt", cookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

// ==================== ONBOARDING ====================

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const {
      fullName,
      bio = "",
      role,
      interests = [],
      location = "",
      profilePic,
    } = req.body ?? {};

    if (!isString(fullName) || !fullName.trim() || !isString(role) || !role) {
      return res.status(400).json({ message: "Full name and role are required" });
    }

    if (fullName.trim().length > NAME_MAX) {
      return res
        .status(400)
        .json({ message: `Full name must be ${NAME_MAX} characters or fewer` });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Please select a valid role" });
    }

    if (!isString(bio) || bio.length > 250) {
      return res
        .status(400)
        .json({ message: "About Me must be a text of up to 250 characters" });
    }

    if (!isString(location) || location.length > 100) {
      return res
        .status(400)
        .json({ message: "Location must be a text of up to 100 characters" });
    }

    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: "Interests must be an array" });
    }

    const invalidInterests = interests.some(
      (interest) => !isString(interest) || !ALLOWED_INTERESTS.includes(interest)
    );
    if (invalidInterests) {
      return res.status(400).json({ message: "One or more interests are invalid" });
    }

    const updateData = {
      fullName: fullName.trim(),
      bio: bio.trim(),
      role,
      interests: [...new Set(interests)],
      location: location.trim(),
      isOnboarded: true,
    };

    // Keep the existing avatar unless a new, valid https image URL was supplied.
    if (profilePic !== undefined && profilePic !== null && profilePic !== "") {
      const safeUrl = normalizeProfilePicUrl(profilePic);
      if (!safeUrl) {
        return res.status(400).json({ message: "Invalid profile picture URL" });
      }
      updateData.profilePic = safeUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Keep the Stream profile (name + avatar) in sync with the saved profile.
    try {
      await upsertStreamUser(toStreamUser(updatedUser));
    } catch (error) {
      console.error("Could not update Stream user at onboarding:", describeStreamError(error));
    }

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
