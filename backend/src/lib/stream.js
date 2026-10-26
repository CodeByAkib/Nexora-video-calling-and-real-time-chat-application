import { StreamChat } from "stream-chat";
import { config } from "./env.js";

let client = null;

function getClient() {
  if (!config.stream.apiKey || !config.stream.apiSecret) {
    throw new Error("Stream is not configured (STREAM_API_KEY / STREAM_API_SECRET missing)");
  }
  client ??= StreamChat.getInstance(config.stream.apiKey, config.stream.apiSecret);
  return client;
}

/**
 * Creates or updates a user inside Stream. Throws on failure so the caller decides what to
 * do. Callers must log `error.message` only: the raw error object holds the request headers,
 * including a never-expiring server-side Stream token.
 */
export const upsertStreamUser = async (userData) => {
  // Automated tests must never call the real Stream service.
  if (config.isTest) return userData;

  await getClient().upsertUsers([userData]);
  return userData;
};

/** Creates a Stream user token. Works offline - it only signs a JWT with the API secret. */
export const generateStreamToken = (userId) => getClient().createToken(String(userId));

/** Logs a Stream failure without leaking request headers or credentials. */
export const describeStreamError = (error) =>
  error?.response?.data?.message || error?.message || "unknown Stream error";
