import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken, getUserFriends } from "../lib/api";
import { createCallId } from "../lib/callId";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Notice = ({ title, children }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#080816] p-6 text-center text-white">
    <h2 className="text-xl font-bold">{title}</h2>
    <p className="max-w-md text-sm text-slate-400">{children}</p>
    <Link
      to="/friends"
      className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 text-sm font-semibold text-violet-200 hover:bg-violet-500/20"
    >
      <ArrowLeft className="h-4 w-4" /> Back to friends
    </Link>
  </div>
);

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [failed, setFailed] = useState(false);

  const { data: tokenData, isError: tokenFailed } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    staleTime: Infinity, // Stream tokens made by the backend do not expire
  });

  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  // Chats are only for accepted friends (this guards the UI; Stream permissions guard the data).
  const isFriend = !!friends?.some((friend) => friend._id === targetUserId);

  const myId = authUser?._id;
  const myName = authUser?.fullName;
  const myImage = authUser?.profilePic;
  const token = tokenData?.token;

  useEffect(() => {
    if (!token || !myId || !isFriend) return;

    let cancelled = false;
    // A dedicated client per chat page - no shared singleton that could keep a previous user.
    const client = new StreamChat(STREAM_API_KEY);

    const connect = (async () => {
      try {
        await client.connectUser({ id: myId, name: myName, image: myImage }, token);
        if (cancelled) return;

        // Same id no matter who opens the chat first: sorted pair of user ids.
        const channelId = [myId, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [myId, targetUserId],
        });
        await currChannel.watch();
        if (cancelled) return;

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        if (cancelled) return;
        console.error("Error initializing chat:", error?.message);
        setFailed(true);
        toast.error("Could not connect to chat. Please try again.");
      }
    })();

    return () => {
      cancelled = true;
      setChatClient(null);
      setChannel(null);
      setFailed(false);
      // Wait for an in-flight connect to settle, then close the websocket.
      connect.finally(() => client.disconnectUser().catch(() => {}));
    };
  }, [token, myId, myName, myImage, targetUserId, isFriend]);

  const handleVideoCall = () => {
    if (!channel) return;

    const callUrl = `${window.location.origin}/call/${createCallId()}`;

    channel
      .sendMessage({ text: `I've started a video call. Join me here: ${callUrl}` })
      .then(() => toast.success("Video call link sent successfully!"))
      .catch(() => toast.error("Could not send the call link. Please try again."));
  };

  let body;
  if (tokenFailed || failed) {
    body = (
      <Notice title="Chat is unavailable">
        We could not connect to the chat service. Check your connection and try again.
      </Notice>
    );
  } else if (friendsLoading) {
    body = <ChatLoader />;
  } else if (!isFriend) {
    body = (
      <Notice title="You can only chat with friends">
        This person is not in your friends list yet. Send or accept a friend request first.
      </Notice>
    );
  } else if (!chatClient || !channel) {
    body = <ChatLoader />;
  } else {
    body = (
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-[#080816] text-white">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-violet-400/15 bg-[#0b0b19] px-3 sm:px-5">
        <Link
          to="/friends"
          aria-label="Back to friends"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-medium text-slate-300 transition hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Friends</span>
        </Link>

        <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text font-mono text-lg font-extrabold tracking-wide text-transparent">
          Nexora
        </span>

        <CallButton handleVideoCall={handleVideoCall} disabled={!channel} />
      </header>

      {/* min-h-0 lets the Stream UI scroll inside this box instead of stretching the page */}
      <main className="min-h-0 flex-1">{body}</main>
    </div>
  );
};

export default ChatPage;
