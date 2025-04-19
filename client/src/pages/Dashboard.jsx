import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDatabases } from "../redux/slices/database";
import Modal from "../components/Modal";
import { FaDatabase, FaPlus, FaSpinner } from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";
import { GrMysql } from "react-icons/gr";
import { useAuth } from "../context/Auth";
import { createQuerySession } from "../redux/slices/querySession";
import { HiOutlineLogout } from "react-icons/hi";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { databases, loading, error } = useSelector((state) => state.database);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getDatabases());
  }, [dispatch]);

  const handleClick = (id) => {
    setSelectedDatabase((prev) => (prev === id ? null : id));
  };

  const handleVoiceDB = async (id) => {
    try {
      const sessionData = {
        user: user._id,
        database: id,
        title: `Session ${new Date().toLocaleDateString()}`,
        description: "Voice query session",
      };
      const response = await dispatch(createQuerySession(sessionData)).unwrap();
      navigate(`/chat/${response._id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  if (loading.fetch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-cyan-400" />
      </div>
    );
  }

  if (error.fetch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">
          {error.fetch}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-black to-gray-900 flex flex-col">
      {/* Header - Fixed height */}
      <div className="p-4 bg-[#0a1a1a] border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400"
          >
            Voxalize
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-4">
              <div className="text-gray-300 max-sm:hidden">{user?.email}</div>
              <img
                src={import.meta.env.VITE_APP_BACKEND_URL + user?.profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-700"
              />
            </Link>
            <button
              onClick={logout}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 rounded-lg"
            >
              <HiOutlineLogout size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            Your Databases
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {databases.map((db) => (
              <div
                key={db._id}
                onClick={() => handleClick(db._id)}
                className={`relative group cursor-pointer rounded-xl px-6 py-8 
                  backdrop-blur-sm border-2 flex flex-col items-center text-center
                  ${
                    selectedDatabase === db._id
                      ? "border-cyan-400 bg-[#0a1a1a]/80"
                      : "border-gray-700/50 hover:border-cyan-500/30 bg-[#0a1a1a]/50"
                  }
                  transition-all duration-300 transform hover:scale-[1.02]
                  hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]`}
              >
                {/* Icon - large */}
                <div className="text-6xl text-cyan-400 mb-4">
                  {db.dbType === "mysql" ? <GrMysql /> : <BiLogoPostgresql />}
                </div>

                {/* DB Name */}
                <h3 className="text-2xl font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {db.database.toUpperCase()}
                </h3>

                {/* Created Date */}
                <div className="text-gray-400 text-sm flex items-center justify-center mb-4">
                  <FaDatabase className="mr-2 text-cyan-400" />
                  {new Date(db.createdAt).toLocaleDateString()}
                </div>

                {/* Drop-down button */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out w-full ${
                    selectedDatabase === db._id
                      ? "max-h-24 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <button
                    onClick={() => handleVoiceDB(db._id)}
                    className="w-full cursor-pointer bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-xl p-2 mt-2 hover:opacity-90 transition-all"
                  >
                    VoiceDB
                  </button>
                </div>
              </div>
            ))}

            {/* Create New DB Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative rounded-xl p-6 border-2 border-dashed 
                backdrop-blur-sm bg-[#0a1a1a]/50
                border-gray-700/50 hover:border-cyan-500/30
                transition-all duration-300 group
                flex flex-col items-center justify-center min-h-[200px]
                hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            >
              <FaPlus className="text-4xl text-gray-500 group-hover:text-cyan-400 transition-colors mb-2" />
              <span className="text-gray-500 group-hover:text-cyan-400 transition-colors">
                Create New Database
              </span>
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Dashboard;
