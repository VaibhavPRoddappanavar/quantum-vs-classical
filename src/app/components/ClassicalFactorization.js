'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function ClassicalFactorization({ steps, currentStep }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      <h2 className="text-2xl font-bold mb-4">Classical Trial Division</h2>
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {steps.slice(0, currentStep + 1).map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`p-4 rounded-lg ${
                step.is_factor ? 'bg-green-900/30' : 'bg-gray-700/30'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{step.message}</span>
                <span className="text-xl">{step.result}</span>
              </div>
              {step.new_number && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-green-400"
                >
                  New number: {step.new_number}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        Time Complexity: O(√n)
      </div>
    </div>
  );
}
