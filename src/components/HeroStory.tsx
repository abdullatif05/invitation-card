import { useState, useEffect, useRef, useCallback } from 'react';
import EnvelopeAnimation from './EnvelopeAnimation';


/* ══════════════════════════════════════════════════════════
   HeroStory – Cinematic Islamic wedding storytelling
   • Phase 1: "You Are Invited" auto-loader (3s)
   • Phase 2: Scroll + auto-advance story slides
   • Phase 3: Smooth fade-in of main site
══════════════════════════════════════════════════════════ */

/* ── Character types ── */
type CharacterSlot =
  | { type: 'groom'; src: string }
  | { type: 'bride'; src: string }
  | { type: 'couple'; src: string }
  | { type: 'none' };

/* ── Transparent-background character component ── */
function StoryCharacter({
  slot,
  accent,
  overlayIcon,

}: {
  slot: CharacterSlot;
  accent: string;
  overlayIcon?: string;
}) {
  if (slot.type === 'none') return null;

  const isCouple = slot.type === 'couple';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      {/* Ambient glow under character */}
      <div style={{
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isCouple ? '85%' : '70%',
        height: '20px',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${accent}40 0%, transparent 70%)`,
        filter: 'blur(8px)',
        zIndex: 0,
      }} />

      {/* Character SVG with no background */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          height: isCouple ? '260px' : '230px',
          filter: `drop-shadow(0 8px 24px ${accent}50)`,
        }}
      >
        {'src' in slot && (
          <img src={slot.src} alt={slot.type} style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
        )}
      </div>

      {/* Floating emoji overlay — top right of character */}
      {overlayIcon && (
        <div style={{
          position: 'absolute',
          top: '0px',
          right: isCouple ? '-5px' : '-10px',
          fontSize: '1.75rem',
          zIndex: 2,
          animation: 'floatBob 2.2s ease-in-out infinite',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          lineHeight: 1,
        }}>
          {overlayIcon}
        </div>
      )}
    </div>
  );
}

/* ── Islamic mosque decoration (Scene 1 — no character) ── */
function MosqueDecoration({ accent }: { accent: string }) {
  return (
    <svg width="200" height="175" viewBox="0 0 200 175" fill="none"
      style={{ filter: `drop-shadow(0 6px 20px ${accent}50)`, animation: 'floatBob 4s ease-in-out infinite' }}>
      {/* Main body */}
      <rect x="25" y="115" width="150" height="55" rx="5" fill="#0b3c2a" />
      {/* Main dome */}
      <path d="M50 115 Q50 70 100 63 Q150 70 150 115Z" fill="#0b3c2a" />
      {/* Side domes */}
      <path d="M25 115 Q25 93 50 90 Q68 93 68 115Z" fill="#0b3c2a" />
      <path d="M132 115 Q132 93 155 90 Q175 93 175 115Z" fill="#0b3c2a" />
      {/* Center minaret */}
      <rect x="91" y="15" width="18" height="55" rx="4" fill="#0b3c2a" />
      <ellipse cx="100" cy="13" rx="12" ry="6" fill="#0b3c2a" />
      {/* Side minarets */}
      <rect x="15" y="55" width="12" height="37" rx="3" fill="#0b3c2a" />
      <ellipse cx="21" cy="53" rx="8" ry="5" fill="#0b3c2a" />
      <rect x="173" y="55" width="12" height="37" rx="3" fill="#0b3c2a" />
      <ellipse cx="179" cy="53" rx="8" ry="5" fill="#0b3c2a" />
      {/* Crescent on top */}
      <circle cx="100" cy="7" r="9" fill={accent} />
      <circle cx="105" cy="4" r="7" fill="#0a1a10" />
      {/* Windows */}
      <ellipse cx="100" cy="130" rx="13" ry="18" fill={accent} opacity="0.25" />
      <ellipse cx="57" cy="133" rx="9" ry="13" fill={accent} opacity="0.18" />
      <ellipse cx="143" cy="133" rx="9" ry="13" fill={accent} opacity="0.18" />
      {/* Door arch */}
      <path d="M87 170 L87 142 Q87 130 100 130 Q113 130 113 142 L113 170 Z" fill={accent} opacity="0.2" />
      {/* Gold dome outline */}
      <path d="M50 115 Q50 70 100 63 Q150 70 150 115" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.55" />
      {/* Stars around */}
      <text x="6" y="30" fontSize="14" fill={accent} opacity="0.9">✦</text>
      <text x="177" y="25" fontSize="11" fill={accent} opacity="0.8">✧</text>
      <text x="183" y="90" fontSize="9" fill={accent} opacity="0.7">✦</text>
      <text x="2" y="100" fontSize="8" fill={accent} opacity="0.6">✧</text>
    </svg>
  );
}

/* ── Scene definitions with precise character assignments ── */
const SCENES = [
  {
    id: 'opening',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    title: 'In the Name of Allah',
    caption: 'A love story written in the heavens…',
    bg: 'radial-gradient(ellipse at 50% 30%, #051810 0%, #0b3c2a 55%, #07261a 100%)',
    accent: '#D4AF37',
    character: { type: 'none' } as CharacterSlot,  // Mosque shown instead
    overlay: undefined,
  },
  {
    id: 'developer',
    arabic: 'الحب في التفاصيل',
    title: 'The Engineer',
    caption: 'Abdullatif Khot — a passionate engineer\nwho crafts beautiful things every day…',
    bg: 'linear-gradient(155deg, #0a1a10 0%, #0b3c2a 50%, #061408 100%)',
    accent: '#EBD391',
    character: { type: 'groom', src: '/images/groom_developer_generated.png' } as CharacterSlot,
    overlay: '⚙️',
  },
  {
    id: 'decision',
    arabic: 'بركة الوالدين',
    title: 'The Blessed Decision',
    caption: 'With the blessings of both families,\na union chosen by Allah was arranged.',
    bg: 'linear-gradient(160deg, #1a0d07 0%, #3c1f0b 45%, #2a1507 100%)',
    accent: '#D4AF37',
    character: { type: 'groom', src: '/images/groom_alone_generated.png' } as CharacterSlot,
    overlay: '🤝',
  },
  {
    id: 'bride',
    arabic: 'قلبان اتحدا',
    title: 'She Said Yes',
    caption: 'Ayesha Kuwari — with grace, joy\nand her father\'s heartfelt blessing.',
    bg: 'radial-gradient(ellipse at 40% 60%, #1a1035 0%, #2a1a4a 55%, #0d0718 100%)',
    accent: '#EBD391',
    character: { type: 'bride', src: '/images/bride_alone_generated.png' } as CharacterSlot,
    overlay: '💍',
  },
  {
    id: 'celebration',
    arabic: 'ليلة الاحتفال',
    title: 'Four Days of Joy',
    caption: 'Mehndi · Paan Khana · Nikah · Walima\nNovember 5 – 8, 2026 • Bhiwandi',
    bg: 'linear-gradient(180deg, #07261a 0%, #0b3c2a 45%, #071a10 100%)',
    accent: '#D4AF37',
    character: { type: 'couple', src: '/images/couple_cleaned.png' } as CharacterSlot,
    overlay: '🎊',
  },
  {
    id: 'invitation',
    arabic: 'أنتم مدعوون',
    title: 'You Are Warmly Invited',
    caption: 'Your presence, prayers & blessings\nwill make our celebration complete.',
    bg: 'radial-gradient(ellipse at 50% 50%, #1a1200 0%, #3c2a07 55%, #1a1200 100%)',
    accent: '#EBD391',
    character: { type: 'groom', src: '/images/groom_alone_generated.png' } as CharacterSlot,
    overlay: '💌',
  },
  {
    id: 'welcome',
    arabic: 'الاحتفال يبدأ',
    title: 'The Celebration Begins…',
    caption: 'Scroll down to explore the schedule,\nvenue details & GPS navigation.',
    bg: 'radial-gradient(ellipse at 50% 40%, #0b3c2a 0%, #07261a 60%, #040f0a 100%)',
    accent: '#D4AF37',
    character: { type: 'couple', src: '/images/couple_cleaned.png' } as CharacterSlot,
    overlay: '✨',
  },
];

type Phase = 'loader' | 'story' | 'envelope' | 'done';

export default function HeroStory({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('loader');
  const [loaderFading, setLoaderFading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<'down' | 'up'>('down');
  const [isAnimating, setIsAnimating] = useState(false);

  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Loader auto-dismiss (3s) ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setLoaderFading(true);
      setTimeout(() => setPhase('story'), 850);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  /* ── Navigate slides ── */
  const navigate = useCallback((dir: 'down' | 'up') => {
    if (isAnimating) return;
    setSlideDir(dir);

    if (dir === 'down' && currentIndex >= SCENES.length - 1) {
      // Reached the last slide. Do not auto-advance. Wait for user to click "View Invitation"
      return;
    }
    if (dir === 'up' && currentIndex <= 0) return;

    const next = dir === 'down' ? currentIndex + 1 : currentIndex - 1;
    setIsAnimating(true);
    setPrevIndex(currentIndex);
    setCurrentIndex(next);
    setTimeout(() => { setPrevIndex(null); setIsAnimating(false); }, 680);
  }, [currentIndex, isAnimating, onComplete]);

  /* ── Auto timer reset ── */
  const resetAuto = useCallback(() => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => navigate('down'), 3000);
  }, [navigate]);

  useEffect(() => {
    if (phase !== 'story') return;
    resetAuto();
    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
  }, [phase, currentIndex, resetAuto]);

  /* ── Wheel ── */
  useEffect(() => {
    if (phase !== 'story') return;
    const fn = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 760);
      navigate(e.deltaY > 0 ? 'down' : 'up');
      resetAuto();
    };
    const el = containerRef.current;
    el?.addEventListener('wheel', fn, { passive: false });
    return () => el?.removeEventListener('wheel', fn);
  }, [phase, navigate, resetAuto]);

  /* ── Touch ── */
  useEffect(() => {
    if (phase !== 'story') return;
    const onS = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onE = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const d = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(d) < 35) return;
      navigate(d > 0 ? 'down' : 'up');
      resetAuto();
    };
    const el = containerRef.current;
    el?.addEventListener('touchstart', onS, { passive: true });
    el?.addEventListener('touchend', onE, { passive: true });
    return () => { el?.removeEventListener('touchstart', onS); el?.removeEventListener('touchend', onE); };
  }, [phase, navigate, resetAuto]);

  const handleSkip = () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    setPhase('done');
    onComplete();
  };

  if (phase === 'done') return null;

  const cur = SCENES[currentIndex];
  const prev = prevIndex !== null ? SCENES[prevIndex] : null;
  const exitY = slideDir === 'down' ? '-100%' : '100%';
  const enterY = slideDir === 'down' ? '100%' : '-100%';

  return (
    <>
      <style>{`
        @keyframes loaderGlow {
          0%,100% { opacity:.75; transform:scale(1); }
          50%      { opacity:1;  transform:scale(1.04); }
        }
        @keyframes loaderFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes starBlink {
          0%,100% { opacity:.1; } 50% { opacity:.85; }
        }
        @keyframes floatBob {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-10px); }
        }
        @keyframes arabicGlow {
          0%,100% { text-shadow:0 0 14px rgba(212,175,55,.3); }
          50%      { text-shadow:0 0 40px rgba(212,175,55,.85); }
        }
        @keyframes charEntrance {
          from { opacity:0; transform:translateY(22px) scale(.92); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes progressGrow { from{width:0%} to{width:100%} }
        .slide-exit { animation: slideExit .65s cubic-bezier(.4,0,.2,1) forwards; }
        .slide-enter{ animation: slideEnter .65s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes slideExit  { from{transform:translateY(0);         opacity:1} to{transform:translateY(${exitY}); opacity:0} }
        @keyframes slideEnter { from{transform:translateY(${enterY}); opacity:0} to{transform:translateY(0);         opacity:1} }
        .char-bob { animation: floatBob 3.6s ease-in-out infinite; }
        .arabic-glow { animation: arabicGlow 3s ease-in-out infinite; }
        .skip-btn:hover { background:rgba(255,255,255,.15)!important; color:rgba(255,255,255,.95)!important; }
      `}</style>

      {/* ════ LOADER ════ */}
      {phase === 'loader' && (
        <div style={{
          ...s.fixed, zIndex: 10000,
          background: 'radial-gradient(ellipse at 50% 40%, #0e4f37 0%, #0b3c2a 50%, #07261a 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: loaderFading ? 0 : 1,
          transition: 'opacity .85s cubic-bezier(.4,0,.2,1)',
        }}>
          {/* Geometric ring */}
          <svg width="300" height="300" viewBox="0 0 300 300" style={{ position: 'absolute', opacity: .13 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <polygon key={i} points="150,18 282,84 282,216 150,282 18,216 18,84"
                stroke="#D4AF37" strokeWidth=".8" fill="none"
                style={{ transform: `rotate(${i * 18}deg)`, transformOrigin: '150px 150px' }} />
            ))}
            <circle cx="150" cy="150" r="96" stroke="#D4AF37" strokeWidth=".7" fill="none" />
            <circle cx="150" cy="150" r="65" stroke="#D4AF37" strokeWidth=".5" fill="none" />
          </svg>

          {/* Stars */}
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', borderRadius: '50%', backgroundColor: '#D4AF37',
              width: i % 4 === 0 ? '4px' : '2px', height: i % 4 === 0 ? '4px' : '2px',
              top: `${5 + (i * 5.1) % 58}%`, left: `${(i * 4.7) % 100}%`,
              animation: `starBlink ${1.2 + (i % 4) * .35}s ease-in-out infinite`,
              animationDelay: `${(i * .18) % 1.8}s`,
            }} />
          ))}

          {/* Crescent */}
          <div style={{
            position: 'absolute', top: '8%', right: '9%', width: '62px', height: '62px',
            borderRadius: '50%', border: '2px solid #D4AF37',
            clipPath: 'circle(50% at 66% 50%)', boxShadow: '0 0 36px rgba(212,175,55,.5)',
          }} />

          {/* Groom photo in loader */}
          <div style={{ marginBottom: '1.5rem', animation: 'loaderFadeUp 1s ease .1s both' }}>
            <StoryCharacter
              slot={{ type: 'groom', src: '/images/groom_nobg_standing.png' }}
              accent="#D4AF37"
            />
          </div>

          <div className="font-serif" style={{
            color: '#EBD391', fontSize: 'clamp(.85rem,1.8vw,1.1rem)',
            letterSpacing: '.1em', marginBottom: '1.1rem', opacity: .85,
            animation: 'loaderFadeUp 1s ease .35s both',
          }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <h1 className="font-serif" style={{
            color: '#fff', fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 300,
            letterSpacing: '.06em', textAlign: 'center',
            textShadow: '0 4px 30px rgba(0,0,0,.5)',
            animation: 'loaderGlow 2.2s ease-in-out infinite, loaderFadeUp 1s ease .5s both',
            lineHeight: 1.4, margin: '0 1.5rem',
          }}>
            You are invited for the wedding ceremony of
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', margin: '1.4rem 0' }}>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right,transparent,#D4AF37)' }} />
            <span style={{ color: '#D4AF37', fontSize: '1.1rem' }}>❖</span>
            <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to left,transparent,#D4AF37)' }} />
          </div>

          <div className="font-serif" style={{
            color: '#EBD391', fontSize: 'clamp(1rem,2.5vw,1.3rem)', fontWeight: 300,
            letterSpacing: '.18em', textTransform: 'uppercase', textAlign: 'center',
            animation: 'loaderFadeUp 1s ease .7s both, floatBob 3s ease-in-out infinite',
          }}>
            Abdullatif &amp; Ayesha
          </div>

          <div style={{
            color: 'rgba(255,255,255,.4)', fontFamily: 'var(--font-sans)',
            fontSize: '.68rem', letterSpacing: '.22em', textTransform: 'uppercase',
            marginTop: '.5rem', animation: 'loaderFadeUp 1s ease .9s both',
          }}>
            November 2026 · Bhiwandi
          </div>

          <div style={{ display: 'flex', gap: '7px', marginTop: '2rem' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#D4AF37',
                animation: 'loaderGlow 1.4s ease-in-out infinite',
                animationDelay: `${i * .25}s`, opacity: .65,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ════ STORY SLIDES ════ */}
      {phase === 'story' && (
        <div ref={containerRef} style={{ ...s.fixed, overflow: 'hidden', zIndex: 9999 }}>
          {prev && (
            <div className="slide-exit" style={{ ...s.slide, background: prev.bg, position: 'absolute', inset: 0, zIndex: 1 }}>
              <SlideContent scene={prev} isExiting />
            </div>
          )}
          <div className={isAnimating ? 'slide-enter' : ''} style={{ ...s.slide, background: cur.bg, position: 'absolute', inset: 0, zIndex: 2 }}>
            <SlideContent scene={cur} index={currentIndex} total={SCENES.length} isLast={currentIndex === SCENES.length - 1} onViewClick={() => setPhase('envelope')} />
          </div>

          {/* Gold progress bar */}
          <div style={s.progressTrack}>
            <div key={currentIndex} style={{ ...s.progressFill, backgroundColor: cur.accent, animation: 'progressGrow 3s linear forwards' }} />
          </div>

          {/* Skip */}
          <button onClick={() => setPhase('envelope')} className="skip-btn" style={s.skipBtn}>Skip ›</button>
        </div>
      )}

      {/* ════ ENVELOPE PHASE ════ */}
      {phase === 'envelope' && <EnvelopeAnimation onComplete={onComplete} />}
    </>
  );
}

/* ── Slide ── */
function SlideContent({
  scene, index, total, isLast, isExiting, onViewClick
}: {
  scene: typeof SCENES[0];
  index?: number;
  total?: number;
  isLast?: boolean;
  isExiting?: boolean;
  onViewClick?: () => void;
}) {
  const { accent } = scene;
  const hasCharacter = scene.character.type !== 'none';

  return (
    <div style={s.slideInner}>
      {/* Geometric pattern */}
      <svg style={s.geomBg} viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="geo-p" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <g stroke={accent} strokeWidth=".4" fill="none" opacity=".08">
              <polygon points="50,3 97,27 97,73 50,97 3,73 3,27" />
              <circle cx="50" cy="50" r="22" />
              <line x1="50" y1="3" x2="50" y2="97" />
              <line x1="3" y1="27" x2="97" y2="73" />
              <line x1="97" y1="27" x2="3" y2="73" />
            </g>
          </pattern>
        </defs>
        <rect width="500" height="500" fill="url(#geo-p)" />
      </svg>

      {/* Stars */}
      {!isExiting && Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%', backgroundColor: accent,
          width: i % 5 === 0 ? '3px' : '2px', height: i % 5 === 0 ? '3px' : '2px',
          top: `${(i * 4.8) % 65}%`, left: `${(i * 5.6) % 100}%`,
          opacity: .12 + (i % 5) * .1,
          animation: `starBlink ${1.5 + (i % 4) * .4}s ease-in-out infinite`,
          animationDelay: `${(i * .18) % 2}s`, pointerEvents: 'none',
        }} />
      ))}

      {/* Crescent */}
      <div style={{ ...s.crescent, borderColor: accent, boxShadow: `0 0 28px ${accent}45` }} />

      {/* ── Layout: if character exists, split horizontally; else center text ── */}
      {hasCharacter ? (
        /* Character + Text side-by-side layout */
        <div style={s.splitLayout}>
          {/* Left: Character */}
          <div
            className="char-bob"
            style={{
              flex: '0 0 auto',
              animation: 'charEntrance .8s cubic-bezier(.34,1.56,.64,1) both',
              animationDelay: '.08s',
            }}
          >
            {scene.character.type === 'none' ? null : (
              <StoryCharacter
                slot={scene.character}
                accent={accent}
                overlayIcon={scene.overlay}
              />
            )}
          </div>

          {/* Right: Text content */}
          <div style={s.textCol}>
            <ArabicText text={scene.arabic} accent={accent} />
            <Ornament accent={accent} />
            <h1 className="font-serif hero-title" style={titleStyle(accent)}>{scene.title}</h1>
            <Caption text={scene.caption} />
            {isLast && <LastCTA accent={accent} onClick={onViewClick} />}
            {typeof index === 'number' && <Counter index={index} total={total!} accent={accent} />}
          </div>
        </div>
      ) : (
        /* Centered layout — Scene 1 (mosque) */
        <div style={s.contentBox}>
          {/* Mosque illustration */}
          <div style={{ marginBottom: '1rem', animation: 'charEntrance .8s cubic-bezier(.34,1.56,.64,1) both' }}>
            <MosqueDecoration accent={accent} />
          </div>
          <ArabicText text={scene.arabic} accent={accent} large />
          <Ornament accent={accent} />
          <h1 className="font-serif" style={{ ...titleStyle(accent), fontSize: 'clamp(1.9rem,5.5vw,3.8rem)' }}>{scene.title}</h1>
          <Caption text={scene.caption} />
          {typeof index === 'number' && <Counter index={index} total={total!} accent={accent} />}
        </div>
      )}
    </div>
  );
}

/* ── Small sub-components ── */
function ArabicText({ text, accent, large }: { text: string; accent: string; large?: boolean }) {
  return (
    <div className="font-serif arabic-glow" style={{
      color: accent,
      fontSize: large ? 'clamp(1.1rem,2.8vw,1.6rem)' : 'clamp(.88rem,2vw,1.2rem)',
      letterSpacing: '.06em', marginBottom: '.4rem',
    }}>
      {text}
    </div>
  );
}

function Ornament({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '.5rem 0' }}>
      <div style={{ width: '44px', height: '1px', background: `linear-gradient(to right,transparent,${accent})` }} />
      <span style={{ color: accent, fontSize: '.8rem' }}>❖</span>
      <div style={{ width: '44px', height: '1px', background: `linear-gradient(to left,transparent,${accent})` }} />
    </div>
  );
}

function Caption({ text }: { text: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,.68)',
      fontSize: 'clamp(.78rem,1.6vw,.96rem)', lineHeight: 1.85,
      fontWeight: 300, letterSpacing: '.03em', margin: '0',
    }}>
      {text.split('\n').map((line, i, a) => <span key={i}>{line}{i < a.length - 1 && <br />}</span>)}
    </p>
  );
}

function LastCTA({ accent, onClick }: { accent: string; onClick?: () => void }) {
  return (
    <div style={{ marginTop: '1.2rem', animation: 'floatBob 2s ease-in-out infinite' }}>
      <button 
        onClick={onClick} 
        style={{ 
          backgroundColor: accent, color: '#07261a', padding: '0.7rem 1.6rem', 
          borderRadius: '30px', fontFamily: 'var(--font-sans)', fontSize: '.85rem', 
          letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, 
          border: 'none', cursor: 'pointer', boxShadow: `0 8px 25px ${accent}40`,
          transition: 'all 0.3s ease'
        }}
      >
        View Invitation
      </button>
    </div>
  );
}

function Counter({ index, total, accent }: { index: number; total: number; accent: string }) {
  return (
    <div style={{ marginTop: '1.2rem', fontFamily: 'var(--font-sans)', fontSize: '.6rem', color: `${accent}70`, letterSpacing: '.22em', textTransform: 'uppercase' }}>
      {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </div>
  );
}

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  fixed:        { position: 'fixed', inset: '0' },
  slide:        { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  slideInner:   { position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  geomBg:       { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 },
  crescent:     { position: 'absolute', top: '7%', right: '8%', width: '54px', height: '54px', borderRadius: '50%', border: '1.5px solid #D4AF37', clipPath: 'circle(50% at 65% 50%)', zIndex: 3 },
  splitLayout:  {
    position: 'relative', zIndex: 10,
    display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
    gap: 'clamp(1.5rem,4vw,3.5rem)',
    padding: '1.5rem clamp(1.5rem,5vw,4rem)',
    paddingRight: 'clamp(85px, 8vw, 4rem)',
    maxWidth: '860px', width: '100%',
  },
  textCol:      { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', flex: '1 1 280px', minWidth: '260px' },
  contentBox:   { position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem 2.5rem', paddingRight: 'clamp(85px, 8vw, 4rem)', maxWidth: '620px', width: '100%' },
  progressTrack:{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '3px', backgroundColor: 'rgba(255,255,255,.08)', zIndex: 20 },
  progressFill: { height: '100%', width: '0%', borderRadius: '0 2px 2px 0' },
  skipBtn:      { position: 'absolute', top: '1.2rem', right: '1.5rem', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.18)', borderRadius: '50px', color: 'rgba(255,255,255,.62)', fontFamily: 'var(--font-sans)', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.12em', padding: '.45rem 1.1rem', cursor: 'pointer', zIndex: 20, backdropFilter: 'blur(12px)', transition: 'all .3s ease' },
};

function titleStyle(accent: string): React.CSSProperties {
  return {
    color: '#fff', fontWeight: 300, fontSize: 'clamp(1.5rem,4.5vw,3rem)', lineHeight: 1.2,
    marginBottom: '.75rem', textShadow: `0 4px 20px rgba(0,0,0,.5), 0 0 60px ${accent}30`,
    letterSpacing: '.04em', whiteSpace: 'nowrap'
  };
}

