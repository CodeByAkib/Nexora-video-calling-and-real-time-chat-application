
import { useState } from "react";
import {
  ShipWheel,
  Sparkles,
  UserRound,
  MapPin,
  Shuffle,
  Camera,
  BriefcaseBusiness,
  Heart,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Code2,
  Gamepad2,
  Music,
  Film,
  Trophy,
  Plane,
  Laptop,
  Users,
} from "lucide-react";

import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";

const ROLES = [
  "Student",
  "Software Developer",
  "Designer",
  "Freelancer",
  "Entrepreneur",
  "Other",
];

const INTERESTS = [
  { label: "Technology", icon: Laptop },
  { label: "Gaming", icon: Gamepad2 },
  { label: "Music", icon: Music },
  { label: "Movies", icon: Film },
  { label: "Sports", icon: Trophy },
  { label: "Travel", icon: Plane },
  { label: "Coding", icon: Code2 },
  { label: "Other", icon: Heart },
];

// The seed must be an opaque value (the user id) - never an email, because the avatar URL is
// stored on the profile and shown to other people.
const getDiceBearAvatar = (seed) =>
  `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(
    seed || "Nexora User"
  )}`;

// Avatars from the retired provider (they 502) or seeded with an email address get replaced.
const isLegacyAvatar = (url) => {
  if (!url) return true;
  if (url.includes("avatar.iran.liara.run")) return true;
  try {
    return new URL(url).searchParams.get("seed")?.includes("@") ?? false;
  } catch {
    return true;
  }
};

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState(() => ({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    role: authUser?.role || "",
    interests: authUser?.interests || [],
    location: authUser?.location || "",
    profilePic: !isLegacyAvatar(authUser?.profilePic)
      ? authUser.profilePic
      : getDiceBearAvatar(authUser?._id || authUser?.fullName),
  }));

  const [avatarError, setAvatarError] = useState(false);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,

    onSuccess: async () => {
      toast.success("Your Nexora profile is ready!");

      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to complete your profile. Please try again."
      );
    },
  });

  const updateField = (field, value) => {
    setFormState((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleInterest = (interest) => {
    setFormState((previous) => {
      const selected = previous.interests.includes(interest);

      return {
        ...previous,
        interests: selected
          ? previous.interests.filter((item) => item !== interest)
          : [...previous.interests, interest],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formState.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!formState.role) {
      toast.error("Please select your role.");
      return;
    }

    if (formState.bio.length > 250) {
      toast.error("About Me must be 250 characters or less.");
      return;
    }

    onboardingMutation({
      fullName: formState.fullName.trim(),
      bio: formState.bio.trim(),
      role: formState.role,
      interests: formState.interests,
      location: formState.location.trim(),
      profilePic: formState.profilePic,
    });
  };

  const handleRandomAvatar = () => {
    const randomSeed = `${authUser?._id || "nexora"}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;

    updateField("profilePic", getDiceBearAvatar(randomSeed));
    setAvatarError(false);

    toast.success("New avatar generated!");
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const sectionClass =
    "rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6";

  const inputClass =
    "h-[50px] w-full rounded-xl border border-white/[0.09] bg-[#19192b] px-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 hover:border-white/20 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080816] px-4 py-10 font-sans text-white selection:bg-violet-500/40 sm:px-6">
      {/* Background glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/[0.07] blur-[120px]" />

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.2) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Brand */}
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 shadow-lg shadow-violet-500/10">
            <ShipWheel className="h-7 w-7 text-violet-300" />
          </div>

          <span className="text-3xl font-extrabold tracking-tight text-white">
            Nexora<span className="text-violet-400">.</span>
          </span>
        </div>

        {/* Main card */}
        <section className="overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#111120]/90 shadow-[0_25px_100px_-25px_rgba(124,58,237,0.25)] backdrop-blur-2xl">
          <div className="h-[3px] w-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />

          <div className="p-6 sm:p-9">
            {/* Heading */}
            <header className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                YOUR NEXT CHAPTER STARTS HERE
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-[34px]">
                Make your{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  Nexora profile
                </span>
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
                Introduce yourself, discover people with similar interests,
                and get ready to connect through real-time chat and video
                calls.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile picture */}
              <section className={sectionClass}>
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                  <div className="relative shrink-0">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-violet-400/40 bg-[#19192b] p-1 shadow-lg shadow-violet-500/10 sm:h-32 sm:w-32">
                      {avatarError ? (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-4xl font-bold text-white">
                          {(formState.fullName || "N")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      ) : (
                        <img
                          key={formState.profilePic}
                          src={formState.profilePic}
                          alt="Profile preview"
                          onError={handleAvatarError}
                          className="h-full w-full rounded-full object-cover"
                        />
                      )}
                    </div>

                    <div className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111120] bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
                      <Camera className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-lg font-bold text-slate-100">
                      Your profile picture
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                      Choose a fun avatar so your friends can recognize you
                      across Nexora.
                    </p>

                    <button
                      type="button"
                      onClick={handleRandomAvatar}
                      className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 text-sm font-semibold text-violet-300 transition hover:border-violet-300 hover:bg-violet-500/20"
                    >
                      <Shuffle className="h-4 w-4" />
                      Generate avatar
                    </button>
                  </div>
                </div>
              </section>

              {/* Personal information */}
              <section className="space-y-5">
                <div className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-violet-400" />
                  <h2 className="font-bold text-slate-100">
                    Personal information
                  </h2>
                </div>

                {/* Full name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-slate-200"
                  >
                    Full name <span className="text-rose-400">*</span>
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    required
                    value={formState.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>

                {/* About me */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="text-sm font-semibold text-slate-200"
                    >
                      About me
                    </label>

                    <span className="text-xs text-slate-500">
                      {formState.bio.length}/250
                    </span>
                  </div>

                  <textarea
                    id="bio"
                    maxLength={250}
                    rows={4}
                    value={formState.bio}
                    onChange={(event) =>
                      updateField("bio", event.target.value)
                    }
                    placeholder="Tell people about yourself, your interests, and what you enjoy talking about..."
                    className="w-full resize-y rounded-xl border border-white/[0.09] bg-[#19192b] px-4 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-slate-500 hover:border-white/20 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>
              </section>

              {/* Role */}
              <section className={sectionClass}>
                <div className="mb-5 flex items-center gap-2">
                  <BriefcaseBusiness className="h-5 w-5 text-violet-400" />

                  <div>
                    <h2 className="font-bold text-slate-100">Your role</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Tell people what you do.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Select your role <span className="text-rose-400">*</span>
                </label>

                <select
                  id="role"
                  required
                  value={formState.role}
                  onChange={(event) =>
                    updateField("role", event.target.value)
                  }
                  className={`${inputClass} px-3`}
                >
                  <option value="" className="bg-[#19192b]">
                    Choose your role
                  </option>

                  {ROLES.map((role) => (
                    <option
                      key={role}
                      value={role}
                      className="bg-[#19192b]"
                    >
                      {role}
                    </option>
                  ))}
                </select>
              </section>

              {/* Interests */}
              <section className={sectionClass}>
                <div className="mb-5 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-violet-400" />

                  <div>
                    <h2 className="font-bold text-slate-100">
                      Your interests
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Select the things you enjoy. Choose multiple options.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {INTERESTS.map(({ label, icon: Icon }) => {
                    const selected = formState.interests.includes(label);

                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleInterest(label)}
                        className={`relative flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all duration-200 ${
                          selected
                            ? "border-violet-400/60 bg-violet-500/15 text-violet-200 shadow-lg shadow-violet-900/10"
                            : "border-white/[0.08] bg-[#19192b] text-slate-400 hover:border-violet-400/30 hover:bg-violet-500/[0.06] hover:text-slate-200"
                        }`}
                      >
                        {selected && (
                          <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-violet-300" />
                        )}

                        <Icon
                          className={`h-5 w-5 ${
                            selected ? "text-violet-300" : ""
                          }`}
                        />

                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {formState.interests.length} interest
                  {formState.interests.length === 1 ? "" : "s"} selected
                </p>
              </section>

              {/* Location */}
              <section>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Location{" "}
                  <span className="font-normal text-slate-500">
                    (optional)
                  </span>
                </label>

                <div className="group relative">
                  <MapPin className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-violet-400" />

                  <input
                    id="location"
                    type="text"
                    autoComplete="address-level2"
                    maxLength={100}
                    value={formState.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="City, Country"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </section>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Saving your profile...
                    </>
                  ) : (
                    <>
                      Complete my profile
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>
                Your profile helps people discover you and connect on Nexora.
              </span>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs tracking-wide text-slate-600">
          © {new Date().getFullYear()} Nexora. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default OnboardingPage;
