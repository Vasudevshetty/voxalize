import SessionHistory from "./SessionHistory";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close sidebar by default on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-black">
      <SessionHistory
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main
        className={`flex-1 transition-all duration-300
          ${sidebarOpen ? "lg:ml-0" : "ml-0"}`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
