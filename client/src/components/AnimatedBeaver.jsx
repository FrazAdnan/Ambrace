import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBeaver() {
  return (
    <motion.div
      style={{
        width: 200,
        height: 200,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      // Overall floating and tilting animation
      animate={{ 
        y: [0, -25, 0], 
        x: [0, 10, -10, 0],
        rotate: [0, 3, -3, 0] 
      }}
      transition={{ 
        duration: 6, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="furGrad" x1="100" y1="30" x2="100" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A05A3A"/>
            <stop offset="1" stopColor="#6D3720"/>
          </linearGradient>
          <linearGradient id="bellyGrad" x1="100" y1="90" x2="100" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E3B38A"/>
            <stop offset="1" stopColor="#C48E63"/>
          </linearGradient>
          <linearGradient id="tailGrad" x1="50" y1="120" x2="150" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4A2F25"/>
            <stop offset="1" stopColor="#2E1C15"/>
          </linearGradient>
          <radialGradient id="visorGrad" cx="100" cy="70" r="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(100, 200, 255, 0.5)"/>
            <stop offset="1" stopColor="rgba(50, 100, 255, 0.1)"/>
          </radialGradient>
        </defs>

        {/* --- TAIL --- */}
        <motion.g
          style={{ originX: '100px', originY: '140px' }}
          animate={{ rotate: [0, -20, 10, 0], scaleY: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Beaver flat tail */}
          <ellipse cx="60" cy="150" rx="40" ry="25" transform="rotate(-30 60 150)" fill="url(#tailGrad)" />
          {/* Tail texture lines */}
          <path d="M40 140 L70 160 M50 130 L80 150" stroke="#2E1C15" strokeWidth="3" opacity="0.5" transform="rotate(-30 60 150)" />
        </motion.g>

        {/* --- LEGS --- */}
        <motion.ellipse cx="75" cy="165" rx="15" ry="10" fill="#4A2F25" 
          animate={{ y: [0, -5, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.ellipse cx="125" cy="165" rx="15" ry="10" fill="#4A2F25" 
          animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />

        {/* --- BODY --- */}
        <motion.g
          animate={{ scaleY: [1, 0.98, 1], scaleX: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: '100px', originY: '160px' }}
        >
          {/* Torso */}
          <rect x="65" y="80" width="70" height="85" rx="35" fill="url(#furGrad)" />
          {/* Belly */}
          <rect x="75" y="95" width="50" height="60" rx="25" fill="url(#bellyGrad)" />
        </motion.g>

        {/* --- ARMS --- */}
        {/* Left Arm */}
        <motion.g
          style={{ originX: '65px', originY: '100px' }}
          animate={{ rotate: [0, 45, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M65 100 Q30 110 40 140" stroke="#6D3720" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M65 100 Q30 110 40 140" stroke="#A05A3A" strokeWidth="10" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* Right Arm */}
        <motion.g
          style={{ originX: '135px', originY: '100px' }}
          animate={{ rotate: [0, -30, -50, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <path d="M135 100 Q170 110 160 140" stroke="#6D3720" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M135 100 Q170 110 160 140" stroke="#A05A3A" strokeWidth="10" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* --- HEAD --- */}
        <motion.g
          style={{ originX: '100px', originY: '90px' }}
          animate={{ rotate: [0, 5, -5, 0], x: [0, 3, -3, 0], y: [0, 2, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Ears */}
          <circle cx="60" cy="45" r="14" fill="#6D3720" />
          <circle cx="60" cy="45" r="8" fill="#4A2F25" />
          <circle cx="140" cy="45" r="14" fill="#6D3720" />
          <circle cx="140" cy="45" r="8" fill="#4A2F25" />

          {/* Skull */}
          <circle cx="100" cy="70" r="48" fill="url(#furGrad)" />
          
          {/* Snout */}
          <ellipse cx="100" cy="85" rx="24" ry="16" fill="#E3B38A" />
          
          {/* Nose */}
          <path d="M92 80 Q100 85 108 80 L100 90 Z" fill="#212121" />

          {/* Buck Teeth */}
          <rect x="94" y="88" width="6" height="12" rx="2" fill="#FFFFFF" />
          <rect x="101" y="88" width="6" height="12" rx="2" fill="#FFFFFF" />
          <line x1="100" y1="88" x2="100" y2="100" stroke="#D1D5DB" strokeWidth="1" />

          {/* Eyes (Blinking Animation) */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1, 0.1, 1, 1] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.45, 0.48, 0.5, 0.85, 0.88, 0.9, 1] }}
          >
            <ellipse cx="82" cy="65" rx="6" ry="10" fill="#212121" />
            <circle cx="84" cy="62" r="2" fill="#FFFFFF" /> {/* Eye glint */}
            
            <ellipse cx="118" cy="65" rx="6" ry="10" fill="#212121" />
            <circle cx="120" cy="62" r="2" fill="#FFFFFF" /> {/* Eye glint */}
          </motion.g>

          {/* Cheeks */}
          <circle cx="70" cy="80" r="6" fill="#FF8A8A" opacity="0.4" />
          <circle cx="130" cy="80" r="6" fill="#FF8A8A" opacity="0.4" />

          {/* Space Visor / Helmet */}
          <circle cx="100" cy="68" r="56" fill="url(#visorGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
          <path d="M54 50 Q100 10 146 50" stroke="rgba(255,255,255,0.7)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M135 90 Q145 80 150 65" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
        </motion.g>

      </svg>
    </motion.div>
  );
}
