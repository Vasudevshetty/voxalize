import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGlobe,
  FaMicrophone,
  FaRobot,
  FaWhatsapp,
  FaChartBar,
  FaBrain,
} from "react-icons/fa";

function Features() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  // Even faster auto-rotation through features (1 second instead of 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedFeature((prev) => (prev + 1) % features.length);
    }, 1500); // Changed from 2500ms to 1000ms for much faster rotation

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Multi-Language Support",
      icon: <FaGlobe className="text-5xl text-blue-400" />,
      description:
        "Harness internationalization with dynamic translation using i18n frameworks and real-time APIs to reach a global audience.",
    },
    {
      title: "Voice-Enabled Interaction",
      icon: <FaMicrophone className="text-5xl text-pink-400" />,
      description:
        "Speech recognition and synthesis through Web Speech API for hands-free, intuitive access.",
    },
    {
      title: "Autonomous AI Agent",
      icon: <FaRobot className="text-5xl text-purple-400" />,
      description:
        "24/7 intelligent assistance powered by large language models for autonomous query resolution.",
    },
    {
      title: "WhatsApp Integration",
      icon: <FaWhatsapp className="text-5xl text-green-400" />,
      description:
        "Use WhatsApp Business API for real-time communication and seamless workflows.",
    },
    {
      title: "Interactive Data Visualization",
      icon: <FaChartBar className="text-5xl text-yellow-400" />,
      description:
        "Visuals with Chart.js and D3.js to convert data into insights.",
    },
    {
      title: "LLM-Powered Intelligence",
      icon: <FaBrain className="text-5xl text-red-400" />,
      description:
        "Adaptive behavior across the app using cutting-edge large language models.",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-900 via-gray-900 to-purple-900 py-12 md:py-24 w-full md:w-[90vw]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-center mb-10 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-500">
              Voice-Form Features
            </span>
          </h2>
          <p className="text-gray-300 mt-4 md:mt-6 max-w-2xl mx-auto text-base md:text-lg">
            Explore the future of interaction with our cutting-edge capabilities
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
          {/* Feature Showcase - Fixed height and width */}
          <div className="w-full lg:w-1/2">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }} // Faster transition to match faster rotation
              className="bg-gray-800 bg-opacity-30 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-gray-700 shadow-lg h-auto md:h-64 w-full"
            >
              <div className="flex items-center mb-4 md:mb-6">
                <div className="p-2 md:p-4 rounded-lg bg-gray-800">
                  {features[selectedFeature].icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white ml-4">
                  {features[selectedFeature].title}
                </h3>
              </div>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {features[selectedFeature].description}
              </p>
            </motion.div>
          </div>

          {/* Feature Selector */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`hexagon cursor-pointer ${
                    selectedFeature === index ? "selected" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFeature(index)}
                >
                  <div
                    className={`hexagon-inner flex items-center justify-center p-2 md:p-6 ${
                      selectedFeature === index
                        ? "bg-gradient-to-br from-blue-500 to-purple-600"
                        : "bg-gray-800 bg-opacity-50 hover:bg-opacity-70"
                    }`}
                  >
                    <motion.div
                      animate={{
                        scale: selectedFeature === index ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: 0.5, // Faster animation for the pulsing effect
                        repeat: selectedFeature === index ? Infinity : 0,
                        repeatType: "reverse",
                      }}
                      className="text-3xl md:text-5xl"
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for hexagon shape - Responsive dimensions */}
      <style jsx>{`
        .hexagon {
          position: relative;
          width: 80px;
          height: 90px;
          clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
          );
          transition: all 0.3s ease;
        }

        .hexagon-inner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: all 0.3s ease;
        }

        .hexagon.selected {
          transform: translateY(-5px);
          filter: drop-shadow(0 10px 8px rgb(59 130 246 / 0.5));
        }

        @media (min-width: 768px) {
          .hexagon {
            width: 120px;
            height: 130px;
          }
        }

        @media (max-width: 480px) {
          .hexagon {
            width: 70px;
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
}

export default Features;
