import React, { useEffect, useState } from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';
import AnimatedBeaver from './AnimatedBeaver';

export default function MascotJourney({ scrollYProgress }) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only access window after component mounts
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Base positions
  const centerX = 0;
  const rightX = (windowSize.width / 2) * 0.7; // 70% to the right
  const leftX = -(windowSize.width / 2) * 0.7; // 70% to the left
  
  const centerY = 0;
  const topY = -(windowSize.height / 2) * 0.6; // 60% up
  const bottomY = (windowSize.height / 2) * 0.6; // 60% down

  // Macroscopic animations based on page scroll
  // Sections: 
  // 0.00 - 0.15: Hero
  // 0.20 - 0.40: Mechanics
  // 0.50 - 0.70: Process
  // 0.80 - 1.00: Safety / Footer
  
  const rawX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.5, 0.6, 0.8, 1],
    [centerX, centerX, rightX, rightX, leftX, leftX, centerX]
  );

  const rawY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.5, 0.6, 0.8, 1],
    [centerY, centerY, topY, topY, centerY, centerY, bottomY]
  );

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.5, 0.6, 0.8, 1],
    [1.5, 1.5, 0.8, 0.8, 1.2, 1.2, 2.5]
  );

  const rawRotate = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.5, 0.6, 0.8, 1],
    [0, 0, 15, 15, -15, -15, 0]
  );

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.9, 1],
    [1, 1, 0]
  );

  // Apply silky smooth spring physics for high-end feel
  const springConfig = { stiffness: 40, damping: 15, mass: 1.5 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);
  const scale = useSpring(rawScale, springConfig);
  const rotate = useSpring(rawRotate, springConfig);
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 20 });

  if (windowSize.width === 0) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        x,
        y,
        scale,
        rotate,
        opacity,
        // Center the transform origin
        marginLeft: -80,
        marginTop: -80,
        zIndex: 10,
        pointerEvents: 'none' // Don't block clicks
      }}
    >
      <AnimatedBeaver />
    </motion.div>
  );
}
