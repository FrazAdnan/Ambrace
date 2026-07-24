import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

export default function SafetySequence() {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const cards = [
    { title: 'AI Moderation', desc: 'Instant disconnect for any unethical conduct.' },
    { title: 'Record & Report', desc: 'Full logs kept for 30 days for safety reviews.' },
    { title: 'No Leakage', desc: 'We never share your personal data with matches.' }
  ];

  // Header fade
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  return (
    <div ref={containerRef} className="sequence-wrapper" style={{ height: isMobile ? '400vh' : '300vh', position: 'relative' }}>
      <div id="safety" style={{ position: 'absolute', top: '60%' }} />
      <div className="sequence-sticky" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        
        <div style={{ maxWidth: 1000, width: '100%', textAlign: 'center' }}>
          
          <motion.div className="sequence-item" style={{ opacity: headerOpacity, y: headerY }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(10,132,255,0.15)', border: '1px solid rgba(10,132,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 32px' }}>
              🛡️
            </div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 24 }}>Privacy is Our Priority</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 700, margin: '0 auto 64px', lineHeight: 1.6 }}>
              Unlike other random meeting apps, Ambrace is built on trust. All sessions are monitored by AI for behavioral compliance, and every teacher is identity-verified via government-issued documents.
            </p>
          </motion.div>
          
          <div style={{ position: 'relative', display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? 'none' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, height: isMobile ? 180 : 'auto' }}>
            {cards.map((s, i) => {
              // Desktop
              const dStart = 0.2 + (i * 0.2);
              const dEnd = dStart + 0.15;
              const dOpacity = useTransform(scrollYProgress, [dStart, dEnd], [0, 1]);
              const dY = useTransform(scrollYProgress, [dStart, dEnd], [50, 0]);

              // Mobile
              const mStart = 0.2 + (i * 0.2);
              const mPeak = mStart + 0.08;
              const mFadeOut = mPeak + 0.1;
              const mOpacity = useTransform(scrollYProgress, [mStart, mPeak, mFadeOut, mFadeOut + 0.05], [0, 1, 1, 0]);
              const mY = useTransform(scrollYProgress, [mStart, mPeak, mFadeOut, mFadeOut + 0.05], [50, 0, 0, -50]);

              return (
                <motion.div key={i} className="sequence-item" 
                  style={{ 
                    opacity: isMobile ? mOpacity : dOpacity, 
                    y: isMobile ? mY : dY,
                    position: isMobile ? 'absolute' : 'relative',
                    width: '100%',
                    left: 0, top: 0,
                    padding: 32, borderRadius: 32, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', textAlign: 'left' 
                  }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
