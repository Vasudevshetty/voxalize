import SessionHistory from "./SessionHistory";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-black">
      <SessionHistory
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-80" : "ml-0"
        } flex-1`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
