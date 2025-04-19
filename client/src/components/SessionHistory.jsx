import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getQuerySessions } from "../redux/slices/querySession";
import { IoMdClose } from "react-icons/io";
import { FaAngleLeft, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

const GradientTitle = () => (
  <h1 className="text-2xl font-bold relative flex items-center gap-2">
    <span className="bg-clip-text text-transparent bg-gradient-to-tr from-green-400 to-cyan-400">
      History
    </span>
  </h1>
);

function SessionHistory({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sessionId } = useParams();

  const { sessions, loading, error } = useSelector(
    (state) => state.querySession
  );

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRefs = useRef({});

  useEffect(() => {
    dispatch(getQuerySessions());
  }, [dispatch]);

  const handleMenuClick = (e, id) => {
    e.stopPropagation();
    const rect = menuButtonRefs.current[id].getBoundingClientRect();
    setMenuPosition({
      top: rect.top + rect.height + 8,
      left: rect.left - 20,
    });
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !Object.values(menuButtonRefs.current).some((ref) =>
          ref?.contains(e.target)
        )
      ) {
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

          return (
            <div key={session._id} className="group relative">
              <button
                onClick={() => handleSessionClick(session._id)}
                className={`w-full cursor-pointer py-3 px-4 rounded-lg text-sm flex justify-between items-center transition-all
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-green-400/10 to-cyan-400/10 text-white shadow"
                      : "hover:bg-[#2a2a2a] text-gray-300"
                  }`}
              >
                <div className="flex flex-col items-start overflow-hidden text-left max-w-[85%]">
                  <span className="font-medium truncate w-full">
                    {session.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div
                  ref={(el) => (menuButtonRefs.current[session._id] = el)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                  onClick={(e) => handleMenuClick(e, session._id)}
                >
                  <BsThreeDotsVertical size={16} />
                </div>
              </button>
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
          className="fixed top-4 left-4 z-50 p-2 rounded-lg cursor-pointer transition-colors text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <MdMenu size={24} color="white" />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-[#131313] border-r border-gray-800 transition-all duration-300 z-40
          ${sidebarOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"}`}
      >
        <div className="p-4 flex items-center justify-center relative border-b border-gray-800">
          <GradientTitle />
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white cursor-pointer rounded-lg transition-colors"
          >
            <FaAngleLeft size={20} />
          </button>
        </div>

        <div className="p-4">{renderSessions()}</div>
      </aside>

      {openMenuId && (
        <div
          className="fixed z-50 w-10 bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-lg p-1 flex flex-col items-center space-y-1"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button
            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-500/10 transition"
            onClick={() => {
              // your delete logic
              setOpenMenuId(null);
            }}
            title="Delete"
          >
            <FaTrashAlt size={14} />
          </button>
        </div>
      )}
    </>
  );
}

export default SessionHistory;
