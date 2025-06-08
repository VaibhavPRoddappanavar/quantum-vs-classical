"use client";

import ShortestPathVisualizer from "../components/problems/ShortestPathVisualizer";
import ComparisonSection from "../components/problems/ComparisonSection";
import { useState } from "react";

/**
 * Graph Shortest Path Simulation Page
 *
 * This page shows the simulation and comparison of classical BFS vs quantum-inspired shortest path algorithms.
 */
export default function GraphSimulatorPage() {
  const [showComparison, setShowComparison] = useState(false);
  const [bfsSteps, setBfsSteps] = useState(0);
  const [quantumSteps, setQuantumSteps] = useState(0);
  const [pathLength, setPathLength] = useState(0);

  // Handler to receive simulation results from visualizer
  function handleSimulationComplete({ bfs, quantum }) {
    setBfsSteps(bfs.steps);
    setQuantumSteps(quantum.steps);
    setPathLength(bfs.path.length);
    setShowComparison(true);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 font-orbitron">Graph Shortest Path Simulator</h1>
        <ShortestPathVisualizer onComplete={handleSimulationComplete} />
        {showComparison && (
          <ComparisonSection
            classicalSteps={bfsSteps}
            quantumSteps={quantumSteps}
            pathLength={pathLength}
          />
        )}
      </div>
    </main>
  );
}
