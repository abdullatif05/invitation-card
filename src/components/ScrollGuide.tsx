import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

type BotMood = 'neutral' | 'thinking' | 'happy';

export default function ScrollGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaving, setIsWaving] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [activeSection, setActiveSection] = useState('hero');
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState<BotMood>('neutral');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Unique session ID for guest chat memory
  const sessionIdRef = useRef<string>(Math.random().toString(36).substring(2, 11));

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize greeting on load
  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: 'Assalamu Alaikum! I am Fareed, your AI coordinator. I am modeled directly after the cartoon assistant! Ask me any questions about Abdullatif & Ayesha\'s wedding events, schedules, lodging, or transport.',
      },
    ]);
  }, []);

  // Waving animation loop on mount & periodically
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 2000);

    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2000);
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(waveInterval);
    };
  }, []);

  // Auto-scroll to bottom of chat history
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Track active page section on scroll to update suggestion helper bubbles
  useEffect(() => {
    const sectionIds = ['hero', 'quran-verse', 'countdown', 'family', 'schedule', 'rsvp', 'location-cta'];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  // Client-side fallback query dictionary
  const getLocalFallbackReply = (query: string): string => {
    const text = query.toLowerCase().trim();

    if (text.includes('dua') || text.includes('prayer') || text.includes('bless') || text.includes('pray')) {
      return "A beautiful sunnah dua for the couple is: 'Barakallahu laka, wa baraka 'alayka, wa jama'a baynakuma fi khayr' (May Allah bless you, and bestow His blessings upon you, and bring you both together in goodness.)";
    }

    if (text.includes('groom') || text.includes('husband') || text.includes('abdullatif')) {
      return 'The groom is Abdullatif Khot, the beloved son of Mr. & Mrs. Zubair Khot. He is marrying Ayesha Kuwari!';
    }
    if (text.includes('bride') || text.includes('wife') || text.includes('ayesha')) {
      return 'The bride is Ayesha Kuwari, the beloved daughter of Mr. & Mrs. Sajid Kuwari. She is marrying Abdullatif Khot!';
    }
    if (text.includes('couple') || text.includes('names') || text.includes('who') || text.includes('marry') || text.includes('getting married')) {
      return 'This wedding invitation is for Groom Abdullatif Khot (son of Zubair Khot) and Bride Ayesha Kuwari (daughter of Sajid Kuwari). They are tying the knot on November 7 & 8, 2026!';
    }
    if (text.includes('parent') || text.includes('parents') || text.includes('father') || text.includes('mother') || text.includes('family') || text.includes('zubair') || text.includes('sajid')) {
      return 'The parents of the groom are Mr. & Mrs. Zubair Khot.\nThe parents of the bride are Mr. & Mrs. Sajid Kuwari.\nBoth families are excited to welcome you!';
    }
    if (text.includes('assalam') || text.includes('salam') || text.includes('slm')) {
      return 'Walaikum Assalam! May peace and blessings of Allah be upon you. How can I assist you with the Nikah or Walima preparations today?';
    }
    if (text.includes('when') || text.includes('date') || text.includes('time') || text.includes('program') || text.includes('schedule')) {
      if (text.includes('nikah') && !text.includes('walima') && !text.includes('mehndi')) {
        return 'The Nikah Ceremony is on Saturday, November 7th, 2026 at 4:00 PM.';
      }
      if (text.includes('walima') && !text.includes('nikah')) {
        return 'The Walima Reception is on Sunday, November 8th, 2026 at 7:00 PM.';
      }
      if (text.includes('mehndi') && !text.includes('nikah')) {
        return 'The Mehndi Ceremony is on Thursday, November 5th, 2026 after Maghrib.';
      }
      if (text.includes('paan') && !text.includes('nikah')) {
        return 'The Paan Khana Ceremony is on Friday, November 6th, 2026 at 8:00 PM.';
      }
      return 'Our 4-day wedding program is:\n• Nov 5 (Thu): Mehndi Ceremony - After Maghrib (Bride\'s Residence)\n• Nov 6 (Fri): Paan Khana Ceremony - Super Tower, Thana Road, Bhiwandi\n• Nov 7 (Sat): Nikah Ceremony - 4:00 PM (Garden Hall)\n• Nov 8 (Sun): Walima Reception - 7:00 PM (Parshuram Tawre Stadium, Gauri Pada, Bhiwandi)';
    }
    
    // Explicit single-event queries without "when/date"
    if (text.includes('only nikah') || (text.includes('nikah') && text.split(' ').length <= 4)) {
       return 'The Nikah Ceremony is on Saturday, November 7th, 2026 at 4:00 PM.';
    }
    if (text.includes('only walima') || (text.includes('walima') && text.split(' ').length <= 4)) {
       return 'The Walima Reception is on Sunday, November 8th, 2026 at 7:00 PM.';
    }

    if (text.includes('where') || text.includes('venue') || text.includes('location') || text.includes('address') || text.includes('stadium') || text.includes('tower') || text.includes('bhiwandi')) {
      return 'Our primary venues are:\n1. Paan Khana Ceremony: Super Tower, Thana Road, Bhiwandi (421302)\n2. Walima Reception: Parshuram Tawre Stadium, Gauri Pada, Bhiwandi (421305)\n\nNote: The Nikah ceremony is at Garden Hall (no specific address is listed). Map routing is available on our Location view!';
    }
    if (text.includes('rsvp') || text.includes('confirm') || text.includes('respond')) {
      return 'You can submit your RSVP directly on our website under the RSVP card. Kindly respond by May 15th, 2026 so we can confirm seat layouts and issue your digital VIP Pass.';
    }
    if (text.includes('stay') || text.includes('hotel') || text.includes('accommodation') || text.includes('room')) {
      return 'We have reserved room blocks with preferred rates for our guests in Thane and Bhiwandi. Use code "Khot-Kuwari Wedding" during booking. Details are on our Location page!';
    }
    if (text.includes('shuttle') || text.includes('bus') || text.includes('transport')) {
      return 'Complimentary guest shuttles will depart from Thane railway station and local lodging hotels directly to Gauri Pada Walima venue starting at 6:15 PM on Sunday.';
    }
    if (text.includes('valet') || text.includes('parking') || text.includes('car')) {
      return 'Complimentary valet parking starts at 6:30 PM on Sunday (Walima) at the stadium gates and on Friday (Paan Khana) at Super Tower.';
    }
    if (text.includes('food') || text.includes('menu') || text.includes('diet') || text.includes('halal') || text.includes('vegetarian')) {
      return 'All meals served are 100% Halal. We offer Halal Standard, Halal Vegetarian, Halal Vegan, and Gluten-Free menus. You can select your dining options when submitting your RSVP.';
    }
    if (text.includes('gift') || text.includes('registry') || text.includes('card')) {
      return 'Your presence and prayers are our greatest gift! If you wish to contribute, a card box will be set up at the welcome lounge.';
    }
    if (text.includes('dress') || text.includes('wear') || text.includes('clothes') || text.includes('code') || text.includes('color')) {
      return 'For our Nikah & Walima, elegant traditional/formal attire is recommended. Emerald Green, Champagne Gold, and Ivory Cream coordinates are highly appreciated!';
    }

    // Basic math evaluation for questions like "2 + 2 = ?"
    const mathMatch = text.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
    if (mathMatch) {
      try {
        const num1 = parseFloat(mathMatch[1]);
        const op = mathMatch[2];
        const num2 = parseFloat(mathMatch[3]);
        let result = 0;
        if (op === '+') result = num1 + num2;
        if (op === '-') result = num1 - num2;
        if (op === '*') result = num1 * num2;
        if (op === '/') result = num1 / num2;
        return `The answer is ${result}! (Now, ask me something about the wedding!)`;
      } catch (e) {
        // ignore
      }
    }

    return 'I am an AI specifically programmed for this wedding! I may not know the answer to everything, but I am happy to assist with the wedding dates, venue address, RSVPs, valet parking, shuttle departure times, dinner menu, or hotels.';
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    // Append user message
    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Trigger typing and thinking states
    setIsTyping(true);
    setMood('thinking');

    try {
      // Connect to Python FastAPI Backend Chat API
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          session_id: sessionIdRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      
      // Determine mood based on answer context
      const answer = data.reply;
      const lowerAnswer = answer.lowerCase || answer.toLowerCase();
      if (lowerAnswer.includes('congratulations') || lowerAnswer.includes('welcome') || lowerAnswer.includes('arrived') || lowerAnswer.includes('pleasure') || lowerAnswer.includes('walaikum')) {
        setMood('happy');
      } else {
        setMood('neutral');
      }

      // Smooth response animation delay
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'bot', text: answer }]);
        setIsTyping(false);
      }, 950);

    } catch (error) {
      console.warn('FastAPI backend down, falling back to local NLP parser.', error);
      
      // Local fallback parsing
      setTimeout(() => {
        const fallbackAnswer = getLocalFallbackReply(textToSend);
        setMessages((prev) => [...prev, { sender: 'bot', text: fallbackAnswer }]);
        setIsTyping(false);
        setMood('neutral');
      }, 750);
    }
  };

  const handleQuickSuggest = (topic: string) => {
    handleSendMessage(topic);
  };

  const getSectionBubbleText = () => {
    if (activeSection === 'hero') return 'Need help? I am Aylif, your AI Wedding assistant. Click me to chat!';
    if (activeSection === 'quran-verse') return 'This verse from Surah Ar-Rum highlights love and mercy. Ask me about the Nikah!';
    if (activeSection === 'countdown') return 'The countdown is live! Ask me when the Nikah starts.';
    if (activeSection === 'family') return 'Ask me about hotel reservations or lodging blocks for guests.';
    if (activeSection === 'schedule') return 'Check the 2-day schedule. Ask me about valet parking or shuttles!';
    if (activeSection === 'rsvp') return 'Please RSVP before May 15th, 2026. Ask me about menu options!';
    if (activeSection === 'location-cta') return 'Try our live GPS simulation. Ask me how to get directions!';
    return 'Click to ask me any questions!';
  };

  // Cartoon bot character modeled directly after the user reference image
  const renderSVGAvatar = (width = 64, height = 64) => {
    return (
      <motion.img
        src="./images/bot_avatar.png"
        alt="Aylif AI Assistant"
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top center', display: 'block' }}
      />
    );
  };

  return (
    <div style={styles.container}>
      <AnimatePresence>
        {isOpen ? (
          /* Expanded Chat Panel */
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={styles.chatCard}
            className="card-premium"
          >
            {/* Header */}
            <div style={styles.chatHeader}>
              <div style={styles.headerInfo}>
                <div style={styles.miniAvatarWrapper}>
                  {renderSVGAvatar(32, 32)}
                </div>
                <div>
                  <div style={styles.headerName} className="font-serif">Aylif</div>
                  <div style={styles.headerSub}>AI Wedding Coordinator</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={styles.closeBtn} aria-label="Minimize Chat">
                <X size={16} />
              </button>
            </div>

            {/* Chat History Messages */}
            <div className="chat-history">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-bubble ${msg.sender === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
              ))}
              
              {/* Flashing Typing Indicator */}
              {isTyping && (
                <div className="chat-bubble chat-bubble-bot" style={styles.typingBubble}>
                  <span className="dot-typing">.</span>
                  <span className="dot-typing">.</span>
                  <span className="dot-typing">.</span>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Suggestion Tags */}
            <div className="chat-suggestions">
              <button onClick={() => handleQuickSuggest('When is the Nikah & Walima?')} className="chat-tag">
                📅 Program Dates
              </button>
              <button onClick={() => handleQuickSuggest('Where is the venue?')} className="chat-tag">
                📍 Venue Address
              </button>
              <button onClick={() => handleQuickSuggest('Where to stay?')} className="chat-tag">
                🏨 Hotel Blocks
              </button>
              <button onClick={() => handleQuickSuggest('Is the food Halal?')} className="chat-tag">
                🍽️ Halal Food
              </button>
              <button onClick={() => handleQuickSuggest('Parking and shuttle info?')} className="chat-tag">
                🚗 Shuttles
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="chat-input-wrapper"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me something..."
                className="chat-input"
                disabled={isTyping}
              />
              <button type="submit" className="chat-send-btn" disabled={isTyping}>
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        ) : (
          /* Minimized state with speech bubble */
          <div style={styles.minimizedWrapper}>
            {/* Contextual speech bubble */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              style={styles.floatingBubble}
              className="card-premium glow-gold"
              onClick={() => setIsOpen(true)}
            >
              <div style={styles.arrow}></div>
              <p style={styles.bubbleText}>
                <Sparkles size={12} color="var(--gold-primary)" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                {getSectionBubbleText()}
              </p>
            </motion.div>

            {/* Programmatic SVG character avatar icon */}
            <div
              style={styles.avatarContainer}
              onClick={() => setIsOpen(true)}
              aria-label="Talk to Fareed AI assistant"
            >
              {renderSVGAvatar(68, 68)}
              <div style={styles.avatarOnline}></div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed' as const,
    bottom: '1.5rem',
    left: '1.5rem',
    zIndex: 998,
    maxWidth: '360px',
    width: 'calc(100vw - 3rem)',
  },
  chatCard: {
    width: '100%',
    maxHeight: '450px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    borderRadius: '16px',
    backgroundColor: '#fff',
    border: '2px solid var(--gold-primary)',
    boxShadow: 'var(--shadow-hover)',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px dashed var(--border-gold)',
    marginBottom: '0.75rem',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  miniAvatarWrapper: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald-tint)',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
  },
  headerName: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--emerald-primary)',
    lineHeight: '1.1',
  },
  headerSub: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  minimizedWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  floatingBubble: {
    padding: '0.75rem 1rem',
    backgroundColor: '#fff',
    border: '1px solid var(--border-gold)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-soft)',
    position: 'relative' as const,
    width: '100%',
  },
  arrow: {
    position: 'absolute' as const,
    bottom: '-8px',
    left: '25px',
    width: '0',
    height: '0',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '8px solid var(--gold-primary)',
  },
  bubbleText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.78rem',
    color: 'var(--text-dark)',
    lineHeight: '1.4',
    margin: 0,
  },
  avatarContainer: {
    position: 'relative' as const,
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    border: '2px solid var(--gold-primary)',
    backgroundColor: '#fff',
    boxShadow: 'var(--shadow-soft)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '10px',
    overflow: 'hidden',
  },
  avatarOnline: {
    position: 'absolute' as const,
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    border: '2px solid white',
    zIndex: 10,
  },
  typingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'var(--emerald-tint)',
    color: 'var(--emerald-primary)',
    border: '1px solid rgba(11, 60, 42, 0.1)',
    borderBottomLeftRadius: '2px',
    display: 'flex',
    gap: '3px',
    padding: '0.5rem 1rem',
  },
};
