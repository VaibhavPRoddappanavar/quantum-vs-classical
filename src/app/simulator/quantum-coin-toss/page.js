"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const QuantumCoinToss = () => {
  const [classicalResults, setClassicalResults] = useState([]);
  const [quantumResults, setQuantumResults] = useState([]);
  const [quantumStages, setQuantumStages] = useState([]); // For each toss: 'init', 'hadamard', 'superposition', 'measured'
  const [isRunning, setIsRunning] = useState(false);
  const [numTrials, setNumTrials] = useState(10);
  const [step, setStep] = useState(0);
  const [stepMode, setStepMode] = useState(false); // Step-through mode
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // For step mode
  const [stepStages, setStepStages] = useState([]); // For step mode: [{stage, outcome}]

  // Helper for classical coin flip animation
  const classicalIcons = {
    Heads: '🪙',
    Tails: '🪙',
  };

  // Helper for quantum qubit visualization
  const QuantumQubit = ({ stage, outcome }) => {
    if (stage === 'init') {
      return (
        <div className="flex flex-col items-center">
          <span className="text-2xl">|0⟩</span>
          <span className="text-xs text-indigo-300 mt-1">Initial state</span>
        </div>
      );
    }
    if (stage === 'hadamard') {
      return (
        <div className="flex flex-col items-center">
          <span className="text-2xl flex items-center">
            |0⟩ <span className="px-2 py-1 ml-2 bg-purple-700 text-purple-100 rounded font-mono text-base animate-pulse border border-purple-300 shadow-md">H</span>
          </span>
          <span className="text-xs text-purple-300 mt-1">Hadamard applied</span>
        </div>
      );
    }
    if (stage === 'superposition') {
      return (
        <div
          className="flex flex-col items-center justify-center w-full"
        >
          <span
            className="text-2xl font-bold px-4 py-2 rounded-lg border-2 border-pink-400 shadow-lg animate-pulse bg-gradient-to-br from-purple-600 via-pink-400 to-pink-700 text-white"
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
              boxShadow: '0 0 16px 2px #f472b6, 0 0 4px 1px #a78bfa',
              border: '2px solid #f472b6',
            }}
          >
            (|0⟩ + |1⟩)/√2 <span role="img" aria-label="wave">🌊</span>
          </span>
          <span className="text-xs text-pink-200 mt-1 font-semibold">Superposition</span>
        </div>
      );
    }
    if (stage === 'measured') {
      return (
        <div className="flex flex-col items-center">
          <span className={`text-2xl ${outcome === '|0⟩' ? 'text-purple-200' : 'text-pink-200'}`}>{outcome}</span>
          <span className="text-xs text-green-200 mt-1">Measured</span>
        </div>
      );
    }
    return null;
  };

  // Run both simulations with stepwise quantum animation (slowed down)
  const runBoth = () => {
    setStep(0);
    setClassicalResults([]);
    setQuantumResults([]);
    setQuantumStages([]);
    setIsRunning(true);
    let i = 0;
    const stageDuration = 600; // ms per stage
    const interval = setInterval(() => {
      // Classical
      const classicalOutcome = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setClassicalResults(prev => [...prev, classicalOutcome]);
      // Quantum: animate through stages
      setQuantumStages(prev => [...prev, 'init']);
      setTimeout(() => setQuantumStages(qs => {
        const copy = [...qs]; copy[i] = 'hadamard'; return copy;
      }), stageDuration);
      setTimeout(() => setQuantumStages(qs => {
        const copy = [...qs]; copy[i] = 'superposition'; return copy;
      }), stageDuration * 2);
      setTimeout(() => {
        const measured = Math.random() < 0.5 ? '|0⟩' : '|1⟩';
        setQuantumResults(prev => [...prev, measured]);
        setQuantumStages(qs => {
          const copy = [...qs]; copy[i] = 'measured'; return copy;
        });
      }, stageDuration * 3);
      setStep(i + 1);
      i++;
      if (i >= numTrials) {
        clearInterval(interval);
        setTimeout(() => setIsRunning(false), stageDuration * 3);
      }
    }, stageDuration * 3 + 100);
  };

  // Step-through mode logic
  const startStepMode = () => {
    setStep(0);
    setClassicalResults([]);
    setQuantumResults([]);
    // All tosses start at 'init' stage
    setQuantumStages(Array(numTrials).fill('init'));
    setCurrentStepIndex(0);
    setStepStages([]);
    setIsRunning(false);
    // Precompute all outcomes for this run
    const classicalOutcomes = [];
    const quantumOutcomes = [];
    for (let i = 0; i < numTrials; i++) {
      classicalOutcomes.push(Math.random() < 0.5 ? 'Heads' : 'Tails');
      quantumOutcomes.push(Math.random() < 0.5 ? '|0⟩' : '|1⟩');
    }
    setStepStages(classicalOutcomes.map((c, i) => [
      { stage: 'init' },
      { stage: 'hadamard' },
      { stage: 'superposition' },
      { stage: 'measured', outcome: quantumOutcomes[i] }
    ]));
    setClassicalResults([]);
    setQuantumResults(Array(numTrials).fill(undefined));
    setQuantumStages(Array(numTrials).fill('init'));
  };

  const stepNext = () => {
    if (currentStepIndex >= numTrials * 4) return;
    const tossIdx = Math.floor(currentStepIndex / 4);
    const stageIdx = currentStepIndex % 4;
    setQuantumStages(prev => {
      const copy = [...prev];
      if (stageIdx === 0) copy[tossIdx] = 'init';
      if (stageIdx === 1) copy[tossIdx] = 'hadamard';
      if (stageIdx === 2) copy[tossIdx] = 'superposition';
      if (stageIdx === 3) copy[tossIdx] = 'measured';
      return copy;
    });
    if (stageIdx === 0) {
      setClassicalResults(prev => {
        const copy = [...prev];
        copy[tossIdx] = stepStages[tossIdx][0] ? (Math.random() < 0.5 ? 'Heads' : 'Tails') : '';
        return copy;
      });
    }
    if (stageIdx === 3) {
      setQuantumResults(prev => {
        const copy = [...prev];
        copy[tossIdx] = stepStages[tossIdx][3].outcome;
        return copy;
      });
    }
    setCurrentStepIndex(idx => idx + 1);
  };

  const stepPrev = () => {
    if (currentStepIndex <= 0) return;
    const tossIdx = Math.floor((currentStepIndex - 1) / 4);
    const stageIdx = (currentStepIndex - 1) % 4;
    setQuantumStages(prev => {
      const copy = [...prev];
      if (stageIdx === 0) copy[tossIdx] = 'init';
      if (stageIdx === 1) copy[tossIdx] = 'init';
      if (stageIdx === 2) copy[tossIdx] = 'hadamard';
      if (stageIdx === 3) copy[tossIdx] = 'superposition';
      return copy;
    });
    if (stageIdx === 0) {
      setClassicalResults(prev => {
        const copy = [...prev];
        copy[tossIdx] = undefined;
        return copy;
      });
    }
    if (stageIdx === 3) {
      setQuantumResults(prev => {
        const copy = [...prev];
        copy[tossIdx] = undefined;
        return copy;
      });
    }
    setCurrentStepIndex(idx => idx - 1);
  };

  const reset = () => {
    setClassicalResults([]);
    setQuantumResults([]);
    setQuantumStages([]);
    setStep(0);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-black/40 rounded-xl shadow-lg p-8 border border-indigo-400/30">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white font-orbitron mb-6">
          Quantum vs Classical Coin Toss
        </h1>
        <p className="text-center text-indigo-200 mb-4">
          Compare the randomness of a classical coin toss and a quantum coin toss (Hadamard on |0⟩, then measure).
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center mb-8">
          {/* Classical Panel */}
          <div className="flex-1 bg-black/30 p-6 rounded-lg border border-indigo-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">Classical Coin Toss <span className="text-2xl">🪙</span></h2>
            <div className="mb-2 text-indigo-200 text-xs italic">A fair coin is flipped. You get <b>Heads</b> or <b>Tails</b> with equal probability. No superposition—just pure randomness.</div>
            <div className="flex gap-2 flex-wrap min-h-[48px]">
              {classicalResults.map((r, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col items-center px-3 py-1 rounded-md font-mono text-lg border ${r === "Heads" ? "bg-blue-900/60 border-blue-400 text-blue-100" : "bg-yellow-900/60 border-yellow-400 text-yellow-100"}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className="text-2xl mb-1">🪙</span>
                  <span>{r}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-indigo-200 text-sm">
              Heads: {classicalResults.filter(r => r === "Heads").length} | Tails: {classicalResults.filter(r => r === "Tails").length}
            </div>
          </div>
          {/* Quantum Panel */}
          <div className="flex-1 bg-black/30 p-6 rounded-lg border border-purple-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">Quantum Coin Toss <span className="text-2xl">⚛️</span></h2>
            <div className="mb-2 text-purple-200 text-xs italic">A qubit starts in <b>|0⟩</b>, a Hadamard gate puts it in a <b>superposition</b> (both |0⟩ and |1⟩), then measurement collapses it to |0⟩ or |1⟩. This is true quantum randomness.</div>
            <div className="flex gap-2 flex-wrap min-h-[48px]">
              {Array.from({ length: quantumResults.length }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col items-center px-3 py-1 rounded-md font-mono text-lg border transition-all duration-200
                    ${quantumStages[i] === 'superposition' ? 'bg-gradient-to-br from-purple-600/60 to-pink-600/60 border-pink-400 text-white shadow-lg shadow-pink-200/20 animate-pulse' :
                      quantumResults[i] === '|0⟩' ? 'bg-purple-900/60 border-purple-400 text-purple-100' : 'bg-pink-900/60 border-pink-400 text-pink-100'}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <QuantumQubit stage={quantumStages[i]} outcome={quantumResults[i]} />
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-purple-200 text-sm">
              |0⟩: {quantumResults.filter(r => r === "|0⟩").length} | |1⟩: {quantumResults.filter(r => r === "|1⟩").length}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
          <label className="text-indigo-100 text-sm font-medium">
            Number of tosses: 
            <input
              type="number"
              min={1}
              max={100}
              value={numTrials}
              onChange={e => setNumTrials(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="ml-2 px-2 py-1 rounded bg-black/60 border border-indigo-400 text-white w-16"
              disabled={isRunning}
            />
          </label>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition disabled:bg-gray-700 disabled:opacity-60"
            onClick={runBoth}
            disabled={isRunning || stepMode}
          >
            Toss {numTrials} Times
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition disabled:bg-gray-700 disabled:opacity-60"
            onClick={reset}
            disabled={isRunning}
          >
            Reset
          </button>
          <button
            className={`bg-pink-700 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition disabled:bg-gray-700 disabled:opacity-60 ml-2 ${stepMode ? 'ring-2 ring-pink-400' : ''}`}
            onClick={() => {
              setStepMode(sm => {
                const next = !sm;
                if (next) startStepMode();
                return next;
              });
            }}
            disabled={isRunning}
          >
            {stepMode ? 'Exit Step Mode' : 'Step Through'}
          </button>
        </div>
        {stepMode && (
          <div className="flex gap-4 justify-center mb-4">
            <button
              className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 px-4 rounded-lg shadow-md transition disabled:bg-gray-700 disabled:opacity-60"
              onClick={stepPrev}
              disabled={currentStepIndex === 0}
            >
              Prev
            </button>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition disabled:bg-gray-700 disabled:opacity-60"
              onClick={stepNext}
              disabled={currentStepIndex >= numTrials * 4}
            >
              Next
            </button>
          </div>
        )}
        <div className="flex justify-center mt-2">
          <Link href="/simulator" className="text-indigo-300 hover:text-indigo-100 text-sm underline">← Back to Simulators</Link>
        </div>
      </div>
    </div>
  );
};

export default QuantumCoinToss;
