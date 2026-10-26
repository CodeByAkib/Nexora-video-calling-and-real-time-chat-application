
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import Avatar from "./Avatar";
import {
  BellIcon,
  HomeIcon,
  ShipWheelIcon,
  UsersIcon,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: HomeIcon,
    },
    {
      to: "/friends",
      label: "Friends",
      icon: UsersIcon,
    },
    {
      to: "/notifications",
      label: "Notifications",
      icon: BellIcon,
    },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-violet-400/10 bg-[#0b0b19] text-white lg:flex">
      {/* Logo */}
      <div className="border-b border-white/[0.07] p-5">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-900/25 transition-transform duration-300 group-hover:scale-105">
            <ShipWheelIcon className="size-5 text-white" />
          </div>

          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text font-mono text-2xl font-extrabold tracking-wide text-transparent">
            Nexora
          </span>
        </Link>

        <p className="ml-1 mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          Connect beyond borders
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Menu
        </p>

        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/"
              ? currentPath === "/"
              : currentPath === to ||
                currentPath.startsWith(`${to}/`);

          return (
            <Link
              key={to}
              to={to}
              className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-violet-400/20 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 text-violet-200 shadow-lg shadow-violet-950/10"
                  : "border-transparent text-slate-400 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-gradient-to-b from-violet-400 to-fuchsia-400" />
              )}

              <Icon
                className={`size-5 transition-colors duration-200 ${
                  isActive
                    ? "text-violet-300"
                    : "text-slate-500 group-hover:text-violet-300"
                }`}
              />

              <span>{label}</span>

              {isActive && (
                <span className="ml-auto size-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-white/[0.07] p-4">
        <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Account
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 transition-colors duration-200 hover:border-violet-400/15 hover:bg-violet-500/[0.04]">
          <Avatar
            src={authUser?.profilePic}
            name={authUser?.fullName}
            className="size-10 rounded-xl ring-1 ring-violet-400/30"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-100">
              {authUser?.fullName}
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              Online
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] tracking-wide text-slate-600">
          Made for meaningful connections
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

