'use client';

import { motion } from 'framer-motion';

const QuantumFactorization = ({ steps, currentStep }) => {
  const currentSteps = steps.slice(0, currentStep);

  const getStepIcon = (phase) => {
    switch (phase) {
      case 'initialization':
        return '🔄';
      case 'quantum_fourier':
        return '🌊';
      case 'gcd_check':
        return '🔍';
      case 'period_finding':
        return '📊';
      case 'period_found':
        return '✨';
      case 'factorization':
        return '🎯';
      case 'fallback':
        return '⚠️';
      default:
        return '•';
    }
  };

  const getStepColor = (phase) => {
    switch (phase) {
      case 'initialization':
        return 'bg-blue-800/30';
      case 'quantum_fourier':
        return 'bg-purple-800/30';
      case 'gcd_check':
        return 'bg-green-800/30';
      case 'period_finding':
        return 'bg-indigo-800/30';
      case 'period_found':
        return 'bg-yellow-800/30';
      case 'factorization':
        return 'bg-emerald-800/30';
      case 'fallback':
        return 'bg-red-800/30';
      default:
        return 'bg-blue-800/30';
    }
  };

  return (
    <div className="p-6 bg-blue-900/30 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Quantum Approach</h2>
      <div className="space-y-4">
        {currentSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${getStepColor(step.phase)} p-4 rounded-lg`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getStepIcon(step.phase)}</span>
              <h3 className="text-lg font-semibold text-blue-300">
                {step.message}
              </h3>
            </div>

            {step.detail && (
              <p className="text-blue-100/80 mb-2 ml-8">{step.detail}</p>
            )}

            {step.sequence && (
              <div className="ml-8 mt-3">
                <div className="text-sm text-blue-300 mb-2">Modular Exponentiation Sequence:</div>
                <div className="grid grid-cols-4 gap-2">
                  {step.sequence.map((item, i) => (
                    <div
                      key={i}
                      className="bg-blue-700/30 p-2 rounded text-center"
                    >
                      <div className="text-sm text-blue-300">
                        a<sup>{item.x}</sup> mod n
                      </div>
                      <div className="text-blue-100">{item.result}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.calculations?.map((calc, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-blue-100/80 mt-2 ml-8 font-mono"
              >
                {calc}
              </motion.p>
            ))}

            {step.factors && (
              <div className="mt-3 ml-8">
                <div className="text-sm text-blue-300 mb-1">Factors Found:</div>
                <div className="text-lg text-blue-100 font-mono">
                  {step.factors.join(' × ')}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-400">
        Time Complexity: O((log n)³)
        <br />
        Space Complexity: O((log n)^2)
      </div>
    </div>
  );
};

export default QuantumFactorization;
