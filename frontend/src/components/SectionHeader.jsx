import React from 'react';

export const SectionHeader = ({ tag, title, highlightedText, description }) => {
  return (
    <div className="section-header animate-fade-up">
      {tag && (
        <div className="section-tag">
          <span>//</span>
          <span>{tag}</span>
        </div>
      )}
      <h2 className="section-title">
        {title}{' '}
        {highlightedText && <span className="text-gradient">{highlightedText}</span>}
      </h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
};

export default SectionHeader;
