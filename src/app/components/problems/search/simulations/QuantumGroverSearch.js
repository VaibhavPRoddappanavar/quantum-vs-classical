"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * Quantum Grover's Search Simulation Component
 * 
 * This component visualizes Grover's quantum search algorithm step by step
 */
const QuantumGroverSearch = ({ 
  array, 
  target, 
  currentStep,
  isRunning,
  onStepComplete,
  onSearchComplete
}) => {
  // Simulation state
  const [state, setState] = useState({
    iteration: 0,
    amplitudes: [],
    probabilities: [],
    measured: false,
    result: -1,
    complete: false,
    message: "Waiting to start...",
    steps: 0
  });

  // Reset simulation when array or target changes
  useEffect(() => {
    if (array && array.length > 0) {
      // Initialize with equal superposition
      const initialAmplitude = 1 / Math.sqrt(array.length);
      const initialProbability = 1 / array.length;
      
      setState({
        iteration: 0,
        amplitudes: Array(array.length).fill(initialAmplitude),
        probabilities: Array(array.length).fill(initialProbability),
        measured: false,
        result: -1,
        complete: false,
        message: "Waiting to start...",
        steps: 0
      });
    }
  }, [array, target]);

  // Simulate one step of Grover's quantum search
  const simulateStep = useCallback(() => {
    setState(prevState => {
      // If already complete, don't do anything
      if (prevState.complete) {
        return prevState;
      }

      const newState = { ...prevState };
      newState.steps += 1;
      
      // Calculate required iterations (approximately π/4 * sqrt(N))
      const requiredIterations = Math.ceil(Math.sqrt(array.length));
      
      if (newState.iteration < requiredIterations && !newState.measured) {
        // Increment iteration counter (only if not already at this iteration)
        if (newState.iteration < newState.steps) {
          newState.iteration += 1;
        }
        
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
        if (newState.iteration >= requiredIterations) {
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
            
            // Store completion result for useEffect to handle
            newState.completionResult = {
              found: true,
              steps: newState.iteration,
              index: maxIndex,
              complexity: "O(√n)"
            };
          } else {
            newState.message = "Measurement did not find target";
            newState.complete = true;
            
            // Store completion result for useEffect to handle
            newState.completionResult = {
              found: false,
              steps: newState.iteration,
              index: -1,
              complexity: "O(√n)"
            };
          }
        }
      }
      
      // We no longer call onStepComplete here to avoid React state update errors
      
      return newState;
    });
  }, [array, target, onStepComplete, onSearchComplete]);

  // Advance simulation when currentStep changes
  useEffect(() => {
    if (currentStep > state.steps && !state.complete) {
      simulateStep();
    }
  }, [currentStep, state.steps, state.complete, simulateStep]);
  
  // Handle completion notification in a separate useEffect
  useEffect(() => {
    if (state.complete && state.completionResult && onSearchComplete) {
      // Use setTimeout to avoid React state update errors
      setTimeout(() => {
        onSearchComplete(state.completionResult);
      }, 0);
    }
  }, [state.complete, state.completionResult, onSearchComplete]);

  // Find the maximum probability for scaling visualizations
  const maxProb = Math.max(...(state.probabilities || [1]));

  return (
    <div className="bg-black/30 p-6 rounded-lg border border-indigo-500/30 h-full">
      <h3 className="text-xl font-bold mb-4 text-white font-orbitron">
        Quantum Grover's Search
      </h3>
      
      {/* Algorithm explanation */}
      <div className="mb-4 text-sm text-gray-300 bg-black/40 p-3 rounded-lg">
        <p>
          Grover's algorithm uses quantum superposition and amplitude amplification to find the target.
          <br />
          <span className="text-indigo-300 font-medium">Time Complexity: O(√n)</span>
        </p>
      </div>
      
      {/* Visualization area */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          {state.measured ? "Final State (After Measurement)" : `Quantum State (Iteration ${state.iteration})`}
        </h4>
        
        <div className="grid grid-cols-5 gap-2">
          {array.map((item, index) => {
            const isHighestProb = state.probabilities[index] === maxProb;
            const isMeasured = state.measured && index === state.result;
            
            return (
              <motion.div
                key={index}
                className={`
                  p-3 rounded-md border text-center relative
                  ${isMeasured ? 'border-green-500 bg-green-900/30' : 
                    isHighestProb && isRunning ? 'border-indigo-400 bg-indigo-900/40' : 'border-purple-500 bg-purple-900/20'}
                `}
                initial={{ opacity: 0.6 }}
                animate={{ 
                  opacity: 1,
                  scale: (isMeasured || (isHighestProb && isRunning)) ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -top-2 -left-2 bg-gray-800 text-xs px-1 rounded-sm border border-gray-700">
                  {index}
                </div>
                <div className="flex flex-col h-full justify-between">
                  <span className="text-xs font-roboto-mono mb-1">
                    {item.toString()}
                  </span>
                  <span className={`text-xs ${isHighestProb ? 'text-indigo-200 font-bold' : 'text-indigo-300'}`}>
                    {(state.probabilities[index] * 100).toFixed(1)}%
                  </span>
                  
                  {/* Probability bar */}
                  <motion.div 
                    className="mt-2 w-full bg-black/50 rounded-sm overflow-hidden"
                    style={{ height: '6px' }}
                  >
                    <motion.div 
                      className={`h-full ${isMeasured ? 'bg-green-500' : isHighestProb ? 'bg-indigo-400' : 'bg-purple-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(state.probabilities[index] / maxProb) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Amplitude visualization */}
      <div className="mt-4 bg-black/30 p-3 rounded-lg border border-white/10">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Amplitude Distribution</h4>
        <div className="h-16 bg-black/50 rounded-lg overflow-hidden flex items-end">
          {state.amplitudes.map((amp, index) => {
            const isHighest = Math.abs(amp) === Math.max(...state.amplitudes.map(a => Math.abs(a)));
            const isMeasured = state.measured && index === state.result;
            
            return (
              <motion.div
                key={index}
                className="relative group"
                style={{ 
                  width: `${(1 / array.length) * 100}%`,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
              >
                <motion.div
                  className={`w-full ${isMeasured ? 'bg-green-500' : 
                    isHighest ? 'bg-indigo-400' : 'bg-purple-500'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.abs(amp) * 100}%` }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      Index: {index}<br/>
                      Amplitude: {amp.toFixed(3)}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="mt-4 text-sm text-gray-300 bg-black/30 p-3 rounded-md border border-white/10">
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${isRunning && !state.measured ? 'animate-pulse' : ''}`}
            style={{ 
              backgroundColor: state.measured && state.result >= 0 
                ? '#22c55e' 
                : state.measured 
                  ? '#f87171' 
                  : state.iteration > 0 
                    ? '#8b5cf6' 
                    : '#6b7280'
            }}
          ></div>
          <p>{state.message}</p>
        </div>
        
        {state.iteration > 0 && (
          <div className="mt-2 text-xs text-gray-400">
            Iterations: {state.iteration} / {Math.ceil(Math.sqrt(array.length))}
          </div>
        )}
      </div>
      
      {/* Complexity explanation */}
      {state.complete && (
        <motion.div 
          className="mt-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-sm font-medium text-white mb-1">Analysis</h4>
          <p className="text-xs text-gray-300">
            Grover's algorithm has a time complexity of O(√n), which is quadratically faster than classical search.
            {state.measured && state.result >= 0 ? (
              <span> In this case, it found the target after {state.iteration} iterations, compared to potentially {array.length} checks in classical search.</span>
            ) : (
              <span> In this case, it performed {state.iteration} iterations but did not find the target.</span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QuantumGroverSearch;
