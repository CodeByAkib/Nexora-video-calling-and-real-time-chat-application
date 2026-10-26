import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";

import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData, isError: tokenFailed } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    staleTime: Infinity,
  });

  const myId = authUser?._id;
  const myName = authUser?.fullName;
  const myImage = authUser?.profilePic;
  const token = tokenData?.token;

  useEffect(() => {
    if (!token || !myId || !callId) return;

    let cancelled = false;
    let videoClient = null;
    let callInstance = null;

    const quietly = (promise) => promise?.catch?.(() => {});

    (async () => {
      try {
        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: { id: myId, name: myName, image: myImage },
          token,
        });

        callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        if (cancelled) {
          // The user left the page while we were still joining - undo it.
          await quietly(callInstance.leave());
          await quietly(videoClient.disconnectUser());
          return;
        }

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        if (cancelled) return;
        console.error("Error joining call:", error?.message);
        toast.error("Could not join the call. Please try again.");
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    })();

    return () => {
      // Leaving the page (back button, navigation) must end our part of the call and release
      // the camera/microphone - otherwise they stay on.
      cancelled = true;
      setClient(null);
      setCall(null);
      setIsConnecting(true);
      if (callInstance) quietly(callInstance.leave());
      if (videoClient) quietly(videoClient.disconnectUser());
    };
  }, [token, myId, myName, myImage, callId]);

  if (isLoading || (isConnecting && !tokenFailed)) return <PageLoader />;

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-[#080816] text-white">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <p className="text-slate-300">
              Could not initialize the call. Please refresh or try again later.
            </p>
            <Link
              to="/"
              className="inline-flex h-10 items-center rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 text-sm font-semibold text-violet-200 hover:bg-violet-500/20"
            >
              Back to Nexora
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // Navigating is a side effect, so it belongs in an effect - not in the render body.
  useEffect(() => {
    if (callingState === CallingState.LEFT) navigate("/");
  }, [callingState, navigate]);

  if (callingState === CallingState.LEFT) return null;

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
