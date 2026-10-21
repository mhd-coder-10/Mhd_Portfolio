import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SectionHeader from '../components/SectionHeader';
import { submitContactMessage } from '../services/api';
import { TelegramIcon } from '../components/SocialIcons';
import { usePortfolioData } from '../context/PortfolioContext';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

// Strict validation patterns matching backend RFC 5322 & E.164 / Indian standards
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const nameRegex = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s.'-]{2,60}$/;

const validatePhoneNumber = (rawPhone) => {
  if (!rawPhone || typeof rawPhone !== 'string') return true;
  const trimmed = rawPhone.trim();
  if (trimmed === '') return true;

  const cleaned = trimmed.replace(/[\s\-\(\)]/g, '');

  // Reject strings with less than 10 digits or more than 15 digits
  if (!/^\+?[0-9]{10,15}$/.test(cleaned)) {
    return false;
  }

  // Reject bogus sequences like "0000000000" or "1111111111"
  if (/^(\+)?([0-9])\2{7,}$/.test(cleaned)) {
    return false;
  }

  // Indian standard mobile number: exactly 10 digits starting with 6, 7, 8, or 9
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // Indian number with leading 0: 0 + 10 digits starting with 6-9
  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // Indian number with 91 prefix: 91 + 10 digits starting with 6-9
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // Indian number with +91 prefix: +91 + 10 digits starting with 6-9
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return true;
  }

  // If it starts with +91 or 91 but didn't match the strict 10-digit Indian pattern above,
  // it is NOT a valid number (do not let it pass as generic international)
  if (cleaned.startsWith('+91') || (cleaned.startsWith('91') && cleaned.length > 10)) {
    return false;
  }

  // Non-Indian international format: starts with '+' and country code other than 91, with 10-15 digits
  if (/^\+[1-9]\d{9,14}$/.test(cleaned)) {
    return true;
  }

  return false;
};

