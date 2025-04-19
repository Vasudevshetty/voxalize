//eslint-disable-next-line
import { motion } from "framer-motion";
import ChartRenderer from "./ChartRenderer"; // Make sure this points to the correct chart renderer file

const DataVisualization = ({ visualizationData }) => {
  if (
    !visualizationData ||
    !visualizationData.data ||
    visualizationData.data.length === 0
  ) {
    return (
      <div className="text-red-500 text-center p-4">
        Data is incompatible for chart visualization
      </div>
    );
  }

  const { data, recommended_graphs } = visualizationData;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 bg-[#1a2a2a] border border-gray-700 rounded-xl p-4 w-[70%]"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400/50 animate-pulse" />
        <span className="text-xs text-gray-400">Visualization</span>
      </div>

      {/* Render smart chart(s) */}
      <ChartRenderer data={data} recommendedGraphs={recommended_graphs} />
    </motion.div>
  );
};

export default DataVisualization;
