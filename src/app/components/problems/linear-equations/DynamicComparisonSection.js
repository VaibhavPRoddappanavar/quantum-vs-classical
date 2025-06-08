"use client";

import { motion } from "framer-motion";

/**
 * Dynamic Comparison Section Component for Linear Equations
 * 
 * This component displays a dynamic comparison between classical and quantum algorithms
 * for solving systems of linear equations
 */
const DynamicComparisonSection = ({ 
  classicalResult, 
  quantumResult, 
  matrixSize 
}) => {
  // Calculate theoretical speedup
  // For HHL, the theoretical speedup is exponential: O(N³) vs O(log N)
  const theoreticalSpeedup = matrixSize > 0 ? `O(N³) vs O(log N)` : "N/A";
  
  // Calculate actual speedup if both algorithms completed
  const actualSpeedup = (classicalResult.steps > 0 && quantumResult.steps > 0) 
    ? (classicalResult.steps / quantumResult.steps).toFixed(2)
    : "N/A";
  
  // Determine if quantum algorithm was actually faster
  const quantumWasFaster = actualSpeedup !== "N/A" && parseFloat(actualSpeedup) > 1;
  
  // Helper function to format solution vectors nicely
  const formatSolution = (solution) => {
    if (!solution || !Array.isArray(solution)) return "N/A";
    return "[" + solution.map(val => {
      if (typeof val !== 'number') return 'N/A';
      return parseFloat(val.toFixed(2)).toString();
    }).join(", ") + "]";
  };
  
  // Calculate solution error if both algorithms have solutions
  const solutionError = (classicalResult.solution && quantumResult.solution) 
    ? calculateError(classicalResult.solution, quantumResult.solution)
    : "N/A";
  
  return (
    <div className="bg-black/30 p-6 rounded-lg border border-indigo-500/30 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-white font-orbitron text-center">
        Algorithm Comparison Analysis
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Results Summary */}
        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
          <h4 className="text-lg font-semibold mb-3 text-white">Results Summary</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Matrix Size:</span>
                <span className="text-white font-medium">{matrixSize}×{matrixSize}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Classical Steps:</span>
                <span className="text-white font-medium">
                  {classicalResult.steps > 0 ? classicalResult.steps : "N/A"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Quantum Steps:</span>
                <span className="text-white font-medium">
                  {quantumResult.steps > 0 ? quantumResult.steps : "N/A"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Solution Found:</span>
                <span className={`font-medium ${classicalResult.solved || quantumResult.solved ? 'text-green-400' : 'text-red-400'}`}>
                  {classicalResult.solved || quantumResult.solved ? "Yes" : "No"}
                </span>
              </div>
            </div>
            
            {(classicalResult.solved || quantumResult.solved) && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Classical Solution:</span>
                  <span className="text-white font-medium font-roboto-mono text-xs">
                    {formatSolution(classicalResult.solution)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quantum Solution:</span>
                  <span className="text-white font-medium font-roboto-mono text-xs">
                    {formatSolution(quantumResult.solution)}
                  </span>
                </div>
                {solutionError !== "N/A" && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Solution Error:</span>
                    <span className="text-white font-medium">
                      {solutionError}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Performance Comparison */}
        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
          <h4 className="text-lg font-semibold mb-3 text-white">Performance Comparison</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Classical Complexity:</span>
              <span className="text-white font-medium">O(n³)</span>
            </div>
            
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Quantum Complexity:</span>
              <span className="text-white font-medium">O(log n)</span>
            </div>
            
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Theoretical Speedup:</span>
              <span className="text-indigo-300 font-medium">{theoreticalSpeedup}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Actual Speedup:</span>
              <span className={`font-medium ${
                actualSpeedup !== "N/A" 
                  ? quantumWasFaster 
                    ? 'text-green-400' 
                    : 'text-yellow-400'
                  : 'text-gray-400'
              }`}>
                {actualSpeedup}x
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Analysis */}
      {(classicalResult.steps > 0 || quantumResult.steps > 0) && (
        <motion.div 
          className="mt-6 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-lg font-semibold mb-2 text-white">Analysis</h4>
          
          <p className="text-gray-300 text-sm leading-relaxed">
            {generateAnalysisText(classicalResult, quantumResult, matrixSize, actualSpeedup, quantumWasFaster, solutionError)}
          </p>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Calculate error percentage between two solution vectors
 */
function calculateError(solution1, solution2) {
  if (!solution1 || !solution2 || solution1.length !== solution2.length) {
    return "N/A";
  }
  
  let sumSquaredDiff = 0;
  let sumSquaredMagnitude = 0;
  
  for (let i = 0; i < solution1.length; i++) {
    const diff = solution1[i] - solution2[i];
    sumSquaredDiff += diff * diff;
    sumSquaredMagnitude += solution1[i] * solution1[i];
  }
  
  if (sumSquaredMagnitude < 1e-10) {
    return "N/A"; // Avoid division by zero
  }
  
  const relativeError = Math.sqrt(sumSquaredDiff / sumSquaredMagnitude);
  return (relativeError * 100).toFixed(2);
}

/**
 * Generates dynamic analysis text based on simulation results
 */
function generateAnalysisText(classicalResult, quantumResult, matrixSize, actualSpeedup, quantumWasFaster, solutionError) {
  if (classicalResult.steps === 0 && quantumResult.steps === 0) {
    return "Run the simulation to see a detailed analysis of both algorithms.";
  }
  
  let analysis = "";
  
  // If both algorithms completed
  if (classicalResult.steps > 0 && quantumResult.steps > 0) {
    if (quantumWasFaster) {
      analysis = `In this simulation with a ${matrixSize}×${matrixSize} matrix, the quantum HHL algorithm demonstrated a ${actualSpeedup}x speedup over classical Gaussian elimination. `;
      
      analysis += `This showcases the potential of quantum algorithms for solving linear systems, which theoretically can achieve exponential speedup for larger systems. `;
    } else {
      analysis = `In this simulation, classical Gaussian elimination performed better than expected compared to the quantum HHL algorithm. `;
      
      analysis += `This is because our simulation is using a small matrix (${matrixSize}×${matrixSize}), where the overhead of quantum operations doesn't yet show its advantage. `;
      
      analysis += `For larger systems, the quantum algorithm would demonstrate its exponential advantage more clearly. `;
    }
    
    // Add information about solution accuracy
    if (solutionError !== "N/A") {
      if (parseFloat(solutionError) < 5) {
        analysis += `Both algorithms found very similar solutions with only ${solutionError}% relative error between them. `;
      } else if (parseFloat(solutionError) < 15) {
        analysis += `The solutions found by both algorithms have some differences, with a ${solutionError}% relative error. This is expected due to the approximations in the quantum simulation. `;
      } else {
        analysis += `The solutions have significant differences (${solutionError}% relative error), which may be due to the simplifications in our quantum simulation or numerical instability. `;
      }
    }
  } 
  // If only classical algorithm completed
  else if (classicalResult.steps > 0) {
    analysis = `The classical Gaussian elimination algorithm ${classicalResult.solved ? `found a solution` : "did not find a solution"} after ${classicalResult.steps} steps. The quantum simulation has not completed yet. `;
  } 
  // If only quantum algorithm completed
  else if (quantumResult.steps > 0) {
    analysis = `The quantum HHL algorithm ${quantumResult.solved ? `found a solution` : "did not find a solution"} after ${quantumResult.steps} steps. The classical simulation has not completed yet. `;
  }
  
  // Add general educational information
  analysis += `The HHL algorithm provides an exponential speedup over classical methods for solving linear systems, which becomes increasingly significant with larger matrices. For a system of size n, classical methods require O(n³) operations, while the quantum HHL algorithm requires only O(log n) operations, though with some caveats regarding the preparation and measurement of the quantum state.`;
  
  return analysis;
}

export default DynamicComparisonSection;
