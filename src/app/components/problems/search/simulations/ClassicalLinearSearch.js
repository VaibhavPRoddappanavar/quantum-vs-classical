"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * Classical Linear Search Simulation Component
 * 
 * This component visualizes the classical linear search algorithm step by step
 */
const ClassicalLinearSearch = ({ 
  array, 
  target, 
  currentStep,
  isRunning,
  onStepComplete,
  onSearchComplete
}) => {
  // Simulation state
  const [state, setState] = useState({
    currentIndex: -1,
    checked: [],
    found: false,
    complete: false,
    message: "Waiting to start...",
    steps: 0
  });

  // Reset simulation when array or target changes
  useEffect(() => {
    setState({
      currentIndex: -1,
      checked: [],
      found: false,
      complete: false,
      message: "Waiting to start...",
      steps: 0
    });
  }, [array, target]);

  // Simulate one step of classical linear search
  const simulateStep = useCallback(() => {
    setState(prevState => {
      // If already complete, don't do anything
      if (prevState.complete) {
        return prevState;
      }

      const newState = { ...prevState };
      newState.steps += 1;
      
      // If we haven't checked all elements yet
      if (newState.currentIndex < array.length - 1) {
        // Increment the current index
        newState.currentIndex += 1;
        
        // Only add to checked array if not already there
        if (!newState.checked.includes(newState.currentIndex)) {
          newState.checked.push(newState.currentIndex);
        }
        
        // Check if current element is the target
        if (array[newState.currentIndex] === target) {
          newState.found = true;
          newState.message = `Found target at index ${newState.currentIndex}!`;
          newState.complete = true;
          
          // Store completion result for useEffect to handle
          newState.completionResult = {
            found: true,
            steps: newState.checked.length,
            index: newState.currentIndex,
            complexity: "O(n)"
          };
        } else {
          newState.message = `Checking index ${newState.currentIndex}...`;
        }
      } else {
        // We've checked all elements and didn't find the target
        newState.message = "Target not found in array";
        newState.complete = true;
        
        // Store completion result for useEffect to handle
        newState.completionResult = {
          found: false,
          steps: newState.checked.length,
          index: -1,
          complexity: "O(n)"
        };
      }
      
      // We no longer call onStepComplete here to avoid React state update errors
      
      return newState;
    });
  }, [array, target, onStepComplete, onSearchComplete]);

  // Advance simulation when currentStep changes
  useEffect(() => {
    // Only simulate a step if the current step from parent is greater than our internal step counter
    // and we're not already complete
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

  return (
    <div className="bg-black/30 p-6 rounded-lg border border-indigo-500/30 h-full">
      <h3 className="text-xl font-bold mb-4 text-white font-orbitron">
        Classical Linear Search
      </h3>
      
      {/* Algorithm explanation */}
      <div className="mb-4 text-sm text-gray-300 bg-black/40 p-3 rounded-lg">
        <p>
          Linear Search checks each element sequentially until it finds the target or reaches the end.
          <br />
          <span className="text-indigo-300 font-medium">Time Complexity: O(n)</span><br />
          <span className="text-green-300 font-medium">Space Complexity: O(1)</span>
        </p>
      </div>
      
      {/* Visualization area */}
      <div className="mb-4">
        <div className="grid grid-cols-5 gap-2 mb-4">
          {array.map((item, index) => (
            <motion.div
              key={index}
              className={`
                p-3 rounded-md border text-center relative
                ${index === state.currentIndex && isRunning ? 'border-yellow-400 bg-yellow-900/30' : 'border-gray-700 bg-gray-800/50'}
                ${state.checked.includes(index) ? 'border-blue-500 bg-blue-900/20' : ''}
                ${state.found && index === state.currentIndex ? 'border-green-500 bg-green-900/30' : ''}
              `}
              initial={{ opacity: 0.6 }}
              animate={{ 
                opacity: 1,
                scale: index === state.currentIndex && isRunning ? 1.05 : 1,
                borderColor: state.found && index === state.currentIndex 
                  ? "#22c55e" 
                  : index === state.currentIndex && isRunning
                    ? "#facc15" 
                    : state.checked.includes(index) 
                      ? "#3b82f6" 
                      : "#374151"
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm font-roboto-mono">
                {item.toString()}
              </span>
              <div className="absolute -top-2 -left-2 bg-gray-800 text-xs px-1 rounded-sm border border-gray-700">
                {index}
              </div>
              
              {/* Current index indicator */}
              {index === state.currentIndex && isRunning && (
                <motion.div 
                  className="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-yellow-400"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="mt-4 text-sm text-gray-300 bg-black/30 p-3 rounded-md border border-white/10">
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${isRunning ? 'animate-pulse' : ''}`}
            style={{ 
              backgroundColor: state.found 
                ? '#22c55e' 
                : state.complete 
                  ? '#f87171' 
                  : state.currentIndex >= 0 
                    ? '#facc15' 
                    : '#6b7280'
            }}
          ></div>
          <p>{state.message}</p>
        </div>
        
        {state.currentIndex >= 0 && (
          <div className="mt-2 text-xs text-gray-400">
            Elements checked: {state.checked.length} / {array.length}
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
            Linear search has a time complexity of O(n) because in the worst case, it needs to check every element in the array.
            {state.found ? (
              <span> In this case, it found the target after checking {state.checked.length} elements.</span>
            ) : (
              <span> In this case, it checked all {array.length} elements without finding the target.</span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ClassicalLinearSearch;
