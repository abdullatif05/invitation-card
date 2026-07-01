import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowDown, ChevronRight, Share2, Compass } from 'lucide-react';
import Countdown from '../components/Countdown';
import Timeline from '../components/Timeline';
import RSVPForm from '../components/RSVPForm';
import MusicPlayer from '../components/MusicPlayer';
import CalendarButton from '../components/CalendarButton';
import ScrollGuide from '../components/ScrollGuide';
import HeroStory from '../components/HeroStory';
import ScrollSprite from '../components/ScrollSprite';
import GiftSection from '../components/GiftSection';

export default function Home() {
  // Always show cinematic intro on every page load / refresh
  const [showStory, setShowStory] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);

  useEffect(() => {
    if (!showStory) setMainVisible(true);
  }, [showStory]);

  const handleStoryComplete = () => {
    setShowStory(false);
    setTimeout(() => setMainVisible(true), 80);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nikah Invitation | Abdullatif & Ayesha',
          text: 'Join us to celebrate the Nikah and Walima of Abdullatif & Ayesha on November 7 & 8, 2026!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Invitation link copied to clipboard!');
    }
  };

  return (
    <div style={styles.homeContainer} id="hero">
      {/* Cinematic Wedding Story Intro */}
      {showStory && <HeroStory onComplete={handleStoryComplete} />}

      {/* Floating Elements - Outside transform div so position:fixed works */}
      <ScrollSprite visible={mainVisible} />
      {mainVisible && <MusicPlayer />}
      {mainVisible && <ScrollGuide />}

      {/* Main site — fades in after story ends */}
      <div
        style={{
          opacity: mainVisible ? 1 : 0,
          transform: mainVisible ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
          pointerEvents: mainVisible ? 'auto' : 'none',
        }}
      >
      {/* 1. HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroBg} className="gold-dust-bg"></div>
        <div style={styles.heroOverlay}></div>

        <div className="container" style={styles.heroContent}>
          {/* Elegant Arabic Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="arabic-text"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={styles.heroSaveDate}
          >
            THE NIKAH & WALIMA CELEBRATIONS
          </motion.span>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            style={styles.heroCoupleWrapper}
          >
            <h1 className="font-serif" style={styles.heroCoupleNames}>
              Abdullatif & Ayesha
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            style={styles.heroDetails}
          >
            November 7 & 8, 2026 • Bhiwandi, Maharashtra
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-gold"
            >
              RSVP INVITATION
            </button>
            <Link to="/location" className="btn-outline" style={{ color: '#fff', borderColor: 'var(--gold-primary)', background: 'rgba(11,60,42,0.3)' }}>
              Location & Details
            </Link>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={styles.scrollIndicator}
          >
            <button 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('quran-verse')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} 
              aria-label="Scroll down"
            >
              <ArrowDown size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. QURANIC VERSE SECTION */}
      <section id="quran-verse" className="section" style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '3rem' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="card-premium"
            style={styles.quranCard}
          >
            <span style={styles.quranQuoteIcon}>❖</span>
            <p style={styles.quranArabic} className="font-serif">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
            </p>
            <p style={styles.quranEnglish}>
              "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought."
            </p>
            <span style={styles.quranSource} className="font-serif">Surah Ar-Rum • [Quran 30:21]</span>
          </motion.div>
        </div>
      </section>

      {/* 3. COUNTDOWN TIMER */}
      <section id="countdown" className="section" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={styles.sectionSubtitle}
          >
            COUNTING DOWN TO OUR NIKAH
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif"
            style={{ marginBottom: '1.5rem' }}
          >
            The Union of Two Hearts
          </motion.h2>
          <Countdown />
        </div>
      </section>

      {/* 4. PARENTS & FAMILY BLESSINGS */}
      <section id="family" className="section section-dark gold-dust-bg">
        <div className="container">
          <div className="grid-family">
            {/* Left family intro */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={styles.familyTextCol}
            >
              <span style={styles.sectionSubtitle}>WITH PARENTAL BLESSINGS</span>
              <h2 className="font-serif align-left-mobile" style={{ textAlign: 'left', marginBottom: '2rem', paddingBottom: '0.75rem' }}>
                Family Blessings
              </h2>
              
              <p style={{ marginBottom: '2rem', fontSize: '1.05rem', lineHeight: '1.8' }}>
                With the grace of Almighty Allah, we cordially invite you to join our families in celebrating the Nikah (Nov 7) and Walima (Nov 8) ceremonies of our children. Your presence, prayers, and blessings are highly cherished.
              </p>

              <div className="grid-parents">
                {/* Groom Parents */}
                <div className="card-premium" style={styles.parentCard}>
                  <div style={styles.parentRole}>Parents of the Groom</div>
                  <h3 className="font-serif" style={{ fontSize: '1.4rem', margin: '0.5rem 0 0.25rem 0' }}>
                    Mr. & Mrs. Zubair Khot
                  </h3>
                  <p style={{ fontSize: '0.85rem' }}>Joyfully inviting you to celebrate the marriage of their beloved son,<br /><strong>Abdullatif Khot</strong></p>
                </div>

                {/* Bride Parents */}
                <div className="card-premium" style={styles.parentCard}>
                  <div style={styles.parentRole}>Parents of the Bride</div>
                  <h3 className="font-serif" style={{ fontSize: '1.4rem', margin: '0.5rem 0 0.25rem 0' }}>
                    Mr. & Mrs. Sajid Kuwari
                  </h3>
                  <p style={{ fontSize: '0.85rem' }}>Joyfully inviting you to celebrate the marriage of their beloved daughter,<br /><strong>Ayesha Kuwari</strong></p>
                </div>
              </div>
            </motion.div>

            {/* Right illustration / photo */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={styles.familyImageCol}
            >
              <div className="card-premium card-arched" style={styles.portraitCard}>
                <img src="./images/islamic_couple.png" alt="Islamic Couple Silhouette Painting" style={styles.portraitImg} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. EVENT TIMELINE SECTION */}
      <section id="schedule" className="section">
        <div className="container">
          <span style={styles.sectionSubtitle}>CELEBRATION TIMELINE</span>
          <h2 className="font-serif">Program Schedule</h2>
          <Timeline />
        </div>
      </section>

      {/* 6. RSVP SECTION */}
      <section id="rsvp" className="section section-dark gold-dust-bg">
        <div className="container-narrow">
          <span style={styles.sectionSubtitle}>RESPONSE REQUESTED</span>
          <h2 className="font-serif">Kindly RSVP</h2>
          <p style={{ textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text-muted)' }}>
            We look forward to welcoming you. Please respond by **May 15th, 2026** to enable us to confirm our guest list and issue your digital VIP pass.
          </p>
          <RSVPForm />
        </div>
      </section>

      {/* 6.5 GIFT SECTION */}
      <GiftSection />

      {/* 7. QUICK LOCATION CTA SECTION */}
      <section id="location-cta" className="section">
        <div className="container">
          <div style={styles.locationCtaCard} className="card-premium">
            <div className="grid-cta">
              <div style={styles.ctaDetails}>
                <span style={styles.sectionSubtitle}>THE WEDDING VENUE</span>
                <h3 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: '1.25rem', color: 'var(--emerald-primary)' }}>
                  The Venue & Travel Details
                </h3>
                
                <div style={styles.ctaItem}>
                  <MapPin size={20} color="var(--gold-primary)" />
                  <div>
                    <strong>Parshuram Tawre Stadium</strong><br />
                    Marriage Ground, Opp. Sportive Swimming Pool, New Gauri Pada, Kariwali, Bhiwandi - 421305
                  </div>
                </div>

                <div style={styles.ctaItem}>
                  <Calendar size={20} color="var(--gold-primary)" />
                  <div>
                    <strong>November 7 & 8, 2026</strong><br />
                    Saturday Nikah starts at 4:00 PM
                  </div>
                </div>

                <p style={{ marginTop: '1.5rem', marginBottom: '2.25rem', fontSize: '0.95rem' }}>
                  A detailed travel guide is available covering hotel booking codes and guest shuttle schedules. Test out our in-app GPS navigation route simulator on the details page.
                </p>

                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Link to="/location" className="btn-emerald">
                    GPS Live Tracking & Info <ChevronRight size={16} />
                  </Link>
                  <CalendarButton />
                  <button onClick={handleShare} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    Share Card <Share2 size={16} />
                  </button>
                </div>
              </div>

              <div style={styles.ctaMapPreview}>
                <div style={styles.mapStaticOverlay}>
                  <Compass size={44} color="var(--gold-primary)" className="animate-bounce" />
                  <span style={styles.mapStaticLabel} className="font-serif">Interactive Navigation</span>
                  <Link to="/location" className="btn-gold" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>
                    Open Map Route
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo} className="font-serif">
          Abdullatif & Ayesha
        </div>
        <p style={{ color: 'var(--gold-primary)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          November 2026
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          &copy; 2026 Abdullatif & Ayesha. All Rights Reserved.
        </p>
      </footer>
      </div>{/* end main site fade wrapper */}
    </div>
  );
}

