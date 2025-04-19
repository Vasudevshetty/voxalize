// eslint-disable-next-line
import { motion } from "framer-motion";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

const SQLCard = ({
  query,
  sqlQuery,
  sqlResponse,
  summary,
  thoughtProcess,
  executionTime,
  timestamp,
}) => {
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full md:max-w-4xl bg-[#1a2a2a] border border-gray-700 rounded-xl shadow-lg p-4 space-y-4"
    >
      {/* User Query */}
      <div className="text-gray-400 text-sm">
        <p className="font-medium mb-1">User Query:</p>
        <p className="text-white">{query}</p>
      </div>

      {/* SQL Query */}
      <div className="bg-[#0a1a1a] rounded-lg p-3">
        <pre className="text-cyan-400 text-xs md:text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <code className="whitespace-pre-wrap break-words">{sqlQuery}</code>
        </pre>
      </div>

      {/* SQL Response Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 text-sm text-left">
          <thead className="bg-[#2a3a3a] text-gray-300 uppercase text-xs">
            <tr>
              {sqlResponse[0] &&
                Object.keys(sqlResponse[0]).map((key, index) => (
                  <th key={index} className="px-3 py-2">
                    {key.replace(/_/g, " ")}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sqlResponse.map((row, i) => (
              <tr key={i} className="hover:bg-[#2a3a3a]">
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-3 py-2 text-gray-300">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="text-gray-300 text-sm">
        <p>{summary}</p>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <span>Execution time: {(executionTime / 1000).toFixed(2)}s</span>
        <button
          onClick={() => setShowThoughtProcess(!showThoughtProcess)}
          className="text-cyan-400 hover:text-cyan-300"
        >
          {showThoughtProcess ? "Hide" : "Show"} thought process
        </button>
        <span>
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </span>
      </div>

      {/* Thought Process Toggle Section */}
      {showThoughtProcess && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#0a1a1a] rounded-lg p-3"
        >
          <pre className="text-gray-400 text-xs md:text-sm whitespace-pre-wrap break-words">
            {thoughtProcess}
          </pre>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SQLCard;
