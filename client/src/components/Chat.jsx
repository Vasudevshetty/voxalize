import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

function Chat() {
  const [selected, setSelected] = useState("dataset1");
  const [listening, setListening] = useState(false);
  const [micStopped, setMicStopped] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleMicClick = () => {
    setListening(true);
    setMicStopped(false);
  };

  const handleStopListening = () => {
    setListening(false);
    setMicStopped(true);
  };

  // ✅ Button enabled if: input text OR mic stopped
  const isVisualizeEnabled = inputText.trim().length > 0 || micStopped;

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-between px-6 py-4">
      <div className="w-full max-w-6xl flex-grow flex flex-col items-center justify-center">
        <div className="bg-[#181818] rounded-xl border border-gray-700 p-6 w-full h-[70vh] relative flex flex-col justify-between shadow-md">
          {/* Dataset Buttons */}
          <div className="absolute top-4 right-4 flex items-center justify-center bg-[#1f1f1f] p-1 rounded-full border border-[#3d3d3d] shadow-md">
            <button
              onClick={() => setSelected("dataset1")}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-300 cursor-pointer ${
                selected === "dataset1"
                  ? "bg-[#282828] text-white shadow-md p-2"
                  : "text-gray-300 hover:text-white hover:bg-[#2a2a2a] p-2"
              }`}
            >
              <img src="/database.png" className="w-4 h-4" alt="Database 1" />
              Dataset 1
            </button>

            <button
              onClick={() => setSelected("dataset2")}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-300 cursor-pointer ${
                selected === "dataset2"
                  ? "bg-[#282828] text-white shadow-md p-2"
                  : "text-gray-300 hover:text-white hover:bg-[#2a2a2a] p-2"
              }`}
            >
              <img src="/database.png" className="w-4 h-4" alt="Database 2" />
              Dataset 2
            </button>
          </div>

          {/* Center */}
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {listening ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  <div className="waveform-bar animate-wave h-10 w-1 bg-blue-400 rounded"></div>
                  <div className="waveform-bar animate-wave h-16 w-1 bg-green-400 rounded delay-100"></div>
                  <div className="waveform-bar animate-wave h-12 w-1 bg-cyan-400 rounded delay-200"></div>
                  <div className="waveform-bar animate-wave h-20 w-1 bg-blue-300 rounded delay-300"></div>
                  <div className="waveform-bar animate-wave h-14 w-1 bg-green-300 rounded delay-400"></div>
                </div>
                <button
                  onClick={handleStopListening}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition-all"
                >
                  Stop Listening
                </button>
              </div>
            ) : (
              <p className="text-lg">Start typing or use the mic...</p>
            )}
          </div>

          {/* Bottom input + buttons */}
          <div className="flex gap-4 items-center justify-center">
            <div
              className={`flex w-[30vw] items-center gap-3 px-4 py-2 rounded-full bg-[#131313] border border-gray-600 ${
                listening ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <FaSearch size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Type here"
                disabled={listening}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500 text-base"
              />
              <img
                src="/voice.png"
                alt="Mic"
                className={`h-12 w-12 cursor-pointer ${
                  listening ? "animate-pulse" : ""
                }`}
                onClick={handleMicClick}
              />
              <img
                src="/translate.png"
                alt="Translate"
                className="h-8 w-8 cursor-pointer"
              />
            </div>

            {/* Visualize Button */}
            <Link
              to={isVisualizeEnabled ? "/visual" : "#"}
              className={`${
                isVisualizeEnabled
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-black hover:opacity-90"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed pointer-events-none"
              } font-semibold px-4 py-2 rounded-full transition-all`}
            >
              Visualize
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
