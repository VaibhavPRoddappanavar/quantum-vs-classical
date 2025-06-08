"use client";

import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const SimulationControls = ({ 
  togglePlayPause, 
  resetSimulation, 
  isRunning, 
  isValidInput
}) => {
  return (
    <div className="flex justify-center mt-6 space-x-8">
      <button
        onClick={togglePlayPause}
        disabled={!isValidInput}
        className="px-6 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200 focus-visible-ring min-w-[120px]"
      >
        {isRunning ? "Pause" : "Play"}
      </button>
      
      <button
        onClick={resetSimulation}
        disabled={!isValidInput}
        className="px-6 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200 focus-visible-ring min-w-[120px]"
      >
        Reset
      </button>
    </div>
  );
};

export default SimulationControls;
