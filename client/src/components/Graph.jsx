import { FaSearch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMenuOpen } from "react-icons/md";
import { useEffect, useRef, useState } from "react";

function Graph() {
  const [selectedDatabase, setSelectedDatabase] = useState(1);
  const [selectedHistoryId, setSelectedHistoryId] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

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

  return (
    <div className="bg-black min-h-screen flex text-white overflow-hidden font-sans">
      {/* Left Sidebar - Static History */}
      <div className="w-80 bg-[#131313] border-r border-gray-800 p-6 flex flex-col">
        <div className="flex justify-between mb-12">
          <IoIosArrowBack size={32} />
          <MdOutlineMenuOpen size={32} />
        </div>

        <div className="text-center tracking-widest">
          <GradientTitle />
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-400 mb-3">Today</p>
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
                        setOpenMenuId(openMenuId === item.id ? null : item.id);
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
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 text-xl text-gray-400">
        <div>graph</div>
        <div className="bg-[#181818] w-[75%] max-w-3xl rounded-full flex items-center px-4 py-2 gap-3">
          <div className="text-white text-xl cursor-pointer">
            <FaSearch />
          </div>

          <input
            type="text"
            placeholder="Type here"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400 text-sm"
          />

          <div className="bg-black rounded-full p-2 cursor-pointer">
            <img
              src="https://s3-alpha-sig.figma.com/img/73fc/cfc6/83796efaf541d8afcf99c3ca8411c147?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=f~5mrDOfaM0ijD7KCP7NRK8PDplbt~SfA5oaswjHSPIVYP0EWkXakkM4BmAJyEuEIj1Hghl0Jyl7y9WR9Z2YZnweO63rJl3tGOclTOM5AJjgv40OBv0sO3hjcCPgoTKGLwX6oUeNcCNC-A9PrdauxUCwza0JYI2zNdf2mLGkyybkS1wvpUEJ5yN1gOgABCWk-7APu1CsOpocF8cg2dYpnwuEqkQPnmc2KPwBmpdBAxDc2XPITczpR5XIB7hrb2ns7G6Y0VMTGxhDQTNUd--i-G3sKrJzkqMAStermEsRqhmp8nc4BUJ04QZvXnyR4Lm8RjEUGLbJEcpeTLypq9vLfw__"
              className="h-6 w-6"
              alt="Mic"
            />
          </div>

          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://s3-alpha-sig.figma.com/img/ab51/5ce5/141ad06b28a2f2b2e8331688b611838e?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oEb4D4iGo2RNW4rQ~kJU0Ia4yxJdkOBDtBkbQ8QNRF90xq-TDztEiWvj8Jmz2OroXPzdPFI2O1hDxjRVGGPB2u8CvYzLvMoj7I2ljG3QSn5WAeTAJ5ADjSPrnjFlWMwM2BIarQRcjuVBa~5Hh03ONqTCsoybpsN59Q5ZAz~KTWjTadDroSE0e11cPjZqjzGDlpk0ixPR33e-vIAprHq9QBNTD2XLecA2b9-NJnyJeXOeN13dSNjGy-en3o04~ieRzeM4nzIktxwZlexlbJwqg1rHvGkg0XaJPKWVPwD9aw~URL2EkLBvdfZWWyqhmwHEyVJXUCmdeJG0bdLuWf08lA__"
              className="h-6 w-6"
              alt="Icon 1"
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Databases */}
      {/* <div className="w-80 bg-[#131313] border-l border-gray-800 p-6">
        <h2 className="text-gray-300 mb-6 font-medium text-lg">Databases</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const isSelected = num === selectedDatabase;
            return (
              <button
                key={num}
                onClick={() => setSelectedDatabase(num)}
                className={`flex items-center justify-between p-4 rounded-xl w-full text-left transition-all duration-200 
                ${
                  isSelected
                    ? "bg-gradient-to-r from-[#00FF6F]/10 to-transparent border border-[#00FF6F]/40 shadow-md scale-[1.02]"
                    : "bg-[#1a1a1a] hover:bg-[#222]"
                }`}
              >
                <span
                  className={`text-base ${
                    isSelected ? "text-white font-medium" : "text-gray-400"
                  }`}
                >
                  Database {num}
                </span>
                <div className="w-8 h-6 flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded-full transition-all duration-200 ${
                      isSelected ? "bg-[#00FF6F]" : "bg-[#1e3e2c]"
                    }`}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}

export default Graph;
