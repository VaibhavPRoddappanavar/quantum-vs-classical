'use client';

import { motion } from 'framer-motion';

export default function PerformanceComparison({ classicalSteps, quantumSteps, number }) {
  const speedup = classicalSteps / quantumSteps;
  
  // Calculate theoretical complexities
  const classicalComplexity = Math.sqrt(number);
  const quantumComplexity = Math.pow(Math.log2(number), 3);
  
  // Calculate relative bar widths (max 100%)
  const maxComplexity = Math.max(classicalComplexity, quantumComplexity);
  const classicalWidth = (classicalComplexity / maxComplexity) * 100;
  const quantumWidth = (quantumComplexity / maxComplexity) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Performance Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-xl mb-4">Steps Taken</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Classical</span>
                <span>{classicalSteps} steps</span>
              </div>
              <div className="h-4 bg-gray-700 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-full bg-red-500"
                  style={{ width: `${(classicalSteps / Math.max(classicalSteps, quantumSteps)) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Quantum</span>
                <span>{quantumSteps} steps</span>
              </div>
              <div className="h-4 bg-gray-700 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-full bg-blue-500"
                  style={{ width: `${(quantumSteps / Math.max(classicalSteps, quantumSteps)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl mb-4">Theoretical Complexity</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>O(√n)</span>
                <span>{classicalComplexity.toFixed(2)} units</span>
              </div>
              <div className="h-4 bg-gray-700 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${classicalWidth}%` }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>O((log n)³)</span>
                <span>{quantumComplexity.toFixed(2)} units</span>
              </div>
              <div className="h-4 bg-gray-700 rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${quantumWidth}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg">
        <h3 className="text-xl mb-2">Conclusion</h3>
        <p className="text-gray-300">
          For n = {number}:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2 text-gray-300">
          <li>Classical algorithm took {classicalSteps} steps using trial division</li>
          <li>Quantum algorithm took {quantumSteps} steps using Shor's algorithm</li>
          <li>The quantum approach was {speedup.toFixed(2)}x faster in terms of steps</li>
          <li>Theoretical speedup becomes more dramatic as numbers get larger</li>
        </ul>
      </div>
    </motion.div>
  );
}
