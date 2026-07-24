import { useAuth } from '../context/AuthContext';
import FeatureGate from './FeatureGate';

export default function Header({ onSelectRole, onExploreRewards, onLoginClick, onHome }) {
  const { user, logout } = useAuth();

  const handleNavClick = (id) => {
    if (onHome) onHome();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(60px) saturate(200%)', WebkitBackdropFilter: 'blur(60px) saturate(200%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'opacity 0.2s' }} onClick={() => {
          if (onHome) onHome();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <img src="/logo.svg" alt="Logo" style={{ width: 32, height: 32 }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Ambrace</span>
        </div>

        {/* Center Links (Controlled by CSS) */}
        <div className="nav-links" style={{ gap: 32, alignItems: 'center' }}>
          <FeatureGate flag="BETA_DASHBOARD">
            <span className="nav-link" onClick={() => alert('Beta Dashboard coming soon!')} style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>✨ Beta Insights</span>
          </FeatureGate>
          <span className="nav-link" onClick={() => handleNavClick('mechanics')}>Features</span>
          <span className="nav-link" onClick={() => handleNavClick('process')}>How it works</span>
          <span className="nav-link" onClick={() => handleNavClick('safety')}>Safety</span>
          <span className="nav-link" onClick={onExploreRewards} style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>Rewards</span>
        </div>

        {/* Right Action */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hi, {user.name}</span>
              <button className="btn btn-outline" onClick={logout} style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: 99 }}>
                Logout
              </button>
              <button className="btn btn-primary" onClick={() => onSelectRole(user.role)} style={{ padding: '8px 24px', fontSize: '0.9rem', borderRadius: 99, boxShadow: 'var(--btn-glow)' }}>
                Dashboard
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onLoginClick} style={{ padding: '8px 24px', fontSize: '0.9rem', borderRadius: 99, boxShadow: 'var(--btn-glow)' }}>
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
