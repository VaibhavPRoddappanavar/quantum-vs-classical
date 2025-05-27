"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const GlitchText = ({ text, className }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.span 
        className="text-white font-bold"
        animate={{
          textShadow: isHovering 
            ? '0 0 10px rgba(139, 92, 246, 0.5)' 
            : '0 0 0px transparent'
        }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

export default GlitchText;
