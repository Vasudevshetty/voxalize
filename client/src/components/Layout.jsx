import SessionHistory from "./SessionHistory";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-black flex">
      <SessionHistory />
      <div className="flex-1 ml-80">
        {" "}
        {/* Offset content when sidebar is open */}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
