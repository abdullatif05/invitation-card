import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import ModelNode from './ModelNode';

interface ThreeCharacterProps {
  modelUrl?: string;
  visible?: boolean;
}

export default function ThreeCharacter({ modelUrl, visible = true }: ThreeCharacterProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 840);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!visible || isMobile) return null;

  const accent = '#D4AF37';

  return (
    <>
      <style>{`
        @keyframes coupleEntrance {
          from { opacity: 0; transform: translateY(-50%) translateX(60px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
        @keyframes glassGlow {
          0%,100% { box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.18); }
          50%      { box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 16px rgba(212,175,55,0.2); }
        }
        @keyframes nameFloat {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-3px); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          right: 'clamp(4px, 1.2%, 18px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 500,
          pointerEvents: 'none', // Let clicks pass through to the page below
          animation: 'coupleEntrance 0.9s cubic-bezier(0.34,1.56,0.64,1) both',
          animationDelay: '0.3s',
        }}
      >
        <div style={{
          background: 'linear-gradient(175deg, rgba(11,60,42,0.52) 0%, rgba(7,38,26,0.68) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(212,175,55,0.28)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(212,175,55,0.18)',
          animation: 'glassGlow 4s ease-in-out infinite',
          padding: '10px 8px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          width: '156px',
        }}>
          {/* Title */}
          <div style={{
            color: accent,
            fontSize: '0.5rem',
            letterSpacing: '0.14em',
            fontFamily: 'var(--font-serif)',
            opacity: 0.88,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}>
            ❖ Abdullatif &amp; Ayesha ❖
          </div>

          <div style={{
            width: '140px',
            height: '215px',
            position: 'relative',
          }}>
            <Canvas
              camera={{ position: [0, 1, 4], fov: 45 }}
              style={{ pointerEvents: 'auto' }} // if you want to allow orbiting later
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
              <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#D4AF37" />
              
              <Environment preset="city" />

              <ModelNode modelUrl={modelUrl} />

              <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={5} blur={2} far={4} />
            </Canvas>
          </div>

          {/* Scroll hint */}
          <div style={{
            color: `${accent}45`,
            fontSize: '0.4rem',
            letterSpacing: '0.1em',
            fontFamily: 'var(--font-sans)',
            textTransform: 'uppercase',
            marginTop: '1px',
          }}>
            scroll to spin ↕
          </div>
        </div>

        {/* Floating name below card */}
        <div style={{
          position: 'absolute',
          bottom: '-26px',
          left: '50%',
          animation: 'nameFloat 3s ease-in-out infinite',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}>
          <span style={{
            color: `${accent}70`,
            fontSize: '0.38rem',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.1em',
          }}>
            November 2026
          </span>
        </div>
      </div>
    </>
  );
}
