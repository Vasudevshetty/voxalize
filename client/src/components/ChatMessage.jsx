// eslint-disable-next-line
import { motion } from "framer-motion";
import SQLCard from "./SQLCard";
import { formatDistanceToNow } from "date-fns";

const ChatMessage = ({ message }) => {
  const isUser = message.user && message.user.username;

  // Render SQLCard if it's a response message
  if (message.sqlQuery && message.sqlResponse) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full flex justify-center px-4 my-4"
      >
        <SQLCard
          query={message.requestQuery}
          sqlQuery={message.sqlQuery}
          sqlResponse={message.sqlResponse}
          summary={message.summary}
          thoughtProcess={message.thoughtProcess}
          executionTime={message.executionTime}
          timestamp={message.createdAt}
        />
      </motion.div>
    );
  }

  // Regular user/AI messages
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`w-full px-4 my-2 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[70%] flex flex-col gap-1">
        {isUser && (
          <span className="text-xs text-gray-400 px-2">
            {message.user.username}
          </span>
        )}
        <div
          className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-r from-green-400 to-cyan-400 text-black"
              : "text-white bg-transparent border border-gray-700"
          }`}
        >
          {message.requestQuery || message.content}
        </div>
        <span className="text-xs text-gray-500 px-2">
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
