
import { useState } from "react";
import {
  ShipWheel,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080816] text-white flex items-center justify-center px-4 py-8 sm:px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Brand */}
        <div className="mb-7 flex justify-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/25 to-cyan-400/10 shadow-lg shadow-violet-500/10">
              <ShipWheel className="h-7 w-7 text-violet-300" />
            </div>

            <span className="text-3xl font-extrabold tracking-tight">
              Nexora<span className="text-violet-400">.</span>
            </span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111120]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* Gradient Top Border */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />

          <div className="grid lg:grid-cols-2">
            {/* Login Form */}
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              {/* Badge */}
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium tracking-wide text-violet-200">
                <Sparkles className="h-3.5 w-3.5" />
                YOUR NEXT CHAPTER STARTS HERE
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Welcome{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  back.
                </span>
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Sign in to pick up your conversations, catch up with your
                friends and jump back into your video calls.
              </p>

              {/* Error Message */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error?.response?.data?.message ||
                    "Unable to sign in. Please check your details and try again."}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Email address
                  </label>

                  <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#19192b] px-4 transition-all focus-within:border-violet-400/70 focus-within:ring-4 focus-within:ring-violet-500/10">
                    <Mail className="h-5 w-5 shrink-0 text-slate-500 transition-colors group-focus-within:text-violet-400" />

                    <input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      autoComplete="email"
                      className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-200"
                    >
                      Password
                    </label>
                  </div>

                  <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#19192b] px-4 transition-all focus-within:border-violet-400/70 focus-within:ring-4 focus-within:ring-violet-500/10">
                    <LockKeyhole className="h-5 w-5 shrink-0 text-slate-500 transition-colors group-focus-within:text-violet-400" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 text-slate-500 transition-colors hover:text-violet-300"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-4 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isPending ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Signup Link */}
              <div className="mt-7 text-center">
                <p className="text-sm text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-violet-300 transition-colors hover:text-cyan-300"
                  >
                    Create one
                  </Link>
                </p>
              </div>

              <div className="mt-8 border-t border-white/[0.07] pt-5 text-center">
                <p className="text-xs text-slate-600">
                  © {new Date().getFullYear()} Nexora. Learn. Connect. Grow.
                </p>
              </div>
            </div>

            {/* Right Illustration Panel */}
            <div className="relative hidden flex-col items-center justify-center overflow-hidden border-l border-white/[0.06] bg-gradient-to-br from-violet-500/[0.09] via-[#151327] to-cyan-500/[0.06] p-10 lg:flex">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/15 blur-[80px]" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />

              <div className="relative z-10 w-full max-w-sm">
                {/* Illustration */}
                <div className="relative mx-auto flex aspect-square max-w-[310px] items-center justify-center">
                  <div className="absolute inset-5 rounded-full border border-violet-400/20" />
                  <div className="absolute inset-10 rounded-full border border-cyan-400/20" />
                  <div className="absolute inset-[60px] rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-400/10 blur-xl" />

                  <div className="relative flex h-36 w-36 items-center justify-center rounded-[36px] border border-violet-300/30 bg-gradient-to-br from-violet-500/25 to-cyan-400/10 shadow-2xl shadow-violet-500/20">
                    <ShipWheel className="h-20 w-20 text-violet-200" />
                    <div className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-[#171729]">
                      <Sparkles className="h-5 w-5 text-cyan-300" />
                    </div>
                  </div>

                  <div className="absolute left-1 top-14 rounded-xl border border-white/10 bg-[#1b1a30] px-3 py-2 text-xs text-violet-200 shadow-xl">
                    🌍 Global connections
                  </div>

                  <div className="absolute bottom-12 right-0 rounded-xl border border-white/10 bg-[#1b1a30] px-3 py-2 text-xs text-cyan-200 shadow-xl">
                    💬 Real conversations
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <h2 className="text-2xl font-bold leading-snug">
                    Every conversation opens{" "}
                    <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                      a new connection.
                    </span>
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    Meet interesting people, chat in real time, and turn great
                    conversations into face-to-face video calls.
                  </p>
                </div>

                <div className="mt-7 flex items-center justify-center gap-2">
                  <span className="h-1.5 w-7 rounded-full bg-violet-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

