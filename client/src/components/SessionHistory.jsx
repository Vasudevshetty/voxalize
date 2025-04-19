import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuerySessions } from "../redux/slices/querySession";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMenuOpen } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

const GradientTitle = () => (
  <h1 className="text-4xl font-bold mb-8 relative">
    <span className="bg-clip-text text-transparent bg-gradient-to-tr from-green-400 to-cyan-400">
      Query History
    </span>
  </h1>
);

function SessionHistory({ selectedHistoryId, setSelectedHistoryId }) {
  const dispatch = useDispatch();
  const { sessions, loading, error } = useSelector(
    (state) => state.querySession
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    dispatch(getQuerySessions());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderContent = () => {
    if (loading.fetch) {
      return (
        <div className="flex items-center justify-center h-40">
          <FaSpinner className="animate-spin text-cyan-400" size={24} />
        </div>
      );
    }

    if (error.fetch) {
      return (
        <div className="text-red-400 bg-red-400/10 p-4 rounded-lg text-center">
          {error.fetch}
        </div>
      );
    }

    if (!sessions.length) {
      return (
        <div className="text-gray-400 text-center p-4">
          No query history found
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {sessions.map((session) => {
          const isSelected = selectedHistoryId === session._id;
          const isMenuOpen = openMenuId === session._id;

          return (
            <div key={session._id} className="space-y-1 relative">
              <button
                onClick={() => setSelectedHistoryId(session._id)}
                className={`w-full py-2 px-3 rounded-2xl text-sm flex justify-between items-center transition-all duration-200
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-[#00FF6F]/10 to-transparent border-l-4 border-[#00FF6F] shadow-lg scale-[1.02]"
                      : "bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-400"
                  }`}
              >
                <div className="flex flex-col items-start">
                  <span
                    className={
                      isSelected ? "text-white font-semibold" : "text-gray-300"
                    }
                  >
                    {session.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className="text-lg mb-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(
                      openMenuId === session._id ? null : session._id
                    );
                  }}
                >
                  ...
                </span>
              </button>

              {isMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-3 top-10 z-10 bg-[#1e1e1e] border border-gray-700 rounded-md shadow-md w-40 text-sm"
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-red-400"
                    onClick={() => {
                      // Add delete functionality here
                      setOpenMenuId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {!sidebarOpen && (
        <button
          className="absolute top-6 left-6 z-20 text-white sm:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <MdOutlineMenuOpen size={32} />
        </button>
      )}

      <div
        className={`${
          sidebarOpen ? "w-80" : "w-16"
        } h-screen bg-[#131313] border-r border-gray-800 p-6 flex flex-col transform transition-all duration-300 z-40
        sm:relative sm:w-80 sm:block ${
          !sidebarOpen ? "absolute top-0 left-0 sm:relative" : ""
        }`}
      >
        <div className="flex justify-between mb-12">
          {sidebarOpen ? (
            <button onClick={() => setSidebarOpen(false)} className="sm:hidden">
              <IoIosArrowBack size={32} />
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="sm:hidden">
              <MdOutlineMenuOpen size={32} />
            </button>
          )}
        </div>

        {sidebarOpen && (
          <>
            <div className="text-center tracking-widest">
              <GradientTitle />
            </div>
            <div className="mt-6">{renderContent()}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default SessionHistory;
