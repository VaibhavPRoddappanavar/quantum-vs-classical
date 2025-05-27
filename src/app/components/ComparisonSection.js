"use client";

import { motion } from "framer-motion";

const ComparisonSection = ({ classicalResult, quantumResult, arraySize }) => {
  // Calculate theoretical steps
  const theoreticalClassical = arraySize; // O(n)
  const theoreticalQuantum = Math.ceil(Math.sqrt(arraySize)); // O(√n)
  
  // Calculate speedup
  const speedup = theoreticalClassical / theoreticalQuantum;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };
  
  return (
    <motion.div
      className="bg-black/30 p-6 rounded-lg border border-indigo-500/30"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-xl font-bold mb-6 text-white font-orbitron tracking-wide text-center">
        Algorithm Comparison Analysis
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Performance Metrics */}
        <motion.div 
          className="bg-black/40 p-4 rounded-lg border border-white/10"
          variants={itemVariants}
        >
          <h4 className="text-lg font-medium text-white mb-4">Performance Metrics</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Steps Required</h5>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Classical Linear Search:</p>
                  <p className="text-lg font-medium text-white">
                    {classicalResult.steps || 0} steps
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Quantum Grover's Search:</p>
                  <p className="text-lg font-medium text-white">
                    {quantumResult.steps || 0} steps
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Theoretical Complexity</h5>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Classical:</p>
                  <p className="text-lg font-medium text-white">O(n) = {theoreticalClassical} steps</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Quantum:</p>
                  <p className="text-lg font-medium text-white">O(√n) = {theoreticalQuantum} steps</p>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Search Result</h5>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Classical:</p>
                  <p className="text-lg font-medium text-white">
                    {classicalResult.found 
                      ? `Found at index ${classicalResult.index}` 
                      : "Not found"}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Quantum:</p>
                  <p className="text-lg font-medium text-white">
                    {quantumResult.found 
                      ? `Found at index ${quantumResult.index}` 
                      : "Not found"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Efficiency Analysis */}
        <motion.div 
          className="bg-black/40 p-4 rounded-lg border border-white/10"
          variants={itemVariants}
        >
          <h4 className="text-lg font-medium text-white mb-4">Efficiency Analysis</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Quantum Speedup</h5>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                      {speedup.toFixed(2)}x faster
                    </span>
                  </div>
                </div>
                <div className="flex h-4 mb-4 overflow-hidden text-xs bg-gray-700 rounded-full">
                  <motion.div 
                    className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (speedup / 10) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Quantum algorithms provide a quadratic speedup for search problems, 
                becoming more significant as the dataset grows.
              </p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Scaling with Data Size</h5>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center p-2 bg-black/30 rounded-lg">
                  <p className="text-xs text-gray-400">n = 100</p>
                  <p className="text-sm font-medium text-white">
                    <span className="text-red-400">100</span> vs <span className="text-green-400">10</span>
                  </p>
                </div>
                <div className="text-center p-2 bg-black/30 rounded-lg">
                  <p className="text-xs text-gray-400">n = 1,000</p>
                  <p className="text-sm font-medium text-white">
                    <span className="text-red-400">1000</span> vs <span className="text-green-400">32</span>
                  </p>
                </div>
                <div className="text-center p-2 bg-black/30 rounded-lg">
                  <p className="text-xs text-gray-400">n = 1,000,000</p>
                  <p className="text-sm font-medium text-white">
                    <span className="text-red-400">1M</span> vs <span className="text-green-400">1000</span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                As the dataset size increases, the quantum advantage becomes more pronounced.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Key Insights */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-4 rounded-lg border border-indigo-500/20"
        variants={itemVariants}
      >
        <h4 className="text-lg font-medium text-white mb-3">Key Insights</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="text-indigo-400 mr-2">•</span>
            <span>
              Quantum search provides a quadratic speedup (O(√n) vs O(n)) over classical search algorithms.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-400 mr-2">•</span>
            <span>
              For small datasets, the advantage may be negligible, but becomes significant as data size grows.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-400 mr-2">•</span>
            <span>
              Grover's algorithm is optimal - no quantum algorithm can solve an unstructured search problem faster than O(√n).
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-400 mr-2">•</span>
            <span>
              The quantum advantage comes from superposition and amplitude amplification, allowing simultaneous evaluation of multiple states.
            </span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default ComparisonSection;
