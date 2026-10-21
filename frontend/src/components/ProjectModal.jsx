import { X, CheckCircle2, Layers, Cpu, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

export const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;

    // Handle ESC key to dismiss
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent body background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="modal-backdrop-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        className="modal-content-enter"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          padding: '2rem',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.25rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--accent-cyan)',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '0.5rem',
              }}
            >
              <Sparkles size={14} />
              <span>{project.badge || project.category}</span>
            </div>
            <h2 id="modal-project-title" style={{ fontSize: '1.65rem', fontWeight: 800 }}>
              {project.name}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              {project.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project modal"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-rose)';
              e.currentTarget.style.color = 'var(--accent-rose)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Project Overview */}
          <div>
            <h3
              style={{
                fontSize: '1.1rem',
                marginBottom: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--accent-cyan)',
              }}
            >
              <Layers size={18} /> Overview & Objective
            </h3>
            <p style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>{project.overview}</p>
          </div>

          {/* Key Features */}
          {project.features && (
            <div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-emerald)',
                }}
              >
                <CheckCircle2 size={18} /> Key Features & Functional Modules
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {project.features.map((feat, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--accent-emerald)',
                        fontWeight: 'bold',
                        marginTop: '2px',
                      }}
                    >
                      ✓
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* My Contribution & Testing */}
          {project.contributions && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.05rem',
                  marginBottom: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-indigo)',
                }}
              >
                <Cpu size={18} /> Role, Development Work & Quality Assurance
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {project.contributions.map((contrib, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                    }}
                  >
                    <span style={{ color: 'var(--accent-indigo)' }}>•</span>
                    <span>{contrib}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology Stack */}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              Technologies & Libraries
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Availability Notice / Links */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <ShieldAlert size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <span>{project.availabilityNote}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <a href="#contact" className="btn btn-primary" onClick={onClose}>
            Discuss This Project
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
