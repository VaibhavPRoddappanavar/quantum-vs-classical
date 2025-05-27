"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to handle search simulation logic
 * @param {Array} array - The array to search in
 * @param {*} target - The target value to search for
 * @returns {Object} - State and functions for the search simulation
 */
const useSearchSimulation = (array, target) => {
  // State for simulation control
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState({ classical: 0, quantum: 0 });
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms per step
  const [simulationResults, setSimulationResults] = useState({
    classical: { found: false, steps: 0, index: -1 },
    quantum: { found: false, steps: 0, index: -1 }
  });
  
  // Simulation states
  const [classicalState, setClassicalState] = useState({
    currentIndex: -1,
    checked: [],
    found: false,
    complete: false,
    message: "Waiting to start..."
  });
  
  const [quantumState, setQuantumState] = useState({
    iteration: 0,
    amplitudes: [],
    probabilities: [],
    measured: false,
    result: -1,
    complete: false,
    message: "Waiting to start..."
  });

  // Initialize simulation when array or target changes
  useEffect(() => {
    if (array && array.length > 0 && target !== undefined && target !== null) {
      // Reset simulation states
      resetSimulation();
      
      // Set max steps for both algorithms
      setMaxSteps({
        classical: array.length, // O(n) for linear search
        quantum: Math.ceil(Math.sqrt(array.length)) // O(√n) for Grover's
      });
      
      // Initialize quantum state with equal amplitudes
      setQuantumState(prev => ({
        ...prev,
        amplitudes: Array(array.length).fill(1 / Math.sqrt(array.length)),
        probabilities: Array(array.length).fill(1 / array.length)
      }));
    }
  }, [array, target]);
  
  // Reset simulation to initial state
  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(0);
    setClassicalState({
      currentIndex: -1,
      checked: [],
      found: false,
      complete: false,
      message: "Waiting to start..."
    });
    
    const initialAmplitudes = array && array.length > 0 
      ? Array(array.length).fill(1 / Math.sqrt(array.length || 1))
      : [];
    
    const initialProbabilities = array && array.length > 0
      ? Array(array.length).fill(1 / (array.length || 1))
      : [];
    
    setQuantumState({
      iteration: 0,
      amplitudes: initialAmplitudes,
      probabilities: initialProbabilities,
      measured: false,
      result: -1,
      complete: false,
      message: "Waiting to start..."
    });
    
    setSimulationResults({
      classical: { found: false, steps: 0, index: -1 },
      quantum: { found: false, steps: 0, index: -1 }
    });
  }, [array]);
  
  // Simulate one step of classical linear search
  const simulateClassicalStep = useCallback(() => {
    const newState = { ...classicalState };
    
    if (newState.currentIndex < array.length - 1 && !newState.found) {
      newState.currentIndex += 1;
      newState.checked.push(newState.currentIndex);
      
      if (array[newState.currentIndex] === target) {
        newState.found = true;
        newState.message = `Found target at index ${newState.currentIndex}!`;
        newState.complete = true;
        
        setSimulationResults(prev => ({
          ...prev,
          classical: { 
            found: true, 
            steps: newState.checked.length, 
            index: newState.currentIndex 
          }
        }));
      } else {
        newState.message = `Checking index ${newState.currentIndex}...`;
      }
    } else if (!newState.complete) {
      newState.message = "Target not found in array";
      newState.complete = true;
      
      setSimulationResults(prev => ({
        ...prev,
        classical: { 
          found: false, 
          steps: newState.checked.length, 
          index: -1 
        }
      }));
    }
    
    setClassicalState(newState);
  }, [classicalState, array, target]);
  
  // Simulate one step of Grover's quantum search
  const simulateQuantumStep = useCallback(() => {
    const newState = { ...quantumState };
    
    if (newState.iteration < Math.ceil(Math.sqrt(array.length)) && !newState.measured) {
      // Simplified simulation of Grover's algorithm
      newState.iteration += 1;
      
      // Find index of target in array (if it exists)
      const targetIndex = array.findIndex(item => item === target);
      
      // Update amplitudes - simplification of quantum behavior
      const newAmplitudes = [...newState.amplitudes];
      const n = newAmplitudes.length;
      
      // Simplified amplitude amplification
      for (let i = 0; i < n; i++) {
        if (i === targetIndex) {
          // Increase amplitude for target
          newAmplitudes[i] = Math.min(newAmplitudes[i] * 1.5, 0.9);
        } else {
          // Decrease amplitude for non-targets
          newAmplitudes[i] = Math.max(newAmplitudes[i] * 0.9, 0.1 / n);
        }
      }
      
      // Normalize amplitudes
      const sum = newAmplitudes.reduce((acc, val) => acc + val * val, 0);
      const normFactor = 1 / Math.sqrt(sum);
      
      newState.amplitudes = newAmplitudes.map(a => a * normFactor);
      newState.probabilities = newState.amplitudes.map(a => a * a);
      
      newState.message = `Iteration ${newState.iteration}: Amplifying target state`;
      
      // Final measurement after sufficient iterations
      if (newState.iteration >= Math.ceil(Math.sqrt(array.length))) {
        newState.measured = true;
        
        // Find highest probability state
        let maxProb = 0;
        let maxIndex = -1;
        
        newState.probabilities.forEach((prob, idx) => {
          if (prob > maxProb) {
            maxProb = prob;
            maxIndex = idx;
          }
        });
        
        newState.result = maxIndex;
        
        if (maxIndex !== -1 && array[maxIndex] === target) {
          newState.message = `Measured target at index ${maxIndex}!`;
          newState.complete = true;
          
          setSimulationResults(prev => ({
            ...prev,
            quantum: { 
              found: true, 
              steps: newState.iteration, 
              index: maxIndex 
            }
          }));
        } else {
          newState.message = "Measurement did not find target";
          newState.complete = true;
          
          setSimulationResults(prev => ({
            ...prev,
            quantum: { 
              found: false, 
              steps: newState.iteration, 
              index: -1 
            }
          }));
        }
      }
    }
    
    setQuantumState(newState);
  }, [quantumState, array, target]);
  
  // Step forward in simulation
  const stepForward = useCallback(() => {
    if (currentStep < Math.max(maxSteps.classical, maxSteps.quantum)) {
      // Update current step
      setCurrentStep(prev => prev + 1);
      
      // Update classical algorithm state
      if (currentStep < maxSteps.classical && !classicalState.complete) {
        simulateClassicalStep();
      }
      
      // Update quantum algorithm state
      if (currentStep < maxSteps.quantum && !quantumState.complete) {
        simulateQuantumStep();
      }
    } else {
      setIsRunning(false);
    }
  }, [currentStep, maxSteps, classicalState, quantumState, simulateClassicalStep, simulateQuantumStep]);
  
  // Play/pause simulation
  const togglePlayPause = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);
  
  // Run simulation with interval when playing
  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(stepForward, simulationSpeed);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed, stepForward]);

  return {
    // States
    isRunning,
    currentStep,
    maxSteps,
    simulationSpeed,
    simulationResults,
    classicalState,
    quantumState,
    
    // Actions
    setSimulationSpeed,
    togglePlayPause,
    stepForward,
    resetSimulation,
    
    // Derived state
    isComplete: classicalState.complete && quantumState.complete
  };
};

export default useSearchSimulation;
