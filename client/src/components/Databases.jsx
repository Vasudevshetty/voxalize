import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";

const databases = [
  { id: 1, name: "Database 1" },
  { id: 2, name: "Database 2" },
  { id: 3, name: "Database 3" },
  { id: 4, name: "Database 4" },
  { id: 5, name: "Database 6" },
];

function Databases() {
  const [selectedDatabase, setSelectedDatabase] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = (id) => {
    setSelectedDatabase(id);
    const db = databases.find((db) => db.id === id);
    if (db) {
      console.log("Selected Database:", db.name);
    }
  };
  return (
    <>
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
      {isModalOpen && (
        <Modal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
      )}
    </>
  );
}

export default Databases;
