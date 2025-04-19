import { motion } from "framer-motion";
import SQLCard from "./SQLCard";

const ChatMessage = ({ message }) => {
  const isUser = message.type === "user";

  if (message.type === "bot" && typeof message.content === "object") {
    return <SQLCard data={message.content} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isUser
            ? "bg-gradient-to-r from-green-400 to-cyan-400 text-black"
            : "bg-[#1a2a2a] text-white"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
