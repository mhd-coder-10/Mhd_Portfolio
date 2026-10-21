import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds = [], offset = 120) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    let ticking = false;

    const calculateActiveSection = () => {
      const scrollPosition = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            ticking = false;
            return;
          }
        }
      }

      // Default to top if scrolled above first section
      if (window.scrollY < 200) {
        setActiveSection('');
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateActiveSection();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
};

export default useScrollSpy;
