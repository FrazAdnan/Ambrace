import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const OPENINGS = [
  {
    id: 1,
    title: 'Founding Engineer (Frontend)',
    type: 'Full-time',
    location: 'Remote',
    department: 'Engineering',
    desc: 'Lead the development of our core React application, focusing on high-fidelity animations, glassmorphic UI, and real-time WebRTC integrations.'
  },
  {
    id: 2,
    title: 'AI Matchmaking Specialist',
    type: 'Full-time',
    location: 'Hybrid',
    department: 'Data & AI',
    desc: 'Design and optimize the algorithms that instantly pair students with the perfect teacher based on cognitive profiling and query context.'
  },
  {
    id: 3,
    title: 'Community Manager',
    type: 'Part-time',
    location: 'Remote',
    department: 'Growth',
    desc: 'Foster our growing network of beta testers, gather feedback, and ensure the safety and quality of the Ambrace ecosystem.'
  }
];

export default function Careers({ onBack }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      
      {/* Ambient Glows */}
      <div style={{ position: 'fixed', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none' }} />
      <div style={{
        position: 'fixed', width: '80vw', height: '80vh', borderRadius: '50%',
        background: 'var(--glow-primary)',
        top: '-20%', left: '-10%', pointerEvents: 'none',
        transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`,
        transition: 'transform 0.15s ease-out'
      }} />
      <div style={{
        position: 'fixed', width: '70vw', height: '70vh', borderRadius: '50%',
        background: 'var(--glow-secondary)',
        bottom: '-20%', right: '-10%', pointerEvents: 'none',
        transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px)`,
        transition: 'transform 0.15s ease-out'
      }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backdropFilter: 'blur(80px) saturate(150%)', WebkitBackdropFilter: 'blur(80px) saturate(150%)' }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, width: '100%', padding: '24px', zIndex: 50, display: 'flex', alignItems: 'center' }}>
        <button className="btn btn-outline" onClick={onBack} style={{ padding: '8px 24px', borderRadius: 99, background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
          ← Back to Home
        </button>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '64px 24px 120px' }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <div className="badge badge-indigo" style={{ marginBottom: 16 }}>We are hiring</div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24 }}>
            Join the <br/>
            <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mission.</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.5, maxWidth: 500, margin: '0 auto' }}>
            Help us build the world's first instantaneous peer-to-peer knowledge network.
          </p>
        </motion.div>

        {/* Listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {OPENINGS.map((job, index) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass"
              style={{ padding: '32px', borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 16, cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="pulse-dot green" style={{ width: 6, height: 6 }}></span> {job.location}
                    </span>
                    <span>•</span>
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ padding: '8px 24px', fontSize: '0.9rem', borderRadius: 99, boxShadow: 'var(--btn-glow)' }}>
                  Apply
                </button>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {job.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
