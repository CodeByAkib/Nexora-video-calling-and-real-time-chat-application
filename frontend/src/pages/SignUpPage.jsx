
import { useState } from "react";
import {
  ShipWheel,
  Sparkles,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080816] px-4 py-10 font-sans text-white selection:bg-violet-500/40 sm:px-6">

      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/[0.07] blur-[120px]" />

      {/* SUBTLE GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.2) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-[460px]">

        {/* BRAND */}
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 shadow-lg shadow-violet-500/10">
            <ShipWheel className="h-7 w-7 text-violet-300" />
          </div>

          <span className="text-3xl font-extrabold tracking-tight text-white">
            Nexora<span className="text-violet-400">.</span>
          </span>
        </div>

        {/* CARD */}
        <div className="overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#111120]/90 shadow-[0_25px_100px_-25px_rgba(124,58,237,0.25)] backdrop-blur-2xl">

          {/* TOP ACCENT */}
          <div className="h-[3px] w-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />

          <div className="p-6 sm:p-9">

            {/* HEADING */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                YOUR NEXT CHAPTER STARTS HERE
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-[34px]">
                Create your{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  account
                </span>
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Join Nexora and make meaningful connections.
              </p>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
              >
                {error?.response?.data?.message ||
                  "Something went wrong. Please try again."}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSignup} className="space-y-5">

              {/* FULL NAME */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Full name
                </label>

                <div className="group relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-violet-400" />

                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="h-[52px] w-full rounded-xl border border-white/[0.09] bg-[#19192b] pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-white/20 focus:border-violet-400/70 focus:bg-[#1c1a31] focus:ring-4 focus:ring-violet-500/10"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-violet-400" />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-[52px] w-full rounded-xl border border-white/[0.09] bg-[#19192b] pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-white/20 focus:border-violet-400/70 focus:bg-[#1c1a31] focus:ring-4 focus:ring-violet-500/10"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Password
                </label>

                <div className="group relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-violet-400" />

                  <input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    minLength={6}
                    className="h-[52px] w-full rounded-xl border border-white/[0.09] bg-[#19192b] pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-white/20 focus:border-violet-400/70 focus:bg-[#1c1a31] focus:ring-4 focus:ring-violet-500/10"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Use at least 6 characters.
                </p>
              </div>

              {/* TERMS */}
              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-violet-500"
                />

                <span className="text-xs leading-5 text-slate-400">
                  I agree to the{" "}
                  <span className="font-medium text-violet-300 transition-colors hover:text-violet-200">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-cyan-300 transition-colors hover:text-cyan-200">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* DIVIDER */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-[11px] font-medium tracking-[0.15em] text-slate-500">
                OR
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            {/* LOGIN */}
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-violet-300 transition-colors hover:text-cyan-300"
              >
                Sign in
              </Link>
            </p>

            {/* TRUST FOOTER */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Simple, secure and built for connections.
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs tracking-wide text-slate-600">
          © {new Date().getFullYear()} Nexora. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
