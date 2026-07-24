import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

export default function ProcessSequence() {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const steps = [
    { step: '01', title: 'Select your subject', desc: 'Tell the system what you\'re struggling with. Bio-chemistry? Linear Algebra? We\'ve got you covered.' },
    { step: '02', title: 'Query matching', desc: 'Our engine scans for available teachers who are experts in that specific tiny niche of your subject.' },
    { step: '03', title: 'Live resolution', desc: 'Meet face-to-face. Use the shared board. Record the solution. Rate the experience.' }
  ];

  // Header fades in 0-0.1
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [50, 0]);

  // Desktop testimonial
  const dTestOpacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);
  const dTestY = useTransform(scrollYProgress, [0.7, 0.8], [50, 0]);

  // Mobile testimonial
  const mTestOpacity = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1], [0, 1, 1, 0]);
  const mTestY = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1], [50, 0, 0, -50]);

  return (
    <div ref={containerRef} className="sequence-wrapper" style={{ height: isMobile ? '400vh' : '300vh', position: 'relative' }}>
      <div id="process" style={{ position: 'absolute', top: '60%' }} />
      <div className="sequence-sticky" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        
        <div style={{ maxWidth: 1200, width: '100%' }}>
          
          <motion.div className="sequence-item" style={{ opacity: headerOpacity, y: headerY, textAlign: 'center', marginBottom: isMobile ? 40 : 80 }}>
            <div style={{ color: 'var(--accent-indigo)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>THE PROCESS</div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>From Query to Clarity in 60 Seconds</h2>
          </motion.div>

          <div style={{ position: 'relative', display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? 'none' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: 64, alignItems: 'center', height: isMobile ? 300 : 'auto' }}>
            
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 48, position: isMobile ? 'absolute' : 'relative', width: '100%', left: 0, top: 0 }}>
              {steps.map((s, i) => {
                // Desktop
                const dStart = 0.1 + (i * 0.2);
                const dEnd = dStart + 0.1;
                const dOpacity = useTransform(scrollYProgress, [dStart, dEnd], [0, 1]);
                const dX = useTransform(scrollYProgress, [dStart, dEnd], [-50, 0]);

                // Mobile
                const mStart = 0.1 + (i * 0.2);
                const mPeak = mStart + 0.08;
                const mFadeOut = mPeak + 0.1;
                const mOpacity = useTransform(scrollYProgress, [mStart, mPeak, mFadeOut, mFadeOut + 0.05], [0, 1, 1, 0]);
                const mY = useTransform(scrollYProgress, [mStart, mPeak, mFadeOut, mFadeOut + 0.05], [50, 0, 0, -50]);

                return (
                  <motion.div key={i} className="sequence-item" 
                    style={{ 
                      opacity: isMobile ? mOpacity : dOpacity, 
                      x: isMobile ? 0 : dX,
                      y: isMobile ? mY : 0,
                      display: 'flex', 
                      gap: 24,
                      position: isMobile ? 'absolute' : 'relative',
                      width: '100%'
                    }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'monospace' }}>{s.step}</div>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 12, letterSpacing: '-0.02em' }}>{s.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5 }}>{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Testimonial */}
            <motion.div className="sequence-item glass" 
              style={{ 
                opacity: isMobile ? mTestOpacity : dTestOpacity, 
                y: isMobile ? mTestY : dTestY,
                position: isMobile ? 'absolute' : 'relative',
                width: '100%',
                left: 0, top: 0
              }}>
              <div style={{ padding: isMobile ? 32 : 48, borderRadius: 40, background: 'var(--glass-bg)' }}>
                <div style={{ fontSize: '4rem', color: 'var(--glass-border)', lineHeight: 0.5, marginBottom: 24 }}>"</div>
                <p style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 500, lineHeight: 1.5, marginBottom: 32, letterSpacing: '-0.01em' }}>
                  This turned my F into an A. Instant matches are an absolute game changer for late-night studying.
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>David K.</div>
                  <div style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', marginTop: 4 }}>MEDICAL STUDENT</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
