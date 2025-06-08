"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LinearEquationsProblemSimulator from "../../components/problems/LinearEquationsProblemSimulator";

export default function LinearEquationsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="w-full flex justify-end mb-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/simulator" className="inline-block">
                <button className="px-4 py-2 bg-black/30 hover:bg-black/50 text-white rounded-lg border border-white/10 transition-colors duration-200 focus-visible-ring flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Back to Problems</span>
                </button>
              </Link>
            </motion.div>
          </div>
          
          <motion.div
            className="text-center mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl font-bold text-white font-orbitron tracking-wider inline-block">
              Linear Equations
            </h1>
            <div className="h-1 w-48 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mt-2 rounded-full"></div>
          </motion.div>
        </div>
        
        <LinearEquationsProblemSimulator />
      </div>
    </main>
  );
}
