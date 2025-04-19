import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getQuerySessions } from "../redux/slices/querySession";
import { IoMdClose } from "react-icons/io";
import { MdOutlineMenuOpen } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

const GradientTitle = () => (
  <h1 className="text-2xl font-bold relative flex items-center gap-2">
    <span className="bg-clip-text text-transparent bg-gradient-to-tr from-green-400 to-cyan-400">
      History
    </span>
  </h1>
);

function SessionHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessionId } = useParams();

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

  const handleSessionClick = (id) => {
    navigate(`/chat/${id}`);
  };

  const renderSessions = () => {
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
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
        {sessions.map((session) => {
          const isSelected = session._id === sessionId;
          const isMenuOpen = openMenuId === session._id;

          return (
            <div key={session._id} className="group relative">
              <button
                onClick={() => handleSessionClick(session._id)}
                className={`w-full py-3 px-4 rounded-lg text-sm flex justify-between items-center transition-all
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-green-400/10 to-cyan-400/10 text-white shadow-lg"
                      : "hover:bg-[#2a2a2a] text-gray-300"
                  }`}
              >
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="font-medium truncate w-full">
                    {session.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(
                      openMenuId === session._id ? null : session._id
                    );
                  }}
                >
                  ⋮
                </div>
              </button>

              {isMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-2 top-12 z-10 bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-lg w-40 py-1 text-sm overflow-hidden"
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 transition-colors"
                    onClick={() => {
                      // Add delete logic here
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
    <>
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <MdOutlineMenuOpen size={24} />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-[#131313] border-r border-gray-800 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0 w-80" : "-translate-x-full"} z-40`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <GradientTitle />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <div className="p-4">{renderSessions()}</div>
      </aside>
    </>
  );
}

export default SessionHistory;
