import React from 'react';
import { Terminal, GitBranch, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const workflowSteps = [
  {
    icon: Terminal,
    title: '1. Modular Architecture & MVC',
    description:
      'Structure every service with distinct separation of Concerns: Models manage Mongoose schemas, Controllers handle business logic, and Routes orchestrate security middleware.',
    accent: 'var(--accent-cyan)',
  },
  {
    icon: Sparkles,
    title: '2. AI-Assisted Workflow Productivity',
    description:
      'Leverage AI tools purposefully to accelerate component boilerplate, speed up regex modeling, and investigate edge cases while maintaining full architectural ownership.',
    accent: 'var(--accent-indigo)',
  },
  {
    icon: Shield,
    title: '3. Rigorous API Contract Validation',
    description:
      'All incoming payloads are strictly validated for types, sanitization, and length limits before hitting database transactions. Zero unhandled promise rejections.',
    accent: 'var(--accent-emerald)',
  },
  {
    icon: CheckCircle2,
    title: '4. Functional Testing & QA Verification',
    description:
      'Systematic testing of user workflows, error states, and network boundaries with Postman collections to ensure zero regressions in production environments.',
    accent: 'var(--accent-violet)',
  },
];

export const Workflow = () => {
  return (
    <section id="workflow" className="section">
      <div className="container">
        <SectionHeader
          tag="Engineering Standards"
          title="Developer"
          highlightedText="Workflow"
          description="How I structure day-to-day engineering to ship maintainable code, eliminate runtime errors, and meet rigorous production standards."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="card hover-lift">
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.accent,
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={22} />
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: '0.9rem', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
