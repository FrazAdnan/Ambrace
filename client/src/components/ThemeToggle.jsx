import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLight(true);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    setIsLight(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      }
      return newTheme;
    });
  };

  return (
    <div 
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '32px',
        width: '72px',
        height: '40px',
        borderRadius: '99px',
        background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        cursor: 'pointer',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'background 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      title="Toggle Theme"
    >
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: 'var(--text-primary)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--bg-primary)',
        fontSize: '14px',
        transform: isLight ? 'translateX(32px) rotate(360deg)' : 'translateX(0) rotate(0deg)',
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {isLight ? '☀️' : '🌙'}
      </div>
    </div>
  );
}