const styles = {
  homeContainer: {
    width: '100%',
  },
  heroSection: {
    position: 'relative' as const,
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute' as const,
    inset: '0',
    backgroundImage: `url('./images/islamic_hero_bg.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
    transform: 'scale(1.02)',
  },
  heroOverlay: {
    position: 'absolute' as const,
    inset: '0',
    background: 'linear-gradient(to bottom, rgba(7, 38, 26, 0.45), rgba(7, 38, 26, 0.65))',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative' as const,
    zIndex: 2,
    textAlign: 'center' as const,
    padding: '0 2rem',
  },
  heroSaveDate: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.25em',
    color: 'var(--gold-light)',
    marginBottom: '1rem',
    display: 'block',
  },
  heroCoupleWrapper: {
    margin: '0.5rem 0 1.5rem 0',
  },
  heroCoupleNames: {
    color: '#FFFFFF',
    textShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
    fontWeight: '300',
    fontSize: 'clamp(2.5rem, 7vw, 6rem)',
  },
  heroDetails: {
    fontFamily: 'var(--font-sans)',
    fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)',
    fontWeight: '300',
    letterSpacing: '0.12em',
    color: '#FAF7F0',
    textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  scrollIndicator: {
    position: 'absolute' as const,
    bottom: '3rem',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'var(--gold-light)',
    cursor: 'pointer',
  },
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
  quranCard: {
    padding: '3rem 2rem',
    border: '1px solid var(--border-gold)',
    borderRadius: '16px',
    backgroundColor: '#fff',
  },
  quranQuoteIcon: {
    fontSize: '1.25rem',
    color: 'var(--gold-primary)',
    display: 'block',
    marginBottom: '1rem',
  },
  quranArabic: {
    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
    color: 'var(--emerald-primary)',
    fontWeight: '500',
    marginBottom: '1.5rem',
  },
  quranEnglish: {
    fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
    fontStyle: 'italic',
    color: 'var(--text-muted)',
    lineHeight: '1.7',
    maxWidth: '700px',
    margin: '0 auto 1rem auto',
  },
  quranSource: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--gold-dark)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
  familyTextCol: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  parentCard: {
    padding: '2rem 1.5rem',
    textAlign: 'center' as const,
    backgroundColor: '#fff',
  },
  parentRole: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'var(--gold-primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
  familyImageCol: {
    display: 'flex',
    justifyContent: 'center',
  },
  portraitCard: {
    padding: '0.5rem',
    borderRadius: '160px 160px 16px 16px',
    backgroundColor: '#fff',
    maxWidth: '400px',
    width: '100%',
    border: '1px solid var(--border-gold)',
  },
  portraitImg: {
    width: '100%',
    height: 'auto',
    borderRadius: '150px 150px 12px 12px',
    display: 'block',
  },
  locationCtaCard: {
    width: '100%',
    padding: '3.5rem',
    backgroundColor: '#fff',
  },
  ctaDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  ctaItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  ctaMapPreview: {
    backgroundColor: 'var(--emerald-tint)',
    backgroundImage: `radial-gradient(var(--border-gold) 1px, transparent 0)`,
    backgroundSize: '24px 24px',
    borderRadius: '16px',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
    minHeight: '300px',
  },
  mapStaticOverlay: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
    textAlign: 'center' as const,
    zIndex: 2,
  },
  mapStaticLabel: {
    fontSize: '1.5rem',
    color: 'var(--emerald-primary)',
  },
  footer: {
    backgroundColor: 'var(--emerald-tint)',
    padding: '5rem 2rem 4rem 2rem',
    textAlign: 'center' as const,
    borderTop: '1px solid var(--border-gold)',
  },
  footerLogo: {
    fontSize: '2.5rem',
    color: 'var(--emerald-primary)',
    fontWeight: '300',
    marginBottom: '0.5rem',
  },
};
