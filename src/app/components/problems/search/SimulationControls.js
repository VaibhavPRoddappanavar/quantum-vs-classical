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
  stepForward, 
  resetSimulation, 
  isRunning, 
  isValidInput, 
  simulationSpeed, 
  setSimulationSpeed 
}) => {
  return (
    <div className="flex justify-center mt-6 space-x-4">
      <button
        onClick={togglePlayPause}
        disabled={!isValidInput}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200 focus-visible-ring"
      >
        {isRunning ? "Pause" : "Play"}
      </button>
      
      <button
        onClick={stepForward}
        disabled={!isValidInput || isRunning}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200 focus-visible-ring"
      >
        Step Forward
      </button>
      
      <button
        onClick={resetSimulation}
        disabled={!isValidInput}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200 focus-visible-ring"
      >
        Reset
      </button>
      
      <div className="flex items-center">
        <label htmlFor="speed-control" className="mr-2 text-sm text-white">
          Speed:
        </label>
        <select
          id="speed-control"
          value={simulationSpeed}
          onChange={(e) => setSimulationSpeed(Number(e.target.value))}
          className="bg-black/30 border border-white/20 text-white rounded-lg p-2 focus-visible-ring"
        >
          <option value="2000">Slow</option>
          <option value="1000">Normal</option>
          <option value="500">Fast</option>
          <option value="200">Very Fast</option>
        </select>
      </div>
    </div>
  );
};

export default SimulationControls;
