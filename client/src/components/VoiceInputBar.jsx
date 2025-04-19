import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Hindi", code: "hi" },
  { label: "Kannada", code: "kn" },
  { label: "Tamil", code: "ta" },
  { label: "Telugu", code: "te" },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function VoiceInputBar() {
  const [recording, setRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [locale, setLocale] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        console.log("Enter pressed with text:", inputText);
        // You can trigger a function here
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputText]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsLoading(true);
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
          console.error("Transcription error:", err);
          setInputText("⚠️ Failed to transcribe or translate");
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-4 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-wrap gap-4 items-center bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg px-4 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {!recording && !isLoading ? (
          <>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your database..."
              className="flex-1 min-w-[200px] bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-400"
            />

            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="bg-[#1a2a2a] text-gray-300 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-cyan-400"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <motion.p
              className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {recording && "🎙️ Listening..."}
              {isLoading && "⏳ Processing audio..."}
            </motion.p>
          </div>
        )}

        <motion.button
          onClick={recording ? stopRecording : startRecording}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-lg font-medium transition-all duration-300 ${
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
      </motion.div>

      {/* Optional: Show a message when text is ready */}
      {!recording && !isLoading && inputText && (
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-gray-400">
            Your voice input has been processed ✨
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
