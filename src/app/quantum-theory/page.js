import React from 'react';

export default function QuantumTheoryOverview() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#7fdbff] to-[#ffd700] bg-clip-text text-transparent drop-shadow-lg">Quantum Theory Hub</h1>
      <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-10">
        Welcome to the Quantum Theory section! Dive into the fascinating world of quantum computing, its algorithms, foundational concepts, and curated resources.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mt-4">
        <a href="/quantum-theory/blogs" className="bg-black/30 rounded-xl p-8 shadow-lg hover:scale-105 transition flex flex-col items-center border border-[#7fdbff]/30">
          <span className="text-3xl font-semibold text-[#ffd700] mb-2">Blogs</span>
          <span className="text-gray-200">Opinion pieces, explainers, and quantum journeys.</span>
        </a>
        <a href="/quantum-theory/articles" className="bg-black/30 rounded-xl p-8 shadow-lg hover:scale-105 transition flex flex-col items-center border border-[#ff7f50]/30">
          <span className="text-3xl font-semibold text-[#ff7f50] mb-2">Articles</span>
          <span className="text-gray-200">Deep dives into theory and quantum phenomena.</span>
        </a>
        <a href="/quantum-theory/algorithms" className="bg-black/30 rounded-xl p-8 shadow-lg hover:scale-105 transition flex flex-col items-center border border-[#a1ffce]/30">
          <span className="text-3xl font-semibold text-[#a1ffce] mb-2">Algorithms</span>
          <span className="text-gray-200">Explore Shor's, Grover's, QFT, and more with visuals.</span>
        </a>
        <a href="/quantum-theory/resources" className="bg-black/30 rounded-xl p-8 shadow-lg hover:scale-105 transition flex flex-col items-center border border-[#c2e9fb]/30">
          <span className="text-3xl font-semibold text-[#c2e9fb] mb-2">Resources</span>
          <span className="text-gray-200">Videos, images, and learning links.</span>
        </a>
      </div>
      
    </div>
  );
}
