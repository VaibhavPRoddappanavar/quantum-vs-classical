"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import InputForm from "./linear-equations/InputForm";
import SimulationControls from "./linear-equations/SimulationControls";
import ClassicalGaussianElimination from "./linear-equations/simulations/ClassicalGaussianElimination";
import QuantumHHLAlgorithm from "./linear-equations/simulations/QuantumHHLAlgorithm";
import DynamicComparisonSection from "./linear-equations/DynamicComparisonSection";

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

/**
 * Linear Equations Problem Simulator Component
 * 
 * This component orchestrates the side-by-side visualization of classical Gaussian elimination
 * and quantum HHL algorithm for solving systems of linear equations
 */
const LinearEquationsProblemSimulator = () => {
  // Input state
  const [input, setInput] = useState({
    matrix: [],
    vector: []
  });
  const [isValidInput, setIsValidInput] = useState(false);
  
  // Simulation control state
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const simulationSpeed = 2000; // Slow speed (2000ms) for better understanding
  
  // Use ref for timer instead of state to avoid re-renders
  const timerRef = useRef(null);
  
  // Results state
  const [classicalResult, setClassicalResult] = useState({
    solved: false,
    steps: 0,
    solution: null,
    complexity: "O(n³)"
  });
  
  const [quantumResult, setQuantumResult] = useState({
    solved: false,
    steps: 0,
    solution: null,
    complexity: "O(log n)"
  });

  // Handle input changes from the form
  const handleInputChange = (newInput) => {
    setInput(newInput);
  };

  // Handle input validity changes
  const handleValidityChange = (isValid) => {
    setIsValidInput(isValid);
  };

  // Reset the simulation
  const resetSimulation = useCallback(() => {
    // Clear timer if it exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setCurrentStep(0);
    setIsRunning(false);
    
    setClassicalResult({
      solved: false,
      steps: 0,
      solution: null,
      complexity: "O(n³)"
    });
    
    setQuantumResult({
      solved: false,
      steps: 0,
      solution: null,
      complexity: "O(log n)"
    });
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    setIsRunning(prevIsRunning => {
      if (!prevIsRunning) {
        // Start the simulation
        // Clear existing timer if it exists
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        // Create new timer
        timerRef.current = setInterval(() => {
          setCurrentStep(prevStep => prevStep + 1);
        }, simulationSpeed);
        return true;
      } else {
        // Pause the simulation
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return false;
      }
    });
  }, [simulationSpeed]);

  // Step forward manually
  const stepForward = useCallback(() => {
    setCurrentStep(prevStep => prevStep + 1);
  }, []);

  // Handle classical algorithm completion
  const handleClassicalComplete = useCallback((result) => {
    setClassicalResult(result);
    
    // If both algorithms have completed, stop the simulation
    if (quantumResult.solved) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [quantumResult.solved]);

  // Handle quantum algorithm completion
  const handleQuantumComplete = useCallback((result) => {
    setQuantumResult(result);
    
    // If both algorithms have completed, stop the simulation
    if (classicalResult.solved) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [classicalResult.solved]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // We don't need this effect anymore since we're using a fixed speed

  // Reset simulation when input changes
  useEffect(() => {
    resetSimulation();
  }, [input, resetSimulation]);

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Input Form */}
      <motion.div variants={itemVariants}>
        <InputForm 
          onInputChange={handleInputChange}
          onValidityChange={handleValidityChange}
        />
      </motion.div>
      
      {/* Simulation Panels */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        variants={itemVariants}
      >
        {/* Classical Algorithm Panel */}
        <ClassicalGaussianElimination
          matrix={input.matrix}
          vector={input.vector}
          currentStep={currentStep}
          isRunning={isRunning}
          onStepComplete={() => {}}
          onSolveComplete={handleClassicalComplete}
        />
        
        {/* Quantum Algorithm Panel */}
        <QuantumHHLAlgorithm
          matrix={input.matrix}
          vector={input.vector}
          currentStep={currentStep}
          isRunning={isRunning}
          onStepComplete={() => {}}
          onSolveComplete={handleQuantumComplete}
        />
      </motion.div>
      
      {/* Simulation Controls */}
      <motion.div variants={itemVariants}>
        <SimulationControls
          togglePlayPause={togglePlayPause}
          resetSimulation={resetSimulation}
          isRunning={isRunning}
          isValidInput={isValidInput}
        />
      </motion.div>
      
      {/* Results Comparison */}
      <motion.div variants={itemVariants} className="mt-12">
        <DynamicComparisonSection
          classicalResult={classicalResult}
          quantumResult={quantumResult}
          matrixSize={input.matrix.length}
        />
      </motion.div>
    </motion.div>
  );
};

export default LinearEquationsProblemSimulator;
