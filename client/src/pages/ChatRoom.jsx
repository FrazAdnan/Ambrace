import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { useSocket } from '../hooks/useSocket';
import VideoPlayer from '../components/VideoPlayer';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const SUBJECTS = {
  math: 'Mathematics', physics: 'Physics', chemistry: 'Chemistry',
  biology: 'Biology', cs: 'Computer Science', history: 'History',
  literature: 'Literature', economics: 'Economics',
};

export default function ChatRoom({ roomId, isInitiator, partner, subject, onSessionEnd }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [partnerLeft, setPartnerLeft] = useState(false);
  const chatEndRef = useRef(null);
  const myName = isInitiator ? 'You (Student)' : 'You (Teacher)';

  const handleCallEnd = useCallback((data) => {
    onSessionEnd(data || { duration: 0, subject });
  }, [onSessionEnd, subject]);

  const { localVideoRef, remoteVideoRef, isMuted, isCameraOff, remoteConnected,
    callDuration, toggleMute, toggleCamera, endCall } = useWebRTC({
    roomId, isInitiator, onCallEnd: handleCallEnd,
  });

  const { emit } = useSocket({
    'chat:message': (data) => {
      setMessages(prev => [...prev, { ...data, mine: false }]);
    },
    'session:ended': (data) => onSessionEnd({ ...data, subject }),
    'session:partner-disconnected': () => {
      setPartnerLeft(true);
      setTimeout(() => onSessionEnd({ duration: callDuration, subject }), 2500);
    },
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const msg = { message: inputText.trim(), senderName: myName, mine: true, timestamp: Date.now() };
    setMessages(prev => [...prev, msg]);
    emit('chat:message', { roomId, message: inputText.trim(), senderName: myName });
    setInputText('');
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'rgba(15,16,32,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}>
            {partner?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{partner?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {partner?.role === 'teacher' ? '🏫 Teacher' : '📚 Student'} · {SUBJECTS[subject] || subject}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {remoteConnected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--accent-emerald)' }}>
              <span className="pulse-dot green" /> Live
            </div>
          )}
          <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, color: 'var(--accent-purple-light)', background: 'rgba(124,58,237,0.1)', padding: '4px 12px', borderRadius: 8 }}>
            {formatTime(callDuration)}
          </div>
        </div>
      </div>

      {/* Partner left banner */}
      {partnerLeft && (
        <div style={{ background: 'rgba(244,63,94,0.15)', borderBottom: '1px solid rgba(244,63,94,0.3)', padding: '10px 24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--accent-rose)' }}>
          {partner?.name} has left the session. Returning to dashboard...
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>
        {/* Video area */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          {/* Remote video (main) */}
          <div style={{ flex: 1, position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {!remoteConnected && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div className="spinner" />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Connecting to {partner?.name}...</p>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: '0.8rem', fontWeight: 600, padding: '4px 12px', borderRadius: 99, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
              {partner?.name}
            </div>
          </div>

          {/* Local video (pip) */}
          <div style={{ position: 'absolute', bottom: 100, right: 360, width: 180, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--glass-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 10 }}>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', transform: 'scaleX(-1)' }} />
            <div style={{ position: 'absolute', bottom: 6, left: 8, fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: 'rgba(0,0,0,0.6)' }}>You</div>
          </div>
        </div>

        {/* Chat sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--glass-border)', background: 'rgba(15,16,32,0.5)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            💬 Chat
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 20 }}>
                No messages yet. Say hi! 👋
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.mine ? 'flex-end' : 'flex-start', gap: 3 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.mine ? 'You' : msg.senderName}</div>
                <div className={`chat-bubble ${msg.mine ? 'mine' : 'theirs'}`}>{msg.message}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: 8 }}>
            <input
              className="input"
              placeholder="Type a message..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKey}
              id="chat-input"
              style={{ flex: 1, padding: '10px 14px', fontSize: '0.875rem' }}
            />
            <button className="btn btn-primary btn-icon" onClick={sendMessage} id="send-btn" style={{ flexShrink: 0, borderRadius: 'var(--radius-md)' }}>→</button>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="control-bar">
        <button className={`ctrl-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute} id="mute-btn">
          <span style={{ fontSize: '1.2rem' }}>{isMuted ? '🔇' : '🎤'}</span>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button className={`ctrl-btn ${isCameraOff ? 'active' : ''}`} onClick={toggleCamera} id="camera-btn">
          <span style={{ fontSize: '1.2rem' }}>{isCameraOff ? '📵' : '📷'}</span>
          {isCameraOff ? 'Start Cam' : 'Stop Cam'}
        </button>
        <button className="ctrl-btn end" onClick={endCall} id="end-call-btn">
          <span style={{ fontSize: '1.2rem' }}>📞</span>
          End Session
        </button>
      </div>
    </div>
  );
}
