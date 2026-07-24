export default function Footer({ onExploreCareers, onLaunchApp }) {
  return (
    <footer style={{ position: 'relative', zIndex: 1, background: 'transparent', padding: '60px 24px 32px' }}>
      
      {/* Decorative Glows */}
      <div style={{ position: 'absolute', top: '-400px', left: '0%', width: '100%', height: '800px', background: 'var(--glow-secondary)', pointerEvents: 'none', zIndex: -1 }} />
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'var(--glow-primary)', borderRadius: '50%', pointerEvents: 'none' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Ultra-Modern Call To Action */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 120 }}>
          <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24, background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.5) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Empower your <br/> learning journey.
          </h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={onLaunchApp} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
              Join Beta
            </button>
            <button className="btn btn-outline btn-lg" onClick={onExploreCareers} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
              Explore opportunities
            </button>
          </div>
        </div>

        {/* Minimalist Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 64, paddingBottom: 40, justifyContent: 'space-between' }}>
          
          {/* Brand Info */}
          <div style={{ flex: '1 1 300px', maxWidth: 400 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <img src="/logo.svg" alt="Logo" style={{ width: 32, height: 32 }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Ambrace</span>
            </div>
            <p style={{ color: '#86868B', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>
              Scholarly solutions for a connected world. Real-time knowledge exchange designed for modern learners.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 99, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.05)' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <span style={{ fontSize: '1.2rem' }}>𝕏</span>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 99, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.05)' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>in</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Platform</h4>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'}>For Students</span>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'}>For Teachers</span>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'} onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}>How it Works</span>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'} onClick={() => document.getElementById('mechanics')?.scrollIntoView({ behavior: 'smooth' })}>Features</span>
          </div>

          {/* Company */}
          <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Company</h4>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'}>About Us</span>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'} onClick={onExploreCareers}>Careers</span>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'}>Contact</span>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'}>Safety Center</span>
          </div>

          {/* Legal */}
          <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Legal</h4>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'}>Privacy Policy</span>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'}>Terms of Service</span>
            <span style={{ color: '#86868B', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FFF'} onMouseLeave={e => e.target.style.color = '#86868B'}>Cookie Policy</span>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, textAlign: 'center', color: '#515154', fontSize: '0.85rem', letterSpacing: '0.02em', position: 'relative', zIndex: 2 }}>
          © {new Date().getFullYear()} Ambrace Platforms Inc. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
