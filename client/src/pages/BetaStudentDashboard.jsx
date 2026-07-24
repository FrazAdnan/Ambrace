import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECTS = [
  { id: 'math', label: 'Mathematics', icon: '∑' },
  { id: 'physics', label: 'Physics', icon: '⚛' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
  { id: 'biology', label: 'Biology', icon: '🧬' },
  { id: 'cs', label: 'Computer Science', icon: '💻' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'literature', label: 'Literature', icon: '📖' },
  { id: 'economics', label: 'Economics', icon: '📈' },
];

const CLASSES = ['Middle School', 'High School (9-10)', 'High School (11-12)', 'Undergraduate', 'Postgraduate'];
const URGENCIES = ['Homework Help', 'Exam Prep', 'Concept Clarification', 'Deep Dive'];

export default function BetaStudentDashboard({ onMatched, onBack }) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    subject: '',
    classLevel: '',
    topic: '',
    urgency: ''
  });

  const [step, setStep] = useState('setup'); // setup | waiting | found
  const [queuePos, setQueuePos] = useState(null);
  const [matchData, setMatchData] = useState(null);

  const { emit } = useSocket({
    'match:found': (data) => {
      setStep('found');
      setMatchData(data);
    },
    'match:accepted': (data) => {
      onMatched(data);
    },
    'queue:position': ({ position }) => setQueuePos(position),
    'match:declined': () => {
      setStep('waiting');
      emit('student:queue', formData);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFindTeacher = () => {
    if (!formData.name.trim() || !formData.subject || !formData.classLevel || !formData.topic || !formData.urgency) return;
    setStep('waiting');
    emit('student:queue', { ...formData, name: formData.name.trim() });
  };

  const handleCancel = () => {
    emit('student:dequeue');
    setStep('setup');
    setQueuePos(null);
  };

  // Fun little animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
    exit: { opacity: 0, scale: 0.95 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>
      {/* Beta Exclusive Ambient Glows */}
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '60vw', height: '60vh', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-10%', right: '-10%', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'fixed', width: '50vw', height: '50vh', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', bottom: '-10%', left: '-10%', pointerEvents: 'none', filter: 'blur(60px)' }} />

      <AnimatePresence mode="wait">
        {step === 'setup' && (
          <motion.div 
            key="setup"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ 
              width: '100%', maxWidth: 600, 
              background: 'var(--glass-bg)', 
              backdropFilter: 'blur(20px)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: 24, 
              padding: 40,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>✨ Beta Exclusive</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Find an Educator</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Tell us exactly what you need help with to get the perfect match.</p>
              </div>
              <button className="btn" onClick={onBack} style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>Back</button>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'grid', gap: 20 }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange}
                  className="input-field" 
                  placeholder="How should the educator call you?" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                    <option value="" disabled>Select Subject</option>
                    {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Grade / Class</label>
                  <select name="classLevel" value={formData.classLevel} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                    <option value="" disabled>Select Level</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Specific Topic</label>
                <input 
                  type="text" 
                  name="topic"
                  value={formData.topic} 
                  onChange={handleChange}
                  className="input-field" 
                  placeholder="e.g. Integration by Parts, Quantum Mechanics..." 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>What are you looking for?</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {URGENCIES.map(u => (
                    <button 
                      key={u}
                      className="btn"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: u }))}
                      style={{ 
                        flex: 1, 
                        minWidth: 'calc(50% - 5px)', 
                        background: formData.urgency === u ? 'var(--accent-indigo)' : 'transparent',
                        border: `1px solid ${formData.urgency === u ? 'var(--accent-indigo)' : 'var(--border-color)'}`,
                        color: formData.urgency === u ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>

            <motion.div variants={itemVariants} style={{ marginTop: 40 }}>
              <button 
                className="btn btn-primary" 
                onClick={handleFindTeacher} 
                disabled={!formData.name || !formData.subject || !formData.classLevel || !formData.topic || !formData.urgency}
                style={{ width: '100%', padding: 16, fontSize: '1.1rem', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', border: 'none' }}
              >
                Initiate Quantum Match 🚀
              </button>
            </motion.div>

          </motion.div>
        )}

        {step === 'waiting' && (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ width: 120, height: 120, border: '4px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7', borderRadius: '50%', margin: '0 auto 32px' }}
            />
            <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>Scanning Network...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 400, margin: '0 auto 24px' }}>
              Finding the best {formData.subject} educator for {formData.topic}.
            </p>
            {queuePos && (
              <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 99, marginBottom: 32 }}>
                Queue Position: <strong style={{ color: '#a855f7' }}>{queuePos}</strong>
              </div>
            )}
            <br />
            <button className="btn" onClick={handleCancel} style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>Cancel Search</button>
          </motion.div>
        )}

        {step === 'found' && matchData && (
          <motion.div 
            key="found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', background: 'var(--glass-bg)', padding: 40, borderRadius: 24, border: '1px solid var(--success-color)' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>Educator Found!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 32 }}>
              <strong>{matchData.partner.name}</strong> is reviewing your request for {formData.topic}.
            </p>
            <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 10, ease: "linear" }}
                style={{ height: '100%', background: 'var(--success-color)' }}
              />
            </div>
            <p style={{ marginTop: 16, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Waiting for educator to accept...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
