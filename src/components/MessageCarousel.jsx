import React, { useEffect, useRef, useState } from 'react';

const FADE_DURATION = 500; // ms
const INTERVAL = 3500; // ms

const MessageCarousel = ({ messages, className = '', style = {} }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    if (paused) return;
    // Fade out, then change message, then fade in
    timeoutRef.current = setTimeout(() => {
      setFade(false);
      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, FADE_DURATION);
    }, INTERVAL);
    return () => clearTimeout(timeoutRef.current);
  }, [index, paused, messages.length]);

  // Pause on hover/focus for accessibility
  const handlePause = () => setPaused(true);
  const handleResume = () => setPaused(false);

  return (
    <div
      className={className}
      style={{ position: 'relative', minHeight: '2.5em', ...style }}
      tabIndex={0}
      aria-live="polite"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
    >
      <div
        style={{
          opacity: fade ? 1 : 0,
          transition: `opacity ${FADE_DURATION}ms ease`,
          willChange: 'opacity',
          fontWeight: 700,
          fontSize: '2rem',
          marginBottom: '0.5rem',
        }}
      >
        {messages[index]}
      </div>
    </div>
  );
};

export default MessageCarousel; 