"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProblemSelector from '../components/ProblemSelector';

export default function SimulatorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="w-full flex justify-start mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block">
              <button className="px-4 py-2 bg-black/30 hover:bg-black/50 text-white rounded-lg border border-white/10 transition-colors duration-200 focus-visible-ring flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Back to Home</span>
              </button>
            </Link>
          </motion.div>
        </div>
        
        {/* Page Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl font-bold text-white font-orbitron tracking-wider inline-block">
            Algorithm Simulator
          </h1>
          <div className="h-1 w-64 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mt-2 rounded-full"></div>
        </motion.div>
        
        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Search Algorithm Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            <Link href="/simulator/search" className="block">
              <h2 className="text-2xl font-bold mb-4">Search Algorithm</h2>
              <p className="text-gray-300 mb-4">Compare classical and quantum search algorithms and visualize their performance differences.</p>
              <div className="flex justify-end">
                <span className="text-blue-400 hover:text-blue-300 transition-colors">Explore →</span>
              </div>
            </Link>
          </motion.div>

          {/* Factorization Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            <Link href="/simulator/factorization" className="block">
              <h2 className="text-2xl font-bold mb-4">Integer Factorization</h2>
              <p className="text-gray-300 mb-4">Experience the power of Shor's algorithm compared to classical factorization methods.</p>
              <div className="flex justify-end">
                <span className="text-blue-400 hover:text-blue-300 transition-colors">Explore →</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
