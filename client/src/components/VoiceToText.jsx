import React, { useState, useRef } from "react";
import axios from "axios";
//eslint-dsisable-next-line
import { motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Hindi", code: "hi" },
  { label: "Kannada", code: "kn" },
  { label: "Tamil", code: "ta" },
  { label: "Telugu", code: "te" },
];

export default function VoiceInputBar() {
  const [recording, setRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [locale, setLocale] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
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
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
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
        console.error("Error:", err);
        setInputText("⚠️ Error transcribing or translating");
      } finally {
        setIsLoading(false);
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto px-4 py-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Language Selector */}
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              🌐 {lang.label}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Input Field & Mic Button */}
      <motion.div
        className="flex items-center gap-3 border border-gray-300 rounded-xl shadow-md px-4 py-3 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          className="flex-1 text-lg px-2 py-1 outline-none text-gray-900 bg-transparent"
          placeholder="Speak or type your input..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <motion.button
          onClick={recording ? stopRecording : startRecording}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-full shadow-md transition-all duration-300 ${
            recording ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {recording ? (
            <FaMicrophoneSlash size={20} />
          ) : (
            <FaMicrophone size={20} />
          )}
        </motion.button>
      </motion.div>

      {/* Status Message */}
      <div className="text-center">
        {recording && (
          <motion.p
            className="text-red-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎙️ Listening...
          </motion.p>
        )}
        {isLoading && (
          <motion.p
            className="text-blue-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⏳ Processing audio...
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