export const Contact = () => {
  const { personalInfo, socialLinks } = usePortfolioData();
  const [formData, setFormData] = useState(initialFormData);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    subject: false,
    message: false,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const val = value !== undefined ? value : formData[name] || '';
    const trimmed = typeof val === 'string' ? val.trim() : '';

    switch (name) {
      case 'name':
        if (!trimmed) return 'Please provide your full name.';
        if (trimmed.length < 2) return 'Name must be at least 2 characters long.';
        if (trimmed.length > 60) return 'Name cannot exceed 60 characters.';
        if (/\d/.test(trimmed)) return 'Name cannot contain numbers.';
        if (!nameRegex.test(trimmed) || !/[a-zA-Z]/.test(trimmed)) {
          return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
        }
        return '';

      case 'email':
        if (!trimmed) return 'Please enter your email address.';
        if (trimmed.length > 100) return 'Email address cannot exceed 100 characters.';
        if (!trimmed.includes('@')) return "Email address must contain an '@' sign.";
        if (!emailRegex.test(trimmed) || trimmed.includes('..')) {
          return 'Please enter a valid email address (e.g., name@company.com).';
        }
        return '';

      case 'phone':
        if (trimmed.length > 0) {
          if (/[^\d+\s\-()]/.test(trimmed)) {
            return 'Phone number can only contain digits, +, spaces, and dashes.';
          }
          const digitsOnly = trimmed.replace(/\D/g, '');
          const hasPlus = trimmed.startsWith('+');

          if (!hasPlus) {
            if (digitsOnly.length < 10) {
              return `Mobile number must be 10 digits (currently ${digitsOnly.length}/10).`;
            }
            if (digitsOnly.length === 10 && !/^[6-9]/.test(digitsOnly)) {
              return 'Indian mobile numbers must start with 6, 7, 8, or 9.';
            }
          } else if (trimmed.startsWith('+91')) {
            const indianDigits = digitsOnly.slice(2);
            if (indianDigits.length < 10) {
              return `Mobile number must be 10 digits after +91 (currently ${indianDigits.length}/10).`;
            }
            if (indianDigits.length === 10 && !/^[6-9]/.test(indianDigits)) {
              return 'Mobile number must start with 6, 7, 8, or 9.';
            }
          } else {
            if (digitsOnly.length < 10) {
              return `International phone number must have at least 10 digits (currently ${digitsOnly.length}).`;
            }
          }

          if (/^(\+)?([0-9])\2{7,}$/.test(trimmed.replace(/[\s\-\(\)]/g, ''))) {
            return 'Please provide a valid phone number (not repeated digits).';
          }

          if (!validatePhoneNumber(trimmed)) {
            return 'Please enter a valid 10-digit mobile (e.g. 93165 15672 or +91 93165 15672).';
          }
        }
        return '';

      case 'subject':
        if (!trimmed) return 'Subject is required.';
        if (trimmed.length < 3) return 'Subject must be at least 3 characters.';
        if (trimmed.length > 120) return 'Subject cannot exceed 120 characters.';
        return '';

      case 'message':
        if (!trimmed) return 'Message is required.';
        if (trimmed.length < 10) return 'Message must be at least 10 characters long.';
        if (trimmed.length > 2000) return 'Message cannot exceed 2000 characters.';
        return '';

      default:
        return '';
    }
  };

  const getFieldState = (name) => {
    const isTouched = !!touched[name];
    const error = errors[name] || '';
    const hasError = isTouched && !!error;
    const value = formData[name] || '';
    const trimmed = typeof value === 'string' ? value.trim() : '';

    let isValid = false;
    if (isTouched && !error) {
      if (name === 'name') isValid = trimmed.length >= 2 && !validateField('name', value);
      else if (name === 'email') isValid = trimmed.length > 0 && !validateField('email', value);
      else if (name === 'phone') isValid = trimmed.length > 0 && !validateField('phone', value) && validatePhoneNumber(value);
      else if (name === 'subject') isValid = trimmed.length >= 3 && !validateField('subject', value);
      else if (name === 'message') isValid = trimmed.length >= 10 && trimmed.length <= 2000;
    }

    return { isTouched, hasError, isValid, error };
  };

  const getInputStyle = (hasError, isValid) => ({
    width: '100%',
    padding: '0.75rem 2.6rem 0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 255, 255, 0.03)',
    border: hasError
      ? '1px solid var(--accent-rose)'
      : isValid
      ? '1px solid rgba(16, 185, 129, 0.5)'
      : '1px solid var(--border-card)',
    boxShadow: hasError
      ? '0 0 0 3px rgba(244, 63, 94, 0.14)'
      : isValid
      ? '0 0 0 3px rgba(16, 185, 129, 0.1)'
      : 'none',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
  });

  const validate = () => {
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    };
    setTouched(allTouched);

    const newErrors = {};
    ['name', 'email', 'phone', 'subject', 'message'].forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = ['name', 'email', 'phone', 'subject', 'message'].find(
        (f) => newErrors[f]
      );
      if (firstErrorField) {
        document.getElementById(`contact-${firstErrorField}`)?.focus();
      }
      return false;
    }
    return true;
  };

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    // Immediately filter out non-phone characters (letters, brackets, punctuation)
    let sanitized = rawVal.replace(/[^\d+\s\-()]/g, '');

    // Allow '+' only as the very first character
    if (sanitized.includes('+')) {
      const startsWithPlus = sanitized.startsWith('+');
      sanitized = (startsWithPlus ? '+' : '') + sanitized.slice(startsWithPlus ? 1 : 0).replace(/\+/g, '');
    }

    const hasPlus = sanitized.startsWith('+');
    const digitsOnly = sanitized.replace(/\D/g, '');

    // Determine max allowed digits so user cannot type past the limit:
    // - Standard 10-digit mobile number: max 10 digits
    // - With leading '0': max 11 digits
    // - With '+91': max 12 digits (91 + 10 digits)
    // - Other international with '+': max 15 digits
    let maxDigits = 10;
    if (hasPlus) {
      if (sanitized.startsWith('+91')) {
        maxDigits = 12; // 91 + 10 digits
      } else {
        maxDigits = 15;
      }
    } else if (digitsOnly.startsWith('0')) {
      maxDigits = 11;
    } else if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
      maxDigits = 12;
    }

    // Auto-limit: If user types beyond max allowed digits, stop and prevent further input
    if (digitsOnly.length > maxDigits) {
      let count = 0;
      let truncated = '';
      for (const ch of sanitized) {
        if (/\d/.test(ch)) {
          if (count < maxDigits) {
            truncated += ch;
            count++;
          }
        } else {
          truncated += ch;
        }
      }
      sanitized = truncated;
    }

    setFormData((prev) => ({ ...prev, phone: sanitized }));
    setTouched((prev) => ({ ...prev, phone: true }));

    const errorMsg = validateField('phone', sanitized);
    setErrors((prev) => ({ ...prev, phone: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'name') {
      finalValue = value.replace(/\d/g, '');
      if (finalValue.length > 60) finalValue = finalValue.slice(0, 60);
    } else if (name === 'subject') {
      if (finalValue.length > 120) finalValue = finalValue.slice(0, 120);
    } else if (name === 'message') {
      if (finalValue.length > 2000) finalValue = finalValue.slice(0, 2000);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (touched[name] || (name === 'email' && finalValue.includes('@')) || finalValue.length >= 2) {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const errorMsg = validateField(name, finalValue);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await submitContactMessage(formData);
      setStatus({
        type: 'success',
        message: response.message || 'Your message has been sent successfully! I will get back to you shortly.',
      });
      setFormData(initialFormData);
      setTouched({
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false,
      });
      setErrors({});

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // Safe fallback
      }
    } catch (error) {
      if (error.fieldErrors) {
        setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
      }
      setStatus({
        type: 'error',
        message: error.message || 'Failed to submit form. Please check your entries and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader
          tag="Initiate Discussion"
          title="Get In"
          highlightedText="Touch"
          description="Have a role, client project, or technical opportunity? Send a message directly to my inbox or connect instantly via WhatsApp or Telegram."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Direct Communication Channels */}
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
              Direct Channels
            </h3>
            <p style={{ fontSize: '0.96rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Whether you are hiring for a Full-Stack MERN developer role, exploring custom business management software, or seeking API architectures, I am eager to connect.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {/* WhatsApp Quick Action Card */}
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderColor: 'rgba(37, 211, 102, 0.35)',
                  background: 'rgba(37, 211, 102, 0.04)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: '#25d366',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MessageSquare size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    FASTEST RESPONSE
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Chat on WhatsApp
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {socialLinks.formattedPhone}
                  </div>
                </div>
                <ExternalLink size={16} color="var(--accent-emerald)" />
              </a>

              {/* Telegram Quick Action Card */}
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderColor: 'rgba(0, 136, 204, 0.4)',
                  background: 'rgba(0, 136, 204, 0.05)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #0088cc, #29b6f6)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0, 136, 204, 0.25)',
                  }}
                >
                  <TelegramIcon size={22} color="#ffffff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    INSTANT CHAT & CALL
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Chat on Telegram
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {socialLinks.telegramUsername}
                  </div>
                </div>
                <ExternalLink size={16} color="#38bdf8" />
              </a>

              {/* Email Card */}
              <a
                href={socialLinks.email}
                className="card hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    EMAIL ADDRESS
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {personalInfo.email}
                  </div>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href={socialLinks.phone}
                className="card hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent-indigo)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    PHONE NUMBER
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {socialLinks.formattedPhone}
                  </div>
                </div>
              </a>

              {/* Location Card */}
              <div
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(168, 85, 247, 0.1)',
                    color: 'var(--accent-violet)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    LOCATION
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {personalInfo.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Send a Direct Message
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              All submissions are stored directly in MongoDB and processed securely.
            </p>

            {/* Status Notifications */}
            {status.message && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: '0.92rem',
                  background:
                    status.type === 'success'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(244, 63, 94, 0.1)',
                  border:
                    status.type === 'success'
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid rgba(244, 63, 94, 0.3)',
                  color:
                    status.type === 'success'
                      ? 'var(--accent-emerald)'
                      : 'var(--accent-rose)',
                }}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {(() => {
              const nameState = getFieldState('name');
              const emailState = getFieldState('email');
              const phoneState = getFieldState('phone');
              const subjectState = getFieldState('subject');
              const messageState = getFieldState('message');

              return (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Name & Email Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1.25rem',
                      marginBottom: '1.25rem',
                    }}
                    className="form-row"
                  >
                    <div>
                      <label
                        htmlFor="contact-name"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          marginBottom: '0.4rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span>
                          Your Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
                        </span>
                        {nameState.isValid && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <CheckCircle2 size={13} /> Valid
                          </span>
                        )}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. Alexander Vance"
                          required
                          autoComplete="name"
                          aria-invalid={nameState.hasError ? 'true' : 'false'}
                          aria-describedby={nameState.hasError ? 'contact-name-error' : undefined}
                          style={getInputStyle(nameState.hasError, nameState.isValid)}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            right: '0.85rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {nameState.hasError && <AlertCircle size={18} color="var(--accent-rose)" />}
                          {nameState.isValid && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
                        </div>
                      </div>
                      {nameState.hasError && (
                        <span
                          id="contact-name-error"
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--accent-rose)',
                            marginTop: '0.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {nameState.error}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          marginBottom: '0.4rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span>
                          Email Address <span style={{ color: 'var(--accent-rose)' }}>*</span>
                        </span>
                        {emailState.isValid && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <CheckCircle2 size={13} /> Valid
                          </span>
                        )}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="alex@company.com"
                          required
                          autoComplete="email"
                          aria-invalid={emailState.hasError ? 'true' : 'false'}
                          aria-describedby={emailState.hasError ? 'contact-email-error' : undefined}
                          style={getInputStyle(emailState.hasError, emailState.isValid)}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            right: '0.85rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {emailState.hasError && <AlertCircle size={18} color="var(--accent-rose)" />}
                          {emailState.isValid && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
                        </div>
                      </div>
                      {emailState.hasError && (
                        <span
                          id="contact-email-error"
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--accent-rose)',
                            marginTop: '0.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {emailState.error}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1.25rem',
                      marginBottom: '1.25rem',
                    }}
                    className="form-row"
                  >
                    <div>
                      <label
                        htmlFor="contact-phone"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          marginBottom: '0.4rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span>
                          Phone / WhatsApp <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(Optional)</span>
                        </span>
                        {phoneState.isValid && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <CheckCircle2 size={13} /> Valid
                          </span>
                        )}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="contact-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          onBlur={handleBlur}
                          placeholder="+91 93165 15672"
                          aria-invalid={phoneState.hasError ? 'true' : 'false'}
                          aria-describedby={phoneState.hasError ? 'contact-phone-error' : undefined}
                          style={getInputStyle(phoneState.hasError, phoneState.isValid)}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            right: '0.85rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {phoneState.hasError && <AlertCircle size={18} color="var(--accent-rose)" />}
                          {phoneState.isValid && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
                        </div>
                      </div>
                      {phoneState.hasError && (
                        <span
                          id="contact-phone-error"
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--accent-rose)',
                            marginTop: '0.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {phoneState.error}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          marginBottom: '0.4rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span>
                          Subject <span style={{ color: 'var(--accent-rose)' }}>*</span>
                        </span>
                        {subjectState.isValid && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                            <CheckCircle2 size={13} /> Valid
                          </span>
                        )}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="contact-subject"
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Full-Stack Developer Role Inquiry"
                          required
                          aria-invalid={subjectState.hasError ? 'true' : 'false'}
                          aria-describedby={subjectState.hasError ? 'contact-subject-error' : undefined}
                          style={getInputStyle(subjectState.hasError, subjectState.isValid)}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            right: '0.85rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {subjectState.hasError && <AlertCircle size={18} color="var(--accent-rose)" />}
                          {subjectState.isValid && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
                        </div>
                      </div>
                      {subjectState.hasError && (
                        <span
                          id="contact-subject-error"
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--accent-rose)',
                            marginTop: '0.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {subjectState.error}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <label
                      htmlFor="contact-message"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        marginBottom: '0.4rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>
                        Message <span style={{ color: 'var(--accent-rose)' }}>*</span>
                      </span>
                      {messageState.isValid && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                          <CheckCircle2 size={13} /> Valid
                        </span>
                      )}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Hi Momin, we reviewed your work and would like to discuss..."
                        required
                        aria-invalid={messageState.hasError ? 'true' : 'false'}
                        aria-describedby={messageState.hasError ? 'contact-message-error' : undefined}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: messageState.hasError
                            ? '1px solid var(--accent-rose)'
                            : messageState.isValid
                            ? '1px solid rgba(16, 185, 129, 0.5)'
                            : '1px solid var(--border-card)',
                          boxShadow: messageState.hasError
                            ? '0 0 0 3px rgba(244, 63, 94, 0.14)'
                            : messageState.isValid
                            ? '0 0 0 3px rgba(16, 185, 129, 0.1)'
                            : 'none',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          resize: 'vertical',
                          lineHeight: '1.6',
                          fontSize: '0.95rem',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        {messageState.hasError && (
                          <span
                            id="contact-message-error"
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--accent-rose)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                            }}
                          >
                            {messageState.error}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color:
                            formData.message.length > 2000 || (messageState.isTouched && formData.message.trim().length < 10)
                              ? 'var(--accent-rose)'
                              : formData.message.length >= 1900
                              ? '#f59e0b'
                              : 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          marginLeft: 'auto',
                        }}
                      >
                        {formData.message.length} / 2000
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      fontSize: '1rem',
                      opacity: loading ? 0.75 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Processing Submission...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message to Momin</span>
                      </>
                    )}
                  </button>
                </form>
              );
            })()}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 580px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
