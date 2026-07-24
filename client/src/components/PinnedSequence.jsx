import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PinnedSequence() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mapping scroll progress to the 3 features
  // Feature 1: Fades in 0-10%, stays 10-25%, fades out 25-35%
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.35], [0, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.35], [50, 0, 0, -50]);
  const scale1 = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.35], [0.95, 1, 1, 1.05]);

  // Feature 2: Fades in 35-45%, stays 45-60%, fades out 60-70%
  const opacity2 = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.7], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.7], [50, 0, 0, -50]);
  const scale2 = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.7], [0.95, 1, 1, 1.05]);

  // Feature 3: Fades in 70-80%, stays until 100%
  const opacity3 = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);
  const y3 = useTransform(scrollYProgress, [0.7, 0.8, 1], [50, 0, 0]);
  const scale3 = useTransform(scrollYProgress, [0.7, 0.8, 1], [0.95, 1, 1]);

  return (
    <div ref={containerRef} className="sequence-wrapper" style={{ height: '400vh', position: 'relative' }}>
      
      {/* Pinned 100vh Container */}
      <div className="sequence-sticky" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Abstract Background Element */}
        <motion.div className="sequence-bg" style={{
          position: 'absolute',
          width: '80vw',
          height: '80vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 60%)',
          scale: useTransform(scrollYProgress, [0, 1], [0.5, 2]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.2]),
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        {/* Content Container */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1000, padding: '0 24px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Feature 1 */}
          <motion.div className="sequence-absolute" style={{ position: 'absolute', width: '100%', opacity: opacity1, y: y1, scale: scale1 }}>
            <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'rgba(10,132,255,0.1)', color: 'var(--accent-blue)', borderRadius: 99, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 32 }}>
              01 / MATCHMAKING
            </div>
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 24 }}>
              Intelligent Precision.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Our engine instantly scans thousands of verified educators to find the exact expert for your highly specific niche query. No waiting, no browsing.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div className="sequence-absolute" style={{ position: 'absolute', width: '100%', opacity: opacity2, y: y2, scale: scale2 }}>
            <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'rgba(94,92,230,0.1)', color: 'var(--accent-indigo)', borderRadius: 99, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 32 }}>
              02 / WORKSPACE
            </div>
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 24 }}>
              Live Collaboration.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Jump into an HD video session with an interactive shared whiteboard. Draw, write, code, and solve complex problems together in real-time.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div className="sequence-absolute" style={{ position: 'absolute', width: '100%', opacity: opacity3, y: y3, scale: scale3 }}>
            <div style={{ display: 'inline-flex', padding: '6px 16px', background: 'rgba(50,215,75,0.1)', color: 'var(--accent-emerald)', borderRadius: 99, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 32 }}>
              03 / RESOLUTION
            </div>
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 24 }}>
              Instant Clarity.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Get your answer, rate the session, and walk away with a complete HD recording and transcript stored safely in your personalized archive.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
