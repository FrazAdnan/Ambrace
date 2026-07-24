import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

export default function MechanicsSequence() {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const cards = [
    { icon: '📹', title: 'Crystal Clear Sessions', desc: 'HD low-latency video and audio optimized for peer-to-peer educational sessions.' },
    { icon: '📝', title: 'Shared Whiteboards', desc: 'Collaborative canvas powered by real-time sync. Draw, write, and solve together.' },
    { icon: '🛡️', title: 'Verified Educators', desc: 'Every teacher undergoes background checks and subject proficiency tests before joining.' },
    { icon: '🎯', title: 'Subject Matching', desc: 'Smart algorithm matches you based on difficulty level, language, and curriculum type.' },
    { icon: '💾', title: 'Session Archiving', desc: 'Get a transcript and recording of every session to review concepts later.' },
    { icon: '🔒', title: 'Safe & Encrypted', desc: 'End-to-end encryption and strict moderation AI to keep the community respectful.' }
  ];

  // Header fades in first
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [50, 0]);

  return (
    <div ref={containerRef} className="sequence-wrapper" style={{ height: isMobile ? '400vh' : '300vh', position: 'relative' }}>
      <div id="mechanics" style={{ position: 'absolute', top: '60%' }} />
      <div className="sequence-sticky" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        
        <div style={{ maxWidth: 1200, width: '100%' }}>
          
          <motion.div className="sequence-item" style={{ opacity: headerOpacity, y: headerY, textAlign: 'center', marginBottom: isMobile ? 32 : 64 }}>
            <div style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>CORE MECHANICS</div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 20 }}>Built for Serious Scholars</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>We've ripped out the chaos and replaced it with academic precision. No bots, no nonsense, just knowledge.</p>
          </motion.div>

          <div style={{ position: 'relative', display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? 'none' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, height: isMobile ? 250 : 'auto' }}>
            {cards.map((f, i) => {
              // Desktop: staggered fade in and stay visible
              const dStart = 0.1 + (i * 0.1);
              const dEnd = dStart + 0.1;
              const desktopOpacity = useTransform(scrollYProgress, [dStart, dEnd], [0, 1]);
              const desktopY = useTransform(scrollYProgress, [dStart, dEnd], [50, 0]);

              // Mobile: overlap sequence (fade in, stay, fade out)
              const mStart = 0.1 + (i * 0.13);
              const mPeak = mStart + 0.05;
              const mFadeOut = mPeak + 0.08;
              const mobileOpacity = useTransform(scrollYProgress, [mStart, mPeak, mFadeOut, mFadeOut + 0.05], [0, 1, 1, 0]);
              const mobileY = useTransform(scrollYProgress, [mStart, mPeak, mFadeOut, mFadeOut + 0.05], [50, 0, 0, -50]);

              return (
                <motion.div key={i} className="sequence-item glass" 
                  style={{ 
                    opacity: isMobile ? mobileOpacity : desktopOpacity, 
                    y: isMobile ? mobileY : desktopY,
                    position: isMobile ? 'absolute' : 'relative',
                    width: '100%',
                    maxWidth: isMobile ? 400 : 'none',
                    left: 0, right: 0, margin: '0 auto'
                  }} 
                  onMouseEnter={e => { if(!isMobile) e.currentTarget.style.transform = 'translateY(-4px)' }} 
                  onMouseLeave={e => { if(!isMobile) e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div style={{ padding: 32, borderRadius: 32, background: 'var(--glass-bg)', transition: 'transform 0.2s', cursor: 'default', height: '100%' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>{f.icon}</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 12, letterSpacing: '-0.01em' }}>{f.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
