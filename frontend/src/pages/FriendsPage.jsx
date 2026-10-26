import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { ArrowLeft, Users, UserPlus, LoaderCircle, RefreshCw } from "lucide-react";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
const {
data: friends = [],
isLoading,
isError,
error,
refetch,
} = useQuery({
queryKey: ["friends"],
queryFn: getUserFriends,
});

return ( <div className="relative min-h-full overflow-hidden bg-[#080816] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
{/* Background effects */} <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-violet-600/[0.08] blur-[120px]" /> <div className="pointer-events-none absolute -right-40 top-80 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[130px]" />


  <div className="relative z-10 mx-auto max-w-7xl space-y-8">
    {/* Page heading */}
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
          <Users className="h-3.5 w-3.5" />
          YOUR CONNECTIONS
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Your{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            Friends
          </span>
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Stay connected with your friends and start meaningful conversations on Nexora.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 text-sm font-semibold text-violet-200 transition hover:border-violet-300/50 hover:bg-violet-500/20 sm:self-auto"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </header>

    {/* Friends count */}
    {!isLoading && !isError && (
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#111120]/90 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
          <Users className="h-5 w-5 text-violet-300" />
        </div>

        <div>
          <p className="text-2xl font-bold text-white">{friends.length}</p>
          <p className="text-sm text-slate-400">
            {friends.length === 1 ? "Connected friend" : "Connected friends"}
          </p>
        </div>
      </div>
    )}

    {/* Loading */}
    {isLoading && (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111120]/90">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-violet-400" />
          <p className="text-sm text-slate-400">Loading your friends...</p>
        </div>
      </div>
    )}

    {/* Error */}
    {isError && (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.05] px-5 py-10 text-center">
        <p className="font-semibold text-red-300">
          Could not load your friends.
        </p>

        <p className="mt-2 text-sm text-slate-400">
          {error?.response?.data?.message ||
            error?.message ||
            "Please check your connection and try again."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-400"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    )}

    {/* Empty state */}
    {!isLoading && !isError && friends.length === 0 && (
      <div className="rounded-2xl border border-white/[0.07] bg-[#111120]/90 p-6">
        <NoFriendsFound />

        <div className="mt-5 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-400"
          >
            <UserPlus className="h-4 w-4" />
            Discover People
          </Link>
        </div>
      </div>
    )}

    {/* Friends grid */}
    {!isLoading && !isError && friends.length > 0 && (
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="h-1 w-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            All Friends
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      </section>
    )}
  </div>
</div>

);
};

export default FriendsPage;
