"use client";

import { motion } from "framer-motion";
import ParticlesBackground from "./components/Particles";
import ParallaxTilt from "./components/ParallaxTilt";
import GlitchText from "./components/GlitchText";
import GlowButton from "./components/GlowButton";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center overflow-hidden">
      {/* Particle background */}
      <ParticlesBackground />
      
      {/* Main content */}
      <motion.main 
        className="relative z-10 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ParallaxTilt className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-2 tracking-tight font-poppins">
            <GlitchText text="Quantum" className="mr-4" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100">vs</span>
            <GlitchText text=" Classical" className="ml-4" />
          </h1>
        </ParallaxTilt>
        
        <ParallaxTilt>
          <motion.p 
            className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Explore and compare quantum and classical algorithms through interactive simulations 
            and visualizations.
          </motion.p>
        </ParallaxTilt>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <GlowButton primary>
            Explore Algorithms
          </GlowButton>
          <GlowButton as="a" href="/simulator">
            View Simulations
          </GlowButton>
        </motion.div>
      </motion.main>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-purple-500/10 rounded-full blur-3xl pulse-effect"></div>
        <div className="absolute bottom-[30%] right-[15%] w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pulse-effect" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[60%] left-[20%] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pulse-effect" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}
