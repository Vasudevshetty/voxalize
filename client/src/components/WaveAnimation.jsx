import React, { useEffect } from "react";

const WaveAnimation = () => {
  const bars = Array.from({ length: 12 });

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes moveUp {
        0%, 100% { height: 30%; transform: translateY(0); }
        50% { height: 90%; transform: translateY(-8px); }
      }

      @keyframes moveDown {
        0%, 100% { height: 30%; transform: translateY(0); }
        50% { height: 90%; transform: translateY(8px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getAnimationStyle = (index) => {
    const isMovingUp = index % 2 === 0;
    const animation = isMovingUp ? "moveUp" : "moveDown";

    let baseHeight;
    if (index % 6 === 0 || index % 6 === 5) baseHeight = "30%";
    else if (index % 6 === 1 || index % 6 === 4) baseHeight = "40%";
    else baseHeight = "55%";

    return {
      animation: `${animation} 1.3s infinite ease-in-out`,
      animationDelay: `${index * 0.1}s`,
      height: baseHeight,
    };
  };

  const getBarColor = (index) => {
    const colors = [
      "from-emerald-400",
      "from-teal-400",
      "from-cyan-400",
      "from-sky-400",
      "from-blue-400",
      "from-indigo-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex items-center justify-center h-40 w-full bg-black px-12 rounded-lg">
      {bars.map((_, index) => (
        <div
          key={index}
          className={`w-1.5 rounded-full bg-gradient-to-b ${getBarColor(
            index
          )} to-cyan-600 mx-1`}
          style={getAnimationStyle(index)}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
