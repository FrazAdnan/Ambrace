import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['📚', '🔬', '📐', '🔭', '💡', '🧠', '🎯', '🎓'];

export default function MiniGame({ onWin }) {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (matches === 8 && onWin) {
      setTimeout(onWin, 1500); // Wait 1.5s so they can see the final match
    }
  }, [matches, onWin]);

  const initializeGame = () => {
    // Duplicate emojis to make pairs, then shuffle
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index) => {
    // Prevent clicking if locked, already flipped, or matched
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [firstIndex, secondIndex] = newFlipped;
      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        // Match!
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setMatches((m) => m + 1);
        setFlippedIndices([]);
        setIsLocked(false);
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 320, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Moves: {moves}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Pairs: {matches}/8</div>
        <button onClick={initializeGame} style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
          Restart
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            style={{ position: 'relative', width: '100%', aspectRatio: '1/1', perspective: 1000, cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer' }}
            onClick={() => handleCardClick(index)}
          >
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {/* Front (Hidden) */}
              <div 
                style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ width: 24, height: 24, opacity: 0.1, background: 'var(--text-primary)', borderRadius: '50%' }} />
              </div>

              {/* Back (Revealed) */}
              <div 
                style={{
                  position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                  background: card.isMatched ? 'rgba(50,215,75,0.15)' : 'var(--bg-secondary)', 
                  border: `1px solid ${card.isMatched ? 'rgba(50,215,75,0.3)' : 'var(--accent-blue)'}`, 
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: 'rotateY(180deg)', fontSize: '1.5rem',
                  boxShadow: card.isMatched ? '0 0 16px rgba(50,215,75,0.2)' : '0 4px 12px rgba(10,132,255,0.2)'
                }}
              >
                {card.emoji}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Victory State */}
      {matches === 8 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: 16, background: 'rgba(50,215,75,0.1)', border: '1px solid rgba(50,215,75,0.2)', borderRadius: 16, color: 'var(--accent-emerald)', textAlign: 'center', fontWeight: 600 }}
        >
          Brilliant! You completed it in {moves} moves.
        </motion.div>
      )}

    </div>
  );
}
