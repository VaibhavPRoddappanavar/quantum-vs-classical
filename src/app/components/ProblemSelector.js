"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const problems = [
  {
    id: 'search',
    title: 'Search Problem',
    description: 'Compare classical Linear Search with quantum Grover\'s Algorithm',
    path: '/simulator/search',
    classicalAlgorithm: 'Linear Search (O(n))',
    quantumAlgorithm: 'Grover\'s Search (O(√n))',
    isAvailable: true
  },
  {
    id: 'factoring',
    title: 'Integer Factorization',
    description: 'Compare classical factoring algorithms with Shor\'s quantum algorithm',
    path: '/simulator/factoring',
    classicalAlgorithm: 'Trial Division (O(√n))',
    quantumAlgorithm: 'Shor\'s Algorithm (O((log n)³))',
    isAvailable: false
  },
  {
    id: 'optimization',
    title: 'Optimization Problem',
    description: 'Compare classical optimization with Quantum Approximate Optimization',
    path: '/simulator/optimization',
    classicalAlgorithm: 'Simulated Annealing (O(e^n))',
    quantumAlgorithm: 'QAOA (Polynomial)',
    isAvailable: false
  }
];

const ProblemSelector = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white font-orbitron tracking-wider inline-block">
          Select a Problem Type
        </h2>
        <div className="h-0.5 w-48 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto mt-2 rounded-full"></div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className={`relative bg-black/30 rounded-lg border overflow-hidden ${
              problem.isAvailable 
                ? 'border-indigo-500/30 cursor-pointer' 
                : 'border-gray-700/30 opacity-60'
            }`}
          >
            {!problem.isAvailable && (
              <div className="absolute top-2 right-2 bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded-full">
                Coming Soon
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-white font-orbitron">
                {problem.title}
              </h3>
              
              <p className="text-gray-300 mb-4 text-sm">
                {problem.description}
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Classical:</span>
                  <span className="text-white font-medium">{problem.classicalAlgorithm}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quantum:</span>
                  <span className="text-white font-medium">{problem.quantumAlgorithm}</span>
                </div>
              </div>
              
              {problem.isAvailable ? (
                <Link href={problem.path} className="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 text-center">
                  Open Simulator
                </Link>
              ) : (
                <button
                  className="w-full py-2 px-4 bg-gray-700 text-gray-300 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Not Available Yet
                </button>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSelector;
