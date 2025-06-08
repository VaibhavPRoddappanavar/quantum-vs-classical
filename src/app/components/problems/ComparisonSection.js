"use client";

import { motion } from "framer-motion";

export default function ComparisonSection({ classicalSteps, quantumSteps, pathLength }) {
  const speedup = classicalSteps && quantumSteps ? (classicalSteps / quantumSteps).toFixed(2) : "-";

  return (
    <motion.div
      className="mt-12 p-6 bg-black/30 rounded-lg border border-indigo-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4 font-orbitron">Classical vs Quantum-inspired Comparison</h2>
      <div className="flex flex-col md:flex-row gap-8 mb-6">
        <div className="flex-1 bg-indigo-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Classical (BFS)</h3>
          <p className="text-white">Steps taken: <span className="font-bold">{classicalSteps}</span></p>
        </div>
        <div className="flex-1 bg-purple-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">Quantum-inspired</h3>
          <p className="text-white">Steps taken: <span className="font-bold">{quantumSteps}</span></p>
        </div>
      </div>
      <div className="text-white text-lg mb-2">Shortest Path Length: <span className="font-bold">{pathLength}</span></div>
      <div className="text-white text-lg">Speedup: <span className="font-bold text-green-400">{speedup}x</span> <span className="text-gray-400">(lower is better)</span></div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-900/40 rounded-lg p-4">
          <h4 className="text-indigo-300 text-lg font-semibold mb-2">Classical BFS</h4>
          <ul className="list-disc ml-6 text-gray-200 text-sm space-y-1">
            <li>Visits nodes one at a time, level by level.</li>
            <li>Guaranteed to find the shortest path in an unweighted graph.</li>
            <li>Number of steps = path length for shortest path, but all explored nodes are counted as steps.</li>
            <li>Time Complexity: <span className="text-white font-bold">O(V + E)</span></li>
          </ul>
        </div>
        <div className="bg-purple-900/40 rounded-lg p-4">
          <h4 className="text-purple-300 text-lg font-semibold mb-2">Quantum-inspired</h4>
          <ul className="list-disc ml-6 text-gray-200 text-sm space-y-1">
            <li>Simulates quantum parallelism by exploring all neighbors of a layer at each step.</li>
            <li>May reduce the number of steps needed, especially in large or highly connected graphs.</li>
            <li>Path found is always the shortest, but fewer total exploration steps may be required.</li>
            <li>Theoretical quantum walk can achieve <span className="text-white font-bold">O(√N)</span> for some search problems.</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 text-gray-300 text-sm">
        <p><strong>Interpretation:</strong> In this demo, both algorithms find the shortest path. The quantum-inspired approach simulates the speedup of quantum walks by exploring multiple nodes in parallel. For small graphs, the difference may be minor, but for larger graphs, quantum algorithms can offer significant speedup in theory.</p>
        <p className="mt-2 italic">This simulation is for educational purposes and visually demonstrates the difference in approach between classical and quantum-inspired algorithms.</p>
      </div>
    </motion.div>
  );
}
