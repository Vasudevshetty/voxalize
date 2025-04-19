import { useState } from "react";
import { motion } from "framer-motion";
import WaveAnimation from "./WaveAnimation";
import { AiOutlineStock } from "react-icons/ai";
import AutoChatDemo from "./AutoChatDemo";

function DemoChat() {
  const [activeChat, setActiveChat] = useState(0); // 0 for IPL, 1 for Sales

  return (
    <div className="bg-black min-h-screen text-white px-4 pt-4">
      <motion.div
        className="text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <WaveAnimation />
        <div className="ml-10 mb-4 overflow-hidden max-w-full">
          <h1 className="typewriter  text-3xl sm:text-5xl font-semibold tracking-wide text-transparent bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text">
            Speak.See.Create
          </h1>
        </div>

        <p className="text-gray-400 mt-2 mb-6 text-sm sm:text-base tracking-wider">
          Where voice meets visualization through cutting-edge AI.
        </p>
      </motion.div>

      <motion.div
        className="bg-[#0e0e0e] w-full max-w-6xl rounded-xl flex flex-col h-[26rem] overflow-hidden shadow-[0_0_8px_#00fff066,0_0_12px_#00ffcc55,0_0_16px_#00ffaa44] border border-cyan-400 mx-auto mt-16"
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
              className={`px-3 py-1 rounded-md text-sm font-medium h-10 flex items-center gap-2 cursor-pointer ${
                activeChat === 0
                  ? "bg-cyan-500 text-black"
                  : "bg-[#2a2a2a] text-white border border-gray-600"
              }`}
            >
              IPL
              <img src="./ipl.png" alt="IPL" className="w-8 h-8" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-md text-sm font-medium h-10 flex items-center gap-2 cursor-pointer ${
                activeChat === 1
                  ? "bg-green-500 text-black"
                  : "bg-[#2a2a2a] text-white border border-gray-600"
              }`}
            >
              Sales
              <AiOutlineStock size={24} />
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-4 py-3">
          <AutoChatDemo setActiveChat={setActiveChat} />
        </div>
      </motion.div>
    </div>
  );
}

export default DemoChat;
