import React, { useState } from 'react';
import { Award, CheckCircle2, FileText, ExternalLink, Eye, X, Calendar, ShieldCheck } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { usePortfolioData } from '../context/PortfolioContext';

export const Certification = () => {
  const { certificationData, certifications } = usePortfolioData();
  const [selectedImage, setSelectedImage] = useState(null);

  // Use array of certifications if available, otherwise single fallback
  const certList = (certifications && certifications.length > 0)
    ? certifications
    : (certificationData ? [certificationData] : []);

  if (certList.length === 0) return null;

  return (
    <section id="certification" className="section" style={{ paddingTop: '1rem' }}>
      <div className="container">
        <SectionHeader
          tag="Credentials"
          title="Professional"
          highlightedText="Certification"
          description="Structured industry training validating full-stack web engineering concepts and practical implementation."
        />

        <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {certList.map((cert, index) => {
            const hasMedia = Boolean(cert.certificateImage);
            const isPdf = typeof cert.certificateImage === 'string' && (
              cert.certificateImage.toLowerCase().endsWith('.pdf') ||
              cert.certificateImage.toLowerCase().includes('.pdf')
            );

            return (
              <div key={cert._id || index} className="card hover-lift cert-card">
                {/* Main Content Info */}
                <div className="cert-info-col">
                  {/* Badge & Issue Date Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <div className="cert-verified-pill">
                      <CheckCircle2 size={13} />
                      <span>Verified Completion</span>
                    </div>

                    {cert.issueDate && (
                      <div className="cert-date-badge">
                        <Calendar size={12} />
                        <span>Issued: {cert.issueDate}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="cert-title">
                    {cert.title}
                  </h3>

                  <h4 className="cert-institution">
                    {cert.institution}
                  </h4>

                  <p className="cert-desc">
                    {cert.description}
                  </p>

                  {/* Skills covered */}
                  {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                    <div className="cert-skills-wrap">
                      {cert.skillsCovered.map((skill, idx) => (
                        <span key={idx} className="tech-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* External verification URL button */}
                  {cert.certificateUrl && (
                    <div style={{ marginTop: '1.25rem' }}>
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary cert-verify-btn"
                      >
                        <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
                        <span>Verify Credential Online</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Attached Certificate Visual Preview (Image or PDF) */}
                {hasMedia && (
                  <div className="cert-media-col">
                    {isPdf ? (
                      /* PDF Certificate Card */
                      <div className="cert-pdf-box">
                        <div className="cert-pdf-icon-wrap">
                          <FileText size={38} className="cert-pdf-icon" />
                        </div>
                        <div className="cert-pdf-text">
                          <div className="cert-pdf-title">Official Certificate PDF</div>
                          <div className="cert-pdf-sub">Document Attachment</div>
                        </div>
                        <a
                          href={cert.certificateImage}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary cert-pdf-btn"
                          title="Open PDF Certificate in new tab"
                        >
                          <FileText size={14} />
                          <span>View PDF Certificate</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    ) : (
                      /* Image Certificate Card with Lightbox Trigger */
                      <div
                        className="cert-img-box"
                        onClick={() => setSelectedImage(cert.certificateImage)}
                        title="Click to view full certificate"
                      >
                        <img
                          src={cert.certificateImage}
                          alt={`${cert.title} certificate`}
                          className="cert-img-thumb"
                          loading="lazy"
                        />
                        <div className="cert-img-overlay">
                          <div className="cert-img-zoom-pill">
                            <Eye size={14} />
                            <span>View Certificate</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN CERTIFICATE IMAGE LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="cert-lightbox-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="cert-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-lightbox-header">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Verified Certificate
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                >
                  <ExternalLink size={13} />
                  <span>Open Full</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="cert-lightbox-close"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="cert-lightbox-body">
              <img
                src={selectedImage}
                alt="Full Certificate"
                className="cert-lightbox-img"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cert-card {
          padding: 2.25rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2.25rem;
          align-items: center;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-hover);
          background: var(--bg-card);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          position: relative;
          overflow: hidden;
        }

        .cert-info-col {
          min-width: 0;
          flex: 1;
        }

        .cert-verified-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          fontSize: 0.76rem;
          color: var(--accent-emerald);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 0.22rem 0.65rem;
          border-radius: var(--radius-full);
          fontWeight: 600;
          text-transform: uppercase;
        }

        .cert-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .cert-title {
          font-size: 1.45rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
          line-height: 1.3;
          color: var(--text-primary);
        }

        .cert-institution {
          font-size: 1.05rem;
          color: var(--accent-cyan);
          font-weight: 600;
          margin-bottom: 0.85rem;
        }

        .cert-desc {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }

        .cert-skills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          width: 100%;
        }

        .cert-verify-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          padding: 0.45rem 0.9rem;
        }

        /* Certificate Media (Image / PDF) Column */
        .cert-media-col {
          width: 260px;
          flex-shrink: 0;
        }

        /* Image preview box */
        .cert-img-box {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border-hover);
          background: var(--bg-surface);
          cursor: pointer;
          aspect-ratio: 4 / 3;
          display: flex;
          align-items: center;
          justifyContent: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .cert-img-box:hover {
          transform: translateY(-3px) scale(1.02);
          border-color: var(--accent-cyan);
        }

        .cert-img-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .cert-img-box:hover .cert-img-thumb {
          transform: scale(1.05);
        }

        .cert-img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(11, 17, 32, 0.65);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justifyContent: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .cert-img-box:hover .cert-img-overlay {
          opacity: 1;
        }

        .cert-img-zoom-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--accent-cyan);
          color: #0b0f19;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
          box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);
        }

        /* PDF Preview Card */
        .cert-pdf-box {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-lg);
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.85rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .cert-pdf-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          display: flex;
          align-items: center;
          justifyContent: center;
          color: #ef4444;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.2);
        }

        .cert-pdf-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cert-pdf-sub {
          font-size: 0.74rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          margin-top: 0.15rem;
        }

        .cert-pdf-btn {
          width: 100%;
          justify-content: center;
          font-size: 0.8rem;
          padding: 0.5rem 0.85rem;
          gap: 0.4rem;
        }

        /* Lightbox Modal */
        .cert-lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(5, 8, 16, 0.88);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          animation: fadeIn 0.2s ease-out;
        }

        .cert-lightbox-content {
          background: var(--bg-surface);
          border: 1px solid var(--border-hover);
          border-radius: var(--radius-lg);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
          overflow: hidden;
        }

        .cert-lightbox-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-card);
        }

        .cert-lightbox-close {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast);
        }

        .cert-lightbox-close:hover {
          color: var(--accent-rose);
        }

        .cert-lightbox-body {
          padding: 1rem;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b0f19;
        }

        .cert-lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }

        /* Responsive Breakpoints */
        @media (max-width: 820px) {
          .cert-card {
            grid-template-columns: 1fr;
            gap: 1.75rem;
            padding: 1.65rem 1.35rem;
          }
          .cert-media-col {
            width: 100%;
          }
          .cert-img-box {
            max-height: 280px;
          }
        }

        @media (max-width: 640px) {
          .cert-card {
            padding: 1.35rem 1.15rem !important;
            gap: 1.25rem !important;
          }
          .cert-title {
            font-size: 1.22rem !important;
          }
          .cert-institution {
            font-size: 0.95rem !important;
          }
          .cert-desc {
            font-size: 0.88rem !important;
            line-height: 1.6 !important;
          }
          .cert-pdf-box {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Certification;
