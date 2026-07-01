import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface PhotoItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

export default function PhotoGallery() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const photos: PhotoItem[] = [
    {
      id: 1,
      src: './images/gallery_rings.png',
      alt: 'Wedding Rings',
      caption: 'The Promise of Forever',
    },
    {
      id: 2,
      src: './images/gallery_venue.png',
      alt: 'Reception Venue',
      caption: 'The Setting of Our Celebration',
    },
    {
      id: 3,
      src: './images/gallery_cake.png',
      alt: 'Wedding Cake',
      caption: 'Sweet Beginnings',
    },
    {
      id: 4,
      src: './images/gallery_bouquet.png',
      alt: 'Bridal Bouquet',
      caption: 'Floral Details of the Day',
    },
  ];

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div style={styles.galleryContainer}>
      {/* Grid Layout */}
      <div style={styles.photoGrid}>
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            style={styles.gridItem}
            className="gallery-card"
            onClick={() => openLightbox(index)}
          >
            <div style={styles.imgWrapper}>
              <img src={photo.src} alt={photo.alt} style={styles.thumbnail} />
              <div className="gallery-overlay" style={styles.overlay}>
                <Maximize2 size={24} color="#fff" style={styles.zoomIcon} />
                <span style={styles.overlayCaption} className="font-serif">
                  {photo.caption}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={styles.lightboxBg}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              style={styles.closeBtn}
              onClick={closeLightbox}
              aria-label="Close Lightbox"
            >
              <X size={28} />
            </button>

            {/* Left Navigation */}
            <button
              style={{ ...styles.navBtn, left: '2rem' }}
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              aria-label="Previous Photo"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Main Lightbox Content */}
            <motion.div
              key={activePhotoIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[activePhotoIndex].src}
                alt={photos[activePhotoIndex].alt}
                style={styles.lightboxImage}
              />
              <div style={styles.lightboxCaption} className="font-serif">
                {photos[activePhotoIndex].caption}
              </div>
            </motion.div>

            {/* Right Navigation */}
            <button
              style={{ ...styles.navBtn, right: '2rem' }}
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              aria-label="Next Photo"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  galleryContainer: {
    width: '100%',
    margin: '0 auto',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    width: '100%',
  },
  gridItem: {
    cursor: 'pointer',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-gold)',
    boxShadow: 'var(--shadow-soft)',
    background: '#fff',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    aspectRatio: '4 / 3',
  },
  imgWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  overlay: {
    position: 'absolute' as const,
    inset: '0',
    backgroundColor: 'rgba(44, 42, 41, 0.4)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    gap: '0.75rem',
  },
  zoomIcon: {
    transform: 'translateY(10px)',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  overlayCaption: {
    color: '#fff',
    fontSize: '1.4rem',
    fontWeight: '400',
    textAlign: 'center' as const,
    transform: 'translateY(10px)',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  lightboxBg: {
    position: 'fixed' as const,
    inset: '0',
    backgroundColor: 'rgba(28, 27, 26, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  closeBtn: {
    position: 'absolute' as const,
    top: '2rem',
    right: '2rem',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  },
  navBtn: {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '0.75rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  },
  lightboxContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    maxWidth: '90%',
    maxHeight: '80%',
    gap: '1rem',
  },
  lightboxImage: {
    maxWidth: '100%',
    maxHeight: '70vh',
    objectFit: 'contain' as const,
    borderRadius: '8px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  },
  lightboxCaption: {
    color: '#FCF9F5',
    fontSize: '1.6rem',
    textAlign: 'center' as const,
    letterSpacing: '0.05em',
  },
};

// Add hover styles for overlay and image zoom
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  .gallery-card:hover img {
    transform: scale(1.08);
  }
  .gallery-card:hover .gallery-overlay {
    opacity: 1;
  }
  .gallery-card:hover .gallery-overlay svg,
  .gallery-card:hover .gallery-overlay span {
    transform: translateY(0);
  }
  button[style*="Btn"]:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  @media (max-width: 768px) {
    button[style*="navBtn"] {
      display: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);
