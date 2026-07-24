import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

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

function formatWaitTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export default function TeacherDashboard({ onMatched, onBack }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [subjects, setSubjects] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [step, setStep] = useState('setup'); // setup | online
  const [studentQueue, setStudentQueue] = useState([]);
  const [now, setNow] = useState(Date.now());

  // Tick every second to update wait times
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const { emit } = useSocket({
    'match:request': (data) => setIncomingRequest(data),
    'match:accepted': (data) => onMatched(data),
    'queue:update': (queue) => setStudentQueue(queue),
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

  // Filter queue to only show students whose subject the teacher can teach
  const relevantStudents = isOnline
    ? studentQueue.filter(s => subjects.includes(s.subject))
    : studentQueue;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none' }} />

      {/* Incoming Request Modal */}
      {incomingRequest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass fade-up is-visible" style={{ padding: 40, maxWidth: 420, width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>📩</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>New Student!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
              <span style={{ color: 'var(--accent-cyan-light)', fontWeight: 600 }}>{incomingRequest.partner.name}</span> needs help with
            </p>
            <div style={{ margin: '12px 0 28px' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                {ALL_SUBJECTS.find(s => s.id === incomingRequest.subject)?.icon}{' '}
                {ALL_SUBJECTS.find(s => s.id === incomingRequest.subject)?.label || incomingRequest.subject}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-danger btn-lg" onClick={handleDecline} id="decline-btn" style={{ flex: 1 }}>✕ Decline</button>
              <button className="btn btn-success btn-lg" onClick={handleAccept} id="accept-btn" style={{ flex: 1 }}>✓ Accept</button>
            </div>
          </div>
        </div>
      )}

      <div className="fade-up is-visible glass" style={{ width: '100%', maxWidth: 620, padding: 40, position: 'relative', zIndex: 1 }}>
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

        {/* ── Student Queue ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Waiting Students
            </span>
            {studentQueue.length > 0 && (
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                {isOnline ? relevantStudents.length : studentQueue.length}
              </span>
            )}
          </div>

          {studentQueue.length === 0 ? (
            <div style={{
              padding: '20px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.08)',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}>
              No students waiting right now
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
              {(isOnline ? relevantStudents : studentQueue).map((student, idx) => {
                const subjectInfo = ALL_SUBJECTS.find(s => s.id === student.subject);
                const waitSecs = Math.floor((now - student.waitingSince) / 1000);
                return (
                  <div
                    key={student.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(124,58,237,0.06)',
                      border: '1px solid rgba(124,58,237,0.15)',
                      transition: 'all 0.2s ease',
                    }}
                    className="student-queue-row"
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: `hsl(${(idx * 47 + 200) % 360}, 70%, 20%)`,
                      border: `2px solid hsl(${(idx * 47 + 200) % 360}, 60%, 40%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', flexShrink: 0,
                    }}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {subjectInfo?.icon} {subjectInfo?.label || student.subject}
                        <span style={{ marginLeft: 8, opacity: 0.6 }}>• waiting {formatWaitTime(student.waitingSince)}</span>
                      </div>
                    </div>

                    {/* Wait indicator */}
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 20,
                      background: waitSecs > 120 ? 'rgba(244,63,94,0.15)' : waitSecs > 60 ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                      color: waitSecs > 120 ? 'var(--accent-rose)' : waitSecs > 60 ? '#f59e0b' : 'var(--accent-emerald)',
                      border: `1px solid ${waitSecs > 120 ? 'rgba(244,63,94,0.3)' : waitSecs > 60 ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                      flexShrink: 0,
                    }}>
                      {waitSecs > 120 ? '🔴 Long wait' : waitSecs > 60 ? '🟡 Waiting' : '🟢 Just joined'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isOnline && studentQueue.length > 0 && relevantStudents.length === 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
              No students waiting for your subjects right now
            </div>
          )}
        </div>

        {/* Status info when online */}
        {isOnline && (
          <div style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-emerald)', fontSize: '0.88rem', fontWeight: 600 }}>
              <span className="pulse-dot green" />
              Waiting for a match — you'll get a popup when a student is assigned to you
            </div>
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
            🟢 Go Online &amp; Accept Students
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

      <style>{`
        .student-queue-row:hover {
          background: rgba(124,58,237,0.12) !important;
          border-color: rgba(124,58,237,0.3) !important;
        }
      `}</style>
    </div>
  );
}
