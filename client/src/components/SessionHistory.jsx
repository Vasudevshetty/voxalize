import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMenuOpen } from "react-icons/md";

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

function SessionHistory({ selectedHistoryId, setSelectedHistoryId }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

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
    </div>
  );
}

export default SessionHistory;
