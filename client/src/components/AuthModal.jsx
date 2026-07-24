import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset to login mode whenever the modal opens
  React.useEffect(() => {
    if (isOpen) {
      setIsLogin(true);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password, role);
    }

    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="glass" style={{ padding: '40px', width: '100%', maxWidth: '420px', position: 'relative', animation: 'modal-fade-in 0.3s ease-out forwards' }}>
        <style>
          {`
            @keyframes modal-fade-in {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}
        </style>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
        >✕</button>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'Outfit' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
          {isLogin ? 'Log in to access your sessions.' : 'Join the platform to start learning or teaching.'}
        </p>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', border: '1px solid rgba(244,63,94,0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {!isLogin && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name</label>
                <input required className="input" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Role</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setRole('student')} className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }}>Student</button>
                  <button type="button" onClick={() => setRole('teacher')} className={`btn ${role === 'teacher' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }}>Teacher</button>
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
            <input required className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
            <input required className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: '8px' }}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  );
}
