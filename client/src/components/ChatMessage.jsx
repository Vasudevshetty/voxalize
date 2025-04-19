// eslint-disable-next-line
import { motion } from "framer-motion";
import SQLCard from "./SQLCard";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineUser, AiOutlineRobot } from "react-icons/ai"; // Icon imports
import { useState } from "react";
import { getGraphRecommendations } from "../utils/service";
import DataVisualization from "./DataVisualization";

const ChatMessage = ({ message }) => {
  const [visualizationData, setVisualizationData] = useState(null);
  const [isLoadingViz, setIsLoadingViz] = useState(false);
  const [vizError, setVizError] = useState(null);
  const isUser = message.user && message.user.username;

  const handleVisualize = async () => {
    if (!message.sqlResponse) return;

    setIsLoadingViz(true);
    setVizError(null);

    try {
      const data = await getGraphRecommendations(message.sqlResponse);
      setVisualizationData(data);
    } catch (err) {
      setVizError("Failed to generate visualization");
      console.error("Visualization error:", err);
    } finally {
      setIsLoadingViz(false);
    }
  };

  // Render SQLCard if it's a response message
  if (message.sqlQuery && message.sqlResponse) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full flex flex-col items-center px-4 my-4"
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

        {/* Visualization Button */}
        <motion.button
          onClick={handleVisualize}
          disabled={isLoadingViz}
          className="mt-2 px-4 py-2 bg-[#1a2a2a] border border-cyan-500/30 
            rounded-lg text-sm text-cyan-400 hover:bg-[#2a3a3a] 
            transition-all duration-200 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoadingViz ? "Generating..." : "Visualize Data"}
        </motion.button>

        {/* Error Message */}
        {vizError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-red-400"
          >
            {vizError}
          </motion.div>
        )}

        {/* Visualization Component */}
        {visualizationData && (
          <DataVisualization
            visualizationData={{
              data: message.sqlResponse,
              recommended_graphs: visualizationData.recommended_graphs,
            }}
          />
        )}
      </motion.div>
    );
  }

  // Regular user/AI messages
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`w-full px-4 my-4 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[70%] flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {isUser ? (
            <AiOutlineUser className="text-green-400 w-5 h-5" />
          ) : (
            <AiOutlineRobot className="text-blue-400 w-5 h-5" />
          )}
          {isUser && (
            <span className="text-xs text-gray-400 px-2">
              {message.user.username}
            </span>
          )}
        </div>

        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-r from-green-400 to-cyan-400 text-black"
              : "text-white bg-transparent border border-gray-700"
          }`}
        >
          {message.requestQuery || message.content}
        </div>

        {/* Thought process section */}
        {message.thoughtProcess && (
          <div className="bg-gray-800 p-3 rounded-xl mt-2">
            <span className="text-xs text-gray-400">Thought Process:</span>
            <p className="text-sm text-white">{message.thoughtProcess}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 px-2">
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
