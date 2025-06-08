"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * Classical Gaussian Elimination Simulation Component
 * 
 * This component visualizes the classical Gaussian elimination algorithm step by step
 * for solving a system of linear equations Ax = b
 */
const ClassicalGaussianElimination = ({ 
  matrix, 
  vector, 
  currentStep,
  isRunning,
  onStepComplete,
  onSolveComplete
}) => {
  // Simulation state
  const [state, setState] = useState({
    currentMatrix: [],
    currentVector: [],
    pivotRow: -1,
    pivotCol: -1,
    eliminationRow: -1,
    highlightedRows: [],
    highlightedCols: [],
    phase: "init", // init, forward, backward, complete
    solution: null,
    message: "Waiting to start...",
    steps: 0
  });

  // Reset simulation when matrix or vector changes
  useEffect(() => {
    if (matrix && matrix.length > 0 && vector && vector.length > 0) {
      // Create deep copies to avoid reference issues
      const initialMatrix = matrix.map(row => [...row]);
      const initialVector = [...vector];
      
      setState({
        currentMatrix: initialMatrix,
        currentVector: initialVector,
        pivotRow: -1,
        pivotCol: -1,
        eliminationRow: -1,
        highlightedRows: [],
        highlightedCols: [],
        phase: "init",
        solution: null,
        message: "Waiting to start...",
        steps: 0
      });
    }
  }, [matrix, vector]);
  
  // Reset simulation when currentStep is reset to 0
  useEffect(() => {
    if (currentStep === 0 && state.steps > 0) {
      // Reset the simulation state
      if (matrix && matrix.length > 0 && vector && vector.length > 0) {
        const initialMatrix = matrix.map(row => [...row]);
        const initialVector = [...vector];
        
        setState({
          currentMatrix: initialMatrix,
          currentVector: initialVector,
          pivotRow: -1,
          pivotCol: -1,
          eliminationRow: -1,
          highlightedRows: [],
          highlightedCols: [],
          phase: "init",
          solution: null,
          message: "Waiting to start...",
          steps: 0
        });
      }
    }
  }, [currentStep, matrix, vector, state.steps]);

  // Simulate one step of Gaussian elimination
  const simulateStep = useCallback(() => {
    setState(prevState => {
      // If already complete, don't do anything
      if (prevState.phase === "complete") {
        return prevState;
      }

      const newState = { ...prevState };
      newState.steps += 1;
      
      // Deep copy matrix and vector to avoid reference issues
      const n = newState.currentMatrix.length;
      const updatedMatrix = newState.currentMatrix.map(row => [...row]);
      const updatedVector = [...newState.currentVector];
      
      // Initialize phase if needed
      if (newState.phase === "init") {
        newState.phase = "forward";
        newState.pivotRow = 0;
        newState.pivotCol = 0;
        newState.message = "Starting forward elimination phase...";
        return newState;
      }
      
      // Forward elimination phase
      if (newState.phase === "forward") {
        const pivotRow = newState.pivotRow;
        const pivotCol = newState.pivotCol;
        
        // If this is a new pivot position
        if (newState.eliminationRow === -1) {
          // Highlight current pivot
          newState.highlightedRows = [pivotRow];
          newState.highlightedCols = [pivotCol];
          newState.message = `Selecting pivot at position (${pivotRow+1},${pivotCol+1})`;
          newState.eliminationRow = pivotRow + 1;
          return newState;
        }
        
        // If we're eliminating rows below the pivot
        if (newState.eliminationRow < n) {
          const elimRow = newState.eliminationRow;
          
          // Check if pivot element is zero (need to swap rows)
          if (Math.abs(updatedMatrix[pivotRow][pivotCol]) < 1e-10) {
            // Find a row below with non-zero element in this column
            let swapRow = -1;
            for (let i = pivotRow + 1; i < n; i++) {
              if (Math.abs(updatedMatrix[i][pivotCol]) > 1e-10) {
                swapRow = i;
                break;
              }
            }
            
            if (swapRow !== -1) {
              // Swap rows
              [updatedMatrix[pivotRow], updatedMatrix[swapRow]] = 
                [updatedMatrix[swapRow], updatedMatrix[pivotRow]];
              [updatedVector[pivotRow], updatedVector[swapRow]] = 
                [updatedVector[swapRow], updatedVector[pivotRow]];
              
              newState.highlightedRows = [pivotRow, swapRow];
              newState.message = `Swapping rows ${pivotRow+1} and ${swapRow+1} to avoid zero pivot`;
            } else {
              // Move to next column
              newState.pivotCol += 1;
              newState.eliminationRow = -1;
              newState.message = `Skipping column ${pivotCol+1} (no non-zero pivot found)`;
              
              // Check if we've reached the end
              if (newState.pivotCol >= n) {
                newState.phase = "backward";
                newState.pivotRow = n - 1;
                newState.pivotCol = n - 1;
                newState.eliminationRow = -1;
                newState.message = "Starting back-substitution phase...";
              }
            }
          } else {
            // Perform elimination for this row
            const factor = updatedMatrix[elimRow][pivotCol] / updatedMatrix[pivotRow][pivotCol];
            
            for (let j = pivotCol; j < n; j++) {
              updatedMatrix[elimRow][j] -= factor * updatedMatrix[pivotRow][j];
            }
            updatedVector[elimRow] -= factor * updatedVector[pivotRow];
            
            newState.highlightedRows = [pivotRow, elimRow];
            newState.message = `Eliminating row ${elimRow+1} using row ${pivotRow+1}`;
            newState.eliminationRow += 1;
            
            // If we've eliminated all rows below the pivot
            if (newState.eliminationRow >= n) {
              // Move to next pivot
              newState.pivotRow += 1;
              newState.pivotCol += 1;
              newState.eliminationRow = -1;
              
              // Check if we've completed forward elimination
              if (newState.pivotRow >= n) {
                newState.phase = "backward";
                newState.pivotRow = n - 1;
                newState.pivotCol = n - 1;
                newState.eliminationRow = -1;
                newState.message = "Starting back-substitution phase...";
              } else {
                newState.message = `Moving to next pivot (${newState.pivotRow+1},${newState.pivotCol+1})`;
              }
            }
          }
        }
      }
      // Back-substitution phase
      else if (newState.phase === "backward") {
        const row = newState.pivotRow;
        
        // Highlight current row
        newState.highlightedRows = [row];
        newState.highlightedCols = [row]; // Assuming square matrix
        
        // Check if we need to normalize the pivot
        if (Math.abs(updatedMatrix[row][row] - 1.0) > 1e-10) {
          // Normalize the row by dividing by the pivot
          const pivotValue = updatedMatrix[row][row];
          
          if (Math.abs(pivotValue) < 1e-10) {
            // Singular matrix, can't solve
            newState.message = "Matrix is singular, cannot solve system";
            newState.phase = "complete";
            
            // Store completion result
            newState.completionResult = {
              solved: false,
              steps: newState.steps,
              solution: null,
              complexity: "O(n³)"
            };
            
            return newState;
          }
          
          for (let j = 0; j < n; j++) {
            updatedMatrix[row][j] /= pivotValue;
          }
          updatedVector[row] /= pivotValue;
          
          newState.message = `Normalizing row ${row+1}`;
          return newState;
        }
        
        // Perform back-substitution
        if (row > 0) {
          newState.pivotRow -= 1;
          newState.message = `Back-substituting row ${row}`;
          
          // Substitute this row's value into all rows above
          for (let i = 0; i < row; i++) {
            const factor = updatedMatrix[i][row];
            updatedMatrix[i][row] = 0;
            updatedVector[i] -= factor * updatedVector[row];
          }
        } else {
          // We've completed back-substitution
          const solution = [...updatedVector];
          
          newState.solution = solution;
          newState.message = "Solution found!";
          newState.phase = "complete";
          
          // Store completion result
          newState.completionResult = {
            solved: true,
            steps: newState.steps,
            solution: solution,
            complexity: "O(n³)"
          };
        }
      }
      
      newState.currentMatrix = updatedMatrix;
      newState.currentVector = updatedVector;
      
      return newState;
    });
  }, [matrix, vector, onStepComplete, onSolveComplete]);

  // Advance simulation when currentStep changes
  useEffect(() => {
    if (currentStep > state.steps && state.phase !== "complete") {
      simulateStep();
    }
  }, [currentStep, state.steps, state.phase, simulateStep]);
  
  // Handle completion notification in a separate useEffect
  useEffect(() => {
    if (state.phase === "complete" && state.completionResult && onSolveComplete) {
      // Use setTimeout to avoid React state update errors
      setTimeout(() => {
        onSolveComplete(state.completionResult);
      }, 0);
    }
  }, [state.phase, state.completionResult, onSolveComplete]);

  // Helper function to format numbers nicely
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "";
    
    // Handle very small numbers that should be zero
    if (Math.abs(num) < 1e-10) return "0";
    
    // Format to 2 decimal places and remove trailing zeros
    return parseFloat(num.toFixed(2)).toString();
  };

  return (
    <div className="bg-black/30 p-6 rounded-lg border border-indigo-500/30 h-full">
      <h3 className="text-xl font-bold mb-4 text-white font-orbitron">
        Classical Gaussian Elimination
      </h3>
      
      {/* Algorithm explanation */}
      <div className="mb-4 text-sm text-gray-300 bg-black/40 p-3 rounded-lg">
        <p>
          Gaussian elimination solves linear systems by transforming the augmented matrix to row echelon form.
          <br />
          <span className="text-indigo-300 font-medium">Time Complexity: O(n³)</span>
        </p>
      </div>
      
      {/* Visualization area */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          {state.phase === "forward" ? "Forward Elimination" : 
           state.phase === "backward" ? "Back-Substitution" : 
           state.phase === "complete" ? "Solution" : "Initial System"}
        </h4>
        
        <div className="flex space-x-4 items-center justify-center">
          {/* Matrix A */}
          <div className="relative bg-black/40 p-4 rounded-lg">
            {state.currentMatrix.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex mb-2">
                {row.map((value, colIndex) => (
                  <motion.div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`
                      w-12 h-12 flex items-center justify-center m-1 rounded-md border
                      ${state.highlightedRows.includes(rowIndex) && state.highlightedCols.includes(colIndex) 
                        ? 'border-yellow-400 bg-yellow-900/30' 
                        : state.highlightedRows.includes(rowIndex) 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : state.highlightedCols.includes(colIndex)
                            ? 'border-purple-500 bg-purple-900/20'
                            : 'border-gray-700 bg-gray-800/50'
                      }
                    `}
                    initial={{ opacity: 0.6 }}
                    animate={{ 
                      opacity: 1,
                      scale: (state.highlightedRows.includes(rowIndex) && state.highlightedCols.includes(colIndex)) ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm font-roboto-mono">
                      {formatNumber(value)}
                    </span>
                  </motion.div>
                ))}
              </div>
            ))}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 text-xl text-white">A</div>
          </div>
          
          {/* Vector x (shown only in solution phase) */}
          {state.phase === "complete" && state.solution && (
            <>
              <div className="text-2xl text-white font-bold">×</div>
              <div className="relative bg-black/40 p-4 rounded-lg">
                {state.solution.map((value, index) => (
                  <motion.div
                    key={`x-${index}`}
                    className="w-12 h-12 flex items-center justify-center m-1 rounded-md border border-green-500 bg-green-900/30 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className="text-sm font-roboto-mono">
                      {formatNumber(value)}
                    </span>
                  </motion.div>
                ))}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 text-xl text-white">x</div>
              </div>
              <div className="text-2xl text-white font-bold">=</div>
            </>
          )}
          
          {/* Vector b */}
          <div className="relative bg-black/40 p-4 rounded-lg">
            {state.currentVector.map((value, index) => (
              <motion.div
                key={`b-${index}`}
                className={`
                  w-12 h-12 flex items-center justify-center m-1 rounded-md border mb-2
                  ${state.highlightedRows.includes(index) 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-gray-700 bg-gray-800/50'
                  }
                `}
                initial={{ opacity: 0.6 }}
                animate={{ 
                  opacity: 1,
                  scale: state.highlightedRows.includes(index) ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-roboto-mono">
                  {formatNumber(value)}
                </span>
              </motion.div>
            ))}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 text-xl text-white">b</div>
          </div>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="mt-4 text-sm text-gray-300 bg-black/30 p-3 rounded-md border border-white/10">
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${isRunning ? 'animate-pulse' : ''}`}
            style={{ 
              backgroundColor: state.phase === "complete" 
                ? state.solution ? '#22c55e' : '#f87171'
                : state.phase !== "init" 
                  ? '#facc15' 
                  : '#6b7280'
            }}
          ></div>
          <p>{state.message}</p>
        </div>
        
        {state.phase !== "init" && (
          <div className="mt-2 text-xs text-gray-400">
            Phase: {state.phase.charAt(0).toUpperCase() + state.phase.slice(1)}
            {state.phase === "complete" && state.solution && (
              <span className="ml-2">
                Solution: [{state.solution.map(formatNumber).join(", ")}]
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicalGaussianElimination;
