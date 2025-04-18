import { Link } from "react-router-dom";
import { FaMicrophone, FaSearch, FaLanguage } from "react-icons/fa";

function Home() {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center px-4 py-10 space-y-10">
      {/* Logo and tagline */}
      <div className="text-center">
        <div className="text-3xl sm:text-5xl font-semibold tracking-wide">
          <span className="text-green-400">Speak</span>
          <span className="text-white">.</span>
          <span className="text-cyan-400">See</span>
          <span className="text-white">.</span>
          <span className="text-blue-500">Create</span>
        </div>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Where voice meets visualization through cutting-edge{" "}
          <span className="text-white font-mono">AI</span>.
        </p>
      </div>

      {/* Mic Control */}
      <div className="flex items-center justify-center space-x-4 bg-[#1a1a1a] rounded-full px-6 py-3 relative shadow-lg">
        <FaSearch className="text-gray-400 text-lg" />
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
          <FaMicrophone className="text-blue-500 text-xl" />
        </div>
        <FaLanguage className="text-gray-400 text-lg" />
      </div>

      {/* Horizontal line */}
      <div className="w-full border-t border-gray-700 max-w-4xl"></div>

      {/* Card Section */}
      <div className="bg-[#111] rounded-xl p-6 flex flex-col md:flex-row justify-between items-center max-w-4xl w-full shadow-md border border-[#2c2c2c]">
        {/* Text Content */}
        <div className="md:w-2/3 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Experience the Power of{" "}
            <span className="text-blue-400">Voice-Driven</span> Visualization
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Transform complex ideas, pitches, or data into clear, compelling
            visuals — just by speaking. Whether you're brainstorming,
            presenting, or strategizing, see how fast your voice can turn into
            impact.
          </p>
          <Link
            to="/visual"
            className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-full shadow hover:scale-105 transition-transform"
          >
            Try Now!
          </Link>
        </div>

        {/* Illustration */}
        <div className="md:w-1/3 mt-6 md:mt-0">
          <img
            src="/illustration.png"
            alt="Visualization Illustration"
            className="w-full max-w-[180px] md:max-w-[220px]"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
