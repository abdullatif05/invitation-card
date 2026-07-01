import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeAnimationProps {
  onComplete: () => void;
}

export default function EnvelopeAnimation({ onComplete }: EnvelopeAnimationProps) {
  const [step, setStep] = useState(0);

  // Sequence the animation steps
  useEffect(() => {
    // Step 1: Envelope flap opens
    const t1 = setTimeout(() => setStep(1), 800);
    // Step 2: Card slides up
    const t2 = setTimeout(() => setStep(2), 1600);
    // Step 3: Envelope fades away / card takes over
    const t3 = setTimeout(() => setStep(3), 3200);
    // Step 4: Call onComplete
    const t4 = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: step < 3 ? 1 : 0 }}
      transition={{ duration: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#040f0a', // very dark emerald
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999, // above everything
        perspective: '1200px',
        overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ y: '100vh', scale: 0.5 }}
        animate={{ y: step < 3 ? 0 : '-50vh', scale: step < 3 ? 1 : 1.5 }}
        transition={{ type: 'spring', damping: 20, stiffness: 60 }}
        style={{
          position: 'relative',
          width: 'clamp(300px, 80vw, 500px)',
          height: 'clamp(200px, 53vw, 330px)', // aspect ratio of envelope
        }}
      >
        {/* ENVELOPE BACK */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0b3c2a', // emerald
          borderRadius: '8px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(212,175,55,0.2)'
        }}>
          {/* Inner liner pattern */}
          <div style={{
            position: 'absolute',
            inset: '2px',
            borderRadius: '6px',
            background: 'linear-gradient(45deg, #0b3c2a, #07261a)',
            opacity: 0.8
          }} />
        </div>

        {/* THE CARD (INVITATION) */}
        <motion.div
          animate={{ 
            y: step >= 2 ? '-65%' : '0%',
            scale: step >= 3 ? 2 : 1,
            opacity: step >= 3 ? 0 : 1
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            inset: '5px',
            backgroundColor: '#FAF7F0',
            borderRadius: '4px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            border: '2px solid #D4AF37',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{
            width: '40px', height: '1px', background: '#D4AF37', marginBottom: '15px'
          }} />
          <h2 className="font-serif" style={{ color: '#0B3C2A', fontSize: '1.8rem', textAlign: 'center', margin: 0 }}>
            Abdullatif & Ayesha
          </h2>
          <div style={{
            width: '40px', height: '1px', background: '#D4AF37', marginTop: '15px'
          }} />
        </motion.div>

        {/* ENVELOPE FRONT (Left and Right flaps forming a V shape) */}
        {/* We can use CSS borders to create the front pocket */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          pointerEvents: 'none',
          overflow: 'hidden',
          borderRadius: '8px'
        }}>
          {/* Left triangle */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0, width: '50%',
            backgroundColor: '#07261A',
            clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
            borderRight: '1px solid rgba(212,175,55,0.4)',
            boxShadow: '2px 0 10px rgba(0,0,0,0.3)'
          }} />
          {/* Right triangle */}
          <div style={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0, width: '50%',
            backgroundColor: '#07261A',
            clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
            borderLeft: '1px solid rgba(212,175,55,0.4)',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.3)'
          }} />
          {/* Bottom triangle */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0, height: '60%',
            backgroundColor: '#0a3022',
            clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
            borderTop: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
          }} />
        </div>

        {/* ENVELOPE TOP FLAP */}
        <motion.div
          animate={{ 
            rotateX: step >= 1 ? 180 : 0,
            zIndex: step >= 1 ? 5 : 30 // goes behind card when open!
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            left: 0, right: 0, top: 0, height: '65%',
            backgroundColor: '#0b3c2a',
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            transformOrigin: 'top center',
            borderBottom: '1px solid rgba(212,175,55,0.5)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {/* Gold Seal */}
          <motion.div 
            animate={{ opacity: step >= 1 ? 0 : 1 }}
            style={{
              width: '40px', height: '40px',
              backgroundColor: '#D4AF37',
              borderRadius: '50%',
              position: 'absolute',
              bottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
              border: '2px solid #b59228'
            }}
          >
            <span style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'serif' }}>A</span>
          </motion.div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
