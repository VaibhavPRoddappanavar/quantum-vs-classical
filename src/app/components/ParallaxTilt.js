"use client";

import React from "react";
import Tilt from "react-parallax-tilt";

const ParallaxTilt = ({ children, className }) => {
  return (
    <Tilt
      className={className}
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      perspective={1000}
      transitionSpeed={1500}
      scale={1.02}
      gyroscope={true}
    >
      {children}
    </Tilt>
  );
};

export default ParallaxTilt;
