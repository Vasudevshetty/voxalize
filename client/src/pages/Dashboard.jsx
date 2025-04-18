import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMenuOpen } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { GrMysql } from "react-icons/gr";
import { BiLogoPostgresql } from "react-icons/bi";
import { Link } from "react-router-dom";

const databases = [
  { id: 1, name: "Database 1" },
  { id: 2, name: "Database 2" },
  { id: 3, name: "Database 3" },
  { id: 4, name: "Database 4" },
  { id: 5, name: "Database 1" },
];

function Dashboard() {
  const [selectedDatabase, setSelectedDatabase] = useState(1);
  const [selectedHistoryId, setSelectedHistoryId] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    databaseName: "",
    rootUser: "",
    password: "",
    user: "",
    host: "",
    userName: "",
    database: "",
    dbType: "mysql",
  });

  const historyItems = [
    { id: 1, title: "Business data", query: "What's the profit?" },
    { id: 2, title: "Sales data", query: "Show sales for Q1" },
    { id: 3, title: "Customer insights", query: "Who are our top customers?" },
    { id: 4, title: "Inventory", query: "How many products are in stock?" },
  ];

  const GradientTitle = () => (
    <h1 className="text-4xl font-bold mb-8 relative">
      <span className="bg-clip-text text-transparent bg-gradient-to-tr from-green-400 to-cyan-400">
        VoiceForm
      </span>
    </h1>
  );

  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (id) => {
    setSelectedDatabase(id);
    const db = databases.find((db) => db.id === id);
    if (db) {
      console.log("Selected Database:", db.name);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnect = () => {
    console.log("Connecting to database with: ", formData);
    setIsModalOpen(false);
  };

  const Modal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-[#1e1e1e] p-6 rounded-lg w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">
          Connect to Database
        </h2>
        <div className="mb-4">
          <input
            type="text"
            name="user"
            value={formData.user}
            onChange={handleInputChange}
            placeholder="User"
            className="w-full bg-[#2a2a2a] text-white border-none rounded-md p-3 mb-3 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            placeholder="Host"
            className="w-full bg-[#2a2a2a] text-white border-none rounded-md p-3 mb-3 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="Username"
            className="w-full bg-[#2a2a2a] text-white border-none rounded-md p-3 mb-3 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full bg-[#2a2a2a] text-white border-none rounded-md p-3 mb-3 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="database"
            value={formData.database}
            onChange={handleInputChange}
            placeholder="Database"
            className="w-full bg-[#2a2a2a] text-white border-none rounded-md p-3 mb-3 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <p className="text-white mb-2">Database Type:</p>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="mysql"
              name="dbType"
              value="mysql"
              checked={formData.dbType === "mysql"}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label
              htmlFor="mysql"
              className="text-white flex  items-center gap-4"
            >
              <span>
                <GrMysql />
              </span>
              MySQL{" "}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="postgresql"
              name="dbType"
              value="postgresql"
              checked={formData.dbType === "postgresql"}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label
              htmlFor="postgresql"
              className="text-white flex  items-center gap-4"
            >
              <span>
                <BiLogoPostgresql />
              </span>
              PostgreSQL{" "}
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleConnect}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen flex text-white overflow-y-scroll font-sans relative">
      {/* Toggle Button when Sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="absolute top-6 left-6 z-20 text-white sm:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <MdOutlineMenuOpen size={32} />
        </button>
      )}

      {/* Left Sidebar - Static History */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-16"
        } h-screen bg-[#131313] border-r border-gray-800 p-6 flex flex-col transform transition-all duration-300 z-40
        sm:relative sm:w-80 sm:block   ${
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
          <div className="text-center tracking-widest">
            <GradientTitle />
          </div>
        )}

        {sidebarOpen && (
          <div className="mt-6">
            <p className="text-lg font-semibold tracking-widest text-gray-400 mb-3">
              Today
            </p>
            <div className="space-y-2">
              {historyItems.map((item) => {
                const isSelected = selectedHistoryId === item.id;
                const isMenuOpen = openMenuId === item.id;

                return (
                  <div key={item.id} className="space-y-1 relative">
                    <button
                      onClick={() => setSelectedHistoryId(item.id)}
                      className={`w-full py-2 px-3 rounded-2xl text-sm flex justify-between items-center transition-all duration-200
                        ${
                          isSelected
                            ? "bg-gradient-to-r from-[#00FF6F]/10 to-transparent border-l-4 border-[#00FF6F] shadow-lg scale-[1.02]"
                            : "bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-400"
                        }`}
                    >
                      <span
                        className={`${
                          isSelected
                            ? "text-white font-semibold"
                            : "text-gray-300"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className="text-lg mb-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === item.id ? null : item.id
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
                            console.log("Deleted:", item.id);
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
          </div>
        )}
      </div>

      {/* Main Content */}
      <Link
        to={"/profile"}
        className="h-14 w-14 absolute border-2 right-10 top-2 cursor-pointer overflow-hidden rounded-full "
      >
        <img src="./user.jpg" alt="" className="w-full h-full " />
      </Link>
      <div
        className={` m-10 mt-20 p-5 w-full h-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-all duration-300`}
      >
        {databases.map((db) => (
          <div
            key={db.id}
            className={`relative cursor-pointer h-40 rounded-2xl p-4 border-2 transition-transform transform hover:scale-105 ${
              db.connected ? "border-green-500" : "border-gray-700"
            }`}
            onClick={() => handleClick(db.id)}
          >
            <p className="text-xl font-semibold mb-2">{db.name}</p>
            <img
              src="./database.png"
              alt="Database Icon"
              className="h-32 absolute bottom-0 right-4"
            />
          </div>
        ))}
        <div
          className="relative cursor-pointer h-40 rounded-2xl p-4 border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-500 text-4xl"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </div>
      </div>
      {isModalOpen && <Modal />}
    </div>
  );
}

export default Dashboard;
