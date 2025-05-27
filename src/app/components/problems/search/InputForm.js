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

const InputForm = ({ 
  inputArray, 
  setInputArray, 
  targetValue, 
  setTargetValue, 
  isValidInput, 
  resetSimulation,
  isRunning,
  currentStep
}) => {
  return (
    <motion.div 
      className="mb-10 max-w-4xl mx-auto"
      variants={itemVariants}
    >
      <div className="bg-black/20 p-6 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-white font-orbitron">Input Parameters</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="input-array" className="block text-sm font-medium text-gray-300 mb-2">
              Input Array (JSON format)
            </label>
            <textarea
              id="input-array"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              placeholder='e.g., ["001", "010", "011", "100", "101"]'
              className="w-full p-3 rounded-lg bg-black/30 border border-white/20 text-white font-roboto-mono focus-visible-ring transition-all duration-200 h-24"
              aria-describedby="array-desc"
            />
            <div id="array-desc" className="mt-1 text-sm text-gray-400">
              Enter a valid JSON array of elements
            </div>
          </div>
          
          <div>
            <label htmlFor="target-value" className="block text-sm font-medium text-gray-300 mb-2">
              Target Value
            </label>
            <input
              id="target-value"
              type="text"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="e.g., 101"
              className="w-full p-3 rounded-lg bg-black/30 border border-white/20 text-white font-roboto-mono focus-visible-ring transition-all duration-200"
              aria-describedby="target-desc"
            />
            <div id="target-desc" className="mt-1 text-sm text-gray-400">
              Enter the target value to search for
            </div>
          </div>
          
          <div className="pt-2">
            <button
              onClick={resetSimulation}
              disabled={!isValidInput || (isRunning && currentStep === 0)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200 focus-visible-ring"
            >
              {isRunning ? "Stop & Reset" : "Initialize Simulation"}
            </button>
            
            {!isValidInput && inputArray && (
              <p className="mt-2 text-red-400 text-sm">
                Please enter a valid JSON array and target value
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InputForm;
