import React, { useState } from "react";

function Connect() {
  const [databases, setDatabases] = useState([
    { id: 1, name: "Database 1", connected: true },
    { id: 2, name: "Database 2", connected: false },
    { id: 3, name: "Database 3", connected: false },
    { id: 4, name: "Database 4", connected: false },
  ]);

  const handleConnect = (id) => {
    setDatabases((prev) =>
      prev.map((db) =>
        db.id === id
          ? { ...db, connected: true }
          : { ...db, connected: false }
      )
    );
  };

  return (
    <div className="p-5 text-white bg-black">
      <h1 className="text-2xl font-bold mb-4">Connect to databases</h1>
      <ul className="list-none p-0">
        {databases.map((db) => (
          <li
            key={db.id}
            className="flex items-center justify-between mb-3 p-3 bg-gray-800 rounded-lg"
          >
            <span className="flex items-center">
              <span
                className={`w-5 h-5 rounded-full mr-3 ${db.connected ? "bg-green-500" : "bg-gray-500"}`}
              ></span>
              {db.name}
            </span>
            {db.connected ? (
              <button
                className="bg-green-500 text-white border-none px-3 py-1 rounded-lg cursor-default"
              >
                Connected
              </button>
            ) : (
              <button
                onClick={() => handleConnect(db.id)}
                className="bg-transparent text-white border border-white px-3 py-1 rounded-lg hover:bg-white hover:text-black"
              >
                Connect
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Connect;
