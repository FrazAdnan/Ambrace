import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import PinnedSequence from '../components/PinnedSequence';
import HeroSequence from '../components/HeroSequence';
import PartnerSection from '../components/PartnerSection';
import MechanicsSequence from '../components/MechanicsSequence';
import ProcessSequence from '../components/ProcessSequence';
import SafetySequence from '../components/SafetySequence';
import AuthModal from '../components/AuthModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Landing({ onSelectRole, onLaunchApp, onExploreCareers, onExploreRewards, onHome }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    const elements = document.querySelectorAll('.fade-up, .fade-in');
    elements.forEach(el => observer.observe(el));

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'clip' }}>
      
      {/* Fixed Ambient Glows */}
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



      {/* Navbar */}
      <Header 
        onSelectRole={onSelectRole} 
        onExploreRewards={onExploreRewards} 
        onLoginClick={() => setIsAuthOpen(true)} 
        onHome={onHome}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <main style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}>
        
        <HeroSequence 
          onSelectRole={(role) => {
            if (user) onSelectRole(user.role);
            else setIsAuthOpen(true);
          }} 
          onLaunchApp={() => {
            if (user) onLaunchApp();
            else setIsAuthOpen(true);
          }} 
          onExploreCareers={onExploreCareers} 
        />
        
        <PartnerSection />
        
        <PinnedSequence />

        {/* Mock UI Element */}
        <section className="fade-up" style={{ maxWidth: 1000, margin: '120px auto', perspective: 1000 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 32, padding: 32, backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', transform: `rotateX(${mousePos.y * -2}deg) rotateY(${mousePos.x * 2}deg)`, transition: 'transform 0.1s ease-out', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }}/>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}/>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }}/>
                </div>
              </div>
              <div style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>SYSTEM ACTIVE</div>
            </div>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>Ready to begin?</h3>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--glass-bg)', padding: '12px 24px', borderRadius: 99, border: '1px solid var(--glass-border)', marginBottom: 24 }}>
                <span style={{ color: 'var(--text-muted)' }}>Subject:</span>
                <span style={{ fontWeight: 600 }}>Advanced Physics - Relativity</span>
              </div>
              <div>
                <span className="badge badge-blue">TEACHER KYC</span>
                <span className="badge badge-indigo" style={{ marginLeft: 8 }}>Verified Professional</span>
              </div>
            </div>
          </div>
        </section>

        <MechanicsSequence />
        
        <ProcessSequence />
        
        <SafetySequence />

      </main>

      {/* Footer */}
      <Footer onExploreCareers={onExploreCareers} onLaunchApp={() => {
        if (user) onLaunchApp();
        else setIsAuthOpen(true);
      }} />

    </div>
  );
}
