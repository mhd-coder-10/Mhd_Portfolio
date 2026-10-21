import React, { useRef, useState } from 'react';

/**
 * SpotlightCard
 * A modern interactive card component that tracks the mouse position
 * to create a dynamic radial spotlight glow over the border and background.
 */
export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(56, 189, 248, 0.15)',
  borderColor = 'rgba(56, 189, 248, 0.35)',
  style = {},
  contentStyle = {},
  ...props
}) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`card spotlight-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
        ...style,
      }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="spotlight-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Card Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', ...contentStyle }}>
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
