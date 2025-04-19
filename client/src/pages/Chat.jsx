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
      // Ensure suggestions are strings
      const formattedSuggestions = results.map((suggestion) =>
        typeof suggestion === "object" ? suggestion.query : suggestion
      );
      setSuggestions(formattedSuggestions);
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
        // Ensure completions are strings
        const formattedCompletions = results.map((completion) =>
          typeof completion === "object" ? completion.query : completion
        );
        setCompletions(formattedCompletions);
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
      await dispatch(getQuerySessionById(sessionId)).unwrap();
      setInputText("");
      setCompletions([]);
    } catch (err) {
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
    <div className="h-screen bg-black flex flex-col">
      <div className="p-4 bg-[#0a1a1a] border-b border-gray-800 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 ml-12"
        >
          Voxalize
        </Link>
        <Link to="/profile" className="flex items-center space-x-4">
          <div className="text-gray-300 max-sm:hidden">
            {currentSession?.user?.email}
          </div>
          <img
            src={
              import.meta.env.VITE_APP_BACKEND_URL +
              currentSession?.user?.profileImage
            }
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence>
          {storedMessages?.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="mx-4 mt-4">
        <VoiceInputBar
          completions={completions}
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          inputText={inputText}
          setInputText={handleVoiceInput}
          locale={locale}
          setLocale={setLocale}
          isLoading={isLoading}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}

export default Chat;
