import React, { useEffect, useRef } from 'react';

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 10,
  opacity: Math.random() * 0.5 + 0.1,
}));

export default function Landing({ onSelectRole }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)' }} />
      <div style={{ position: 'fixed', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none' }} />

      {/* Particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.id % 2 === 0 ? 'var(--accent-purple)' : 'var(--accent-cyan)',
            opacity: p.opacity,
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      {/* Glowing orbs */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', bottom: '-80px', right: '-80px', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: 800, width: '100%' }}>
        {/* Logo */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: 'var(--shadow-purple)' }}>🎓</div>
          <span style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>EduConnect</span>
        </div>

        <h1 className="fade-up" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20, animationDelay: '0.1s' }}>
          Learn from Real<br />
          <span className="gradient-text">Teachers, Live</span>
        </h1>

        <p className="fade-up" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 56, maxWidth: 520, margin: '0 auto 56px', animationDelay: '0.2s' }}>
          Connect instantly with teachers who can answer your questions in real-time — like a video call, built for learning.
        </p>

        {/* Role cards */}
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 560, margin: '0 auto', animationDelay: '0.3s' }}>
          <RoleCard
            emoji="📚"
            title="I'm a Student"
            desc="Find a teacher and get your doubts cleared instantly"
            accent="var(--accent-cyan)"
            accentBg="rgba(6,182,212,0.1)"
            accentBorder="rgba(6,182,212,0.25)"
            onClick={() => onSelectRole('student')}
          />
          <RoleCard
            emoji="🏫"
            title="I'm a Teacher"
            desc="Help students by sharing your knowledge and expertise"
            accent="var(--accent-purple-light)"
            accentBg="rgba(124,58,237,0.1)"
            accentBorder="rgba(124,58,237,0.25)"
            onClick={() => onSelectRole('teacher')}
          />
        </div>

        {/* Stats bar */}
        <div className="fade-up" style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 56, animationDelay: '0.4s' }}>
          {[['1000+', 'Students'], ['200+', 'Teachers'], ['10+', 'Subjects']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700 }}>{num}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ emoji, title, desc, accent, accentBg, accentBorder, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: accentBg, border: `1px solid ${accentBorder}`,
      borderRadius: 'var(--radius-xl)', padding: '28px 20px',
      cursor: 'pointer', transition: 'all 0.25s ease', textAlign: 'left', color: 'var(--text-primary)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${accentBg}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{emoji}</div>
      <div style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: accent, fontSize: '0.82rem', fontWeight: 600 }}>
        Get started <span style={{ fontSize: '1rem' }}>→</span>
      </div>
    </button>
  );
}
