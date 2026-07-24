import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { useSocket } from '../hooks/useSocket';
import Whiteboard from '../components/Whiteboard';

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
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
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
    'board:toggle': ({ isOpen }) => setIsWhiteboardOpen(isOpen),
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
    <div style={{ height: '100vh', display: 'flex', background: 'var(--bg-primary)', padding: 24, gap: 24, overflow: 'hidden' }}>
      
      {/* Background Glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'var(--gradient-hero)', pointerEvents: 'none' }} />

      {/* Main Video Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', borderRadius: '32px', overflow: 'hidden', background: '#000', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', border: '1px solid var(--glass-border)', zIndex: 1 }}>
        
        {/* Main Content (Whiteboard) */}
        {isWhiteboardOpen && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
            <Whiteboard roomId={roomId} />
          </div>
        )}

        {/* Remote Video (Main OR PiP) */}
        <video 
          ref={remoteVideoRef} 
          autoPlay 
          playsInline 
          style={isWhiteboardOpen ? {
            position: 'absolute', bottom: 360, right: 32, width: 220, aspectRatio: '3/4', borderRadius: '24px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 24px 48px rgba(0,0,0,0.6)', zIndex: 10, transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
          } : { 
            width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: remoteConnected ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)' 
          }} 
        />
        
        {/* Loading Spinner / Waiting UI */}
        {!remoteConnected && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: 'rgba(28,28,30,0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 600, color: '#fff', boxShadow: '0 8px 32px rgba(10,132,255,0.4)' }}>
              {partner?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="spinner" />
              <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 500, letterSpacing: '-0.01em' }}>Connecting to {partner?.name}...</p>
            </div>
          </div>
        )}

        {/* Top Info Overlay */}
        <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '8px 16px', borderRadius: '99px', pointerEvents: 'auto' }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{partner?.name || 'Partner'}</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>• {SUBJECTS[subject] || subject}</span>
            </div>
            {partnerLeft && (
              <div style={{ display: 'inline-block', background: 'var(--accent-rose)', color: '#fff', padding: '6px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 500, animation: 'fade-up 0.3s ease' }}>
                Partner disconnected. Ending session...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '8px 16px', borderRadius: '99px', pointerEvents: 'auto' }}>
            {remoteConnected && <span className="pulse-dot green" />}
            <span style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
              {formatTime(callDuration)}
            </span>
          </div>
        </div>

        {/* Local Video PiP */}
        <div style={{ position: 'absolute', bottom: 120, right: 32, width: 220, aspectRatio: '3/4', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 24px 48px rgba(0,0,0,0.6)', background: '#1c1c1e', zIndex: 10, transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)' }}>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scaleX(-1)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: '0.8rem', fontWeight: 500, padding: '4px 12px', borderRadius: '99px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#fff' }}>
            You
          </div>
        </div>

        {/* Floating Control Bar */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(28,28,30,0.6)', backdropFilter: 'blur(40px) saturate(200%)', WebkitBackdropFilter: 'blur(40px) saturate(200%)', padding: '12px 20px', borderRadius: '99px', border: '1px solid var(--glass-border)', boxShadow: '0 16px 32px rgba(0,0,0,0.4)', zIndex: 20 }}>
          <button className={`ctrl-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute} title="Toggle Audio" style={{ width: 48, height: 48 }}>
            <span style={{ fontSize: '1.2rem' }}>{isMuted ? '🔇' : '🎤'}</span>
          </button>
          <button className={`ctrl-btn ${isCameraOff ? 'active' : ''}`} onClick={toggleCamera} title="Toggle Video" style={{ width: 48, height: 48 }}>
            <span style={{ fontSize: '1.2rem' }}>{isCameraOff ? '📵' : '📷'}</span>
          </button>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
          <button className={`ctrl-btn ${isWhiteboardOpen ? 'active' : ''}`} onClick={() => {
            const next = !isWhiteboardOpen;
            setIsWhiteboardOpen(next);
            emit('board:toggle', { roomId, isOpen: next });
          }} title="Toggle Whiteboard" style={{ width: 48, height: 48 }}>
            <span style={{ fontSize: '1.2rem' }}>📝</span>
          </button>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
          <button className="ctrl-btn end" onClick={endCall} style={{ height: 48, padding: '0 24px', borderRadius: '99px' }}>
            <span style={{ fontSize: '1.1rem', marginRight: 6 }}>📞</span>
            Leave
          </button>
        </div>
      </div>

      {/* Glass Sidebar for Chat */}
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', background: 'rgba(28, 28, 30, 0.4)', backdropFilter: 'blur(60px) saturate(200%)', WebkitBackdropFilter: 'blur(60px) saturate(200%)', border: '1px solid var(--glass-border)', borderRadius: '32px', zIndex: 1, boxShadow: '0 24px 64px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>💬</div>
          <span style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>Chat</span>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 40, fontWeight: 500 }}>
              No messages yet.<br/>Say hi to start the conversation! 👋
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.mine ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              {!msg.mine && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, marginLeft: 12 }}>{msg.senderName}</div>}
              <div style={{
                background: msg.mine ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
                color: msg.mine ? '#fff' : 'var(--text-primary)',
                padding: '12px 16px', borderRadius: '20px',
                borderBottomRightRadius: msg.mine ? '4px' : '20px',
                borderBottomLeftRadius: msg.mine ? '20px' : '4px',
                fontSize: '0.95rem', lineHeight: 1.4, letterSpacing: '-0.01em',
                wordBreak: 'break-word', boxShadow: msg.mine ? '0 4px 12px rgba(10,132,255,0.2)' : 'none'
              }}>
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ padding: '16px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="iMessage..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKey}
            style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '99px', padding: '12px 20px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem', transition: 'background 0.2s' }}
            onFocus={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onBlur={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
          />
          <button onClick={sendMessage} disabled={!inputText.trim()} style={{ background: !inputText.trim() ? 'rgba(255,255,255,0.1)' : 'var(--accent-blue)', color: !inputText.trim() ? 'rgba(255,255,255,0.3)' : '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: !inputText.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.2s', transform: !inputText.trim() ? 'scale(1)' : 'scale(1.05)', boxShadow: !inputText.trim() ? 'none' : '0 4px 12px rgba(10,132,255,0.3)' }}>
            ↑
          </button>
        </div>
      </div>

    </div>
  );
}
