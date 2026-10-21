import {
  Terminal,
  Heart,
  Mail,
  Phone,
  MessageSquare,
  ArrowUp,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, TelegramIcon } from '../components/SocialIcons';
import { usePortfolioData } from '../context/PortfolioContext';

export const Footer = () => {
  const { personalInfo, navigationLinks, socialLinks, settings } = usePortfolioData();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        padding: '4rem 0 2rem 0',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.35rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Terminal size={18} />
              </div>
              <span>
                {personalInfo.name}
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '380px', marginBottom: '1.25rem' }}>
              {settings?.footer?.description || 'Full-Stack MERN Developer specialized in scalable web architectures, secure RESTful APIs, and rigorous QA verification.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span className="status-dot" />
              <span>{settings?.footer?.statusText || 'Full-Stack Services Active & Available'}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Connect & Socials */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Connect & Inquiries
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <a
                href={socialLinks.email}
                style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Mail size={16} color="var(--accent-cyan)" />
                <span>{personalInfo.email}</span>
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#25d366')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <MessageSquare size={16} color="#25d366" />
                <span>WhatsApp: {socialLinks.formattedPhone}</span>
              </a>

              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#29b6f6')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <TelegramIcon size={16} color="#29b6f6" />
                <span>Telegram: {socialLinks.telegramUsername}</span>
              </a>

              <a
                href={socialLinks.phone}
                style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-indigo)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <Phone size={16} color="var(--accent-indigo)" />
                <span>Direct: {socialLinks.formattedPhone}</span>
              </a>
            </div>

            {/* Social Icons row */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {socialLinks.telegram ? (
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-btn"
                  title="Telegram Profile"
                  aria-label="Telegram"
                >
                  <TelegramIcon size={16} />
                </a>
              ) : null}
              {socialLinks.github ? (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                  <GithubIcon size={16} />
                </a>
              ) : null}
              {socialLinks.linkedin ? (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                  <LinkedinIcon size={16} />
                </a>
              ) : null}
              {socialLinks.instagram ? (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                  <InstagramIcon size={16} />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <span>Back to top</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
