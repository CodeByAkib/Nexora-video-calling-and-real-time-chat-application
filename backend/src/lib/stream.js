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


export const upsertStreamUser = async (userData) => {
  // Automated tests must never call the real Stream service.
  if (config.isTest) return userData;

  await getClient().upsertUsers([userData]);
  return userData;
};


export const generateStreamToken = (userId) => getClient().createToken(String(userId));


export const describeStreamError = (error) =>
  error?.response?.data?.message || error?.message || "unknown Stream error";
