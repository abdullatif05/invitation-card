import { motion } from 'framer-motion';
import { Utensils, BookOpen, Brush, Coffee } from 'lucide-react';

interface EventItem {
  day: string;
  time: string;
  title: string;
  location: string;
  description: string;
  icon: React.ReactNode;
}

export default function Timeline() {
  const events: EventItem[] = [
    // Day 1: Mehndi Ceremony
    {
      day: 'Day 1: Mehndi • Thu, Nov 5',
      time: 'After Maghrib',
      title: 'Mehndi Ceremony',
      location: "Bride's Residence",
      description: 'The colorful traditional henna gathering to kick off our wedding celebrations.',
      icon: <Brush size={20} color="var(--gold-primary)" />,
    },
    // Day 2: Paan Khana Ceremony
    {
      day: 'Day 2: Paan Khana • Fri, Nov 6',
      time: '08:00 PM onwards',
      title: 'Paan Khana Ceremony',
      location: 'Super Tower, Thana Road, Bhiwandi',
      description: 'An elegant gathering to celebrate the traditional Paan Khana ceremony and seek family blessings.',
      icon: <Coffee size={20} color="var(--gold-primary)" />,
    },
    // Day 3: Nikah Ceremony
    {
      day: 'Day 3: Nikah • Sat, Nov 7',
      time: '04:00 PM',
      title: 'Nikah Ceremony',
      location: 'Garden Hall',
      description: 'The solemnization of our marriage contract (Nikah) in the presence of our loved ones.',
      icon: <BookOpen size={20} color="var(--gold-primary)" />,
    },
    // Day 4: Walima Reception
    {
      day: 'Day 4: Walima • Sun, Nov 8',
      time: '07:00 PM',
      title: 'Walima Feast Reception',
      location: 'Parshuram Tawre Stadium, Gauri Pada, Bhiwandi',
      description: 'The grand wedding reception feast hosted by the groom\'s family to share in our joy.',
      icon: <Utensils size={20} color="var(--gold-primary)" />,
    },
  ];

  return (
    <div className="timeline-wrapper">
      <div className="timeline-line"></div>
      {events.map((event, index) => {
        const isEven = index % 2 === 0;
        return (
          <div key={index} className="timeline-item" style={{ justifyContent: isEven ? 'flex-start' : 'flex-end' }}>
            {/* Timeline Marker */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="timeline-marker"
            >
              {event.icon}
            </motion.div>

            {/* Event Details Card */}
            <motion.div
              initial={{
                opacity: 0,
                x: isEven ? -50 : 50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="timeline-card card-premium"
              style={{
                alignSelf: 'center',
                textAlign: isEven ? 'right' : 'left',
              }}
            >
              <div style={styles.dayHeader} className="font-serif">
                {event.day}
              </div>
              <div style={styles.timeBadge}>
                {event.time}
              </div>
              <h3 style={styles.eventTitle}>{event.title}</h3>
              <div style={styles.locationText}>{event.location}</div>
              <p style={styles.eventDesc}>{event.description}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  dayHeader: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--gold-primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '0.25rem',
  },
  timeBadge: {
    fontSize: '1.4rem',
    fontWeight: '400',
    color: 'var(--emerald-primary)',
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-serif)',
  },
  eventTitle: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: 'var(--text-dark)',
    marginBottom: '0.25rem',
    fontFamily: 'var(--font-sans)',
  },
  locationText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '0.75rem',
  },
  eventDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
};
