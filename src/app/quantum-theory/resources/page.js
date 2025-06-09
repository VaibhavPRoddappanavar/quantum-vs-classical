import React from 'react';
import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div>
      <div className="flex justify-center w-full">
        <Link href="/" className="mb-6 px-5 py-2 rounded-lg bg-[#232946] text-[#ffd700] font-semibold shadow hover:bg-[#393e46] transition">← Back to Home</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-[#c2e9fb]">Quantum Resources</h1>
      {/* Video Resources Section */}
      <h2 className="text-2xl font-bold mb-4 mt-8 text-[#7fdbff]">Video Resources</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-black/30 rounded-xl p-6 shadow-md flex flex-col items-center">
          <div className="w-full aspect-video max-w-[350px] mb-4">
            <iframe src="https://www.youtube.com/embed/X8MZWCGgIb8" title="Quantum Computing: Crash Course Computer Science" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded w-full h-full"></iframe>
          </div>
          <span className="text-gray-200 text-center">Quantum Computing: Crash Course Computer Science</span>
        </div>
        {/* Card 2 */}
        <div className="bg-black/30 rounded-xl p-6 shadow-md flex flex-col items-center">
          <div className="w-full aspect-video max-w-[350px] mb-4">
            <iframe src="https://www.youtube.com/embed/1hHMwLxN6EM" title="How Quantum Computers Work - TED-Ed" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded w-full h-full"></iframe>
          </div>
          <span className="text-gray-200 text-center">How Quantum Computers Work – TED-Ed</span>
        </div>
        {/* Card 3 */}
        <div className="bg-black/30 rounded-xl p-6 shadow-md flex flex-col items-center">
          <div className="w-full aspect-video max-w-[350px] mb-4">
            <iframe src="https://www.youtube.com/embed/mAHC1dWKNYE" title="Quantum Fourier Transform – Qiskit" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded w-full h-full"></iframe>
          </div>
          <span className="text-gray-200 text-center">Quantum Fourier Transform – Qiskit</span>
        </div>
        {/* Card 4 */}
        <div className="bg-black/30 rounded-xl p-6 shadow-md flex flex-col items-center">
          <div className="w-full aspect-video max-w-[350px] mb-4">
            <iframe src="https://www.youtube.com/embed/70Z-UUPjYY4" title="Quantum Computing: The Big Picture (Microsoft Research)" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded w-full h-full"></iframe>
          </div>
          <span className="text-gray-200 text-center">Quantum Computing: The Big Picture (Microsoft Research)</span>
        </div>
        {/* Card 5 */}
        <div className="bg-black/30 rounded-xl p-6 shadow-md flex flex-col items-center">
          <div className="w-full aspect-video max-w-[350px] mb-4">
            <iframe src="https://www.youtube.com/embed/NqHKr9CGWJ0" title="Quantum Computing Applications (IBM Research)" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded w-full h-full"></iframe>
          </div>
          <span className="text-gray-200 text-center">Quantum Computing Applications (IBM Research)</span>
        </div>
        {/* Card 6 */}
        <div className="bg-black/30 rounded-xl p-6 shadow-md flex flex-col items-center">
          <div className="w-full aspect-video max-w-[350px] mb-4">
            <iframe src="https://www.youtube.com/embed/f7qNDZC2IX4" title="Quantum Computing in Practice – D-Wave" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded w-full h-full"></iframe>
          </div>
          <span className="text-gray-200 text-center">Quantum Computing in Practice – D-Wave</span>
        </div>
      </div>

      {/* Divider for Textual Resources */}
      <div className="border-t border-[#7fdbff]/40 my-12"></div>
      <h2 className="text-2xl font-bold mb-4 text-[#ffd700]">Textual & Interactive Resources</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-black/30 rounded-xl p-6 shadow-md flex flex-col items-center">
          <a href="https://quantum-computing.ibm.com/" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 px-4 bg-[#0a1931] text-[#7fdbff] rounded-lg font-semibold shadow hover:bg-[#112d4e] transition mb-4">IBM Quantum Experience</a>
          <span className="text-gray-200 text-center">Try real quantum computers and simulators online with IBM's Quantum Experience platform.</span>
        </div>
        <div className="bg-black/30 rounded-xl p-6 shadow-md flex flex-col items-center">
          <a href="https://qiskit.org/learn/" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 px-4 bg-[#232946] text-[#ffd700] rounded-lg font-semibold shadow hover:bg-[#393e46] transition mb-4">Qiskit Textbook & Tutorials</a>
          <span className="text-gray-200 text-center">Learn quantum programming and algorithms interactively with Qiskit's open-source resources.</span>
        </div>
      </div>
    </div>
  );
}
