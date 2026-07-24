import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSequence({ onSelectRole, onLaunchApp, onExploreCareers }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"] // from when it hits top to when it leaves
  });

  // Fade out elements as we scroll down
  const opacityPill = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yPill = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const opacityTitle = useTransform(scrollYProgress, [0.1, 0.3], [1, 0]);
  const yTitle = useTransform(scrollYProgress, [0.1, 0.3], [0, -50]);
  const scaleTitle = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  const opacityDesc = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);
  const yDesc = useTransform(scrollYProgress, [0.2, 0.4], [0, -50]);

  const opacityBtns = useTransform(scrollYProgress, [0.3, 0.5], [1, 0]);
  const yBtns = useTransform(scrollYProgress, [0.3, 0.5], [0, -50]);

  const opacityFooter = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);
  const yFooter = useTransform(scrollYProgress, [0.4, 0.6], [0, 50]);

  // Overall container scale down effect
  const containerScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const containerOpacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);

  return (
    <div ref={containerRef} className="sequence-wrapper" style={{ height: '200vh', position: 'relative' }}>
      
      <div className="sequence-sticky" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div className="sequence-item" style={{ scale: containerScale, opacity: containerOpacity, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
          
          <motion.div style={{ opacity: opacityPill, y: yPill, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '99px', background: 'rgba(10,132,255,0.1)', border: '1px solid rgba(10,132,255,0.2)', color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 32, letterSpacing: '0.05em' }}>
            <span className="pulse-dot green" style={{ width: 6, height: 6 }} /> LIVE KNOWLEDGE EXCHANGE
          </motion.div>
          
          <motion.h1 style={{ opacity: opacityTitle, y: yTitle, scale: scaleTitle, fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 24, maxWidth: 900 }}>
            Instant Wisdom.<br/>
            <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #fff 0%, #a1a1a6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Randomly Matched.</span>
          </motion.h1>

          <motion.p style={{ opacity: opacityDesc, y: yDesc, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 48, maxWidth: 640, letterSpacing: '-0.01em' }}>
            The spontaneity of Omegle meets the precision of top-tier tutoring. Connect with verified experts instantly to solve your toughest academic blockers.
          </motion.p>

          <motion.div style={{ opacity: opacityBtns, y: yBtns, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
            <button className="btn btn-primary btn-lg" onClick={onLaunchApp} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>Join Beta</button>
            <button className="btn btn-outline btn-lg" onClick={onExploreCareers} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>Explore opportunities</button>
          </motion.div>

          <motion.div style={{ opacity: opacityFooter, y: yFooter, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>

            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block', boxShadow: '0 0 12px rgba(50,215,75,0.6)' }} />
              1,240 Users Matching Right Now
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
