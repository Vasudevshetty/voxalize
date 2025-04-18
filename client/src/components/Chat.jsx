import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";

const sampleSuggestions = [
  "how many customers are there",
  "how many orders per customer",
  "how many products in each category",
  "how many order items per order",
  "how many reviews per product",
  "how many customers in each city",
  "how many orders have been made",
  "how many products have been reviewed",
  "how many orders have a total amount greater than",
  "how many customers have made a review",
];

function Chat() {
  const [selected, setSelected] = useState("dataset1");
  const [listening, setListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputText.trim().length > 0 && listening) {
      setListening(false);
    }
  }, [inputText]);

  const handleMicClick = () => {
    if (inputText.trim().length === 0) {
      setListening(true);
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleStopListening = () => {
    setListening(false);
  };

  const isVisualizeEnabled = inputText.trim().length > 0 || listening;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setListening(false); // disable mic if typing

    if (value.trim().length === 0) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    } else {
      const suggestions = sampleSuggestions
        .filter((item) => item.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 4);
      setFilteredSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && filteredSuggestions.length > 0) {
      e.preventDefault();

      // Check if the user typed a number before pressing Tab
      const match = inputText.trim().match(/^(\d)$/);
      const index = match ? parseInt(match[1], 10) - 1 : 0;

      if (filteredSuggestions[index]) {
        setInputText(filteredSuggestions[index]);
      } else {
        setInputText(filteredSuggestions[0]); // fallback to first suggestion
      }

      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-between px-6 py-4">
      <div className="w-full max-w-6xl flex-grow flex flex-col items-center justify-center">
        <div className="bg-[#181818] rounded-xl border border-gray-700 p-6 w-full h-[70vh] relative flex flex-col justify-between shadow-md overflow-hidden">
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

          {/* Suggestions */}
          {showSuggestions && (
            <div className="absolute top-64 left-1/2 transform -translate-x-1/2 flex gap-4 flex-wrap justify-center transition-all duration-300 animate-fade-in z-10">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-[#262626] border border-gray-600 px-4 py-2 rounded-xl text-sm text-white cursor-pointer hover:bg-[#333] transition-transform transform hover:scale-105"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="text-gray-400 mr-2">{index + 1}.</span>
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          {/* Center Prompt */}
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
            ) : inputText.trim() === "" ? (
              <p className="text-lg text-gray-500">
                Start typing or use the mic...
              </p>
            ) : null}
          </div>

          {/* Input Field */}
          <div className="flex gap-4 items-center justify-center">
            <div
              className={`flex w-[30vw] items-center gap-3 px-4 py-2 rounded-full bg-[#131313] border border-gray-600 ${
                listening ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <FaSearch size={20} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type here"
                disabled={listening}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500 text-base"
              />
              <img
                src="/voice.png"
                alt="Mic"
                className={`h-12 w-12 cursor-pointer ${
                  inputText.trim().length > 0
                    ? "opacity-30 pointer-events-none"
                    : "hover:scale-105"
                } ${listening ? "animate-pulse" : ""}`}
                onClick={handleMicClick}
              />
              <img
                src="/translate.png"
                alt="Translate"
                className="h-8 w-8 cursor-pointer"
              />
            </div>

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
