import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Soft romantic wedding piano/instrumental loop URL
  const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3';

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay blocked:', err));
    }
  };

  // Try to play on user first click/scroll interaction to feel seamless
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            cleanup();
          })
          .catch(() => {});
      }
    };

    const cleanup = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

    return cleanup;
  }, [isPlaying]);

  useEffect(() => {
    const handlePlayEvent = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log('Custom trigger autoplay blocked:', err));
      }
    };

    document.addEventListener('play-wedding-music', handlePlayEvent);
    return () => {
      document.removeEventListener('play-wedding-music', handlePlayEvent);
    };
  }, [isPlaying]);

  return (
    <div style={styles.floatingWrapper}>
      <audio ref={audioRef} src={audioUrl} loop />
      
      <button
        onClick={togglePlay}
        style={{
          ...styles.playerButton,
          borderColor: isPlaying ? 'var(--gold-primary)' : 'var(--border-gold)',
          animation: isPlaying ? 'rotateDisc 8s linear infinite' : 'none',
        }}
        aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        className="card-premium"
      >
        {isPlaying ? (
          <Volume2 size={20} color="var(--gold-primary)" />
        ) : (
          <VolumeX size={20} color="var(--text-muted)" />
        )}
      </button>

      {/* Mini note banner */}
      <div style={styles.miniLabel}>
        <Music size={12} color="var(--gold-primary)" />
        <span>{isPlaying ? 'Music On' : 'Music Off'}</span>
      </div>
    </div>
  );
}

const styles = {
  floatingWrapper: {
    position: 'fixed' as const,
    bottom: '2rem',
    right: '2rem',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.25rem',
  },
  playerButton: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(11, 60, 42, 0.15)',
    transition: 'transform 0.3s ease',
    padding: 0,
    outline: 'none',
  },
  miniLabel: {
    backgroundColor: 'var(--emerald-primary)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: '500',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    padding: '0.2rem 0.5rem',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    boxShadow: 'var(--shadow-soft)',
  },
};

// Add CSS keyframe for rotating disc
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes rotateDisc {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
