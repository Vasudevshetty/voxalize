import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import WaveAnimation from "./WaveAnimation";
import ChatMessage from "./ChatMessage";
import { AiOutlineStock } from "react-icons/ai";

function DemoChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [dbConfig, setDbConfig] = useState(null);
  const messagesEndRef = useRef(null);

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
    <div className="bg-black min-h-screen text-white px-4 pt-4">
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
          Where voice meets visualization through cutting-edge AI.
        </p>
      </motion.div>

      <motion.div
        className="bg-[#0e0e0e] w-full max-w-4xl rounded-lg flex flex-col h-[26rem] overflow-hidden shadow-[0_0_8px_#00fff066,0_0_12px_#00ffcc55,0_0_16px_#00ffaa44] border border-cyan-400 mx-auto"
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
  );
}

export default DemoChat;
