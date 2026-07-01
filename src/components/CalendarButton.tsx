import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Download } from 'lucide-react';

export default function CalendarButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const eventTitle = 'Wedding of Abdullatif & Ayesha';
  const eventDesc = 'You are cordially invited to celebrate the wedding of Abdullatif Khot and Ayesha Kuwari.';
  const eventLoc = 'Marriage Ground, Parshuram Tawre Stadium, Opp. Sportive Swimming Pool, New Gauri Pada, Kariwali, Bhiwandi - 421305';
  
  // November 7 & 8, 2026: Start Nov 7 4:00 PM, End Nov 8 11:00 PM
  const startTime = '20261107T160000';
  const endTime = '20261108T230000';

  // Google Calendar link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDesc)}&location=${encodeURIComponent(eventLoc)}`;

  // Dynamic .ics file download for Apple Calendar / Outlook
  const downloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KhotKuwari//IslamicWedding//EN',
      'BEGIN:VEVENT',
      'UID:wedding-abdullatif-ayesha-2027',
      'DTSTAMP:20260630T120000',
      'DTSTART:' + startTime,
      'DTEND:' + endTime,
      'SUMMARY:' + eventTitle,
      'DESCRIPTION:' + eventDesc,
      'LOCATION:' + eventLoc,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wedding-abdullatif-ayesha.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={styles.container}>
      <button onClick={() => setIsOpen(!isOpen)} className="btn-gold" style={styles.button}>
        <Calendar size={16} /> ADD TO CALENDAR <ChevronDown size={14} style={{ marginLeft: '0.25rem' }} />
      </button>

      {isOpen && (
        <div style={styles.dropdown} className="card-premium">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            style={styles.dropdownItem}
            className="dropdown-hover"
          >
            Google Calendar
          </a>
          <button onClick={downloadICS} style={styles.dropdownItem} className="dropdown-hover">
            <Download size={12} style={{ marginRight: '0.5rem' }} /> Apple / Outlook iCal
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative' as const,
    display: 'inline-block',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '110%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
    padding: '0.5rem',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-hover)',
    backgroundColor: '#fff',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    zIndex: 10,
    backdropFilter: 'blur(5px)',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-dark)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '500',
    textAlign: 'left' as const,
    textDecoration: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
};

// Add dropdown hover override style rules
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  .dropdown-hover:hover {
    background-color: var(--emerald-tint) !important;
    color: var(--emerald-primary) !important;
  }
`;
document.head.appendChild(styleSheet);
