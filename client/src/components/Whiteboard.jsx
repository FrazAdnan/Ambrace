import React, { useRef, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function Whiteboard({ roomId }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#F5F5F7'); // Default text-primary

  const { emit } = useSocket({
    'board:draw': (data) => {
      const { x0, y0, x1, y1, color } = data;
      drawLine(x0, y0, x1, y1, color, false);
    },
    'board:clear': () => {
      clearCanvas(false);
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    // Set internal resolution twice the display size for retina sharpness
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    
    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 4;
    contextRef.current = context;
  }, []);

  // Track previous position for smooth continuous lines
  const prevPos = useRef({ x: 0, y: 0 });

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    prevPos.current = { x: offsetX, y: offsetY };
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    
    drawLine(prevPos.current.x, prevPos.current.y, offsetX, offsetY, color, true);
    prevPos.current = { x: offsetX, y: offsetY };
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const drawLine = (x0, y0, x1, y1, strokeColor, emitData) => {
    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);

    if (strokeColor === 'erase') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = 20; // Thicker line for erasing
      context.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 4;
      context.strokeStyle = strokeColor;
    }

    context.stroke();
    context.closePath();

    if (emitData) {
      emit('board:draw', { roomId, data: { x0, y0, x1, y1, color: strokeColor } });
    }
  };

  const clearCanvas = (emitData = true) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (emitData) {
      emit('board:clear', { roomId });
    }
  };

  const COLORS = ['#F5F5F7', '#0A84FF', '#32D74B', '#FF453A', '#FF9F0A'];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#1c1c1e' }}>
      
      {/* Toolbar */}
      <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, padding: '12px 20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 99, zIndex: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: color === c ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', transform: color === c ? 'scale(1.2)' : 'scale(1)', padding: 0 }}
          />
        ))}
        
        <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
        
        {/* Eraser */}
        <button
          onClick={() => setColor('erase')}
          style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: color === 'erase' ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', transform: color === 'erase' ? 'scale(1.2)' : 'scale(1)', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}
          title="Eraser"
        >
          🧽
        </button>

        <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
        
        <button onClick={() => clearCanvas(true)} style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 600, background: 'transparent', padding: '0 8px' }}>
          Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{ width: '100%', height: '100%', cursor: 'crosshair', display: 'block' }}
      />
    </div>
  );
}
