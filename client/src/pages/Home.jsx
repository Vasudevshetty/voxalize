import { Link } from "react-router-dom";
import { FaMicrophone, FaSearch, FaLanguage } from "react-icons/fa";

function Home() {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center px-4 py-10 space-y-10">
      {/* Logo and tagline */}
      <div className="text-center">
        <div>
          <img src="/audio.png" className="h-fit w-32" />
        </div>
        <div className="text-3xl sm:text-5xl font-semibold tracking-wide ml-10 ">
          <span className="text-green-400">Speak</span>
          <span className="text-green-500">.</span>
          <span className="text-cyan-400">See</span>
          <span className="text-cyan-500">.</span>
          <span className="text-blue-500">Create</span>
        </div>
        <p className="text-gray-400 mt-6 text-sm sm:text-base tracking-wider">
          Where voice meets visualization through cutting-edge{" "}
          <span className="text-white font-mono">AI</span>.
        </p>
      </div>

      {/* Mic Control */}
      <div className="h-96  text-white border w-full ">DEMO PART</div>
      {/* <div className="flex items-center justify-between w-58 bg-[#1a1a1a] rounded-full px-6 py-3 relative shadow-lg">
        <FaSearch size={26} className="text-gray-400 text-lg" />
        <div className="w-16 h-16  bg-black rounded-full flex items-center justify-center shadow-lg">
          <FaMicrophone size={36} className="text-blue-500 text-xl " />
        </div>
        <FaLanguage size={26} className="text-gray-400 text-lg" />
      </div> */}

      {/* Horizontal line */}
      <div className="w-full border-t-2 border-[#3a3a3a]  max-w-4xl"></div>

      {/* Card Section */}
      <div className="bg-[#0e0e0e] rounded-xl p-6 flex flex-col md:flex-row justify-between items-center max-w-4xl w-full ">
        {/* Text Content */}
        <div className="md:w-2/3 space-y-3">
          <h2 className="text-3xl tracking-wider  font-bold">
            Experience the Power of
            <br />
            <span className="">
              <span className="text-green-400">Voice</span>
              <span className="text-cyan-400">-</span>
              <span className="text-cyan-600">Driven</span>
            </span>{" "}
            Visualization
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Transform complex ideas, pitches, or data into clear, compelling
            visuals — just by speaking. Whether you're brainstorming,
            presenting, or strategizing, see how fast your voice can turn into
            impact.
          </p>
          <Link
            to="/signup"
            className="inline-block mt-3 px-8 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-full shadow hover:scale-105 transition-transform"
          >
            Try Now!
          </Link>
        </div>

        {/* Illustration */}
        <div className="md:w-1/3 mt-6 md:mt-0">
          <img
            src="/hero.png"
            alt="Visualization Illustration"
            className="w-96 h-fit"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
