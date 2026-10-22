import React, { useState, useEffect } from 'react';
import {
  ArrowDown,
  Download,
  Mail,
  Phone,
  MessageSquare,
  Terminal,
  Code2,
  CheckCircle2,
  Database,
  Sparkles,
  Zap,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, TelegramIcon } from '../components/SocialIcons';
import { checkApiHealth } from '../services/api';
import AnimatedCounter from '../components/AnimatedCounter';
import { usePortfolioData } from '../context/PortfolioContext';
import { useToast } from '../admin/components/AdminToast';

const defaultRotatingRoles = [
  'Full-Stack Developer (MERN)',
  'React.js UI & System Architect',
  'Scalable RESTful API Engineer',
  'MongoDB Data Modeling Specialist',
  'Functional Testing & QA Engineer',
];

export const Hero = () => {
  const { personalInfo, socialLinks } = usePortfolioData();
  const { showToast } = useToast();
  const rotatingRoles = personalInfo.hero?.rotatingRoles && personalInfo.hero.rotatingRoles.length > 0
    ? personalInfo.hero.rotatingRoles
    : defaultRotatingRoles;
  const stats = personalInfo.hero?.stats || { mcaCpi: 8.45, enterpriseApps: 3, qaReliability: 100, techStacks: 10 };

  const handleResumeDownload = async (e) => {
    e.preventDefault();
    if (!socialLinks?.resume || socialLinks?.resumeActive === false) {
      showToast('Resume file abhi exist nahi karta.', 'error');
      return;
    }

    try {
      const filename = socialLinks.resumeName || 'Momin-Mahmmadbhai-Resume.pdf';
      const response = await fetch(socialLinks.resume);
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      showToast('Resume file abhi exist nahi karta.', 'error');
    }
  };

  // Typewriter effect state
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, checking: true });

  // Dynamic Typewriter Logic
  useEffect(() => {
    const currentRole = rotatingRoles[roleIndex % rotatingRoles.length] || rotatingRoles[0];
    let timer;

    if (!isDeleting) {
      if (displayedText.length < currentRole.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        }, 75);
      } else {
        // Pause at end of role
        timer = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentRole.substring(0, displayedText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % rotatingRoles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex, rotatingRoles]);

  // Live Backend & Atlas Database ping
  useEffect(() => {
    let mounted = true;
    checkApiHealth().then((res) => {
      if (!mounted) return;
      if (res && res.database && res.database.status === 'connected') {
        setDbStatus({ connected: true, checking: false });
      } else {
        setDbStatus({ connected: false, checking: false });
      }
    }).catch(() => {
      if (mounted) setDbStatus({ connected: false, checking: false });
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '90px',
        paddingBottom: '50px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '3rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left Hero Content */}
          <div>
            {/* Availability Badge Row */}
            <div
              className="animate-fade-up"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Availability Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: 'var(--accent-emerald)',
                }}
              >
                <span className="status-dot live-neon" />
                <span>{personalInfo.hero?.badgeText || 'Available for Full-Stack Roles'}</span>
              </div>
            </div>

            {/* Developer Avatar Pill */}
            {personalInfo.profileImage && (
              <a
                href="#about"
                className="animate-fade-up delay-100"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  marginBottom: '1rem',
                  padding: '0.35rem 0.95rem 0.35rem 0.35rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(8px)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ position: 'relative', width: '44px', height: '44px' }}>
                  <img
                    src={personalInfo.profileImage || '/assets/profile-momin.jpg'}
                    alt={personalInfo.name}
                    onError={(e) => {
                      e.target.src = '/assets/profile-momin.jpg';
                    }}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                      border: '2px solid var(--accent-cyan)',
                      display: 'block',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-emerald)',
                      border: '2px solid #030712',
                      boxShadow: '0 0 6px var(--accent-emerald)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {personalInfo.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    MCA Graduate • Full-Stack MERN
                  </span>
                </div>
              </a>
            )}

            {/* Main Greeting & Name */}
            <h1
              className="animate-fade-up delay-100"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '1rem',
                letterSpacing: '-0.03em',
              }}
            >
              Hello, I'm <br />
              <span className="text-gradient">{personalInfo.name}</span>
            </h1>

            {/* Dynamic Typewriter Subtitle */}
            <div
              className="animate-fade-up delay-200"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
                color: 'var(--accent-cyan)',
                marginBottom: '1.5rem',
                fontWeight: 600,
                minHeight: '2rem',
              }}
            >
              <Code2 size={24} style={{ flexShrink: 0 }} />
              <span>
                {displayedText}
                <span className="typewriter-caret">|</span>
              </span>
            </div>

            {/* Headline Overview */}
            <p
              className="animate-fade-up delay-300"
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: '580px',
                marginBottom: '2rem',
              }}
            >
              {personalInfo.headline}
            </p>

            {/* Action CTAs */}
            <div
              className="animate-fade-up delay-400"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <a href={personalInfo.hero?.primaryCtaLink || '#projects'} className="btn btn-primary">
                <span>{personalInfo.hero?.primaryCtaText || 'View My Work'}</span>
                <ArrowDown size={17} />
              </a>

              <a
                href={socialLinks.resume || '#'}
                onClick={handleResumeDownload}
                className="btn btn-secondary"
                title={socialLinks.resumeActive ? "Download Resume" : "Resume abhi exist nahi karta"}
              >
                <Download size={17} />
                <span>{personalInfo.hero?.secondaryCtaText || 'Download Resume'}</span>
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                title="Chat with Mohammad on WhatsApp"
              >
                <MessageSquare size={17} />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-telegram"
                title="Chat with Mohammad on Telegram"
              >
                <TelegramIcon size={17} />
                <span>Chat on Telegram</span>
              </a>
            </div>

            {/* Key Metrics Counter Strip */}
            <div
              className="animate-fade-up delay-450"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                padding: '1.25rem 1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  <AnimatedCounter target={stats.mcaCpi || 8.45} decimals={2} duration={1400} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>MCA CPI</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)' }}>
                  <AnimatedCounter target={stats.enterpriseApps || 3} suffix="+" duration={1200} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Enterprise Apps</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  <AnimatedCounter target={stats.qaReliability || 100} suffix="%" duration={1600} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>QA Reliability</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>
                  <AnimatedCounter target={stats.techStacks || 10} suffix="+" duration={1400} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tech Stacks</div>
              </div>
            </div>

            {/* Social & Direct Contact Icons */}
            <div
              className="animate-fade-up delay-500"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.1rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CONNECT:
              </span>

              <a
                href={socialLinks.email}
                className="social-icon-btn"
                title="Send Email"
                aria-label="Send Email"
              >
                <Mail size={18} />
              </a>

              <a
                href={socialLinks.phone}
                className="social-icon-btn"
                title={`Call ${socialLinks.formattedPhone}`}
                aria-label="Phone Call"
              >
                <Phone size={18} />
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title="WhatsApp Direct Chat"
                aria-label="WhatsApp Direct"
              >
                <MessageSquare size={18} />
              </a>

              {socialLinks.github ? (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  title="GitHub Profile"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon size={18} />
                </a>
              ) : (
                <span
                  className="social-icon-btn disabled-social"
                  title="GitHub profile"
                  aria-label="GitHub"
                >
                  <GithubIcon size={18} />
                </span>
              )}

              {socialLinks.linkedin ? (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon size={18} />
                </a>
              ) : (
                <span
                  className="social-icon-btn disabled-social"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={18} />
                </span>
              )}

              {socialLinks.instagram ? (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  title="Instagram Profile"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon size={18} />
                </a>
              ) : (
                <span
                  className="social-icon-btn disabled-social"
                  title="Instagram Profile"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={18} />
                </span>
              )}

              {socialLinks.telegram && (
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  title="Telegram Profile"
                  aria-label="Telegram Profile"
                >
                  <TelegramIcon size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Right Hero Visual: Interactive Technical Card with Floating Badges */}
          <div className="hero-terminal-wrapper animate-scale-up delay-200" style={{ position: 'relative' }}>
            {/* Floating Badge 1 - Top Right */}
            <div
              className="float-element"
              style={{
                position: 'absolute',
                top: '-18px',
                right: '15px',
                zIndex: 10,
                background: 'rgba(14, 21, 38, 0.92)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                backdropFilter: 'blur(12px)',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
              }}
            >
              <Zap size={14} color="#f59e0b" />
              <span>Full-Stack MERN</span>
            </div>

            {/* Floating Badge 2 - Bottom Left */}
            <div
              className="float-element-reverse"
              style={{
                position: 'absolute',
                bottom: '-16px',
                left: '15px',
                zIndex: 10,
                background: 'rgba(14, 21, 38, 0.92)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                backdropFilter: 'blur(12px)',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-emerald)',
              }}
            >
              <Sparkles size={14} color="#10b981" />
              <span>Scalable REST APIs</span>
            </div>

            {/* Main Terminal Window */}
            <div
              className="card glass-panel"
              style={{
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-hover)',
                boxShadow: 'var(--shadow-indigo-glow)',
                padding: '0',
                overflow: 'hidden',
              }}
            >
              {/* Terminal Titlebar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'rgba(0, 0, 0, 0.25)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981' }} />
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Terminal size={14} />
                  <span>momin-profile.json</span>
                </div>
                <div style={{ width: '30px' }} />
              </div>

              {/* Terminal Code Body */}
              <div
                style={{
                  padding: '1.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.86rem',
                  lineHeight: 1.65,
                }}
              >
                <div>
                  <span style={{ color: 'var(--accent-violet)' }}>const</span>{' '}
                  <span style={{ color: 'var(--accent-cyan)' }}>developer</span> = &#123;
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#94a3b8' }}>name:</span>{' '}
                  <span style={{ color: '#34d399' }}>"{personalInfo.name}"</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#94a3b8' }}>title:</span>{' '}
                  <span style={{ color: '#38bdf8' }}>"{personalInfo.title}"</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#94a3b8' }}>stack:</span> [
                  <span style={{ color: '#fbbf24' }}>"React"</span>,{' '}
                  <span style={{ color: '#fbbf24' }}>"Node"</span>,{' '}
                  <span style={{ color: '#fbbf24' }}>"Express"</span>,{' '}
                  <span style={{ color: '#fbbf24' }}>"MongoDB Atlas"</span>],
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#94a3b8' }}>education:</span>{' '}
                  <span style={{ color: '#34d399' }}>"MCA (CPI: 8.45)"</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#94a3b8' }}>location:</span>{' '}
                  <span style={{ color: '#34d399' }}>"Gujarat, India"</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span style={{ color: '#94a3b8' }}>focus:</span>{' '}
                  <span style={{ color: '#38bdf8' }}>"Scalable APIs & Quality Testing"</span>
                </div>
                <div>&#125;;</div>

                {/* Live Strengths List */}
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" />
                    <span>REST APIs & Clean MVC Architecture</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span>JWT Authentication & Secure RBAC</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--accent-indigo)" />
                    <span>Functional Validation & QA Testing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-normal);
        }
        .social-icon-btn:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
          transform: translateY(-3px);
          box-shadow: var(--shadow-sm);
        }
        .disabled-social {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .disabled-social:hover {
          border-color: var(--border-card);
          color: var(--text-secondary);
          transform: none;
          box-shadow: none;
        }
        @media (max-width: 968px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-terminal-wrapper {
            max-width: 520px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
