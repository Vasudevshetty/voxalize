import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDatabaseById } from "../redux/slices/database";
import { getQuerySessionById } from "../redux/slices/querySession";
import {
  createQueryMessage,
  getSessionMessages,
} from "../redux/slices/queryMessage";
import { fetchSuggestions, fetchCompletions } from "../utils/service";
import { AnimatePresence } from "framer-motion";
import ChatMessage from "../components/ChatMessage";
import debounce from "lodash/debounce";

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
  const { currentDatabase } = useSelector((state) => state.database);
  const { currentSession } = useSelector((state) => state.querySession);
  const { messages: storedMessages } = useSelector(
    (state) => state.queryMessage
  );

  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [locale, setLocale] = useState("en");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Fetch session and database on mount
  useEffect(() => {
    if (sessionId) {
      dispatch(getQuerySessionById(sessionId))
        .unwrap()
        .then((session) => {
          if (session.database) {
            dispatch(getDatabaseById(session.database._id));
          }
        });
      dispatch(getSessionMessages(sessionId));
    }
  }, [sessionId, dispatch]);

  // Fetch suggestions when database loads
  useEffect(() => {
    if (currentDatabase) {
      handleFetchSuggestions();
    }
  }, [currentDatabase]);

  const handleFetchSuggestions = async () => {
    if (!currentDatabase) return;

    const config = {
      dbtype: currentDatabase.dbType,
      host: currentDatabase.host,
      user: currentDatabase.username,
      password: currentDatabase.password,
      dbname: currentDatabase.database,
    };

    try {
      const results = await fetchSuggestions(config);
      setSuggestions(results);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  const fetchCompletionsDebounced = useCallback(
    debounce(async (query) => {
      if (!currentDatabase || !query) return;

      const config = {
        dbtype: currentDatabase.dbType,
        host: currentDatabase.host,
        user: currentDatabase.username,
        password: currentDatabase.password,
        dbname: currentDatabase.database,
      };

      try {
        const results = await fetchCompletions(query, config);
        setCompletions(results);
      } catch (err) {
        console.error("Completion error:", err);
      }
    }, 500),
    [currentDatabase]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [storedMessages]);

  const handleSend = async (text = inputText) => {
    if (!text.trim() || !currentDatabase || !sessionId) return;

    setIsLoading(true);

    try {
      await dispatch(
        createQueryMessage({
          sessionId,
          databaseId: currentDatabase._id,
          requestQuery: text,
          user: currentSession?.user,
        })
      ).unwrap();

      setInputText("");
      setCompletions([]);
    } catch (err) {
      console.error("Send error:", err);
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
          {storedMessages?.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-700 p-4 bg-[#1a1a1a]">
        <div className="flex items-start gap-4 flex-col sm:flex-row">
          <div className="flex gap-4 w-full">
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
                const value = e.target.value;
                setInputText(value);
                fetchCompletionsDebounced(value);
              }}
              placeholder="Ask anything about your database..."
              className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-700"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className={`bg-gradient-to-r from-green-400 to-cyan-400 text-black px-5 py-2 rounded-lg font-medium ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>

          {/* Show auto completions */}
          {completions.length > 0 && (
            <div className="w-full bg-[#1a2a2a] border border-gray-700 rounded-lg p-2 mt-2 space-y-2">
              <p className="text-gray-400 text-sm">Suggestions:</p>
              {completions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(item)}
                  className="block text-left w-full text-gray-200 hover:bg-[#2a3a3a] p-2 rounded-md transition"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Show recommended queries from DB */}
        {suggestions.length > 0 && (
          <div className="mt-4 text-sm text-gray-400">
            <p className="mb-2">Recommended Queries:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(suggestion)}
                  className="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
