// This layout applies the same background, fonts, and global theme as the main site
import React from 'react';
import ParticlesBackground from '../components/Particles';

export default function QuantumTheoryLayout({ children }) {
  return (
    <div className="min-h-screen w-full relative text-gray-100 font-poppins overflow-x-hidden">
      {/* Animated purple particles background */}
      <ParticlesBackground />
      {/* Decorative blurred purple/blue elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-purple-500/10 rounded-full blur-3xl pulse-effect"></div>
        <div className="absolute bottom-[30%] right-[15%] w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pulse-effect" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[60%] left-[20%] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pulse-effect" style={{ animationDelay: '2s' }}></div>
      </div>
      {/* Navigation for theory section */}
      <nav className="w-full flex justify-center py-6 bg-black/30 backdrop-blur-md z-20 sticky top-0 shadow-lg">
        <div className="flex gap-8 text-lg font-semibold">
          <a href="/quantum-theory" className="hover:text-[#7fdbff] transition">Overview</a>
          <a href="/quantum-theory/blogs" className="hover:text-[#ffd700] transition">Blogs</a>
          <a href="/quantum-theory/articles" className="hover:text-[#ff7f50] transition">Articles</a>
          <a href="/quantum-theory/algorithms" className="hover:text-[#a1ffce] transition">Algorithms</a>
          <a href="/quantum-theory/resources" className="hover:text-[#c2e9fb] transition">Resources</a>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 pb-24 pt-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
