import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="bg-[#000000] ">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
