import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDatabases } from "../redux/slices/database";
import Modal from "./Modal";
import { FaDatabase, FaPlus, FaSpinner } from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";
import { GrMysql } from "react-icons/gr";

function Databases() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { databases, loading, error } = useSelector((state) => state.database);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getDatabases());
  }, [dispatch]);

  const handleClick = (id) => {
    setSelectedDatabase((prev) => (prev === id ? null : id));
  };

  const handleVoiceDB = (id) => {
    navigate(`/chat/${id}`);
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
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 right-0 m-4 z-10">
        <Link
          to="/profile"
          className="h-14 w-14 block border-2 border-gray-700 hover:border-cyan-400 transition-colors overflow-hidden rounded-full shadow-lg"
        >
          <img
            src="/default-avatar.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
          Your Databases
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {databases.map((db) => (
            <div
              key={db._id}
              onClick={() => handleClick(db._id)}
              className={`relative group cursor-pointer rounded-2xl px-6 py-8 border-2 flex flex-col items-center text-center
                ${
                  selectedDatabase === db._id
                    ? "border-cyan-400 bg-cyan-400/5"
                    : "border-gray-700 hover:border-gray-600"
                }
                transition-all duration-300 transform hover:scale-[1.02]`}
            >
              {/* Icon - large */}
              <div className="text-6xl text-cyan-400 mb-4">
                {db.dbType === "mysql" ? <GrMysql /> : <BiLogoPostgresql />}
              </div>

              {/* DB Name */}
              <h3 className="text-2xl font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                {db.name}
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
                  className="w-full bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-xl p-2 mt-2 hover:opacity-90 transition-all"
                >
                  VoiceDB
                </button>
              </div>
            </div>
          ))}

          {/* Create New DB Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative rounded-2xl p-6 border-2 border-dashed border-gray-700 
              hover:border-cyan-400 transition-all duration-300 group
              flex flex-col items-center justify-center min-h-[200px]"
          >
            <FaPlus className="text-4xl text-gray-500 group-hover:text-cyan-400 transition-colors mb-2" />
            <span className="text-gray-500 group-hover:text-cyan-400 transition-colors">
              Create New Database
            </span>
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Databases;
