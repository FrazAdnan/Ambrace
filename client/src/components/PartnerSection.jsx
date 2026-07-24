import React from 'react';
import { motion } from 'framer-motion';

export default function PartnerSection() {
  return (
    <section style={{ maxWidth: 1000, margin: '40px auto 160px', padding: '0 24px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass"
        style={{ 
          padding: '60px 40px', 
          borderRadius: 40, 
          background: 'var(--glass-bg)', 
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 32 }}>
          Officially Recognised and Supported By
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
          {/* Logo SVG Image */}
          <img 
            src="/iit-madras-logo.svg" 
            alt="IIT Madras Logo" 
            style={{ 
              height: 100, 
              width: 'auto',
              // Dark mode needs inversion if the SVG is black, or we can use CSS filter
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8, color: 'var(--text-primary)' }}>
              Indian Institute of Technology<br />Madras
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.8rem', gap: 6 }}>
                <span className="pulse-dot green" style={{ width: 6, height: 6 }}></span> PRE-INCUBATED STARTUP
              </div>
            </div>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, lineHeight: 1.6, marginTop: 16 }}>
          Our matchmaking algorithms and peer-to-peer infrastructure were developed with the backing and technical support of India's premier engineering institute.
        </p>

      </motion.div>
    </section>
  );
}
