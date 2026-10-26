import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { PUBLIC_USER_FIELDS, isValidId } from "../lib/validation.js";

// Upper bound for the discovery list so one request can never dump the whole user table.
const RECOMMENDED_USERS_LIMIT = 100;

// Fields shown next to a request (notifications). Same profile vocabulary as everywhere else.
const REQUEST_PARTY_FIELDS = "fullName profilePic role location";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      _id: { $nin: [currentUser._id, ...currentUser.friends] }, // not me, not my friends
      isOnboarded: true,
    })
      // Allow-list: other users never get an email address or any private field.
      .select(PUBLIC_USER_FIELDS)
      .sort({ createdAt: -1 })
      .limit(RECOMMENDED_USERS_LIMIT)
      .lean();

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      // Must stay in step with what FriendCard renders: role, interests, bio, location.
      .populate("friends", PUBLIC_USER_FIELDS);

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (!isValidId(recipientId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId).select("friends");
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.some((friendId) => friendId.toString() === myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists (in either direction)
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    if (!isValidId(requestId)) {
      return res.status(400).json({ message: "Invalid friend request id" });
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", REQUEST_PARTY_FIELDS);

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", REQUEST_PARTY_FIELDS);

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.error("Error in getFriendRequests controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", REQUEST_PARTY_FIELDS);

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("Error in getOutgoingFriendReqs controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
