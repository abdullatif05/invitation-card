import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, Ticket } from 'lucide-react';
import Swal from 'sweetalert2';

interface RSVPData {
  fullName: string;
  email: string;
  contactNumber: string;
  location: string;
  familyMembers: string;
}

export default function RSVPForm() {
  const [formData, setFormData] = useState<RSVPData>({
    fullName: '',
    email: '',
    contactNumber: '',
    location: '',
    familyMembers: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof RSVPData, string>> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\+?[\d\s\-()]{7,16}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.familyMembers.trim()) {
      newErrors.familyMembers = 'Please specify family member details';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof RSVPData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const triggerGoldConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#EBD391', '#0B3C2A', '#FAF7F0'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#EBD391', '#0B3C2A', '#FAF7F0'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbzr-170IOnYQAKuF4l5rq-knZmOY6HOisT3m5DaHxeWYAhUik3ZukU7zsTOM278V8cM/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            contactNumber: formData.contactNumber,
            location: formData.location,
            familyMembers: formData.familyMembers,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        triggerGoldConfetti();
        Swal.fire({
          title: 'Success!',
          text: 'Thank you for your submission. Please check your email to receive your invitation card.',
          icon: 'success',
          confirmButtonColor: '#0B3C2A',
        });
        setFormData({
          fullName: '',
          email: '',
          contactNumber: '',
          location: '',
          familyMembers: '',
        });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#0B3C2A',
      });
    } finally {
      setLoading(false);
    }
  };




  return (
    <div style={styles.formContainer} className="card-premium">
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="timestamp" value={new Date().toISOString()} />
        <div className="form-group">
          <label htmlFor="rsvp-fullname" className="form-label">Full Name</label>
          <input
            id="rsvp-fullname"
            name="fullName"
            type="text"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Abdullatif Khot"
            disabled={loading}
          />
          {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rsvp-email" className="form-label">Email Address</label>
          <input
            id="rsvp-email"
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. name@example.com"
            disabled={loading}
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rsvp-contact" className="form-label">Contact Number</label>
          <input
            id="rsvp-contact"
            name="contactNumber"
            type="tel"
            className="form-control"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="e.g. +91 9876543210"
            disabled={loading}
          />
          {errors.contactNumber && <span style={styles.errorText}>{errors.contactNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rsvp-location" className="form-label">Where Are You Coming From?</label>
          <input
            id="rsvp-location"
            name="location"
            type="text"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Mumbai, Maharashtra"
            disabled={loading}
          />
          {errors.location && <span style={styles.errorText}>{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rsvp-family" className="form-label">Family Member Details (please specify who will be attending)</label>
          <textarea
            id="rsvp-family"
            name="familyMembers"
            className="form-control"
            value={formData.familyMembers}
            onChange={handleChange}
            placeholder="e.g. Self, Wife and 2 Kids..."
            rows={4}
            style={{ resize: 'vertical' }}
            disabled={loading}
          />
          {errors.familyMembers && <span style={styles.errorText}>{errors.familyMembers}</span>}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn-gold"
            disabled={loading}
            style={loading ? styles.btnDisabled : undefined}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span> Sending...
              </>
            ) : (
              <>
                Get Invitation Card <Send size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  formContainer: {
    width: '100%',
    maxWidth: '650px',
    margin: '0 auto',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    display: 'block',
    fontFamily: 'var(--font-sans)',
  },
  btnDisabled: {
    opacity: 0.8,
    cursor: 'not-allowed',
    transform: 'none',
  },
  spinner: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
  },
  successContainer: {
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
  },
  ticketCard: {
    width: '100%',
    maxWidth: '500px',
    padding: '2.5rem 2rem',
    backgroundColor: '#fff',
    border: '2px solid var(--gold-primary)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: 'var(--shadow-hover)',
    position: 'relative' as const,
  },
  ticketHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '1rem',
    borderBottom: '1px dashed var(--border-gold)',
    marginBottom: '1.5rem',
  },
  ticketHeading: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--emerald-primary)',
    letterSpacing: '0.1em',
  },
  confirmedBadge: {
    backgroundColor: 'var(--emerald-primary)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: '700',
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  ticketBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  ticketRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  ticketLabel: {
    fontSize: '0.65rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    marginBottom: '0.15rem',
  },
  ticketVal: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-dark)',
  },
  barcodeWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px dashed var(--border-gold)',
  },
  barcodeLines: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeText: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.25rem',
    letterSpacing: '0.25em',
  },
  ticketInstructions: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textAlign: 'center' as const,
    marginTop: '1.5rem',
    fontStyle: 'italic',
    lineHeight: '1.4',
  },
  declineCard: {
    textAlign: 'center' as const,
    maxWidth: '500px',
    width: '100%',
    padding: '3rem 2rem',
  },
};
