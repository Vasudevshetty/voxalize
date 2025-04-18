import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div>
      <nav className="bg-[#000000] flex justify-between items-center p-4 shadow-md border-1 border-b-[#3A3A3A] w:[90%] md:w-[75%] mx-auto  h-12">
        <div className="text-2xl  text-white font-sharetechmono">Voxalize</div>
        <button
          className="text-sm md:text-md cursor-pointer text-white bg-[#282828] font-dmmono  w-28 h-8 rounded-full   flex justify-center items-center "
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Logout" : "Sign In"}
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
