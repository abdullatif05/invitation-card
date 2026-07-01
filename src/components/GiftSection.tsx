import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, X, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

import { createPortal } from 'react-dom';

export default function GiftSection() {
  const [modalType, setModalType] = useState<'money' | 'dua' | null>(null);

  const triggerCelebration = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#0b3c2a']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#0b3c2a']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleOpenDua = () => {
    setModalType('dua');
    setTimeout(() => {
      triggerCelebration();
    }, 100);
  };

  const modalContent = (
    <AnimatePresence>
      {modalType && (
        <div style={styles.modalOverlay} onClick={() => setModalType(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={styles.modalContent}
            className="card-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalType(null)}
              style={styles.closeBtn}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {modalType === 'money' && (
              <div style={{ textAlign: 'center' }}>
                <QrCode size={40} color="var(--gold-primary)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--emerald-primary)', marginBottom: '1rem' }}>
                  Digital Gift
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Scan the QR code below using any payment app to send your gift.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'center', opacity: 0.8 }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" style={{ height: '18px' }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style={{ height: '22px' }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style={{ height: '11px' }} />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: '16px' }} />
                </div>
                <div style={styles.qrContainer}>
                  <img src="./images/qr-code.jpeg" alt="Payment QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
            )}

            {modalType === 'dua' && (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <Heart size={48} color="var(--gold-primary)" fill="var(--gold-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 className="font-serif" style={{ fontSize: '2rem', color: 'var(--emerald-primary)', marginBottom: '1rem' }}>
                  Jazakallah Khair!
                </h3>
                <p style={{ color: 'var(--text-dark)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  Thank you so much for your heartfelt Dua.<br/>
                  Your blessings mean the world to us and make our celebration complete!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <section id="gift-section" className="section gold-dust-bg" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <span style={styles.sectionSubtitle}>BLESSINGS & GIFTS</span>
        <h2 className="font-serif">Share Your Love</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Your presence and prayers are the greatest gifts we could ask for. Should you wish to bless us further, you may choose below.
        </p>

        <div style={styles.buttonContainer}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-gold"
            onClick={() => setModalType('money')}
            style={styles.ctaButton}
          >
            <Gift size={20} />
            Send Money
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-emerald"
            onClick={handleOpenDua}
            style={styles.ctaButton}
          >
            <Heart size={20} />
            Send Dua
          </motion.button>
        </div>
      </div>

      {typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
    </section>
  );
}

const styles = {
  sectionSubtitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--gold-primary)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    marginBottom: '0.5rem',
    display: 'block',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  ctaButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.8rem 2rem',
    fontSize: '1rem',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '16px',
    maxWidth: '450px',
    width: '100%',
    position: 'relative' as const,
    border: '2px solid var(--border-gold)',
  },
  closeBtn: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #e9ecef',
    display: 'inline-block',
  },
  qrPlaceholder: {
    width: '200px',
    height: '200px',
    backgroundColor: '#fff',
    border: '2px dashed #ced4da',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
  }
};
