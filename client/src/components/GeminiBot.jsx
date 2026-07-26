import React, { useState, useRef, useEffect } from 'react';

export default function GeminiBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Hi there. I am Ambrace Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
      const apiUrl = `${SERVER_URL}/api/chat`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch');

      setMessages(prev => [...prev, { role: 'model', content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: 'Oops! Something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {isOpen && (
        <div style={{
          width: 360, height: 550, background: 'rgba(28, 28, 30, 0.75)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '32px', marginBottom: 20, display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)', overflow: 'hidden', backdropFilter: 'blur(60px) saturate(200%)', WebkitBackdropFilter: 'blur(60px) saturate(200%)'
        }}>
          {/* Header */}
          <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', color: '#fff' }}>✨</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>Ambrace Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', width: 28, height: 28, borderRadius: '50%', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
                color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                padding: '12px 16px', borderRadius: '20px',
                borderBottomRightRadius: m.role === 'user' ? '4px' : '20px',
                borderBottomLeftRadius: m.role === 'model' ? '4px' : '20px',
                maxWidth: '85%', fontSize: '0.95rem', lineHeight: 1.4, letterSpacing: '-0.01em',
                wordBreak: 'break-word', boxShadow: m.role === 'user' ? '0 4px 12px rgba(10,132,255,0.2)' : 'none'
              }}>
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '20px', borderBottomLeftRadius: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Message Assistant..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '99px', padding: '12px 20px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem', transition: 'background 0.2s' }}
              onFocus={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
              onBlur={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
            />
            <button type="submit" disabled={isLoading || !input.trim()} style={{ background: (isLoading || !input.trim()) ? 'rgba(255,255,255,0.1)' : 'var(--accent-blue)', color: (isLoading || !input.trim()) ? 'rgba(255,255,255,0.3)' : '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', transform: (isLoading || !input.trim()) ? 'scale(1)' : 'scale(1.05)', boxShadow: (isLoading || !input.trim()) ? 'none' : '0 4px 12px rgba(10,132,255,0.3)' }}>
              ↑
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} style={{
        width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(40px) saturate(150%)', WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 16px 32px rgba(0,0,0,0.5)', transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        transform: isOpen ? 'scale(0.8) rotate(90deg)' : 'scale(1) rotate(0deg)'
      }}>
        {isOpen ? '✕' : <span style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✨</span>}
      </button>
    </div>
  );
}
