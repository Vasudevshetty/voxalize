import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Hindi", code: "hi" },
  { label: "Kannada", code: "kn" },
  { label: "Tamil", code: "ta" },
  { label: "Telugu", code: "te" },
];

const SUGGESTIONS_LIMIT = 4;
const COMPLETIONS_LIMIT = 3;

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const LoadingText = ({ text }) => (
  <div className="text-base relative inline-block">
    <span
      className="inline-block animate-gradient bg-gradient-to-r from-gray-500 via-white to-gray-500 
      text-transparent bg-clip-text bg-[length:200%_100%] font-medium tracking-wide
      drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
    >
      {text}
    </span>
    <div
      className="absolute top-0 left-0 right-0 h-full pointer-events-none
      bg-gradient-to-r from-transparent via-white/20 to-transparent 
      animate-shimmer opacity-50"
    />
  </div>
);

const ErrorMessage = ({ message, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="absolute -top-16 left-0 right-0 mx-4"
  >
    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center justify-between">
      <span className="text-red-400 text-sm">{message}</span>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-300 ml-3"
      >
        ✕
      </button>
    </div>
  </motion.div>
);

export default function VoiceInputBar({
  completions = [],
  suggestions = [],
  onSuggestionClick,
  inputText,
  setInputText,
  locale,
  setLocale,
  isLoading,
  isSuggestionsLoading,
  isCompletionsLoading,
  onSend,
}) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend(inputText);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputText, onSend]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onerror = () => {
        setError("Recording error occurred. Please try again.");
        stopRecording();
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "voice.webm", { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", locale);

        try {
          const res = await axios.post(
            "https://studysyncs.xyz/services/speech-to-text",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          let spokenText = res.data.transcription;

          if (locale !== "en") {
            const translateRes = await axios.post(
              "https://studysyncs.xyz/services/translate",
              null,
              {
                params: {
                  text: spokenText,
                  target_lang: "en",
                },
              }
            );
            spokenText = translateRes.data.translated_text;
          }

          setInputText(spokenText);
        } catch (err) {
          console.error("Voice processing error:", err);
          setInputText("");
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      let errorMessage = "Failed to access microphone.";
      if (err.name === "NotAllowedError") {
        errorMessage =
          "Microphone access denied. Please allow microphone access.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No microphone found. Please connect a microphone.";
      }
      setError(errorMessage);
      console.error("Microphone access error:", err);
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && recording) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    } catch (err) {
      setError("Error stopping recording. Please refresh the page.");
      console.error("Stop recording error:", err);
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      <AnimatePresence>
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}
      </AnimatePresence>

      {(isLoading || isSuggestionsLoading || isCompletionsLoading) && (
        <div className="absolute -top-8 left-0 right-0 text-center">
          <LoadingText
            text={
              isLoading
                ? "Processing your request..."
                : isSuggestionsLoading
                ? "Loading suggestions..."
                : "Generating completions..."
            }
          />
        </div>
      )}

      {/* Floating Suggestions Box */}
      <AnimatePresence mode="wait">
        {!recording &&
          !isLoading &&
          !isSuggestionsLoading &&
          !isCompletionsLoading && (
            <motion.div
              key={inputText ? "completions" : "suggestions"}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mb-2 backdrop-blur-md bg-[#1a1a1a]/80 
              border-2 border-dotted border-cyan-500/30 rounded-xl 
              shadow-[0_0_15px_rgba(34,211,238,0.1)] p-4 
              hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] 
              transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400/50 animate-pulse" />
                <p className="text-xs text-gray-400">
                  {inputText ? "Try completing:" : "Try asking:"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(inputText ? completions : suggestions)
                  .slice(0, inputText ? COMPLETIONS_LIMIT : SUGGESTIONS_LIMIT)
                  .map((item, index) => {
                    const displayText =
                      typeof item === "object" ? item.query : item;
                    return (
                      <motion.button
                        key={index}
                        variants={itemVariants}
                        onClick={() => onSuggestionClick?.(displayText)}
                        className="text-sm bg-[#2a2a2a]/80 text-gray-300 px-4 py-2 rounded-lg
                        border border-cyan-500/10 hover:border-cyan-500/30 
                        hover:bg-[#2a3a3a] hover:shadow-[0_0_10px_rgba(34,211,238,0.1)]
                        transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {displayText}
                      </motion.button>
                    );
                  })}
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Input Bar */}
      <div className="flex flex-wrap gap-2 items-center px-2 py-3">
        {!recording ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your database..."
              disabled={isLoading}
              className="flex-1  min-w-[200px]   bg-[#2a2a2a] text-white px-4 py-2.5
                         rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-400
                         disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              disabled={recording || isLoading}
              className="bg-[#1a2a2a] text-gray-300 rounded-lg px-4 py-2.5
                         border border-gray-700 focus:outline-none focus:border-cyan-400
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center py-2 relative">
            <motion.p
              className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              🎙️ Listening...
            </motion.p>
            <div className="absolute bottom-full mb-2 flex items-center justify-center w-full z-10">
              <Wave />
            </div>
          </div>
        )}

        <div className="flex gap-3 ">
          <motion.button
            onClick={recording ? stopRecording : startRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className={`p-3.5 rounded-lg font-medium transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                         recording
                           ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                           : "bg-gradient-to-r from-green-400 to-cyan-400 text-black hover:opacity-90"
                       }`}
          >
            {recording ? (
              <FaMicrophoneSlash size={20} />
            ) : (
              <FaMicrophone size={20} />
            )}
          </motion.button>

          {!recording && inputText && (
            <motion.button
              onClick={() => onSend(inputText)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className="p-3.5 rounded-lg font-medium bg-gradient-to-r from-green-400 to-cyan-400 
                         text-black hover:opacity-90 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <IoSend size={20} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
const Wave = () => {
  const bars = Array.from({ length: 12 });

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes moveUp {
        0%, 100% { height: 40%; transform: translateY(0); }
        50% { height: 90%; transform: translateY(-6px); }
      }

      @keyframes moveDown {
        0%, 100% { height: 40%; transform: translateY(0); }
        50% { height: 90%; transform: translateY(6px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getAnimationStyle = (index) => {
    const isMovingUp = index % 2 === 0;
    const animation = isMovingUp ? "moveUp" : "moveDown";

    let baseHeight;
    if (index % 6 === 0 || index % 6 === 5) baseHeight = "20px";
    else if (index % 6 === 1 || index % 6 === 4) baseHeight = "28px";
    else baseHeight = "36px";

    return {
      animation: `${animation} 1.3s infinite ease-in-out`,
      animationDelay: `${index * 0.1}s`,
      height: baseHeight,
    };
  };

  return (
    <div className="flex items-end justify-center h-16 w-full px-4">
      {bars.map((_, index) => (
        <div
          key={index}
          className="w-1.5 mx-0.5 rounded-full bg-gradient-to-b from-green-400 to-blue-500"
          style={getAnimationStyle(index)}
        />
      ))}
    </div>
  );
};
