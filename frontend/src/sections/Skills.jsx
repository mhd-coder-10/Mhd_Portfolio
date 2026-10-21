import React, { useState, useMemo, useRef } from 'react';
import {
  Layout,
  Server,
  Database,
  ShieldCheck,
  Share2,
  CheckSquare,
  Wrench,
  Sparkles,
  Terminal,
  Globe,
  Cloud,
  Code2,
  Zap,
  Cpu,
  Layers,
  Search,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SpotlightCard from '../components/SpotlightCard';
import useScrollReveal from '../hooks/useScrollReveal';
import { usePortfolioData } from '../context/PortfolioContext';

// Comprehensive Icon Map with robust fallbacks
const iconMap = {
  Layout,
  Server,
  Database,
  ShieldCheck,
  Share2,
  CheckSquare,
  Wrench,
  Sparkles,
  Terminal,
  Globe,
  Cloud,
  Code2,
  Zap,
  Cpu,
  Layers,
};



// Aesthetic Category Theme Colors
const getCategoryTheme = (categoryTitle = '') => {
  const cat = categoryTitle.toLowerCase();
  if (cat.includes('program') || cat.includes('language')) {
    return {
      accent: '#3b82f6',
      accentRgb: '59, 130, 246',
      bgGlow: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.25)',
    };
  }
  if (cat.includes('front')) {
    return {
      accent: '#38bdf8',
      accentRgb: '56, 189, 248',
      bgGlow: 'rgba(56, 189, 248, 0.1)',
      border: 'rgba(56, 189, 248, 0.25)',
    };
  }
  if (cat.includes('back') || cat.includes('real-time')) {
    return {
      accent: '#10b981',
      accentRgb: '16, 185, 129',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.25)',
    };
  }
  if (cat.includes('data') || cat.includes('cach')) {
    return {
      accent: '#a855f7',
      accentRgb: '168, 85, 247',
      bgGlow: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.25)',
    };
  }
  if (cat.includes('devops') || cat.includes('observ') || cat.includes('cloud')) {
    return {
      accent: '#06b6d4',
      accentRgb: '6, 182, 212',
      bgGlow: 'rgba(6, 182, 212, 0.1)',
      border: 'rgba(6, 182, 212, 0.25)',
    };
  }
  if (cat.includes('auth') || cat.includes('secur')) {
    return {
      accent: '#f43f5e',
      accentRgb: '244, 63, 94',
      bgGlow: 'rgba(244, 63, 94, 0.1)',
      border: 'rgba(244, 63, 94, 0.25)',
    };
  }
  if (cat.includes('state')) {
    return {
      accent: '#818cf8',
      accentRgb: '129, 140, 248',
      bgGlow: 'rgba(129, 140, 248, 0.1)',
      border: 'rgba(129, 140, 248, 0.25)',
    };
  }
  if (cat.includes('test')) {
    return {
      accent: '#f59e0b',
      accentRgb: '245, 158, 11',
      bgGlow: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
    };
  }
  if (cat.includes('tool') || cat.includes('concept')) {
    return {
      accent: '#14b8a6',
      accentRgb: '20, 184, 166',
      bgGlow: 'rgba(20, 184, 166, 0.1)',
      border: 'rgba(20, 184, 166, 0.25)',
    };
  }
  if (cat.includes('ai')) {
    return {
      accent: '#ec4899',
      accentRgb: '236, 72, 153',
      bgGlow: 'rgba(236, 72, 153, 0.1)',
      border: 'rgba(236, 72, 153, 0.25)',
    };
  }
  return {
    accent: '#38bdf8',
    accentRgb: '56, 189, 248',
    bgGlow: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.2)',
  };
};

