import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const iplChat = [
  { sender: "User", message: "Hi, can you tell me about Virat Kohli?" },
  {
    sender: "Bot",
    message: "Virat Kohli is an Indian cricketer known for his aggressive batting.",
  },
  { sender: "User", message: "How many centuries has he scored in IPL?" },
  {
    sender: "Bot",
    message: "As of 2024, Kohli has scored 7 centuries in the IPL.",
  },
];

const salesChat = [
  { sender: "User", message: "Hey, how are this quarter's sales?" },
  {
    sender: "Bot",
    message: "Sales increased by 15% this quarter compared to the last.",
  },
  { sender: "User", message: "Which region performed the best?" },
  {
    sender: "Bot",
    message: "The North region had the highest growth at 22%.",
  },
];

const datasets = [iplChat, salesChat];

const AutoChatDemo = ({ setActiveChat }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [datasetIndex, setDatasetIndex] = useState(0);
  const chatRef = useRef(null);

  useEffect(() => {
    let index = 0;
    const currentChat = datasets[datasetIndex];
    setVisibleMessages([currentChat[0]]);
    setActiveChat(datasetIndex); // Inform parent about the dataset

    const interval = setInterval(() => {
      if (index < currentChat.length - 1) {
        index++;
        setVisibleMessages((prev) => [...prev, currentChat[index]]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDatasetIndex((prev) => (prev + 1) % datasets.length);
        }, 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [datasetIndex, setActiveChat]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleMessages]);

  return (
    <div
      ref={chatRef}
      className="flex flex-col gap-3 h-[200px] overflow-y-auto p-3 rounded-lg custom-scrollbar"
    >
      {visibleMessages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`px-4 py-2 rounded-md max-w-[80%] whitespace-pre-line ${
            msg.sender === "User"
              ? "bg-cyan-500 text-black self-end ml-auto"
              : "bg-gray-800 text-white self-start"
          }`}
        >
          {msg.message}
        </motion.div>
      ))}
    </div>
  );
};

export default AutoChatDemo;
