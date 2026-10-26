/** Small, dependency-free input helpers shared by the controllers. */

export const isString = (value) => typeof value === "string";

/**
 * Strict MongoDB ObjectId check. mongoose.isValidObjectId() also accepts any 12-character
 * string, which would let junk through to the database layer, so we require 24 hex chars.
 */
export const isValidId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

/** Returns the cleaned https URL, or null when the value is not an acceptable image URL. */
export function normalizeProfilePicUrl(value) {
  if (!isString(value)) return null;

  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 2000) return null;

  try {
    const url = new URL(trimmed);
    // https only: blocks javascript:, data:, file: and plain-http (mixed-content) URLs.
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Builds the default avatar URL. The seed is the user's database id - an opaque value - and
 * NEVER their email address, because the avatar URL is shown to other users and sent to the
 * third-party avatar service.
 */
export const buildDefaultAvatarUrl = (userId) =>
  `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(String(userId))}`;

/** Public profile fields that other users are allowed to see. No email, no password. */
export const PUBLIC_USER_FIELDS = "fullName profilePic bio role interests location";

export const ALLOWED_ROLES = [
  "Student",
  "Software Developer",
  "Designer",
  "Freelancer",
  "Entrepreneur",
  "Other",
];

export const ALLOWED_INTERESTS = [
  "Technology",
  "Gaming",
  "Music",
  "Movies",
  "Sports",
  "Travel",
  "Coding",
  "Other",
];
