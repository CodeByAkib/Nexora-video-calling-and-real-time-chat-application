

export const isString = (value) => typeof value === "string";


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


export const buildDefaultAvatarUrl = (userId) =>
  `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(String(userId))}`;


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
