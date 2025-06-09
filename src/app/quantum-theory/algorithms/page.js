import React from 'react';
import Link from 'next/link';

const quantumAlgorithms = [
  {
    name: "Shor's Algorithm",
    description: "An efficient quantum algorithm for integer factorization, exponentially faster than the best-known classical algorithms.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Shor_Algorithm_Flowchart.png",
    video: "https://www.youtube.com/embed/5_56TXtFVK4"
  },
  {
    name: "Grover's Algorithm",
    description: "A quantum algorithm that finds with high probability the unique input to a black box function that produces a particular output value, quadratically faster than any classical algorithm.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Grover_Algorithm.png",
    video: "https://www.youtube.com/embed/2Tw39kZIbhs"
  },
  {
    name: "Quantum Fourier Transform (QFT)",
    description: "A key subroutine in many quantum algorithms, including Shor's, enabling efficient computation of the discrete Fourier transform on a quantum computer.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Quantum_Fourier_Transform_Circuit.png",
    video: "https://www.youtube.com/embed/uISnQE6Qsls"
  },
  {
    name: "Quantum Phase Estimation (QPE)",
    description: "Quantum Phase Estimation is a fundamental quantum algorithm used to estimate the eigenvalue (phase) corresponding to an eigenvector of a unitary operator. It is a key component in Shor's algorithm and quantum simulations, enabling the extraction of useful information from quantum systems.",
    video: "https://www.youtube.com/embed/4nT0BTUxhJY"
  },
  {
    name: "Deutsch–Jozsa Algorithm",
    description: "The Deutsch–Jozsa algorithm is one of the earliest quantum algorithms, demonstrating quantum speedup. It determines whether a given function is constant or balanced with a single query, whereas a classical algorithm would require exponentially more queries in the worst case.",
    video: "https://www.youtube.com/embed/7MdEHsRZxvo"
  },
  {
    name: "Variational Quantum Eigensolver (VQE)",
    description: "The Variational Quantum Eigensolver is a hybrid quantum-classical algorithm used to find the ground state energy of a molecule or quantum system. VQE leverages quantum computers to prepare quantum states and classical computers to optimize parameters, making it a leading approach for near-term quantum devices.",
    video: "https://www.youtube.com/embed/SjV7JFLxOuw"
  }
];

export default function AlgorithmsPage() {
  return (
    <div>
      <div className="flex justify-center w-full">
        <Link href="/" className="mb-6 px-5 py-2 rounded-lg bg-[#232946] text-[#ffd700] font-semibold shadow hover:bg-[#393e46] transition">← Back to Home</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-[#a1ffce]">Quantum Algorithms</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {quantumAlgorithms.map((algo, i) => (
          <div
            key={i}
            className="bg-black/30 rounded-2xl p-6 shadow-lg flex flex-col items-stretch h-[540px] max-h-[500px] min-h-[500px]"
          >
            <h2 className="text-xl font-semibold text-[#7fdbff] mb-2 min-h-[48px] line-clamp-2">{algo.name}</h2>
            <div className="flex-1 flex flex-col justify-between">
              <p className="text-gray-200 mb-3 text-sm">
                {algo.description}
              </p>
            </div>
            <div className="flex-1 flex justify-between">
              <iframe
                width="100%"
                height="180"
                src={algo.video}
                title={algo.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded w-full"
                style={{ minHeight: '180px', maxHeight: '180px' }}
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
