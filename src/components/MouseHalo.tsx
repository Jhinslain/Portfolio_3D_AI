import React, { useEffect, useState, CSSProperties } from 'react';

const MouseHalo = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Vérifier si l'élément sous le curseur est cliquable
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const isClickableElement = element && (
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.tagName === 'INPUT' ||
        element.getAttribute('role') === 'button' ||
        element.getAttribute('role') === 'link' ||
        (element as HTMLElement).onclick !== null ||
        element.classList.contains('cursor-pointer')
      );
      
      setIsClickable(isClickableElement);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const haloStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 50,
    background: `radial-gradient(circle at ${position.x}px ${position.y}px, 
      rgba(255, 255, 255, 0.08) 0%, 
      transparent 15%)`,
    transition: 'opacity 0.3s ease-in-out',
  };

  const focusedHaloStyle: CSSProperties = {
    ...haloStyle,
    background: `radial-gradient(circle at ${position.x}px ${position.y}px, 
      rgba(255, 255, 255, 0.15) 0%, 
      transparent 10%)`,
    opacity: isClickable ? 1 : 0,
  };

  return (
    <>
      <div style={haloStyle} />
      <div style={focusedHaloStyle} />
    </>
  );
};

export default MouseHalo; 