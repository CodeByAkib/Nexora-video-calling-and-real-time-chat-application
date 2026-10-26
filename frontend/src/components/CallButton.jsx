import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall, disabled = false }) {
  return (
    <button
      type="button"
      onClick={handleVideoCall}
      disabled={disabled}
      aria-label="Start a video call"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/10 transition hover:from-violet-500 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <VideoIcon className="size-5" />
      <span className="hidden sm:inline">Video call</span>
    </button>
  );
}

export default CallButton;
