import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line
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

const SUGGESTIONS_LIMIT = 8; // Show 8 suggestions in a 4x2 grid
const COMPLETIONS_LIMIT = 6; // Show 6 completions in a 3x2 grid

// Add animation variants
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

export default function VoiceInputBar({
  completions = [],
  suggestions = [],
  onSuggestionClick,
  inputText,
  setInputText,
  locale,
  setLocale,
  isLoading,
  onSend,
}) {
  const [recording, setRecording] = useState(false);
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
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
      console.error("Microphone access error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setRecording(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-3">
      {/* Suggestions or Completions */}
      <AnimatePresence mode="wait">
        {!recording && (
          <motion.div
            key={inputText ? "completions" : "suggestions"}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mb-4"
          >
            <p className="text-xs text-gray-400 mb-3">
              {inputText ? "Try completing:" : "Try asking:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {(inputText ? completions : suggestions)
                .slice(0, inputText ? COMPLETIONS_LIMIT : SUGGESTIONS_LIMIT)
                .map((item, index) => (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    onClick={() => onSuggestionClick?.(item)}
                    className="text-sm bg-[#1a2a2a] text-gray-300 px-4 py-2 rounded-lg
                              border border-gray-700/50 hover:border-cyan-500/30 
                              hover:bg-[#2a3a3a] transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item}
                  </motion.button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <div className="flex flex-wrap gap-3 items-center bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg px-4 py-3">
        {!recording ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your database..."
              disabled={isLoading}
              className="flex-1 min-w-[200px] bg-[#2a2a2a] text-white px-4 py-2.5
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
          <div className="flex-1 flex items-center justify-center py-2">
            <motion.p
              className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              🎙️ Listening...
            </motion.p>
          </div>
        )}

        <div className="flex gap-3">
          <motion.button
            onClick={recording ? stopRecording : startRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className={`p-3.5 rounded-lg font-medium transition-all duration-300 
                     disabled:opacity-50 disabled:cursor-not-allowed ${
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
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoSend size={20} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
