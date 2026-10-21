import React, { useEffect, useState, useRef } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

/**
 * AnimatedCounter
 * Smoothly animates a number from 0 to target value when scrolled into view.
 */
export const AnimatedCounter = ({
  target,
  duration = 1600,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  style = {},
}) => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || animatedRef.current) return;
    animatedRef.current = true;

    let startTime = null;
    const startVal = 0;
    const endVal = typeof target === 'number' ? target : parseFloat(target);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeOut;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(endVal);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
