import { ShipWheel, LoaderCircle, Sparkles } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080816] font-sans text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Loader content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-[26px] border border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 shadow-xl shadow-violet-500/10">
          <ShipWheel className="h-10 w-10 text-violet-300" />

          <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-cyan-300" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Nexora<span className="text-violet-400">.</span>
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Connecting you to a world of possibilities
        </p>

        <div className="relative mt-8 flex items-center gap-3">
          <LoaderCircle className="h-5 w-5 animate-spin text-violet-400" />

          <span className="text-sm font-medium text-slate-300">
            Preparing your experience...
          </span>
        </div>

        {/* Loading progress decoration */}
        <div className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

