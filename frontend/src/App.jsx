import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { PortfolioProvider } from './context/PortfolioContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ToastProvider } from './admin/components/AdminToast';

// Public Page
import PublicPortfolio from './pages/PublicPortfolio';

// Admin Architecture
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';

// Admin Pages
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProfile from './admin/pages/AdminProfile';
import AdminHero from './admin/pages/AdminHero';
import AdminAbout from './admin/pages/AdminAbout';
import AdminExperience from './admin/pages/AdminExperience';
import AdminSkills from './admin/pages/AdminSkills';
import AdminProjects from './admin/pages/AdminProjects';
import AdminEducation from './admin/pages/AdminEducation';
import AdminCertifications from './admin/pages/AdminCertifications';
import AdminSocialLinks from './admin/pages/AdminSocialLinks';
import AdminContactSettings from './admin/pages/AdminContactSettings';
import AdminResume from './admin/pages/AdminResume';
import AdminMessages from './admin/pages/AdminMessages';
import AdminSettings from './admin/pages/AdminSettings';

export function App() {
  return (
    <PortfolioProvider>
      <AdminAuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Portfolio Route (Pixel-Perfect, Zero UI Regression) */}
              <Route path="/" element={<PublicPortfolio />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin CMS Area */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="certifications" element={<AdminCertifications />} />
                <Route path="social-links" element={<AdminSocialLinks />} />
                <Route path="contact-settings" element={<AdminContactSettings />} />
                <Route path="resume" element={<AdminResume />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Catch-all redirect to public portfolio */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AdminAuthProvider>
    </PortfolioProvider>
  );
}

export default App;
