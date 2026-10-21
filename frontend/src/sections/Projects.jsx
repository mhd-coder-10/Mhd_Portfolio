import React, { useState, useMemo } from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, Filter, Code2, Database, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SpotlightCard from '../components/SpotlightCard';
import useScrollReveal from '../hooks/useScrollReveal';
import { usePortfolioData } from '../context/PortfolioContext';

export const Projects = ({ onSelectProject }) => {
  const { projects } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 });
  const [expandedProjects, setExpandedProjects] = useState({});

  const toggleExpandTech = (key) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const categories = useMemo(() => {
    const set = new Set(['All']);
    (projects || []).forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return (projects || []).filter((project) => {
      if (activeCategory === 'All') return true;
      return project.category === activeCategory;
    });
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div ref={headerRef} className={`reveal-item ${headerVisible ? 'revealed' : ''}`}>
          <SectionHeader
            tag="Portfolio Showcase"
            title="Featured"
            highlightedText="Projects"
            description="Real-time WebRTC collaboration platforms and AI-powered intelligence applications developed with modern full-stack engineering."
          />
        </div>

        {/* Filter Categories Pill Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginBottom: '3rem',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`btn filter-tab-pill ${activeCategory === cat ? 'active' : 'btn-secondary'}`}
              style={{
                padding: '0.45rem 1.15rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 500,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          {(filteredProjects || []).map((project, index) => {
            const projectKey = project._id || project.id || `proj-${index}`;
            const isTechExpanded = Boolean(expandedProjects[projectKey]);
            const visibleTechs = isTechExpanded
              ? project.technologies
              : project.technologies.slice(0, 7);

            return (
              <SpotlightCard
                key={projectKey}
                className="project-card hover-lift"
                spotlightColor="rgba(56, 189, 248, 0.16)"
                style={{
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
              >
                <div className="project-card-grid">
                  {/* Left Column: Details */}
                  <div>
                  {/* Category & Status Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--accent-cyan)',
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {project.category}
                    </span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      • {project.status}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: 800,
                      marginBottom: '0.75rem',
                      lineHeight: 1.25,
                    }}
                  >
                    {project.name}
                  </h3>

                  {/* Tagline / Overview */}
                  <p
                    style={{
                      fontSize: '1rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      marginBottom: '1.25rem',
                    }}
                  >
                    {project.tagline}
                  </p>

                  {/* Top Features Highlights */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {project.features.slice(0, 3).map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <CheckCircle2
                            size={15}
                            color="var(--accent-emerald)"
                            style={{ flexShrink: 0, marginTop: '3px' }}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies Badges */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.45rem',
                      marginBottom: '1.75rem',
                      alignItems: 'center',
                    }}
                  >
                    {visibleTechs.map((tech, tIdx) => (
                      <span key={tIdx} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 7 && (
                      <button
                        type="button"
                        onClick={() => toggleExpandTech(projectKey)}
                        className="tech-badge"
                        style={{
                          cursor: 'pointer',
                          color: isTechExpanded ? '#f43f5e' : 'var(--accent-cyan)',
                          borderColor: isTechExpanded ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)',
                          background: isTechExpanded ? 'rgba(244, 63, 94, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          transition: 'all var(--transition-fast)',
                        }}
                        title={isTechExpanded ? 'Show fewer technologies' : 'Show all technologies'}
                      >
                        {isTechExpanded ? (
                          <>
                            <span>Show Less</span>
                            <ChevronUp size={13} />
                          </>
                        ) : (
                          <>
                            <span>+{project.technologies.length - 7} more</span>
                            <ChevronDown size={13} />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                {/* Action CTA buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                  {project.hasDemo && project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight size={15} />
                    </a>
                  )}

                  {project.hasGithub && project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <span>Source Code</span>
                      <ArrowUpRight size={15} />
                    </a>
                  )}

                  {project.availabilityNote && (
                    <span
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      🔒 {project.availabilityNote}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Architectural Visual Highlight */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
                className="project-visual-card"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--accent-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Code2 size={14} />
                    <span>PROJECT OVERVIEW</span>
                  </span>
                  <Sparkles size={16} color="var(--accent-cyan)" />
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {project.overview || project.tagline}
                </div>

                <div
                  style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <ShieldCheck size={16} color="var(--accent-emerald)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Quality & Validation Standard
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Rigorous functional testing, MongoDB Atlas schema validation, and end-to-end workflow verification.
                  </p>
                </div>
              </div>
            </div>
            </SpotlightCard>
          );
        })}
        </div>
      </div>

      <style>{`
        .project-card-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.95fr);
          gap: 2.5rem;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 992px) {
          .project-card {
            padding: 1.35rem !important;
          }
          .project-card-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;
