
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CheckCircle,
  MapPin,
  UserPlus,
  Users,
  Sparkles,
  ArrowRight,
  LoaderCircle,
  MessageCircle,
  BriefcaseBusiness,
  Heart,
  Search,
  UserRound,
} from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";

import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";

import FriendCard from "../components/FriendCard";

const HomePage = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const {
    mutate: sendRequestMutation,
    isPending,
    variables: pendingUserId,
  } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["outgoingFriendReqs"],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Could not send the friend request. Please try again."
      );
      // The server is the source of truth (e.g. the other user already asked us) - resync.
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  // Derived straight from the query data. (It used to be copied into state by an effect that
  // depended on a fresh `[]` default - a new array every render - so it re-rendered forever
  // while the query was loading or had failed.)
  const outgoingRequestsIds = useMemo(() => {
    const ids = new Set();
    (outgoingFriendReqs ?? []).forEach((req) => {
      const recipientId = req?.recipient?._id;
      if (recipientId) ids.add(recipientId);
    });
    return ids;
  }, [outgoingFriendReqs]);

  const sectionTitle =
    "text-2xl font-extrabold tracking-tight text-white sm:text-3xl";

  const sectionCard =
    "rounded-2xl border border-white/[0.07] bg-[#111120]/90 shadow-lg shadow-black/10";

  return (
    <div className="relative min-h-full overflow-hidden bg-[#080816] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-violet-600/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-80 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-[26px] border border-violet-400/15 bg-gradient-to-br from-[#171329] via-[#111120] to-[#101b27] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-cyan-400/[0.08] blur-[80px]" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                WELCOME TO NEXORA
              </div>

              <h1 className={sectionTitle}>
                Your People. Your{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  Conversations.
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Meet interesting people, build connections, and turn every
                conversation into something meaningful.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#discover-people"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-400"
                >
                  <Search className="h-4 w-4" />
                  Discover People
                </a>

                <Link
                  to="/notifications"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
                >
                  <Users className="h-4 w-4" />
                  Friend Requests
                </Link>
              </div>
            </div>

            <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-[28px] border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-cyan-400/10 sm:flex">
              <MessageCircle className="h-14 w-14 text-violet-300" />
            </div>
          </div>

          {/* Quick stats */}
          <div className="relative mt-7 grid max-w-md grid-cols-2 gap-3 border-t border-white/[0.07] pt-5">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-300" />
                <p className="text-2xl font-bold text-white">
                  {friends.length}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-400">Your connections</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                <p className="text-2xl font-bold text-white">
                  {recommendedUsers.length}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-400">People to discover</p>
            </div>
          </div>
        </section>

        {/* Friends section */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
              <Users className="h-5 w-5 text-violet-300" />
            </div>

            <div>
              <h2 className={sectionTitle}>Your Connections</h2>
              <p className="mt-1 text-sm text-slate-500">
                People you can start a conversation with.
              </p>
            </div>
          </div>

          {loadingFriends ? (
            <div className={`${sectionCard} flex justify-center py-12`}>
              <LoaderCircle className="h-7 w-7 animate-spin text-violet-400" />
            </div>
          ) : friends.length === 0 ? (
            <div
              className={`${sectionCard} flex flex-col items-center px-5 py-10 text-center`}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                <MessageCircle className="h-8 w-8 text-violet-300" />
              </div>

              <h3 className="text-lg font-bold text-white">
                Your conversations start here
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                Connect with people who share your interests. Send a friend
                request and start building your network.
              </p>

              <a
                href="#discover-people"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-cyan-300"
              >
                Find people
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* Discover people */}
        <section id="discover-people">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08]">
              <Search className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <h2 className={sectionTitle}>Discover People</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Find your next conversation partner on Nexora.
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className={`${sectionCard} flex justify-center py-12`}>
              <LoaderCircle className="h-7 w-7 animate-spin text-violet-400" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className={`${sectionCard} px-5 py-10 text-center`}>
              <UserRound className="mx-auto h-10 w-10 text-slate-600" />

              <h3 className="mt-4 text-lg font-bold text-white">
                No new people to show
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Check back later to discover more people on Nexora.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                const interests = Array.isArray(user.interests)
                  ? user.interests
                  : [];

                const fullName = user.fullName || "Nexora User";

                const initials = fullName
                  .trim()
                  .split(/\s+/)
                  .map((part) => part.charAt(0))
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <RecommendedUserCard
                    key={user._id}
                    user={user}
                    fullName={fullName}
                    initials={initials}
                    interests={interests}
                    hasRequestBeenSent={hasRequestBeenSent}
                    isPending={isPending && pendingUserId === user._id}
                    onSendRequest={() => sendRequestMutation(user._id)}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] py-5 text-center">
          <p className="text-xs text-slate-600">
            Made for meaningful connections.{" "}
            <span className="font-semibold text-violet-400">Nexora.</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

const RecommendedUserCard = ({
  user,
  fullName,
  initials,
  interests,
  hasRequestBeenSent,
  isPending,
  onSendRequest,
}) => {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111120] transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-xl hover:shadow-violet-950/20">
      <div className="h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 opacity-40 transition-opacity group-hover:opacity-100" />

      <div className="p-5">
        {/* User details */}
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-700 text-xl font-bold text-white">
            {user.profilePic && !avatarError ? (
              <img
                src={user.profilePic}
                alt={fullName}
                className="h-full w-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-white transition-colors group-hover:text-violet-200">
              {fullName}
            </h3>

            {user.location ? (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                <span className="truncate">{user.location}</span>
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500">
                Nexora community member
              </p>
            )}
          </div>
        </div>

        {/* Role */}
        <div className="mt-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <BriefcaseBusiness className="h-3.5 w-3.5 text-violet-400" />
            Role
          </p>

          <div className="rounded-lg border border-violet-400/15 bg-violet-500/[0.06] px-3 py-2">
            <span className="text-sm font-medium text-violet-200">
              {user.role || "Nexora Member"}
            </span>
          </div>
        </div>

        {/* Interests */}
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Heart className="h-3.5 w-3.5 text-pink-400" />
            Interests
          </p>

          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interests.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] px-2.5 py-1.5 text-xs font-medium text-cyan-200"
                >
                  {interest}
                </span>
              ))}

              {interests.length > 4 && (
                <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-400">
                  +{interests.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No interests added yet.
            </p>
          )}
        </div>

        {/* About Me */}
        <div className="mt-4 min-h-[60px]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            About Me
          </p>

          <p className="line-clamp-2 text-sm leading-6 text-slate-400">
            {user.bio || "Ready to connect and make new friends on Nexora."}
          </p>
        </div>

        {/* Friend request */}
        <button
          type="button"
          className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
            hasRequestBeenSent
              ? "border border-emerald-400/20 bg-emerald-500/[0.08] text-emerald-300"
              : "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-600/10 hover:from-violet-500 hover:to-indigo-400 hover:shadow-violet-500/20"
          }`}
          onClick={onSendRequest}
          disabled={hasRequestBeenSent || isPending}
        >
          {hasRequestBeenSent ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Request Sent
            </>
          ) : isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Sending request...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Send Friend Request
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default HomePage;
