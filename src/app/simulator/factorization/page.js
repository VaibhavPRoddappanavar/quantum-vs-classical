'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ClassicalFactorization from '../../components/ClassicalFactorization';
import QuantumFactorization from '../../components/QuantumFactorization';
import PerformanceComparison from '../../components/PerformanceComparison';

export default function FactorizationPage() {
  const [number, setNumber] = useState('15');
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [maxSteps, setMaxSteps] = useState(0);
  const [error, setError] = useState('');

  const classicalFactorization = (n) => {
    const steps = [];
    const factors = [];
    let currentNumber = n;
    let stepCount = 0;

    // Generate prime numbers up to sqrt(n) using Sieve of Eratosthenes
    const maxPrime = Math.floor(Math.sqrt(n));
    const sieve = new Array(maxPrime + 1).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i * i <= maxPrime; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= maxPrime; j += i) {
          sieve[j] = false;
        }
      }
    }

    // Get list of primes
    const primes = [];
    for (let i = 2; i <= maxPrime; i++) {
      if (sieve[i]) primes.push(i);
    }

    // Try dividing by each prime
    for (const divisor of primes) {
      while (currentNumber > 1) {
        const isDivisible = currentNumber % divisor === 0;
        stepCount++;

        steps.push({
          divisor,
          number: currentNumber,
          is_factor: isDivisible,
          message: `Is ${currentNumber} divisible by ${divisor}?`,
          result: isDivisible ? '✅' : '❌'
        });

        if (isDivisible) {
          factors.push(divisor);
          currentNumber = currentNumber / divisor;
          steps[steps.length - 1].new_number = currentNumber;
        } else {
          break;
        }

        // Safety check for very large numbers
        if (stepCount > 100) {
          steps.push({
            divisor: '...',
            number: currentNumber,
            is_factor: false,
            message: 'Number too large for demonstration',
            result: '⚠️'
          });
          return { steps, factors, total_steps: stepCount };
        }
      }
    }

    // If there's still a number left, it must be prime
    if (currentNumber > 1) {
      steps.push({
        divisor: currentNumber,
        number: currentNumber,
        is_factor: true,
        message: `${currentNumber} is prime`,
        result: '✅'
      });
      factors.push(currentNumber);
      stepCount++;
    }

    return { steps, factors, total_steps: stepCount };
  };

  const quantumFactorization = (n) => {
    const steps = [];
    let stepCount = 0;

    // Helper functions
    const gcd = (a, b) => {
      a = Math.abs(Math.round(a));
      b = Math.abs(Math.round(b));
      while (b) {
        [a, b] = [b, a % b];
      }
      return a;
    };

    const modPow = (base, exp, mod) => {
      if (exp === 0) return 1;
      if (exp === 1) return base % mod;
      const half = modPow(base, Math.floor(exp/2), mod);
      if (exp % 2 === 0) return (half * half) % mod;
      return (((half * half) % mod) * base) % mod;
    };

    const findPrimeFactors = (num) => {
      const factors = [];
      let n = num;
      let d = 2;
      while (n > 1) {
        while (n % d === 0) {
          factors.push(d);
          n /= d;
        }
        d++;
        if (d * d > n) {
          if (n > 1) factors.push(n);
          break;
        }
      }
      return factors;
    };

    // Step 1: Initialize quantum state
    steps.push({
      phase: 'initialization',
      message: 'Initialize Quantum State',
      detail: `Prepare quantum registers for input number ${n}`,
      calculations: ['|ψ₀⟩ = |1⟩ ⊗ |0⟩']
    });
    stepCount++;

    // Step 2: Create superposition
    steps.push({
      phase: 'initialization',
      message: 'Create Superposition',
      detail: 'Apply Hadamard gates to create uniform superposition',
      calculations: ['|ψ₁⟩ = H⊗ⁿ|ψ₀⟩ = Σᵢ|i⟩|0⟩']
    });
    stepCount++;

    // Step 3: Apply quantum Fourier transform
    steps.push({
      phase: 'quantum_fourier',
      message: 'Apply Quantum Fourier Transform',
      detail: 'Transform state to frequency domain for period finding',
      calculations: ['QFT|x⟩ = Σᵣ e²ᵖⁱˣʳ/ᴺ|r⟩']
    });
    stepCount++;

    // Step 4: Quantum Period Finding
    const bases = [2, 7, 11];
    let foundPeriod = false;
    let finalFactors = [];
    
    for (const a of bases) {
      if (foundPeriod) break;
      
      // Initial GCD check
      const gcdResult = gcd(a, n);
      steps.push({
        phase: 'gcd_check',
        message: 'Initial GCD Check',
        detail: `Check if base ${a} shares factors with ${n}`,
        calculations: [`gcd(${a}, ${n}) = ${gcdResult}`]
      });
      stepCount++;
      
      if (gcdResult > 1) {
        const factor1 = gcdResult;
        const factor2 = n / factor1;
        steps.push({
          phase: 'gcd_check',
          message: 'Direct Factor Found',
          detail: `Found factor through GCD`,
          calculations: [
            `${n} = ${factor1} × ${factor2}`,
            'Proceeding to find prime factors...'
          ]
        });
        finalFactors = findPrimeFactors(factor1).concat(findPrimeFactors(factor2));
        foundPeriod = true;
        stepCount++;
        break;
      }

      // Quantum period finding simulation
      const sequence = [];
      for (let x = 0; x < 8; x++) {
        const result = modPow(a, x, n);
        sequence.push({ x, result });
      }

      steps.push({
        phase: 'period_finding',
        message: `Quantum Period Finding (Base ${a})`,
        detail: `Apply modular exponentiation operator Uᵃ`,
        calculations: [`Uᵃ|x⟩ = |ax mod n⟩`],
        sequence
      });
      stepCount++;

      // Find period
      let period = 0;
      for (let r = 2; r < sequence.length; r++) {
        if (modPow(a, r, n) === 1) {
          period = r;
          break;
        }
      }

      if (period > 0) {
        steps.push({
          phase: 'period_finding',
          message: 'Period Detection',
          detail: `Found period r = ${period}`,
          calculations: [`${a}^${period} ≡ 1 (mod ${n})`]
        });
        stepCount++;

        if (period % 2 === 0) {
          const x = modPow(a, period/2, n);
          if (x !== n - 1) {
            const factor1 = gcd(x - 1, n);
            const factor2 = gcd(x + 1, n);
            
            steps.push({
              phase: 'period_found',
              message: 'Factor Computation',
              detail: 'Computing factors using period',
              calculations: [
                `x = ${a}^(${period}/2) mod ${n} = ${x}`,
                `factor₁ = gcd(x-1, n) = gcd(${x}-1, ${n}) = ${factor1}`,
                `factor₂ = gcd(x+1, n) = gcd(${x}+1, ${n}) = ${factor2}`
              ]
            });
            stepCount++;
            
            if (factor1 > 1 && factor2 > 1) {
              // Get prime factors
              const primeFactors1 = findPrimeFactors(factor1);
              const primeFactors2 = findPrimeFactors(factor2);
              
              steps.push({
                phase: 'factorization',
                message: 'Prime Factorization',
                detail: 'Breaking down into prime factors',
                calculations: [
                  `${factor1} = ${primeFactors1.join(' × ')}`,
                  `${factor2} = ${primeFactors2.join(' × ')}`
                ]
              });
              stepCount++;
              
              finalFactors = [...new Set([...primeFactors1, ...primeFactors2])];
              foundPeriod = true;
              break;
            }
          }
        }
      }
    }

    // Fallback to classical method if quantum approach fails
    if (!foundPeriod) {
      steps.push({
        phase: 'fallback',
        message: 'Quantum Period Not Found',
        detail: 'Using classical factorization as fallback',
        calculations: ['Falling back to trial division method']
      });
      stepCount++;
      finalFactors = findPrimeFactors(n);
    }

    // Final result
    steps.push({
      phase: 'factorization',
      message: 'Factorization Complete',
      detail: `Prime factorization of ${n}`,
      calculations: [
        `${n} = ${finalFactors.join(' × ')}`,
        `Found in ${stepCount} steps`
      ],
      factors: finalFactors
    });
    stepCount++;

    return { 
      steps, 
      factors: finalFactors.sort((a, b) => a - b),
      total_steps: stepCount 
    };
  };

  const simulateFactorization = (n) => {
    const classical = classicalFactorization(n);
    const quantum = quantumFactorization(n);
    return { classical, quantum };
  };

  const runFactorization = async () => {
    // Validate input
    if (!number.trim()) {
      setError('Please enter a number to factorize');
      return;
    }
    
    const num = parseInt(number);
    if (isNaN(num) || num <= 1) {
      setError('Please enter a valid number greater than 1');
      return;
    }

    // Clear error and start factorization
    setError('');
    setIsAnimating(true);
    setCurrentStep(0);
    const results = simulateFactorization(num);
    setResults(results);
    setMaxSteps(Math.max(results.classical.steps.length, results.quantum.steps.length));

    // Animate through steps
    for (let i = 0; i < Math.max(results.classical.steps.length, results.quantum.steps.length); i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(i);
    }
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Quantum vs Classical Factorization</h1>
          <Link href="/simulator" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition-colors">
            Back to Problems
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
                setError('');
              }}
              className="bg-gray-700 text-white px-4 py-2 rounded"
              min="2"
              disabled={isAnimating}
              placeholder="Enter a number > 1"
            />
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
            <button
              onClick={runFactorization}
              disabled={isAnimating}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition-colors disabled:opacity-50"
            >
              {isAnimating ? 'Animating...' : 'Start Factorization'}
            </button>
          </div>
        </div>

        {results && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ClassicalFactorization
                steps={results.classical.steps}
                currentStep={currentStep}
              />
              <QuantumFactorization
                steps={results.quantum.steps}
                currentStep={currentStep}
              />
            </div>
            
            {/* Final Answer Display */}
            {!isAnimating && currentStep > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-900/30 p-6 rounded-lg mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">Final Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl mb-2">Classical Approach</h3>
                    <p className="text-lg text-green-400">
                      Factors: {results.classical.factors.join(' × ')}
                    </p>
                    <p className="text-gray-400 mt-1">
                      Found in {results.classical.total_steps} steps
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Quantum Approach</h3>
                    <p className="text-lg text-blue-400">
                      Factors: {results.quantum.factors.join(' × ')}
                    </p>
                    <p className="text-gray-400 mt-1">
                      Found in {results.quantum.total_steps} steps
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Performance Comparison */}
            {!isAnimating && currentStep > 0 && (
              <PerformanceComparison
                classicalSteps={results.classical.total_steps}
                quantumSteps={results.quantum.total_steps}
                number={number}
              />
            )}
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gray-800 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Algorithm Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-2">Classical Trial Division</h3>
              <p className="text-gray-300">• Time Complexity: O(√n)</p>
              <p className="text-gray-300">• Systematically checks divisors</p>
              <p className="text-gray-300">• Simple but inefficient for large numbers</p>
            </div>
            <div>
              <h3 className="text-xl mb-2">Quantum Shor's Algorithm</h3>
              <p className="text-gray-300">• Time Complexity: O((log n)³)</p>
              <p className="text-gray-300">• Uses quantum period finding</p>
              <p className="text-gray-300">• Exponentially faster for large numbers</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
