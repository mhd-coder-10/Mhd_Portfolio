import React from 'react';

export const BackgroundMesh = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Ambient Gradient Glow Orb 1 - Cyan Indigo */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%)',
          filter: 'blur(75px)',
          animation: 'meshShift 24s infinite ease-in-out',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Ambient Gradient Glow Orb 2 - Violet Pink */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '-5%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.10) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)',
          filter: 'blur(85px)',
          animation: 'meshShift 28s infinite ease-in-out reverse',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Ambient Gradient Glow Orb 3 - Emerald Teal */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(56, 189, 248, 0.03) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'meshShift 20s infinite ease-in-out',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Ambient Gradient Glow Orb 4 - Center Highlight */}
      <div
        style={{
          position: 'absolute',
          top: '70%',
          right: '25%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'meshShift 32s infinite ease-in-out',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Animated Subtle Floating Dots */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'var(--accent-cyan)',
          boxShadow: '0 0 12px var(--accent-cyan)',
          opacity: 0.6,
          animation: 'floatSlow 7s infinite ease-in-out',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: '85%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'var(--accent-violet)',
          boxShadow: '0 0 14px var(--accent-violet)',
          opacity: 0.5,
          animation: 'floatSlow 9s infinite ease-in-out reverse',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: 'var(--accent-emerald)',
          boxShadow: '0 0 10px var(--accent-emerald)',
          opacity: 0.7,
          animation: 'floatSlow 11s infinite ease-in-out',
        }}
      />

      {/* Developer Subtle Matrix Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(var(--grid-line) 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px',
          opacity: 0.9,
        }}
      />
    </div>
  );
};

export default BackgroundMesh;
