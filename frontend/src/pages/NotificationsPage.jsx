import {
useMutation,
useQuery,
useQueryClient,
} from "@tanstack/react-query";

import {
acceptFriendRequest,
getFriendRequests,
} from "../lib/api";

import {
BellIcon,
ClockIcon,
MessageSquareIcon,
UserCheckIcon,
Check,
LoaderCircle,
Sparkles,
} from "lucide-react";

import NoNotificationsFound from "../components/NoNotificationsFound";
import Avatar from "../components/Avatar";
import toast from "react-hot-toast";

const NotificationsPage = () => {
const queryClient = useQueryClient();

const { data: friendRequests, isLoading, isError, refetch } = useQuery({
queryKey: ["friendRequests"],
queryFn: getFriendRequests,
});

const { mutate: acceptRequestMutation, isPending } = useMutation({
mutationFn: acceptFriendRequest,
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
queryClient.invalidateQueries({ queryKey: ["friends"] });
queryClient.invalidateQueries({ queryKey: ["users"] });
toast.success("Friend request accepted");
},
onError: (error) => {
toast.error(error?.response?.data?.message || "Could not accept the request. Please try again.");
},
});

const incomingRequests = friendRequests?.incomingReqs || [];
const acceptedRequests = friendRequests?.acceptedReqs || [];

const sectionTitle =
"text-2xl font-extrabold tracking-tight text-white sm:text-3xl";

const sectionCard =
"rounded-2xl border border-white/[0.07] bg-[#111120]/90 shadow-lg shadow-black/10";

return ( <div className="relative min-h-full overflow-hidden bg-[#080816] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
{/* Background glows — matching HomePage */} <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-violet-600/[0.08] blur-[120px]" /> <div className="pointer-events-none absolute -right-40 top-80 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[130px]" />


  <div className="relative z-10 mx-auto max-w-7xl space-y-10">
    {/* Page heading */}
    <section className="relative overflow-hidden rounded-[26px] border border-violet-400/15 bg-gradient-to-br from-[#171329] via-[#111120] to-[#101b27] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-cyan-400/[0.08] blur-[80px]" />

      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          YOUR ACTIVITY
        </div>

        <h1 className={sectionTitle}>
          Stay{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            Connected.
          </span>
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Manage your friend requests and keep up with your growing
          community on Nexora.
        </p>

        {!isLoading && (
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5 sm:max-w-sm">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
              <p className="text-2xl font-bold text-white">
                {incomingRequests.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Friend Requests
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
              <p className="text-2xl font-bold text-white">
                {acceptedRequests.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                New Connections
              </p>
            </div>
          </div>
        )}
      </div>
    </section>

    {/* Loading state */}
    {isLoading ? (
      <div className={`${sectionCard} flex min-h-64 flex-col items-center justify-center`}>
        <LoaderCircle className="h-8 w-8 animate-spin text-violet-400" />
        <p className="mt-4 text-sm text-slate-400">
          Loading notifications...
        </p>
      </div>
    ) : isError ? (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.05] px-5 py-10 text-center">
        <p className="font-semibold text-red-300">Could not load your notifications.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    ) : (
      <>
        {/* Incoming friend requests */}
        {incomingRequests.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                <UserCheckIcon className="h-5 w-5 text-violet-300" />
              </div>

              <div className="flex-1">
                <h2 className={sectionTitle}>Friend Requests</h2>
                <p className="mt-1 text-sm text-slate-500">
                  People who want to connect with you
                </p>
              </div>

              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-200">
                {incomingRequests.length}
              </span>
            </div>

            <div className="space-y-4">
              {incomingRequests.map((request) => (
                <article
                  key={request._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111120] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:shadow-xl hover:shadow-violet-950/20"
                >
                  <div className="h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 opacity-40 transition-opacity group-hover:opacity-100" />

                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        src={request.sender?.profilePic}
                        name={request.sender?.fullName}
                        className="h-16 w-16 rounded-2xl border border-violet-400/20"
                        textClassName="text-xl"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold text-white transition-colors group-hover:text-violet-200">
                          {request.sender?.fullName || "Unknown User"}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.07] px-2.5 py-1.5 text-xs text-cyan-200">
                            <span className="text-slate-400">Role: </span>
                            {request.sender?.role || "Nexora Member"}
                          </span>

                          <span className="rounded-lg border border-violet-400/20 bg-violet-500/[0.08] px-2.5 py-1.5 text-xs text-violet-200">
                            <span className="text-slate-400">Location: </span>
                            {request.sender?.location || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/10 transition-all duration-200 hover:from-violet-500 hover:to-indigo-400 hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => acceptRequestMutation(request._id)}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Accept
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Accepted friend requests */}
        {acceptedRequests.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08]">
                <BellIcon className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <h2 className={sectionTitle}>New Connections</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Friends who accepted your request
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {acceptedRequests.map((notification) => (
                <article
                  key={notification._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111120] transition-all duration-300 hover:border-emerald-400/25 hover:shadow-lg hover:shadow-emerald-950/10"
                >
                  <div className="h-[2px] bg-gradient-to-r from-emerald-400/70 via-cyan-400/40 to-transparent" />

                  <div className="flex items-start gap-4 p-5">
                    <Avatar
                      src={notification.recipient?.profilePic}
                      name={notification.recipient?.fullName}
                      className="h-14 w-14 rounded-2xl border border-emerald-400/15"
                      textClassName="text-lg"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white transition-colors group-hover:text-emerald-200">
                        {notification.recipient?.fullName || "Unknown User"}
                      </h3>

                      <p className="my-2 text-sm leading-6 text-slate-400">
                        {notification.recipient?.fullName || "Your friend"}{" "}
                        accepted your friend request.
                      </p>

                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <ClockIcon className="h-3.5 w-3.5" />
                        Recently
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-2 text-xs font-semibold text-emerald-300">
                      <MessageSquareIcon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">New Friend</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {incomingRequests.length === 0 &&
          acceptedRequests.length === 0 && (
            <div className={`${sectionCard} p-5 sm:p-8`}>
              <NoNotificationsFound />
            </div>
          )}
      </>
    )}

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

export default NotificationsPage;
