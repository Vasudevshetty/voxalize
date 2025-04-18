import { useEffect, useRef, useState } from "react";
import { BiLogoPostgresql } from "react-icons/bi";
import { GrMysql } from "react-icons/gr";

function Modal({ setIsModalOpen }) {
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleConnect = () => {
    console.log("Connecting to database with: ", formData);
    setIsModalOpen(false);
  };
  return (
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
}

export default Modal;
