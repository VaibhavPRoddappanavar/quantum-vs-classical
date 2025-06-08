"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import InputForm from "./InputForm";
import SimulationControls from "./SimulationControls";
import ClassicalGaussianElimination from "./simulations/ClassicalGaussianElimination";
import QuantumHHLAlgorithm from "./simulations/QuantumHHLAlgorithm";
import DynamicComparisonSection from "./DynamicComparisonSection";

/**
 * Linear Equations Visualizer Component
 * 
 * This component orchestrates the side-by-side visualization of classical Gaussian elimination
 * and quantum HHL algorithm for solving systems of linear equations
 */
const LinearEquationsVisualizer = () => {
  // Input state
  const [input, setInput] = useState({
    matrix: [],
    vector: []
  });
  const [isValidInput, setIsValidInput] = useState(false);
  
  // Simulation control state
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms between steps
  const [simulationTimer, setSimulationTimer] = useState(null);
  
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
    setCurrentStep(0);
    setIsRunning(false);
    clearInterval(simulationTimer);
    setSimulationTimer(null);
    
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
  }, [simulationTimer]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    setIsRunning(prevIsRunning => {
      if (!prevIsRunning) {
        // Start the simulation
        const timer = setInterval(() => {
          setCurrentStep(prevStep => prevStep + 1);
        }, simulationSpeed);
        setSimulationTimer(timer);
        return true;
      } else {
        // Pause the simulation
        clearInterval(simulationTimer);
        setSimulationTimer(null);
        return false;
      }
    });
  }, [simulationSpeed, simulationTimer]);

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
      clearInterval(simulationTimer);
      setSimulationTimer(null);
    }
  }, [quantumResult.solved, simulationTimer]);

  // Handle quantum algorithm completion
  const handleQuantumComplete = useCallback((result) => {
    setQuantumResult(result);
    
    // If both algorithms have completed, stop the simulation
    if (classicalResult.solved) {
      setIsRunning(false);
      clearInterval(simulationTimer);
      setSimulationTimer(null);
    }
  }, [classicalResult.solved, simulationTimer]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (simulationTimer) {
        clearInterval(simulationTimer);
      }
    };
  }, [simulationTimer]);

  // Update timer when simulation speed changes
  useEffect(() => {
    if (isRunning) {
      clearInterval(simulationTimer);
      const timer = setInterval(() => {
        setCurrentStep(prevStep => prevStep + 1);
      }, simulationSpeed);
      setSimulationTimer(timer);
    }
  }, [simulationSpeed, isRunning, simulationTimer]);

  // Reset simulation when input changes
  useEffect(() => {
    resetSimulation();
  }, [input, resetSimulation]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h2 
        className="text-3xl font-bold mb-6 text-white text-center font-orbitron"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Linear Equations Solver
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <InputForm 
          onInputChange={handleInputChange}
          onValidityChange={handleValidityChange}
        />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SimulationControls
          togglePlayPause={togglePlayPause}
          stepForward={stepForward}
          resetSimulation={resetSimulation}
          isRunning={isRunning}
          isValidInput={isValidInput}
          simulationSpeed={simulationSpeed}
          setSimulationSpeed={setSimulationSpeed}
        />
      </motion.div>
      
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <DynamicComparisonSection
          classicalResult={classicalResult}
          quantumResult={quantumResult}
          matrixSize={input.matrix.length}
        />
      </motion.div>
    </div>
  );
};

export default LinearEquationsVisualizer;
