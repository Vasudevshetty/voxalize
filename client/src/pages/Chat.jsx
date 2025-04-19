/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
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
import VoiceInputBar from "../components/VoiceInputBar";
import debounce from "lodash/debounce";

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
  const [isSuggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isCompletionsLoading, setCompletionsLoading] = useState(false);
  const [error, setError] = useState(null);

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

    setSuggestionsLoading(true);
    setError(null);

    const config = {
      dbtype: currentDatabase.dbType,
      host: currentDatabase.host,
      user: currentDatabase.username,
      password: currentDatabase.password,
      dbname: currentDatabase.database,
    };

    try {
      const results = await fetchSuggestions(config);
      const formattedSuggestions = results.map((suggestion) =>
        typeof suggestion === "object" ? suggestion.query : suggestion
      );
      setSuggestions(formattedSuggestions);
    } catch (err) {
      setError("Failed to load suggestions. Please try again.");
      console.error("Suggestion error:", err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const fetchCompletionsDebounced = useCallback(
    debounce(async (query) => {
      if (!currentDatabase || !query) return;

      setCompletionsLoading(true);
      setError(null);

      const config = {
        dbtype: currentDatabase.dbType,
        host: currentDatabase.host,
        user: currentDatabase.username,
        password: currentDatabase.password,
        dbname: currentDatabase.database,
      };

      try {
        const results = await fetchCompletions(query, config);
        const formattedCompletions = results.map((completion) =>
          typeof completion === "object" ? completion.query : completion
        );
        setCompletions(formattedCompletions);
      } catch (err) {
        setError("Failed to generate completions. Please try again.");
        console.error("Completion error:", err);
      } finally {
        setCompletionsLoading(false);
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
    setError(null);

    try {
      await dispatch(
        createQueryMessage({
          sessionId,
          databaseId: currentDatabase._id,
          requestQuery: text,
          user: currentSession?.user,
        })
      ).unwrap();
      await dispatch(getQuerySessionById(sessionId)).unwrap();
      setInputText("");
      setCompletions([]);
    } catch (err) {
      const errorMessage =
        err.status === 500
          ? "Server error. Please try again."
          : "Failed to send message. Please try again.";
      setError(errorMessage);
      console.error("Send error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (text) => {
    setInputText(text);
    fetchCompletionsDebounced(text);
  };

  const handleSuggestionClick = (text) => {
    setInputText(text);
    handleSend(text);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col">
      <div className="px-6 py-3 bg-[#0a1a1a]/90 border-b border-gray-800 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10">
        <Link
          to="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-300 hover:to-cyan-300 transition-colors"
        >
          Voxalize
        </Link>
        <Link
          to="/profile"
          className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
        >
          <div className="text-gray-300 max-sm:hidden font-medium">
            {currentSession?.user?.email}
          </div>
          <img
            src={
              import.meta.env.VITE_APP_BACKEND_URL +
              currentSession?.user?.profileImage
            }
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-700"
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence>
          {storedMessages?.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />

        {error && (
          <div className="max-w-[70%] mx-auto bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4 text-red-100 flex items-center justify-between shadow-lg">
            <div ref={messagesEndRef} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-300 hover:text-red-100 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="mx-4 mb-4 mt-2">
        <VoiceInputBar
          completions={completions}
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          inputText={inputText}
          setInputText={handleVoiceInput}
          locale={locale}
          setLocale={setLocale}
          isLoading={isLoading}
          isSuggestionsLoading={isSuggestionsLoading}
          isCompletionsLoading={isCompletionsLoading}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}

export default Chat;
