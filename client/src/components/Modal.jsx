import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDatabase } from "../redux/slices/database";
import { BiLogoPostgresql } from "react-icons/bi";
import { GrMysql } from "react-icons/gr";
import { FaSpinner } from "react-icons/fa";

function Modal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.database);

  const [formData, setFormData] = useState({
    host: "",
    username: "",
    password: "",
    database: "",
    dbType: "mysql",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createDatabase(formData));

    if (createDatabase.fulfilled.match(resultAction)) {
      onClose();
      setFormData({
        host: "",
        username: "",
        password: "",
        database: "",
        dbType: "mysql",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleConnect}
        className="bg-[#1e1e1e] p-8 rounded-xl w-full max-w-md relative border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
          onClick={onClose}
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
          Connect to Database
        </h2>

        {error?.create && (
          <div className="mb-4 text-red-500 text-sm bg-red-500/10 p-3 rounded">
            {error.create}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            name="database"
            value={formData.database}
            onChange={handleInputChange}
            placeholder="Database Name"
            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition-colors"
            required
          />

          <input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            placeholder="Host"
            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition-colors"
            required
          />

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition-colors"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-400 transition-colors"
            required
            autoComplete="off"
          />

          {/* Database Type Selector */}
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Database Type:</p>
            <div className="grid grid-cols-2 gap-4">
              {/* MySQL Option */}
              <label className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                <input
                  type="radio"
                  name="dbType"
                  value="mysql"
                  checked={formData.dbType === "mysql"}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <GrMysql
                  className={`text-xl ${
                    formData.dbType === "mysql"
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    formData.dbType === "mysql"
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }
                >
                  MySQL
                </span>
              </label>

              {/* PostgreSQL Option */}
              <label className="flex items-center space-x-2 p-3 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                <input
                  type="radio"
                  name="dbType"
                  value="postgresql"
                  checked={formData.dbType === "postgresql"}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <BiLogoPostgresql
                  className={`text-xl ${
                    formData.dbType === "postgresql"
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    formData.dbType === "postgresql"
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }
                >
                  PostgreSQL
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading.create}
            className="w-full bg-gradient-to-r cursor-pointer from-green-400 to-cyan-400 text-white rounded-lg p-3 hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            {loading.create ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
