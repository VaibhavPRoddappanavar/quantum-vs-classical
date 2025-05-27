"use client";

import { createElement } from "react";
import { motion } from "framer-motion";

const GlowButton = ({ children, className, primary = false, as = "button", ...props }) => {
  // Common props for all button types
  const commonProps = {
    className: `glow-button ${
      primary
        ? "bg-indigo-600 hover:bg-indigo-700"
        : "bg-transparent hover:bg-white/10 border border-white/30"
    } text-white font-medium rounded-lg px-8 py-3 ${className || ""}`,
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
    ...props
  };

  // Create the appropriate motion component based on the 'as' prop
  return createElement(motion[as] || motion.button, commonProps, children);
};

export default GlowButton;
