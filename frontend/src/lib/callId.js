/**
 * Creates a hard-to-guess id for a video call. The old scheme reused the chat channel id, which
 * is just the two users' (visible) ids joined together - anyone could work out the link.
 */
export function createCallId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
