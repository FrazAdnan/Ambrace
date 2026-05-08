import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

const ALL_SUBJECTS = [
  { id: 'math', label: 'Mathematics', icon: '∑' },
  { id: 'physics', label: 'Physics', icon: '⚛' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
  { id: 'biology', label: 'Biology', icon: '🧬' },
  { id: 'cs', label: 'Computer Science', icon: '💻' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'literature', label: 'Literature', icon: '📖' },
  { id: 'economics', label: 'Economics', icon: '📈' },
];

export default function TeacherDashboard({ onMatched, onBack }) {
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [step, setStep] = useState('setup'); // setup | online

  const { emit } = useSocket({
    'match:request': (data) => setIncomingRequest(data),
    'match:accepted': (data) => onMatched(data),
  });

  const toggleSubject = (id) => {
    setSubjects(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleGoOnline = () => {
    if (!name.trim() || subjects.length === 0) return;
    setIsOnline(true);
    setStep('online');
    emit('teacher:online', { name: name.trim(), subjects });
  };

  const handleGoOffline = () => {
    setIsOnline(false);
    setStep('setup');
    emit('teacher:offline');
    setIncomingRequest(null);
  };

  const handleAccept = () => {
    if (!incomingRequest) return;
    emit('match:accept', { roomId: incomingRequest.roomId });
    setIncomingRequest(null);
  };

  const handleDecline = () => {
    if (!incomingRequest) return;
    emit('match:decline', { roomId: incomingRequest.roomId });
    setIncomingRequest(null);
  };

  // Update subjects while online
  useEffect(() => {
    if (isOnline) emit('teacher:update', { subjects });
  }, [subjects, isOnline]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none' }} />

      {/* Incoming Request Modal */}
      {incomingRequest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass fade-up" style={{ padding: 40, maxWidth: 420, width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>📩</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>New Student!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
              <span style={{ color: 'var(--accent-cyan-light)', fontWeight: 600 }}>{incomingRequest.partner.name}</span> needs help with
            </p>
            <div style={{ margin: '12px 0 28px' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                {ALL_SUBJECTS.find(s => s.id === incomingRequest.subject)?.icon} {ALL_SUBJECTS.find(s => s.id === incomingRequest.subject)?.label || incomingRequest.subject}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-danger btn-lg" onClick={handleDecline} id="decline-btn" style={{ flex: 1 }}>✕ Decline</button>
              <button className="btn btn-success btn-lg" onClick={handleAccept} id="accept-btn" style={{ flex: 1 }}>✓ Accept</button>
            </div>
          </div>
        </div>
      )}

      <div className="fade-up glass" style={{ width: '100%', maxWidth: 560, padding: 40, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button onClick={onBack} className="btn btn-outline btn-icon" style={{ width: 36, height: 36, fontSize: '1rem' }} disabled={isOnline}>←</button>
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700 }}>Teacher Dashboard</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>Help students in real-time</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={`pulse-dot ${isOnline ? 'green' : 'amber'}`} />
            <span style={{ fontSize: '0.8rem', color: isOnline ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Name */}
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Your Name</label>
        <input
          className="input"
          placeholder="Enter your name..."
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isOnline}
          style={{ marginBottom: 28 }}
          id="teacher-name"
        />

        {/* Subjects */}
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Your Subjects <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(select all you can teach)</span>
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
          {ALL_SUBJECTS.map(s => (
            <button
              key={s.id}
              className={`subject-pill ${subjects.includes(s.id) ? 'selected' : ''}`}
              onClick={() => toggleSubject(s.id)}
              id={`teach-${s.id}`}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Status info when online */}
        {isOnline && (
          <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600 }}>
              <span className="pulse-dot green" />
              Waiting for students to connect...
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 6 }}>
              You'll see a popup when a student needs help with your subjects.
            </p>
          </div>
        )}

        {/* Action button */}
        {!isOnline ? (
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleGoOnline}
            disabled={!name.trim() || subjects.length === 0}
            id="go-online-btn"
          >
            🟢 Go Online & Accept Students
          </button>
        ) : (
          <button
            className="btn btn-outline btn-lg"
            style={{ width: '100%', borderColor: 'rgba(244,63,94,0.4)', color: 'var(--accent-rose)' }}
            onClick={handleGoOffline}
            id="go-offline-btn"
          >
            🔴 Go Offline
          </button>
        )}
      </div>
    </div>
  );
}