export const Skills = () => {
  const { skillCategories } = usePortfolioData();
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all categories
  const categoriesList = useMemo(() => {
    return ['All', ...(skillCategories || []).map((cat) => cat.title)];
  }, [skillCategories]);

  // Total skills count
  const totalSkillsCount = useMemo(() => {
    return (skillCategories || []).reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  }, [skillCategories]);

  // Filter skills based on Category & Search Query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return (skillCategories || [])
      .map((cat) => {
        // Filter by category tab
        if (activeCategory !== 'All' && cat.title !== activeCategory) {
          return null;
        }

        // Filter skills within category by search
        const matchedSkills = (cat.skills || []).filter((skill) => {
          if (!q) return true;
          return (
            skill.name.toLowerCase().includes(q) ||
            (skill.desc && skill.desc.toLowerCase().includes(q)) ||
            (skill.level && skill.level.toLowerCase().includes(q)) ||
            cat.title.toLowerCase().includes(q)
          );
        });

        if (matchedSkills.length === 0) return null;

        return {
          ...cat,
          skills: matchedSkills,
        };
      })
      .filter(Boolean);
  }, [skillCategories, activeCategory, searchQuery]);



  return (
    <section id="skills" className="section" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div ref={headerRef} className={`reveal-item ${headerVisible ? 'revealed' : ''}`}>
          <SectionHeader
            tag="Technical Arsenal"
            title="Skills &"
            highlightedText="Competencies"
            description="Production-tested full-stack capabilities, modern component libraries, clean REST API architectures, and automated QA workflows."
          />
        </div>



        {/* =========================================================================
            2. INTERACTIVE CONTROLS (Category Filter Pills & Search Bar)
           ========================================================================= */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Top row: Search input & Active count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Real-time Search Input */}
            <div
              style={{
                position: 'relative',
                flex: '1 1 280px',
                maxWidth: '420px',
              }}
            >
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Filter technologies (e.g. React, MongoDB, Git)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 2.4rem 0.65rem 2.6rem',
                  fontSize: '0.88rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(14, 21, 38, 0.6)',
                  color: 'var(--text-primary)',
                  backdropFilter: 'blur(8px)',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                  }}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Total matching indicator */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing {filteredCategories.reduce((acc, cat) => acc + cat.skills.length, 0)} skills
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.55rem',
            }}
          >
            {categoriesList.map((catName) => {
              const isActive = activeCategory === catName;
              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => setActiveCategory(catName)}
                  style={{
                    padding: '0.45rem 1.05rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-full)',
                    border: isActive
                      ? '1px solid var(--accent-cyan)'
                      : '1px solid var(--border-subtle)',
                    background: isActive
                      ? 'rgba(56, 189, 248, 0.15)'
                      : 'rgba(255, 255, 255, 0.02)',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'var(--border-hover)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            3. MODERN SKILLS GRID (Sleek Glassmorphic Cards - No Clunky Inner Boxes)
           ========================================================================= */}
        {filteredCategories.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              background: 'rgba(14, 21, 38, 0.5)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--accent-cyan)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Search size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              No technologies found
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              No skills match your search query "{searchQuery}".
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem',
              alignItems: 'stretch',
            }}
          >
            {filteredCategories.map((category, idx) => {
              const IconComponent = iconMap[category.icon] || Layout;
              const theme = getCategoryTheme(category.title);

              return (
                <SpotlightCard
                  key={idx}
                  className="hover-lift"
                  spotlightColor={`rgba(${theme.accentRgb}, 0.12)`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'linear-gradient(180deg, rgba(14, 21, 38, 0.8) 0%, rgba(10, 16, 28, 0.8) 100%)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {/* Category Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.85rem',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          background: theme.bgGlow,
                          color: theme.accent,
                          border: `1px solid ${theme.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={18} />
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                        {category.title}
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {category.skills?.length || 0} items
                    </span>
                  </div>

                  {/* Clean, Non-Boxy Skill List */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      flex: 1,
                    }}
                  >
                    {(category.skills || []).map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'transparent',
                          border: '1px solid transparent',
                          borderLeft: `2px solid ${theme.border}`,
                          transition: 'all var(--transition-fast)',
                          cursor: 'default',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderLeftColor = theme.accent;
                          e.currentTarget.style.transform = 'translateX(3px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderLeftColor = theme.border;
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        {/* Title & Level Badge Row */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            marginBottom: skill.desc ? '0.25rem' : 0,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: '0.92rem',
                              color: 'var(--text-primary)',
                              letterSpacing: '-0.01em',
                            }}
                          >
                            {skill.name}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              color: theme.accent,
                              background: theme.bgGlow,
                              border: `1px solid ${theme.border}`,
                              padding: '0.12rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            {skill.level}
                          </span>
                        </div>

                        {/* Elegant Descriptor (Integrated, not in another box) */}
                        {skill.desc && (
                          <p
                            style={{
                              fontSize: '0.79rem',
                              color: 'var(--text-secondary)',
                              lineHeight: 1.45,
                              margin: 0,
                            }}
                          >
                            {skill.desc}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
