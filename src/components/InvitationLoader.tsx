import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface InvitationLoaderProps {
  onOpenComplete: () => void;
}

export default function InvitationLoader({ onOpenComplete }: InvitationLoaderProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Blast gold confetti
    const end = Date.now() + 800;
    const colors = ['#D4AF37', '#EBD391', '#FFFFFF', '#0B3C2A'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Dispatch custom event to unlock and start the MusicPlayer
    document.dispatchEvent(new CustomEvent('play-wedding-music'));

    // Wait for the slide animations to complete before unmounting
    setTimeout(() => {
      setIsDone(true);
      onOpenComplete();
    }, 1400);
  };

  if (isDone) return null;

  return (
    <div style={styles.fullscreenOverlay}>
      <AnimatePresence>
        {!isOpening && (
          /* Gold seal and prompt text */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={styles.sealContainer}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              onClick={handleOpen}
              style={styles.waxSeal}
              className="glow-gold"
              whileHover={{ scale: 1.08, rotate: [0, -3, 3, -3, 3, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div style={styles.waxSealInner}>
                <span style={styles.sealArabic} className="font-serif">❖</span>
              </div>
            </motion.div>
            <h2 style={styles.sealHeader} className="font-serif">
              Abdullatif & Ayesha
            </h2>
            <p style={styles.sealSub}>
              THE WEDDING INVITATION
            </p>
            <button onClick={handleOpen} className="btn-gold" style={styles.sealBtn}>
              Open Invitation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Door Panel */}
      <motion.div
        animate={isOpening ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        style={styles.topDoor}
        className="gold-dust-bg"
      >
        <div style={styles.topDoorBorder}></div>
      </motion.div>

      {/* Bottom Door Panel */}
      <motion.div
        animate={isOpening ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        style={styles.bottomDoor}
        className="gold-dust-bg"
      >
        <div style={styles.bottomDoorBorder}></div>
      </motion.div>
    </div>
  );
}

const styles = {
  fullscreenOverlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#07261A', // Base fallback color
  },
  sealContainer: {
    position: 'absolute' as const,
    zIndex: 10001,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#fff',
  },
  waxSeal: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#B38F24',
    backgroundImage: 'radial-gradient(#EBD391 25%, #B38F24 75%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)',
    cursor: 'pointer',
    border: '4px solid #D4AF37',
    transition: 'transform 0.2s',
  },
  waxSealInner: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    border: '2px dashed rgba(255,255,255,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealArabic: {
    fontSize: '2.2rem',
    color: '#fff',
    lineHeight: 1,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  sealHeader: {
    fontSize: '2.4rem',
    color: '#fff',
    marginTop: '1.5rem',
    marginBottom: '0.25rem',
    fontWeight: '300',
    textShadow: '0 2px 6px rgba(0,0,0,0.5)',
  },
  sealSub: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    color: 'var(--gold-light)',
    letterSpacing: '0.25em',
    marginBottom: '2rem',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
  },
  sealBtn: {
    boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
  },
  topDoor: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#0B3C2A',
    backgroundImage: 'radial-gradient(circle at center bottom, #0E4F37, #07261A)',
    borderBottom: '2px solid var(--gold-primary)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'flex-end',
    boxSizing: 'border-box' as const,
  },
  topDoorBorder: {
    width: '100%',
    height: '10px',
    backgroundImage: 'linear-gradient(to right, transparent, var(--gold-light), transparent)',
    opacity: 0.8,
  },
  bottomDoor: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#0B3C2A',
    backgroundImage: 'radial-gradient(circle at center top, #0E4F37, #07261A)',
    borderTop: '2px solid var(--gold-primary)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'flex-start',
    boxSizing: 'border-box' as const,
  },
  bottomDoorBorder: {
    width: '100%',
    height: '10px',
    backgroundImage: 'linear-gradient(to right, transparent, var(--gold-light), transparent)',
    opacity: 0.8,
  },
};
