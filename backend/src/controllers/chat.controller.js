import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    // The token is always minted for the AUTHENTICATED user's id - never an id from the request.
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Could not create chat token" });
  }
}
