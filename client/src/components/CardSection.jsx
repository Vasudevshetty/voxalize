import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CardSection() {
  return (
    <motion.div
      className="p-4 flex flex-col md:flex-row justify-center items-center w-full max-w-7xl mx-auto mt-8 space-y-6 md:space-y-0 md:space-x-6 mb-10 rounded-r-xl overflow-hidden"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className=" w-full  md:w-2/3 space-y-3 px-4 text-center md:text-left">
        <h2 className="text-white font-dmmono text-2xl sm:text-3xl tracking-wider font-medium">
          Experience the Power of
          <br />
          <span>
            <span className="text-green-400">Voice</span>
            <span className="text-cyan-400">-</span>
            <span className="text-cyan-600">Driven</span>
          </span>{" "}
          Visualization
        </h2>
        <p className="text-gray-300 font-dmsans md:w-4/5 w-full   text-sm sm:text-base">
          Transform complex ideas, pitches, or data into clear, compelling
          visuals — just by speaking. Whether you're brainstorming, presenting,
          or strategizing, see how fast your voice can turn into impact.
        </p>
        <Link
          to="/auth/signup"
          className="inline-block w-fit mt-3 px-8 py-2 bg-gradient-to-r from-green-400 to-cyan-500 text-black font-semibold rounded-full shadow hover:scale-105 transition-transform"
        >
          Try Now!
        </Link>
      </div>

      <div className="w-full md:w-1/3 flex justify-center">
        <img
          src="/hero.png"
          alt="Visualization Illustration"
          className="w-64 sm:w-80 md:w-96 h-auto rounded-r-xl hidden md:block"
        />
      </div>
    </motion.div>
  );
}

export default CardSection;
