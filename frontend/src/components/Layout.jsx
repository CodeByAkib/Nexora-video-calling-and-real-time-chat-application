
import { useLocation } from "react-router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/call");

  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex flex-1 flex-col">
          {!hideNavbar && <Navbar />}

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
