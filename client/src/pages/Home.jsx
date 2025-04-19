import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatMessage from "../components/ChatMessage";
import { useState, useRef, useEffect } from "react";
import { AiOutlineStock } from "react-icons/ai";
import WaveAnimation from "../components/WaveAnimation";
import { motion } from "framer-motion";
import Features from "../components/Features";
import Footer from "../components/Footer";
function Home() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [locale, setLocale] = useState("en");
  const [dbConfig, setDbConfig] = useState(null);
  const messagesEndRef = useRef(null);

  const LANGUAGES = [
    { label: "English", code: "en" },
    { label: "Hindi", code: "hi" },
    { label: "Kannada", code: "kn" },
    { label: "Tamil", code: "ta" },
    { label: "Telugu", code: "te" },
  ];

  const MYSQL_CONFIG = { dbtype: "mysql" };
  const POSTGRES_CONFIG = { dbtype: "postgresql" };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMessage = { type: "user", content: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    if (!dbConfig) {
      const botReply = {
        type: "bot",
        content: "Please select either MySQL or PostgreSQL to proceed.",
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          database_config: dbConfig,
          query_request: { query: inputText },
        }),
      });

      const data = await response.json();
      const botReply = {
        type: "bot",
        content: data.result || "No result found.",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      const errorReply = {
        type: "bot",
        content: "Error fetching data from the server.",
      };
      setMessages((prev) => [...prev, errorReply]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      className="bg-[#000000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <div className="bg-black min-h-screen text-white px-4 pt-4">
        <div
          className="flex flex-col justify-between items-center w-full max-w-7xl mx-auto"
          style={{ height: "calc(100vh - 80px)" }}
        >
          {/* Logo and Tagline */}
          <motion.div
            className="text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <WaveAnimation />
            <div className="text-3xl sm:text-5xl font-semibold tracking-wide ml-10">
              <span className="text-green-400">Speak</span>
              <span className="text-green-500">.</span>
              <span className="text-cyan-400">See</span>
              <span className="text-cyan-500">.</span>
              <span className="text-blue-500">Create</span>
            </div>
            <p className="text-gray-400 mt-2 mb-6 text-sm sm:text-base tracking-wider">
              Where voice meets visualization through cutting-edge{" "}
              <span className="text-white font-mono">AI</span>.
            </p>
          </motion.div>

          {/* Chat UI Section */}
          <motion.div
            className="bg-[#0e0e0e] w-full max-w-4xl rounded-lg flex flex-col h-[26rem] overflow-hidden shadow-[0_0_8px_#00fff066,0_0_12px_#00ffcc55,0_0_16px_#00ffaa44] border border-cyan-400"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-[#1a1a1a] p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
                Chat Demo
              </h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDbConfig(MYSQL_CONFIG)}
                  className={`px-3 py-1 rounded-md text-sm font-medium h-10 flex items-center ${
                    dbConfig?.dbtype === "mysql"
                      ? "bg-cyan-500 text-black"
                      : "bg-[#2a2a2a] text-white border border-gray-600"
                  }`}
                >
                  IPL
                  <span>
                    <img src="./ipl.png" alt="" className="w-10 h-10" />
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDbConfig(POSTGRES_CONFIG)}
                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center h-10 ${
                    dbConfig?.dbtype === "postgresql"
                      ? "bg-green-500 text-black"
                      : "bg-[#2a2a2a] text-white border border-gray-600"
                  }`}
                >
                  Sales
                  <span>
                    <AiOutlineStock size={32} />
                  </span>
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-[#1a1a1a] border-t border-gray-700 p-4 flex items-center gap-3">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="bg-[#1a2a2a] text-gray-300 rounded-lg px-3 py-2 border border-gray-700"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-700"
              />

              <motion.button
                onClick={handleSend}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-400 to-cyan-400 text-black px-4 py-2 rounded-lg font-medium"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full border-t-2 border-[#3a3a3a] max-w-4xl mx-auto my-10" />

        {/* Horizontal line */}
        <div className="w-full border-t-2 border-[#3a3a3a] max-w-7xl"></div>

        {/* Card Section */}
        <motion.div
          className="bg-gradient-to-r from-[#423e3e] to-black rounded-xl ml-24  p-4 flex flex-col md:flex-row justify-center items-center  w-[85%]  mt-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="md:w-2/3 space-y-3 px-4">
            <h2 className="text-3xl tracking-wider font-bold">
              Experience the Power of
              <br />
              <span>
                <span className="text-green-400">Voice</span>
                <span className="text-cyan-400">-</span>
                <span className="text-cyan-600">Driven</span>
              </span>{" "}
              Visualization
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Transform complex ideas, pitches, or data into clear, compelling
              visuals — just by speaking.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="inline-block mt-3 px-8 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-full shadow hover:scale-105 transition-transform"
              >
                Try Now!
              </Link>
            </motion.div>
          </div>

          <div className="md:w-1/3 mt-6 md:mt-0">
            <img
              src="/hero.png"
              alt="Visualization Illustration"
              className="w-96 h-fit"
            />
          </div>
        </motion.div>
      </div>
      <div className="h-screen flex items-center flex-col my-12 ">
        <Features />
        <Footer />
      </div>
    </motion.div>
  );
}

export default Home;
