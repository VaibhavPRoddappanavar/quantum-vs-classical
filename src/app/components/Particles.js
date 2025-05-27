"use client";

import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  
  useEffect(() => {
    const initParticles = async () => {
      try {
        const { loadFull } = await import("tsparticles");
        await loadFull(window.tsParticles);
        setInit(true);
      } catch (error) {
        console.error("Error initializing particles:", error);
      }
    };
    
    initParticles();
  }, []);
  
  const particlesLoaded = useCallback(async (container) => {
    // console.log(container);
  }, []);

  if (!init) return null;
  
  return (
    <Particles
      id="tsparticles"
      loaded={particlesLoaded}
      options={{
        background: {
          opacity: 0,
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: false,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
              distance: 100,
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 150,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#a78bfa",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 50,
          },
          opacity: {
            value: 0.3,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default ParticlesBackground;
