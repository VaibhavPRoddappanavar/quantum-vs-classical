"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ClassicalLinearSearch from "./search/simulations/ClassicalLinearSearch";
import QuantumGroverSearch from "./search/simulations/QuantumGroverSearch";
import DynamicComparisonSection from "./search/DynamicComparisonSection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const SearchProblemSimulator = () => {
  // State for problem inputs
  const [inputArray, setInputArray] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);
  
  // Parsed data for simulation
  const [parsedArray, setParsedArray] = useState([]);
  const [parsedTarget, setParsedTarget] = useState("");
  
  // Simulation control state
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const simulationSpeed = 1500; // Slower speed (1.5 seconds per step) for better understanding
  
  // Simulation results
  const [classicalResult, setClassicalResult] = useState({
    found: false,
    steps: 0,
    index: -1,
    complexity: "O(n)"
  });
  
  const [quantumResult, setQuantumResult] = useState({
    found: false,
    steps: 0,
    index: -1,
    complexity: "O(√n)"
  });
  
  // Validate inputs
  useEffect(() => {
    try {
      // Simple validation - check if input is a valid array format
      const array = JSON.parse(inputArray || "[]");
      if (Array.isArray(array) && array.length > 0 && targetValue.trim() !== "") {
        setParsedArray(array);
        setParsedTarget(targetValue);
        setIsValidInput(true);
      } else {
        setIsValidInput(false);
      }
    } catch (e) {
      setIsValidInput(false);
    }
  }, [inputArray, targetValue]);
  
  // Reset simulation
  const resetSimulation = useCallback(() => {
    // Stop the simulation first
    setIsRunning(false);
    
    // Reset step counter
    setCurrentStep(0);
    
    // Reset results
    setClassicalResult({
      found: false,
      steps: 0,
      index: -1,
      complexity: "O(n)"
    });
    setQuantumResult({
      found: false,
      steps: 0,
      index: -1,
      complexity: "O(√n)"
    });
    
    // Force a re-render of child components by changing the key
    setParsedArray([...parsedArray]);
  }, [parsedArray]);
  
  // Handle step forward
  const stepForward = useCallback(() => {
    if (!isValidInput) return;
    setCurrentStep(prev => prev + 1);
  }, [isValidInput]);
  
  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!isValidInput) return;
    setIsRunning(prev => !prev);
  }, [isValidInput]);
  
  // Run simulation with interval when playing
  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, simulationSpeed);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);
  
  // Handle classical search completion
  const handleClassicalComplete = useCallback((result) => {
    setClassicalResult(result);
  }, []);
  
  // Handle quantum search completion
  const handleQuantumComplete = useCallback((result) => {
    setQuantumResult(result);
  }, []);
  
  return (
    <motion.div
      className="w-full max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Problem Description */}
      <motion.div 
        className="mb-8 text-center"
        variants={itemVariants}
      >
        <div className="bg-black/30 p-6 rounded-lg border border-indigo-500/30 max-w-4xl mx-auto">
          <p className="text-lg text-gray-200 font-light leading-relaxed">
            Given an array of elements, find the index of a specific target value.
          </p>
        </div>
      </motion.div>
      
      {/* Input Form */}
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
                placeholder='e.g., ["101", "99", "42", "1337", "512"]'
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
                placeholder="e.g., 42"
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
      
      {/* Simulation Panels */}
      <motion.div 
        className="mb-10"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Classical Algorithm Panel */}
          <div className="flex-1">
            <ClassicalLinearSearch
              array={parsedArray}
              target={parsedTarget}
              currentStep={currentStep}
              isRunning={isRunning}
              onStepComplete={stepForward}
              onSearchComplete={handleClassicalComplete}
            />
          </div>
          
          {/* Quantum Algorithm Panel */}
          <div className="flex-1">
            <QuantumGroverSearch
              array={parsedArray}
              target={parsedTarget}
              currentStep={currentStep}
              isRunning={isRunning}
              onStepComplete={stepForward}
              onSearchComplete={handleQuantumComplete}
            />
          </div>
        </div>
        
        {/* Simplified Simulation Controls */}
        <div className="flex justify-center mt-6 space-x-6">
          <button
            onClick={togglePlayPause}
            disabled={!isValidInput}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200 focus-visible-ring text-lg font-medium"
          >
            {isRunning ? "Pause" : "Play"}
          </button>
          
          <button
            onClick={resetSimulation}
            disabled={!isValidInput}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors duration-200 focus-visible-ring text-lg font-medium"
          >
            Reset
          </button>
        </div>
      </motion.div>
      
      {/* Dynamic Comparison Section */}
      <motion.div variants={itemVariants}>
        <DynamicComparisonSection 
          classicalResult={classicalResult}
          quantumResult={quantumResult}
          arraySize={parsedArray.length}
        />
      </motion.div>
    </motion.div>
  );
};

export default SearchProblemSimulator;
