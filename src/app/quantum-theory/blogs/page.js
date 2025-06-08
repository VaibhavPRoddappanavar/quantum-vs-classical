import React from 'react';

export default function BlogsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#ffd700] text-center drop-shadow">What is Quantum Computing?</h1>
      <div className="bg-black/30 rounded-2xl p-8 shadow-lg mb-10">
        <p className="text-lg text-gray-200 mb-4">
          Quantum computing is an emergent field of cutting-edge computer science harnessing the unique qualities of quantum mechanics to solve problems beyond the ability of even the most powerful classical computers.
        </p>
        <p className="text-lg text-gray-200 mb-4">
          The field of quantum computing contains a range of disciplines, including quantum hardware and quantum algorithms. While still in development, quantum technology will soon be able to solve complex problems that supercomputers can’t solve, or can’t solve fast enough.
        </p>
        <p className="text-lg text-gray-200 mb-4">
          By taking advantage of quantum physics, fully realized quantum computers would be able to process massively complicated problems at orders of magnitude faster than modern machines. For a quantum computer, challenges that might take a classical computer thousands of years to complete might be reduced to a matter of minutes.
        </p>
        <p className="text-lg text-gray-200 mb-4">
          The study of subatomic particles, also known as quantum mechanics, reveals unique and fundamental natural principles. Quantum computers harness these fundamental phenomena to compute probabilistically and quantum mechanically.
        </p>
      </div>

      <div className="bg-black/30 rounded-2xl p-8 shadow-lg mb-10">
        <h2 className="text-2xl font-semibold text-[#7fdbff] mb-4">Four Key Principles of Quantum Mechanics</h2>
        <ul className="list-disc list-inside text-gray-200 space-y-2">
          <li><b>Superposition:</b> The state in which a quantum particle or system can represent not just one possibility, but a combination of multiple possibilities.</li>
          <li><b>Entanglement:</b> The process in which multiple quantum particles become correlated more strongly than regular probability allows.</li>
          <li><b>Decoherence:</b> The process in which quantum particles and systems can decay, collapse or change, converting into single states measurable by classical physics.</li>
          <li><b>Interference:</b> The phenomenon in which entangled quantum states can interact and produce more and less likely probabilities.</li>
        </ul>
      </div>

      <div className="bg-black/30 rounded-2xl p-8 shadow-lg mb-10">
        <h2 className="text-2xl font-semibold text-[#7fdbff] mb-4">Qubits</h2>
        <p className="text-gray-200 mb-4">
          While classical computers rely on binary bits (zeros and ones) to store and process data, quantum computers can encode even more data at once using quantum bits, or qubits, in superposition.
        </p>
        <p className="text-gray-200 mb-4">
          A qubit can behave like a bit and store either a zero or a one, but it can also be a weighted combination of zero and one at the same time. When combined, qubits in superposition can scale exponentially. Two qubits can compute with four pieces of information, three can compute with eight, and four can compute with sixteen.
        </p>
        <p className="text-gray-200 mb-4">
          However, each qubit can only output a single bit of information at the end of the computation. Quantum algorithms work by storing and manipulating information in a way inaccessible to classical computers, which can provide speedups for certain problems.
        </p>
        <p className="text-gray-200 mb-4">
          As silicon chip and superconductor development has scaled over the years, it is distinctly possible that we might soon reach a material limit on the computing power of classical computers. Quantum computing could provide a path forward for certain important problems.
        </p>
        <p className="text-gray-200 mb-4">
          With leading institutions such as <span className="text-[#7fdbff] font-semibold">IBM, Microsoft, Google and Amazon</span> joining eager startups such as Rigetti and Ionq in investing heavily in this exciting new technology, quantum computing is estimated to become a <span className="text-[#ffd700] font-semibold">USD 1.3 trillion industry by 2035</span>.
        </p>
      </div>

      <div className="bg-black/30 rounded-2xl p-8 shadow-lg mb-10">
        <h2 className="text-2xl font-semibold text-[#7fdbff] mb-4">How Do Quantum Computers Work?</h2>
        <p className="text-gray-200 mb-4">
          A primary difference between classical and quantum computers is that quantum computers use qubits instead of bits to store exponentially more information. While quantum computing does use binary code, qubits process information differently from classical computers. But what are qubits and where do they come from?
        </p>
        <h3 className="text-xl font-semibold text-[#ffd700] mb-2">What are Qubits?</h3>
        <p className="text-gray-200 mb-4">
          Generally, qubits are created by manipulating and measuring quantum particles (the smallest known building blocks of the physical universe), such as photons, electrons, trapped ions and atoms. Qubits can also engineer systems that behave like a quantum particle, as in superconducting circuits.
        </p>
        <p className="text-gray-200 mb-4">
          To manipulate such particles, qubits must be kept extremely cold to minimize noise and prevent them from providing inaccurate results or errors resulting from unintended decoherence.
        </p>
        <p className="text-gray-200 mb-4">
          There are many different types of qubits used in quantum computing today, with some better suited for different types of tasks.
        </p>
        <ul className="list-disc list-inside text-gray-200 space-y-2 mb-4">
          <li><b>Superconducting qubits:</b> Made from superconducting materials operating at extremely low temperatures, these qubits are favored for their speed in performing computations and fine-tuned control.</li>
          <li><b>Trapped ion qubits:</b> Trapped ion particles can also be used as qubits and are noted for long coherence times and high-fidelity measurements.</li>
          <li><b>Quantum dots:</b> Small semiconductors that capture a single electron and use it as a qubit, offering promising potential for scalability and compatibility with existing semiconductor technology.</li>
          <li><b>Photons:</b> Individual light particles used to send quantum information across long distances through optical fiber cables and are currently being used in quantum communication and quantum cryptography.</li>
          <li><b>Neutral atoms:</b> Commonly occurring neutral atoms charged with lasers are well suited for scaling and performing operations.</li>
        </ul>
        <p className="text-gray-200 mb-4">
          When processing a complex problem, such as factoring large numbers, classical bits become bound up by holding large quantities of information. Quantum bits behave differently. Because qubits can hold a superposition, a quantum computer that uses qubits can approach the problem in ways different from classical computers.
        </p>
        <div className="bg-indigo-900/20 rounded-lg p-4 my-4">
          <b className="text-[#ffd700]">Maze Analogy:</b> <span className="text-gray-200">Imagine you are standing in the center of a complicated maze. To escape the maze, a traditional computer would have to “brute force” the problem, trying every possible combination of paths to find the exit. This kind of computer would use bits to explore new paths and remember which ones are dead ends.<br/><br/>Comparatively, a quantum computer might derive a bird’s-eye view of the maze, testing multiple paths simultaneously and using quantum interference to reveal the correct solution. However, qubits don't test multiple paths at once; instead, quantum computers measure the probability amplitudes of qubits to determine an outcome. These amplitudes function like waves, overlapping and interfering with each other. When asynchronous waves overlap, it effectively eliminates possible solutions to complex problems, and the realized coherent wave or waves present the solution.</span>
        </div>
      </div>

      <div className="bg-black/20 rounded-2xl p-6 shadow-md mt-12 text-center">
        <h3 className="text-xl font-semibold text-[#7fdbff] mb-2">Research Newsletter</h3>
        <p className="text-gray-300 mb-2">Never miss a tech breakthrough. Discover emerging research in AI, quantum, hybrid cloud, and more from IBM’s experts with the monthly Future Forward newsletter.</p>
        <a href="https://www.ibm.com/research/newsletter" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-6 py-2 rounded bg-gradient-to-r from-[#7fdbff] to-[#ffd700] text-black font-bold shadow hover:scale-105 transition">Subscribe to Newsletter</a>
      </div>
    </div>
  );
}
