import { useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface ScrollSpriteProps {
  visible?: boolean;
}

export default function ScrollSprite({ visible = true }: ScrollSpriteProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 840);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Map 0 -> 1 scroll to frame index 0 -> 299
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 299], { clamp: true });
  
  // Create transforms for backgroundPosition
  const backgroundPosition = useTransform(frameIndex, (latest) => {
    const frame = Math.round(latest);
    const col = frame % 20;
    const row = Math.floor(frame / 20);
    // Frame width is 160px, height is 240px
    return `${-col * 160}px ${-row * 240}px`;
  });

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes coupleEntrance {
          from { opacity: 0; transform: translateY(-50%) translateX(60px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          right: isMobile ? '4px' : 'clamp(4px, 1.2%, 18px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 500,
          pointerEvents: 'none',
          animation: 'coupleEntrance 0.9s cubic-bezier(0.34,1.56,0.64,1) both',
          animationDelay: '0.3s',
        }}
      >
        {/* Spritesheet animation box without any green patch */}
        <motion.div style={{
          width: '160px',
          height: '240px',
          borderRadius: '16px',
          backgroundImage: 'url(./images/float_spritesheet.jpg)',
          backgroundSize: '3200px 3600px',
          backgroundPosition: backgroundPosition,
          backgroundRepeat: 'no-repeat',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 0 10px rgba(212,175,55,0.2)',
          border: '1.5px solid rgba(212,175,55,0.4)',
          // Hardware acceleration and mobile scaling
          transform: isMobile ? 'scale(0.65) translateZ(0)' : 'translateZ(0)',
          transformOrigin: 'right center',
          willChange: 'background-position',
        }} />
      </div>
    </>
  );
}
