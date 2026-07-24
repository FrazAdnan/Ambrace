import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function Loyalty({ onSelectRole, onExploreRewards, onExploreCareers, onBack, onLaunchApp }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mock data for the loyalty program
  const userPoints = 850;
  const nextTierPoints = 1000;
  const progressPercent = Math.min((userPoints / nextTierPoints) * 100, 100);

  const waysToEarn = [
    { id: 1, title: 'Complete a Session', points: '+50 pts', icon: '🎓', desc: 'Finish a 30+ min learning session' },
    { id: 2, title: '5-Star Rating', points: '+20 pts', icon: '⭐', desc: 'Receive top marks from your peer' },
    { id: 3, title: '7-Day Streak', points: '+100 pts', icon: '🔥', desc: 'Learn or teach every day for a week' },
    { id: 4, title: 'Help a Beginner', points: '+75 pts', icon: '🤝', desc: 'Guide a new user on the platform' }
  ];

  const rewards = [
    { id: 1, title: 'Priority Matching', cost: 500, icon: '⚡', desc: 'Skip the line when looking for a session.', locked: false },
    { id: 2, title: 'Premium Avatar', cost: 800, icon: '🎭', desc: 'Unlock exclusive profile customizations.', locked: false },
    { id: 3, title: 'Free Expert Session', cost: 1500, icon: '💎', desc: 'Get 1 hour free with a vetted expert.', locked: true },
    { id: 4, title: 'Ambrace Merch', cost: 5000, icon: '👕', desc: 'Exclusive hoodie shipped to your door.', locked: true }
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'clip', paddingBottom: 80 }}>
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
      <Header 
        onSelectRole={onSelectRole} 
        onExploreRewards={onExploreRewards} 
        onLoginClick={() => setIsAuthOpen(true)} 
        onHome={onBack}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        
        {/* Header & Progress */}
        <motion.div 
          className="glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ padding: '48px', borderRadius: 'var(--radius-xl)', marginBottom: 64, position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '100%', background: 'var(--glow-primary)', zIndex: 0 }} />
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center', justifyContent: 'space-between' }}>
            {user ? (
              <>
                <div style={{ flex: '1 1 300px' }}>
                  <div className="badge badge-amber" style={{ marginBottom: 16 }}>⭐ Ambrace Rewards</div>
                  <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em' }}>
                    You are a <br/> <span className="gradient-text">Scholar</span>
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5 }}>
                    You're just 150 points away from the Master tier. Keep learning and teaching to unlock exclusive benefits!
                  </p>
                </div>
                
                <div style={{ flex: '1 1 300px', background: 'var(--bg-tertiary)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{userPoints}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Points</div>
                  
                  <div style={{ width: '100%', height: 12, background: 'var(--bg-secondary)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: 99 }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>Scholar</span>
                    <span>Master ({nextTierPoints})</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ flex: '1 1 300px' }}>
                  <div className="badge badge-amber" style={{ marginBottom: 16 }}>⭐ Ambrace Rewards</div>
                  <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em' }}>
                    Join the <br/> <span className="gradient-text">Program</span>
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5 }}>
                    Sign in to view your points balance, track your progress, and redeem exclusive rewards!
                  </p>
                </div>
                <div style={{ flex: '1 1 300px', background: 'var(--bg-tertiary)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>Login to View Points</h3>
                  <button className="btn btn-primary" onClick={() => setIsAuthOpen(true)} style={{ padding: '12px 24px' }}>Sign In</button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* How to Earn */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 80 }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 32, letterSpacing: '-0.02em' }}>How to Earn Points</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {waysToEarn.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: 24, borderRadius: 'var(--radius-lg)', transition: 'transform 0.3s ease' }}
                whileHover={{ y: -5, borderColor: 'var(--accent-blue)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.5 }}>{item.desc}</p>
                <div className="badge badge-blue">{item.points}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Rewards Catalog */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 32, letterSpacing: '-0.02em' }}>Rewards Catalogue</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {rewards.map((reward, i) => (
              <motion.div 
                key={reward.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--glass-border)', 
                  padding: 32, 
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  opacity: reward.locked ? 0.6 : 1,
                  filter: reward.locked ? 'grayscale(0.8)' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {reward.locked && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    🔒 Locked
                  </div>
                )}
                
                <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                  {reward.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 4 }}>{reward.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.4 }}>{reward.desc}</p>
                  <button 
                    className={`btn ${reward.locked ? 'btn-outline' : 'btn-primary'}`} 
                    disabled={reward.locked}
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  >
                    {reward.locked ? `${reward.cost} pts needed` : `Redeem for ${reward.cost} pts`}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </main>

      <Footer onExploreCareers={onExploreCareers} onLaunchApp={() => {
        if (user) onLaunchApp();
        else setIsAuthOpen(true);
      }} />
    </div>
  );
}
