import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

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

export default function StudentLobby({ onMatched, onBack }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [subject, setSubject] = useState('');
  const [step, setStep] = useState('setup'); // setup | waiting | found
  const [queuePos, setQueuePos] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [dots, setDots] = useState('');

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
      emit('student:queue', { name, subject });
    },
  });

  useEffect(() => {
    if (step !== 'waiting') return;
    const i = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(i);
  }, [step]);

  const handleFindTeacher = () => {
    if (!name.trim() || !subject) return;
    setStep('waiting');
    emit('student:queue', { name: name.trim(), subject });
  };

  const handleCancel = () => {
    emit('student:dequeue');
    setStep('setup');
    setQueuePos(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none' }} />

      <div className="fade-up glass" style={{ width: '100%', maxWidth: 560, padding: 40, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button onClick={onBack} className="btn btn-outline btn-icon" style={{ width: 36, height: 36, fontSize: '1rem' }}>←</button>
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700 }}>Find a Teacher</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>Get live help from an expert</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className="badge badge-cyan">📚 Student</span>
          </div>
        </div>

        {step === 'setup' && (
          <>
            {/* Name */}
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Your Name</label>
            <input
              className="input"
              placeholder="Enter your name..."
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ marginBottom: 28 }}
              id="student-name"
            />

            {/* Subject */}
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Select a Subject</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  className={`subject-pill ${subject === s.id ? 'selected' : ''}`}
                  onClick={() => setSubject(s.id)}
                  id={`subject-${s.id}`}
                >
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleFindTeacher}
              disabled={!name.trim() || !subject}
              id="find-teacher-btn"
            >
              🔍 Find a Teacher
            </button>
          </>
        )}

        {step === 'waiting' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', border: '2px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', animation: 'float 3s ease-in-out infinite' }}>🔍</div>
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px dashed rgba(124,58,237,0.2)', animation: 'spin 8s linear infinite' }} />
            </div>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 700, marginBottom: 10 }}>
              Finding your teacher{dots}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>
              Subject: <span style={{ color: 'var(--accent-cyan-light)', fontWeight: 600 }}>
                {SUBJECTS.find(s => s.id === subject)?.label}
              </span>
            </p>
            {queuePos && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 28 }}>
                Queue position: #{queuePos}
              </p>
            )}
            {!queuePos && <div style={{ marginBottom: 28 }} />}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
              {[0.1, 0.2, 0.3].map(d => (
                <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-purple)', animation: `pulse-dot 1.2s ${d}s ease-in-out infinite` }} />
              ))}
            </div>

            <button className="btn btn-outline" onClick={handleCancel} id="cancel-search-btn">Cancel Search</button>
          </div>
        )}

        {step === 'found' && matchData && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>🎉</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Teacher Found!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
              Connecting you with <span style={{ color: 'var(--accent-purple-light)', fontWeight: 600 }}>{matchData.partner.name}</span>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Starting your session...</p>
            <div className="spinner" style={{ margin: '24px auto 0' }} />
          </div>
        )}
      </div>
    </div>
  );
}
