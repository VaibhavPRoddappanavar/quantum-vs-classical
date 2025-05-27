"use client";

import { motion } from "framer-motion";

/**
 * Dynamic Comparison Section Component
 * 
 * This component displays a dynamic comparison between classical and quantum algorithms
 * based on the actual simulation results
 */
const DynamicComparisonSection = ({ 
  classicalResult, 
  quantumResult, 
  arraySize 
}) => {
  // Calculate theoretical speedup
  const theoreticalSpeedup = arraySize > 0 ? Math.sqrt(arraySize).toFixed(2) : "N/A";
  
  // Calculate actual speedup if both algorithms completed
  const actualSpeedup = (classicalResult.steps > 0 && quantumResult.steps > 0) 
    ? (classicalResult.steps / quantumResult.steps).toFixed(2)
    : "N/A";
  
  // Determine if quantum algorithm was actually faster
  const quantumWasFaster = actualSpeedup !== "N/A" && parseFloat(actualSpeedup) > 1;
  
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
                <span className="text-gray-400">Array Size:</span>
                <span className="text-white font-medium">{arraySize}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Classical Steps:</span>
                <span className="text-white font-medium">
                  {classicalResult.steps > 0 ? classicalResult.steps : "N/A"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Quantum Iterations:</span>
                <span className="text-white font-medium">
                  {quantumResult.steps > 0 ? quantumResult.steps : "N/A"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Target Found:</span>
                <span className={`font-medium ${classicalResult.found || quantumResult.found ? 'text-green-400' : 'text-red-400'}`}>
                  {classicalResult.found || quantumResult.found ? "Yes" : "No"}
                </span>
              </div>
            </div>
            
            {(classicalResult.found || quantumResult.found) && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Found at Index:</span>
                  <span className="text-white font-medium">
                    {classicalResult.found ? classicalResult.index : quantumResult.index}
                  </span>
                </div>
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
              <span className="text-white font-medium">O(n)</span>
            </div>
            
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Quantum Complexity:</span>
              <span className="text-white font-medium">O(√n)</span>
            </div>
            
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Theoretical Speedup:</span>
              <span className="text-indigo-300 font-medium">{theoreticalSpeedup}x</span>
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
            {generateAnalysisText(classicalResult, quantumResult, arraySize, actualSpeedup, quantumWasFaster)}
          </p>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Generates dynamic analysis text based on simulation results
 */
function generateAnalysisText(classicalResult, quantumResult, arraySize, actualSpeedup, quantumWasFaster) {
  if (classicalResult.steps === 0 && quantumResult.steps === 0) {
    return "Run the simulation to see a detailed analysis of both algorithms.";
  }
  
  let analysis = "";
  
  // If both algorithms completed
  if (classicalResult.steps > 0 && quantumResult.steps > 0) {
    if (quantumWasFaster) {
      analysis = `In this simulation with ${arraySize} elements, Grover's quantum search algorithm demonstrated a ${actualSpeedup}x speedup over classical linear search. `;
      
      if (parseFloat(actualSpeedup) < Math.sqrt(arraySize)) {
        analysis += `While this is impressive, the theoretical maximum speedup for this array size would be approximately ${Math.sqrt(arraySize).toFixed(2)}x. `;
      } else {
        analysis += `This closely matches the theoretical speedup of ${Math.sqrt(arraySize).toFixed(2)}x for an array of this size. `;
      }
    } else {
      analysis = `In this simulation, classical linear search performed better than expected compared to Grover's algorithm. `;
      
      if (classicalResult.found && classicalResult.index < Math.sqrt(arraySize)) {
        analysis += `This is because the target was found early in the array (at index ${classicalResult.index}), which is a best-case scenario for linear search. `;
      } else {
        analysis += `This can happen in smaller arrays or specific arrangements where the overhead of quantum operations doesn't yet show its advantage. `;
      }
      
      analysis += `For larger datasets, Grover's algorithm would demonstrate its O(√n) advantage more clearly. `;
    }
    
    // Add information about target finding
    if (classicalResult.found && quantumResult.found) {
      analysis += `Both algorithms successfully found the target at index ${classicalResult.index}. `;
    } else if (classicalResult.found) {
      analysis += `Only the classical algorithm found the target at index ${classicalResult.index}. `;
    } else if (quantumResult.found) {
      analysis += `Only the quantum algorithm found the target at index ${quantumResult.index}. `;
    } else {
      analysis += `Neither algorithm found the target in the array. `;
    }
  } 
  // If only classical algorithm completed
  else if (classicalResult.steps > 0) {
    analysis = `The classical linear search algorithm ${classicalResult.found ? `found the target at index ${classicalResult.index}` : "did not find the target"} after checking ${classicalResult.steps} elements. The quantum simulation has not completed yet. `;
  } 
  // If only quantum algorithm completed
  else if (quantumResult.steps > 0) {
    analysis = `Grover's quantum search algorithm ${quantumResult.found ? `found the target at index ${quantumResult.index}` : "did not find the target"} after ${quantumResult.steps} iterations. The classical simulation has not completed yet. `;
  }
  
  // Add general educational information
  analysis += `Grover's algorithm provides a quadratic speedup over classical search, which becomes increasingly significant with larger datasets. For a database of size n, classical search requires O(n) operations, while Grover's algorithm requires only O(√n) operations.`;
  
  return analysis;
}

export default DynamicComparisonSection;
