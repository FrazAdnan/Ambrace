import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MiniGame from '../components/MiniGame';

export default function ComingSoon({ onBack }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setCardTilt({ x, y });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setSubmitted(true);
      setEmail('');
      // Here you would typically fire off the email to your backend
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Ambient Glows */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', width: '80vw', height: '80vh', borderRadius: '50%',
        background: 'var(--glow-primary)',
        top: '-20%', left: '-10%', pointerEvents: 'none',
        transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`,
        transition: 'transform 0.15s ease-out'
      }} />
      <div style={{
        position: 'absolute', width: '70vw', height: '70vh', borderRadius: '50%',
        background: 'var(--glow-secondary)',
        bottom: '-20%', right: '-10%', pointerEvents: 'none',
        transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px)`,
        transition: 'transform 0.15s ease-out'
      }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backdropFilter: 'blur(80px) saturate(150%)', WebkitBackdropFilter: 'blur(80px) saturate(150%)' }} />

      {/* Nav Back */}
      <nav style={{ position: 'absolute', top: 0, width: '100%', padding: '24px', zIndex: 50 }}>
        <button className="btn btn-outline" onClick={onBack} style={{ padding: '8px 24px', borderRadius: 99, background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
          ← Back to Home
        </button>
      </nav>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 600, padding: 24, perspective: 1000 }}
      >
        <motion.div 
          className="glass"
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{ 
            padding: '64px 48px', 
            borderRadius: 40, 
            textAlign: 'center',
            transform: `rotateX(${cardTilt.y * -5}deg) rotateY(${cardTilt.x * 5}deg)`,
            transition: 'transform 0.15s ease-out',
            overflow: 'hidden'
          }}
        >
          
          <AnimatePresence mode="wait">
            {!gameWon ? (
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16, lineHeight: 1.1 }}>
                  Unlock Beta <br/>
                  <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Access.</span>
                </h1>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5, marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
                  Beat the memory match to prove your focus and unlock the exclusive waitlist registration.
                </p>

                <MiniGame onWin={() => setGameWon(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                <div style={{ width: 80, height: 80, margin: '0 auto 32px', borderRadius: 24, background: 'rgba(50,215,75,0.1)', border: '1px solid rgba(50,215,75,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                  🎓
                </div>
                
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16, lineHeight: 1.1 }}>
                  Brilliant. <br/>
                  <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>You're in.</span>
                </h1>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.5, marginBottom: 48, maxWidth: 400, margin: '0 auto 48px' }}>
                  You've unlocked the beta registration. Claim your spot before the gates close.
                </p>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ padding: 24, background: 'rgba(50,215,75,0.1)', border: '1px solid rgba(50,215,75,0.2)', borderRadius: 24, color: 'var(--accent-emerald)' }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>✅</div>
                    <div style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>You're on the list!</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: 4 }}>We'll notify you as soon as we open the gates.</div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 10 }}>
                    <input 
                      type="email" 
                      placeholder="Enter your email address..." 
                      className="input" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ padding: '16px 24px', borderRadius: 99, fontSize: '1rem', flex: 1, background: 'var(--bg-primary)' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: 99, padding: '0 32px', fontSize: '1rem', boxShadow: 'var(--btn-glow)' }}>
                      Claim Spot
                    </button>
                  </form>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-amber)', display: 'inline-block', boxShadow: '0 0 8px var(--accent-amber)' }} />
                  Limited spots available in the beta program
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </motion.div>
    </div>
  );
}
