import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDatabaseById } from "../redux/slices/database";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import ChatMessage from "../components/ChatMessage";

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Hindi", code: "hi" },
  { label: "Kannada", code: "kn" },
  { label: "Tamil", code: "ta" },
  { label: "Telugu", code: "te" },
];

function Chat() {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const { currentDatabase, loading } = useSelector((state) => state.database);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [recording, setRecording] = useState(false);
  const [locale, setLocale] = useState("en");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(getDatabaseById(databaseId));
  }, [databaseId]);

  useEffect(() => {
    if (currentDatabase?.dbType && currentDatabase?.host) {
      fetchSuggestions();
    }
  }, [currentDatabase]);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.post(
        `https://studysyncs.xyz/services/recommend`,
        {
          database_config: {
            dbtype: currentDatabase?.dbType,
            host: currentDatabase?.host,
            user: currentDatabase?.username,
            password: currentDatabase?.password,
            dbname: currentDatabase?.database,
          },
        }
      );
      setSuggestions(res.data.recommended_queries);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  const fetchCompletions = async (query) => {
    try {
      const res = await axios.post(
        `https://studysyncs.xyz/services/search-completions`,
        {
          term: query,
          limit: 14,
          database_config: {
            dbtype: currentDatabase.dbType,
            host: currentDatabase.host,
            user: currentDatabase.username,
            password: currentDatabase.password,
            dbname: currentDatabase.database,
          },
        }
      );
      setCompletions(res.data.completions);
    } catch (err) {
      console.error("Failed to fetch completions:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = { type: "user", content: inputText };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await axios.post(`https://studysyncs.xyz/services/chat`, {
        query_request: { query: inputText },
        database_config: {
          dbtype: currentDatabase.dbType,
          host: currentDatabase.host,
          user: currentDatabase.username,
          password: currentDatabase.password,
          dbname: currentDatabase.database,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: res.data,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "error", content: "Failed to process query" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="p-4 bg-[#0a1a1a] border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
          VoiceDB Chat
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-700 p-4 bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="bg-[#1a2a2a] text-gray-300 rounded-lg px-3 py-2 border border-gray-700"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (e.target.value) fetchCompletions(e.target.value);
            }}
            placeholder="Ask anything about your database..."
            className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-700"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-gradient-to-r from-green-400 to-cyan-400 text-black px-5 py-2 rounded-lg font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
