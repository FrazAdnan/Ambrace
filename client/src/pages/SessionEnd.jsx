import React, { useState } from 'react';

const SUBJECTS = {
  math: 'Mathematics', physics: 'Physics', chemistry: 'Chemistry',
  biology: 'Biology', cs: 'Computer Science', history: 'History',
  literature: 'Literature', economics: 'Economics',
};

function formatTime(seconds) {
  if (!seconds) return '0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function SessionEnd({ sessionData, onRestart, onHome }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log('Session feedback:', { rating, feedback });
    setSubmitted(true);
  };

  const subject = sessionData?.subject;
  const duration = sessionData?.duration;
  const partnerName = sessionData?.partnerName;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none' }} />

      <div className="fade-up glass" style={{ width: '100%', maxWidth: 480, padding: 40, position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {!submitted ? (
          <>
            {/* Session summary */}
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎓</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>Session Complete!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.95rem' }}>
              Great session {partnerName ? `with ${partnerName}` : ''}!
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
              {subject && (
                <div style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 3 }}>SUBJECT</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{SUBJECTS[subject] || subject}</div>
                </div>
              )}
              {duration !== undefined && (
                <div style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 3 }}>DURATION</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatTime(duration)}</div>
                </div>
              )}
            </div>

            {/* Star rating */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 14, fontWeight: 500 }}>
                How was your experience?
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    id={`star-${star}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', transition: 'transform 0.15s', transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)', color: (hoverRating || rating) >= star ? 'var(--accent-amber)' : 'var(--text-muted)' }}
                  >★</button>
                ))}
              </div>
              {rating > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', marginTop: 8, fontWeight: 500 }}>
                  {['', 'Needs improvement', 'Fair', 'Good', 'Very good', 'Excellent!'][rating]}
                </p>
              )}
            </div>

            {/* Feedback text */}
            <textarea
              className="input"
              placeholder="Leave a comment (optional)..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              id="feedback-input"
              style={{ resize: 'none', height: 90, marginBottom: 24, fontSize: '0.875rem' }}
            />

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: 12 }}
              onClick={handleSubmit}
              disabled={rating === 0}
              id="submit-rating-btn"
            >
              Submit Feedback
            </button>
            <button
              className="btn btn-outline"
              style={{ width: '100%' }}
              onClick={onRestart}
              id="skip-btn"
            >
              Skip & Start New Session
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3.5rem', marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>✨</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 700, marginBottom: 12 }}>Thank you!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '0.95rem' }}>
              Your feedback helps us improve EduConnect.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={onRestart} id="new-session-btn">
                🔁 New Session
              </button>
              <button className="btn btn-outline btn-lg" style={{ flex: 1 }} onClick={onHome} id="home-btn">
                🏠 Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
