"use client";

import { motion } from "framer-motion";

const AlgorithmPanel = ({ title, state, currentStep, maxSteps, data, type }) => {
  // Determine if this is classical or quantum algorithm
  const isClassical = type === "classical";
  const isQuantum = type === "quantum";
  
  return (
    <motion.div 
      className="flex-1 bg-black/30 p-6 rounded-lg border border-indigo-500/30 min-h-[400px] relative overflow-hidden group"
      whileHover={{ 
        scale: 1.01, 
        boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
        transition: { duration: 0.3 }
      }}
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 z-0 overflow-hidden">
        <div className="shimmer-effect"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-4 text-white font-orbitron tracking-wide">
          {title}
        </h3>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress: Step {currentStep} / {maxSteps}</span>
            <span>{Math.round((currentStep / maxSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (currentStep / maxSteps) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Status message */}
        <div className="mb-4 h-8">
          <p className="text-sm font-medium text-indigo-300">
            {state.message || "Waiting to start..."}
          </p>
        </div>
        
        {/* Visualization area */}
        <div className="bg-black/40 rounded-lg p-4 border border-white/10 min-h-[250px] mb-4">
          {isClassical && (
            <ClassicalVisualization 
              data={data} 
              currentIndex={state.currentIndex} 
              checked={state.checked} 
              found={state.found}
            />
          )}
          
          {isQuantum && (
            <QuantumVisualization 
              data={data}
              amplitudes={state.amplitudes}
              probabilities={state.probabilities}
              measured={state.measured}
              result={state.result}
              iteration={state.iteration}
            />
          )}
        </div>
        
        {/* Algorithm explanation */}
        <div className="text-sm text-gray-300">
          {isClassical && (
            <p>
              Linear Search checks each element sequentially until it finds the target or reaches the end.
              Time Complexity: O(n)
            </p>
          )}
          
          {isQuantum && (
            <p>
              Grover's Algorithm uses quantum superposition and amplitude amplification to find the target.
              Time Complexity: O(√n)
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Classical Linear Search Visualization
const ClassicalVisualization = ({ data, currentIndex, checked, found }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">No data to visualize</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className={`
              p-3 rounded-md border text-center relative
              ${index === currentIndex ? 'border-yellow-400 bg-yellow-900/30' : 'border-gray-700 bg-gray-800/50'}
              ${checked.includes(index) ? 'border-blue-500 bg-blue-900/20' : ''}
              ${found && index === currentIndex ? 'border-green-500 bg-green-900/30' : ''}
            `}
            initial={{ opacity: 0.6 }}
            animate={{ 
              opacity: 1,
              scale: index === currentIndex ? 1.05 : 1,
              borderColor: found && index === currentIndex 
                ? ["#22c55e", "#22c55e", "#22c55e"] 
                : index === currentIndex 
                  ? ["#facc15", "#facc15", "#facc15"] 
                  : checked.includes(index) 
                    ? "#3b82f6" 
                    : "#374151"
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-sm font-roboto-mono">
              {item.toString()}
            </span>
            <div className="absolute -top-2 -left-2 bg-gray-800 text-xs px-1 rounded-sm border border-gray-700">
              {index}
            </div>
            
            {/* Current index indicator */}
            {index === currentIndex && (
              <motion.div 
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-yellow-400"></div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Current index status */}
      <div className="mt-4 text-sm text-gray-300 bg-black/30 p-2 rounded-md border border-white/10">
        {currentIndex >= 0 ? (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 animate-pulse" 
              style={{ backgroundColor: found ? '#22c55e' : '#facc15' }}></div>
            <p>
              {found 
                ? `✓ Found target at index ${currentIndex}` 
                : `Checking index ${currentIndex}...`
              }
            </p>
          </div>
        ) : (
          <p>Ready to start search...</p>
        )}
      </div>
    </div>
  );
};

// Quantum Search Visualization
const QuantumVisualization = ({ data, amplitudes, probabilities, measured, result, iteration }) => {
  if (!data || data.length === 0 || !amplitudes || amplitudes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">No data to visualize</p>
      </div>
    );
  }
  
  // Max probability for scaling the visualization
  const maxProb = Math.max(...(probabilities || []));
  
  return (
    <div>
      {/* Probability bars visualization */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          {measured ? "Final State (After Measurement)" : `Quantum State (Iteration ${iteration})`}
        </h4>
        
        <div className="grid grid-cols-5 gap-2">
          {data.map((item, index) => {
            const isHighestProb = probabilities[index] === maxProb;
            return (
              <motion.div
                key={index}
                className={`
                  p-3 rounded-md border text-center relative
                  ${measured && index === result ? 'border-green-500 bg-green-900/30' : 
                    isHighestProb ? 'border-indigo-400 bg-indigo-900/40' : 'border-purple-500 bg-purple-900/20'}
                `}
                initial={{ opacity: 0.6 }}
                animate={{ 
                  opacity: 1,
                  scale: (measured && index === result) || isHighestProb ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -top-2 -left-2 bg-gray-800 text-xs px-1 rounded-sm border border-gray-700">
                  {index}
                </div>
                <div className="flex flex-col h-full justify-between">
                  <span className="text-xs font-roboto-mono mb-1">
                    {item.toString()}
                  </span>
                  <span className={`text-xs ${isHighestProb ? 'text-indigo-200 font-bold' : 'text-indigo-300'}`}>
                    {(probabilities[index] * 100).toFixed(1)}%
                  </span>
                  
                  {/* Probability bar */}
                  <motion.div 
                    className="mt-2 w-full bg-black/50 rounded-sm overflow-hidden"
                    style={{ height: '6px' }}
                  >
                    <motion.div 
                      className={`h-full ${isHighestProb ? 'bg-indigo-400' : 'bg-purple-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(probabilities[index] / maxProb) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Amplitude visualization - enhanced */}
      <div className="mt-4 bg-black/30 p-3 rounded-lg border border-white/10">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Amplitude Distribution</h4>
        <div className="h-16 bg-black/50 rounded-lg overflow-hidden flex items-end">
          {amplitudes.map((amp, index) => {
            const isHighest = Math.abs(amp) === Math.max(...amplitudes.map(a => Math.abs(a)));
            return (
              <motion.div
                key={index}
                className="relative group"
                style={{ 
                  width: `${(1 / amplitudes.length) * 100}%`,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
              >
                <motion.div
                  className={`w-full ${measured && index === result ? 'bg-green-500' : 
                    isHighest ? 'bg-indigo-400' : 'bg-purple-500'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.abs(amp) * 100}%` }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      Index: {index}<br/>
                      Amplitude: {amp.toFixed(3)}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-300 bg-black/30 p-2 rounded-md border border-white/10">
        {measured ? (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: result >= 0 ? '#22c55e' : '#f87171' }}></div>
            <p>
              {result >= 0 
                ? `✓ Measured state with highest probability: index ${result}` 
                : "Measurement complete, no clear result"
              }
            </p>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 bg-indigo-400 animate-pulse"></div>
            <p>Amplifying target state probability...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmPanel;
