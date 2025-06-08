"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * Quantum HHL Algorithm Simulation Component
 * 
 * This component visualizes the quantum HHL algorithm step by step
 * for solving a system of linear equations Ax = b
 */
const QuantumHHLAlgorithm = ({ 
  matrix, 
  vector, 
  currentStep,
  isRunning,
  onStepComplete,
  onSolveComplete
}) => {
  // Simulation state
  const [state, setState] = useState({
    phase: "init", // init, qpe, rotation, iqpe, measurement, complete
    qubits: {
      clock: Array(3).fill({ value: 0, probability: 1 }),
      eigenvalue: Array(3).fill({ value: 0, probability: 1 }),
      ancilla: { value: 0, probability: 1 },
      solution: Array(3).fill({ value: 0, probability: 1/3 })
    },
    eigenvalues: [],
    currentCircuitStep: -1,
    highlightedGate: null,
    solution: null,
    normalizedSolution: null,
    message: "Waiting to start...",
    steps: 0
  });

  // Reset simulation when matrix or vector changes
  useEffect(() => {
    if (matrix && matrix.length > 0 && vector && vector.length > 0) {
      // Initialize with equal superposition for solution register
      const n = matrix.length;
      const initialSolutionRegister = Array(n).fill({ value: 0, probability: 1/n });
      
      // Pre-compute eigenvalues for the simulation
      // In a real quantum computer, these would be discovered through QPE
      const eigenvalues = computeEigenvalues(matrix);
      
      setState({
        phase: "init",
        qubits: {
          clock: Array(3).fill({ value: 0, probability: 1 }),
          eigenvalue: Array(3).fill({ value: 0, probability: 1 }),
          ancilla: { value: 0, probability: 1 },
          solution: initialSolutionRegister
        },
        eigenvalues: eigenvalues,
        currentCircuitStep: -1,
        highlightedGate: null,
        solution: null,
        normalizedSolution: null,
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
        // Initialize with equal superposition for solution register
        const n = matrix.length;
        const initialSolutionRegister = Array(n).fill({ value: 0, probability: 1/n });
        
        // Pre-compute eigenvalues for the simulation
        const eigenvalues = computeEigenvalues(matrix);
        
        setState({
          phase: "init",
          qubits: {
            clock: Array(3).fill({ value: 0, probability: 1 }),
            eigenvalue: Array(3).fill({ value: 0, probability: 1 }),
            ancilla: { value: 0, probability: 1 },
            solution: initialSolutionRegister
          },
          eigenvalues: eigenvalues,
          currentCircuitStep: -1,
          highlightedGate: null,
          solution: null,
          normalizedSolution: null,
          message: "Waiting to start...",
          steps: 0
        });
      }
    }
  }, [currentStep, matrix, vector, state.steps]);

  // Simulate one step of HHL algorithm
  const simulateStep = useCallback(() => {
    setState(prevState => {
      // If already complete, don't do anything
      if (prevState.phase === "complete") {
        return prevState;
      }

      const newState = { ...prevState };
      newState.steps += 1;
      
      // Initialize phase if needed
      if (newState.phase === "init") {
        newState.phase = "qpe";
        newState.currentCircuitStep = 0;
        newState.message = "Starting Quantum Phase Estimation...";
        
        // Apply Hadamard gates to clock register (create superposition)
        const clockRegister = newState.qubits.clock.map(() => ({
          value: "H", // Represents superposition
          probability: 0.5 // Equal probability for |0⟩ and |1⟩
        }));
        
        newState.qubits = {
          ...newState.qubits,
          clock: clockRegister
        };
        
        newState.highlightedGate = "hadamard";
        
        return newState;
      }
      
      // Quantum Phase Estimation phase
      if (newState.phase === "qpe") {
        if (newState.currentCircuitStep < 2) {
          // Simulate controlled-U operations
          newState.currentCircuitStep += 1;
          newState.message = `QPE: Applying controlled unitary operations (step ${newState.currentCircuitStep})`;
          
          // Update eigenvalue register to show it's being affected
          const eigenvalueRegister = newState.qubits.eigenvalue.map((qubit, idx) => ({
            value: idx < newState.currentCircuitStep ? "φ" : 0, // φ represents eigenphase
            probability: 0.5
          }));
          
          newState.qubits = {
            ...newState.qubits,
            eigenvalue: eigenvalueRegister
          };
          
          newState.highlightedGate = "controlled-u";
        } else {
          // Complete QPE phase - eigenvalues are now encoded in eigenvalue register
          newState.phase = "rotation";
          newState.currentCircuitStep = 0;
          newState.message = "QPE complete. Starting controlled rotation based on eigenvalues...";
          
          // Represent eigenvalues in the eigenvalue register
          const eigenvalueRegister = newState.eigenvalues.map(val => ({
            value: formatEigenvalue(val),
            probability: 1/newState.eigenvalues.length
          }));
          
          newState.qubits = {
            ...newState.qubits,
            eigenvalue: eigenvalueRegister
          };
          
          newState.highlightedGate = "inverse-qft";
        }
        
        return newState;
      }
      
      // Controlled rotation phase
      if (newState.phase === "rotation") {
        // Apply controlled rotation to ancilla qubit
        newState.message = "Applying controlled rotation to ancilla qubit based on eigenvalues";
        
        // Update ancilla qubit to show rotation
        newState.qubits = {
          ...newState.qubits,
          ancilla: { value: "R", probability: 0.5 } // R represents rotated state
        };
        
        newState.phase = "iqpe";
        newState.currentCircuitStep = 0;
        newState.highlightedGate = "controlled-rotation";
        
        return newState;
      }
      
      // Inverse Quantum Phase Estimation phase
      if (newState.phase === "iqpe") {
        if (newState.currentCircuitStep < 2) {
          // Simulate inverse QPE operations
          newState.currentCircuitStep += 1;
          newState.message = `Inverse QPE: Applying inverse operations (step ${newState.currentCircuitStep})`;
          
          // Update eigenvalue register to show it's being reset
          const eigenvalueRegister = newState.qubits.eigenvalue.map((qubit, idx) => ({
            value: idx >= newState.currentCircuitStep ? "φ" : 0,
            probability: idx >= newState.currentCircuitStep ? 0.5 : 1
          }));
          
          newState.qubits = {
            ...newState.qubits,
            eigenvalue: eigenvalueRegister
          };
          
          newState.highlightedGate = "inverse-controlled-u";
        } else {
          // Complete inverse QPE phase
          newState.phase = "measurement";
          newState.message = "Inverse QPE complete. Measuring the solution register...";
          
          // Reset eigenvalue register
          const eigenvalueRegister = newState.qubits.eigenvalue.map(() => ({
            value: 0,
            probability: 1
          }));
          
          // Update solution register with amplitudes proportional to 1/λ
          const solutionRegister = newState.eigenvalues.map((eigenvalue, idx) => {
            // In HHL, amplitude is proportional to 1/λ
            const amplitude = Math.min(1.0 / Math.abs(eigenvalue), 5);
            return {
              value: idx,
              probability: amplitude * amplitude // Probability is amplitude squared
            };
          });
          
          // Normalize probabilities
          const totalProb = solutionRegister.reduce((sum, q) => sum + q.probability, 0);
          const normalizedSolutionRegister = solutionRegister.map(q => ({
            ...q,
            probability: q.probability / totalProb
          }));
          
          newState.qubits = {
            ...newState.qubits,
            eigenvalue: eigenvalueRegister,
            solution: normalizedSolutionRegister
          };
          
          newState.highlightedGate = "hadamard";
        }
        
        return newState;
      }
      
      // Measurement phase
      if (newState.phase === "measurement") {
        // Calculate the solution vector
        const n = matrix.length;
        const rawSolution = Array(n).fill(0);
        
        // Convert quantum state probabilities to solution vector
        newState.qubits.solution.forEach((qubit, idx) => {
          rawSolution[idx] = Math.sqrt(qubit.probability);
        });
        
        // Normalize the solution
        const normFactor = Math.sqrt(rawSolution.reduce((sum, val) => sum + val * val, 0));
        const normalizedSolution = rawSolution.map(val => val / normFactor);
        
        // Scale to match the classical solution (this is a simulation simplification)
        const scaledSolution = scaleQuantumSolution(normalizedSolution, matrix, vector);
        
        newState.solution = scaledSolution;
        newState.normalizedSolution = normalizedSolution;
        newState.message = "Solution found through quantum measurement!";
        newState.phase = "complete";
        newState.highlightedGate = "measurement";
        
        // Store completion result
        newState.completionResult = {
          solved: true,
          steps: newState.steps,
          solution: scaledSolution,
          complexity: "O(log(n))"
        };
      }
      
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

  // Helper function to compute eigenvalues (simplified for simulation)
  const computeEigenvalues = (matrix) => {
    // This is a simplified approach - in reality, eigenvalues would be discovered through QPE
    // For a 3x3 matrix, we'll return 3 approximate eigenvalues
    // In a real implementation, we would compute actual eigenvalues
    
    // Simple approximation based on diagonal elements
    return matrix.map((row, idx) => Math.max(0.1, Math.abs(row[idx])));
  };
  
  // Helper function to format eigenvalues for display
  const formatEigenvalue = (val) => {
    return val.toFixed(1);
  };
  
  // Helper function to scale quantum solution to match classical solution
  const scaleQuantumSolution = (normalizedSolution, matrix, vector) => {
    // In a real quantum computer, we would need to perform additional steps
    // to get the correct scaling. This is a simulation simplification.
    
    // Simple scaling approach - scale to make the largest component match
    const maxComponent = Math.max(...normalizedSolution);
    const maxVectorComponent = Math.max(...vector);
    
    const scaleFactor = maxVectorComponent / maxComponent;
    return normalizedSolution.map(val => val * scaleFactor);
  };
  
  // Helper function to format numbers nicely
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "";
    
    // Handle very small numbers that should be zero
    if (Math.abs(num) < 1e-10) return "0";
    
    // Format to 2 decimal places and remove trailing zeros
    return parseFloat(num.toFixed(2)).toString();
  };

  // Get the maximum probability for scaling visualizations
  const maxProb = Math.max(...state.qubits.solution.map(q => q.probability || 0), 0.01);

  return (
    <div className="bg-black/30 p-6 rounded-lg border border-indigo-500/30 h-full">
      <h3 className="text-xl font-bold mb-4 text-white font-orbitron">
        Quantum HHL Algorithm
      </h3>
      
      {/* Algorithm explanation */}
      <div className="mb-4 text-sm text-gray-300 bg-black/40 p-3 rounded-lg">
        <p>
          HHL algorithm uses quantum phase estimation and amplitude amplification to solve linear systems.
          <br />
          <span className="text-indigo-300 font-medium">Time Complexity: O(log(n))</span>
        </p>
      </div>
      
      {/* Visualization area */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          {state.phase === "qpe" ? "Quantum Phase Estimation" : 
           state.phase === "rotation" ? "Controlled Rotation" : 
           state.phase === "iqpe" ? "Inverse Phase Estimation" :
           state.phase === "measurement" ? "Measurement" :
           state.phase === "complete" ? "Solution" : "Initial State"}
        </h4>
        
        {/* Quantum Circuit Visualization */}
        <div className="bg-black/40 p-4 rounded-lg mb-4">
          <div className="flex flex-col space-y-3">
            {/* Clock register */}
            <div className="flex items-center">
              <div className="w-20 text-right pr-2 text-sm text-gray-300">Clock:</div>
              <div className="flex space-x-2">
                {state.qubits.clock.map((qubit, idx) => (
                  <motion.div
                    key={`clock-${idx}`}
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-md border
                      ${state.highlightedGate === "hadamard" ? 'border-yellow-400 bg-yellow-900/30' : 'border-gray-700 bg-gray-800/50'}
                    `}
                    initial={{ opacity: 0.6 }}
                    animate={{ 
                      opacity: 1,
                      scale: state.highlightedGate === "hadamard" ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm font-roboto-mono">
                      {qubit.value === "H" ? "H" : qubit.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Eigenvalue register */}
            <div className="flex items-center">
              <div className="w-20 text-right pr-2 text-sm text-gray-300">Eigenvalue:</div>
              <div className="flex space-x-2">
                {state.qubits.eigenvalue.map((qubit, idx) => (
                  <motion.div
                    key={`eigenvalue-${idx}`}
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-md border
                      ${(state.highlightedGate === "controlled-u" || state.highlightedGate === "inverse-controlled-u" || state.highlightedGate === "inverse-qft") 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : 'border-gray-700 bg-gray-800/50'}
                    `}
                    initial={{ opacity: 0.6 }}
                    animate={{ 
                      opacity: 1,
                      scale: (state.highlightedGate === "controlled-u" || state.highlightedGate === "inverse-controlled-u" || state.highlightedGate === "inverse-qft") ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm font-roboto-mono">
                      {qubit.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Ancilla qubit */}
            <div className="flex items-center">
              <div className="w-20 text-right pr-2 text-sm text-gray-300">Ancilla:</div>
              <div className="flex space-x-2">
                <motion.div
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-md border
                    ${state.highlightedGate === "controlled-rotation" ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800/50'}
                  `}
                  initial={{ opacity: 0.6 }}
                  animate={{ 
                    opacity: 1,
                    scale: state.highlightedGate === "controlled-rotation" ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-roboto-mono">
                    {state.qubits.ancilla.value}
                  </span>
                </motion.div>
              </div>
            </div>
            
            {/* Solution register */}
            <div className="flex items-center">
              <div className="w-20 text-right pr-2 text-sm text-gray-300">Solution:</div>
              <div className="flex space-x-2">
                {state.qubits.solution.map((qubit, idx) => (
                  <motion.div
                    key={`solution-${idx}`}
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-md border
                      ${state.phase === "complete" ? 'border-green-500 bg-green-900/30' : 'border-gray-700 bg-gray-800/50'}
                    `}
                    initial={{ opacity: 0.6 }}
                    animate={{ 
                      opacity: 1,
                      scale: state.phase === "complete" ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm font-roboto-mono">
                      {qubit.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Amplitude Visualization */}
        <div className="bg-black/40 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Solution State Amplitudes
          </h4>
          
          <div className="flex justify-center items-end h-32 space-x-2">
            {state.qubits.solution.map((qubit, idx) => (
              <div key={`amp-${idx}`} className="flex flex-col items-center">
                <motion.div
                  className="w-12 bg-indigo-500 rounded-t-md flex items-center justify-center"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: Math.max(5, (qubit.probability / maxProb) * 100),
                    backgroundColor: state.phase === "complete" ? "#22c55e" : "#6366f1"
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-xs text-white font-bold">
                    {(qubit.probability * 100).toFixed(0)}%
                  </span>
                </motion.div>
                <div className="text-xs text-gray-400 mt-1">|{idx}⟩</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Solution display (shown only in complete phase) */}
      {state.phase === "complete" && state.solution && (
        <div className="mt-4 bg-black/30 p-3 rounded-md border border-green-500/30">
          <h4 className="text-sm font-medium text-white mb-2">Quantum Solution</h4>
          <div className="flex justify-center space-x-2">
            {state.solution.map((value, idx) => (
              <motion.div
                key={`sol-${idx}`}
                className="w-12 h-12 flex items-center justify-center rounded-md border border-green-500 bg-green-900/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <span className="text-sm font-roboto-mono">
                  {formatNumber(value)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Status indicator */}
      <div className="mt-4 text-sm text-gray-300 bg-black/30 p-3 rounded-md border border-white/10">
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${isRunning ? 'animate-pulse' : ''}`}
            style={{ 
              backgroundColor: state.phase === "complete" 
                ? '#22c55e'
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
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantumHHLAlgorithm;
