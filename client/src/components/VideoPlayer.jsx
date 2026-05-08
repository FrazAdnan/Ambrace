import React from 'react';

export default function VideoPlayer({ videoRef, label, muted = false, mirrored = false, placeholder = null }) {
  return (
    <div className="video-wrapper">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
      />
      {placeholder && (
        <div className="video-placeholder">
          {placeholder}
        </div>
      )}
      {label && <div className="video-label">{label}</div>}
    </div>
  );
}
