
import { useState } from "react";
import { Link } from "react-router";
import {
  MessageCircle,
  MapPin,
  ArrowRight,
  BriefcaseBusiness,
  Heart,
  Sparkles,
} from "lucide-react";

const FriendCard = ({ friend }) => {
  const [avatarError, setAvatarError] = useState(false);

  const fullName = friend?.fullName || "Nexora User";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const interests = Array.isArray(friend?.interests)
    ? friend.interests
    : [];

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111120] transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-xl hover:shadow-violet-950/20">
      {/* Gradient accent */}
      <div className="h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 opacity-50 transition-opacity group-hover:opacity-100" />

      <div className="p-5">
        {/* Friend information */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-700 text-lg font-bold text-white">
            {friend?.profilePic && !avatarError ? (
              <img
                src={friend.profilePic}
                alt={fullName}
                onError={() => setAvatarError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-white transition-colors group-hover:text-violet-200">
              {fullName}
            </h3>

            {friend?.location ? (
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                {friend.location}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">
                Your friend on Nexora
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

          <div className="rounded-lg border border-violet-400/15 bg-violet-500/[0.06] px-3 py-2.5">
            <span className="text-sm font-medium text-violet-200">
              {friend?.role || "Nexora Member"}
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
            <div className="flex min-h-8 flex-wrap gap-2">
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
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            About Me
          </p>

          <p className="line-clamp-2 text-sm leading-6 text-slate-400">
            {friend?.bio || "Ready to connect and make new friends on Nexora."}
          </p>
        </div>

        {/* Message button */}
        <Link
          to={`/chat/${friend?._id}`}
          className="group/button mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/10 transition-all duration-200 hover:from-violet-500 hover:to-indigo-400 hover:shadow-violet-500/20"
        >
          <MessageCircle className="h-4 w-4" />
          Message
          <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

export default FriendCard;
