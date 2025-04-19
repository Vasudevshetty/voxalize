import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <nav className="bg-[#000000] flex justify-between items-center p-8 shadow-md border-1 border-b-[#3A3A3A] w-full md:w-[75%] mx-auto h-12">
        <Link
          to="/"
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 "
        >
          Voxalize
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col md:flex md:flex-row gap-4 fixed md:static top-0 right-0 h-screen md:h-auto w-2/3 md:w-auto bg-black md:bg-transparent z-50 md:z-auto p-4 md:p-0 shadow-md md:shadow-none`}
        >
          <button
            onClick={toggleMenu}
            className="self-end text-white text-2xl mb-4 md:hidden"
          >
            <FaTimes />
          </button>
          <Link
            to={isAuthenticated ? "/dashboard" : "/auth/login"}
            className="text-sm md:text-md cursor-pointer text-white bg-[#282828] font-dmmono w-[90%] md:w-36 h-12 rounded-full flex justify-center items-center mt-4 md:mt-0"
          >
            {isAuthenticated ? "Dashboard" : "Login"}
          </Link>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="text-sm md:text-md cursor-pointer text-white bg-[#282828] font-dmmono w-[90%] md:w-36 h-12 rounded-full flex justify-center items-center mt-4 md:mt-0"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
