import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useScrollSpy } from '../hooks/useScrollSpy';

// UI Components
import BackgroundMesh from '../components/BackgroundMesh';
import Navbar from '../components/Navbar';
import ProjectModal from '../components/ProjectModal';
import ScrollToTop from '../components/ScrollToTop';

// Sections
import Hero from '../sections/Hero';
import About from '../sections/About';
import Experience from '../sections/Experience';
import Skills from '../sections/Skills';
import Approach from '../sections/Approach';
import Projects from '../sections/Projects';
import Workflow from '../sections/Workflow';
import Education from '../sections/Education';
import Certification from '../sections/Certification';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';

const sectionIds = [
  'about',
  'experience',
  'skills',
  'approach',
  'projects',
  'education',
  'contact',
];

export function PublicPortfolio() {
  const { theme, toggleTheme } = useTheme();
  const activeSection = useScrollSpy(sectionIds, 150);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="app-layout" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Subtle Animated Background Mesh */}
      <BackgroundMesh />

      {/* Sticky Top Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        activeSection={activeSection}
      />

      {/* Main Portfolio Sections */}
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Approach />
        <Projects onSelectProject={(project) => setSelectedProject(project)} />
        <Workflow />
        <Education />
        <Certification />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default PublicPortfolio;
