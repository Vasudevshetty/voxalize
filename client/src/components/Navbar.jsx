import { Link } from "react-router-dom";
import { useAuth } from "../context/Auth";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <nav className="bg-[#000000] flex justify-between items-center p-4 shadow-md border-1 border-b-[#3A3A3A] w:[90%] md:w-[75%] mx-auto  h-12">
        <Link to="/" className="text-2xl text-white font-sharetechmono">
          Voxalize
        </Link>
        <div className="flex gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/auth/login"}
            className="text-sm md:text-md cursor-pointer text-white bg-[#282828] font-dmmono w-28 h-8 rounded-full flex justify-center items-center"
          >
            {isAuthenticated ? "Dashboard" : "Login"}
          </Link>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="text-sm md:text-md cursor-pointer text-white bg-[#282828] font-dmmono w-28 h-8 rounded-full flex justify-center items-center"
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
