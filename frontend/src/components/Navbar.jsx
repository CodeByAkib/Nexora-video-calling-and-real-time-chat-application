
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, LogOutIcon, UsersIcon } from "lucide-react";
import Avatar from "./Avatar";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();

  const { logoutMutation } = useLogout();

  return (
    <nav className="sticky top-0 z-30 flex h-16 items-center border-b border-violet-400/15 bg-[#0b0b19]/95 text-white shadow-[0_4px_25px_rgba(76,29,149,0.08)] backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-end gap-3 sm:gap-4">

          {/* Page links: the sidebar is hidden below the lg breakpoint, so phones/tablets get them here */}
          <div className="mr-auto flex items-center gap-1 lg:hidden">
            {[
              { to: "/", label: "Home", Icon: HomeIcon },
              { to: "/friends", label: "Friends", Icon: UsersIcon },
            ].map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                aria-label={label}
                aria-current={pathname === to ? "page" : undefined}
                className={`flex size-10 items-center justify-center rounded-xl border transition-all duration-200 ${
                  pathname === to
                    ? "border-violet-400/25 bg-violet-500/15 text-violet-200"
                    : "border-transparent text-slate-400 hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-200"
                }`}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          {/* Notifications */}
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="flex size-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-all duration-200 hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-200"
          >
            <BellIcon className="h-5 w-5" />
          </Link>

          {/* Theme Selector — functionality unchanged */}
          <div className="flex items-center justify-center rounded-xl transition-colors hover:bg-white/[0.04]">
            <ThemeSelector />
          </div>

          {/* User Avatar */}
          <Avatar
            src={authUser?.profilePic}
            name={authUser?.fullName}
            className="size-9 rounded-xl ring-1 ring-violet-400/25 transition-all duration-200 hover:ring-violet-400/60"
          />

          {/* Logout */}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-all duration-200 hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-300"
            onClick={() => logoutMutation()}
            aria-label="Logout"
          >
            <LogOutIcon className="h-5 w-5" />
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

