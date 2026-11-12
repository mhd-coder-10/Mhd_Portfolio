import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  personalInfo as defaultPersonalInfo,
  educationData as defaultEducationData,
  languages as defaultLanguages,
  certificationData as defaultCertificationData,
  experiences as defaultExperiences,
  skillCategories as defaultSkillCategories,
  projects as defaultProjects,
  developmentApproach as defaultApproach,
  navigationLinks as defaultNavLinks,
} from '../config/portfolioData';
import defaultSocialLinks from '../config/socialLinks';
import { fetchPublicPortfolio, API_BASE_URL } from '../services/api';

const PortfolioContext = createContext(null);
const CACHE_KEY = 'momin_portfolio_public_cache';

const getInitialCachedData = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
};

export const PortfolioProvider = ({ children }) => {
  const cachedData = getInitialCachedData();

  const [personalInfo, setPersonalInfo] = useState(() => {
    if (cachedData?.profile) {
      return {
        ...defaultPersonalInfo,
        ...cachedData.profile,
        profileImage: cachedData.profile.profileImage || defaultPersonalInfo.profileImage,
        hero: cachedData.profile.hero || defaultPersonalInfo.hero,
        about: cachedData.profile.about || defaultPersonalInfo.about,
      };
    }
    return defaultPersonalInfo;
  });

  const [experiences, setExperiences] = useState(() => (Array.isArray(cachedData?.experiences) ? cachedData.experiences : defaultExperiences));
  const [skillCategories, setSkillCategories] = useState(() => (Array.isArray(cachedData?.skillCategories) ? cachedData.skillCategories : defaultSkillCategories));
  const [projects, setProjects] = useState(() => (Array.isArray(cachedData?.projects) ? cachedData.projects : defaultProjects));
  const [projectCategories, setProjectCategories] = useState(() => (Array.isArray(cachedData?.projectCategories) ? cachedData.projectCategories : []));
  const [educationData, setEducationData] = useState(() => (Array.isArray(cachedData?.education) ? cachedData.education : defaultEducationData));
  const [languages, setLanguages] = useState(() => (Array.isArray(cachedData?.languages) ? cachedData.languages : defaultLanguages));
  const [certificationData, setCertificationData] = useState(() => (cachedData?.certification || defaultCertificationData));
  const [certifications, setCertifications] = useState(() => (Array.isArray(cachedData?.certifications) ? cachedData.certifications : [defaultCertificationData]));
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [contactSettings, setContactSettings] = useState(() => cachedData?.contactSettings || null);
  const [settings, setSettings] = useState(() => cachedData?.settings || null);
  const [developmentApproach, setDevelopmentApproach] = useState(defaultApproach);
  const [navigationLinks, setNavigationLinks] = useState(defaultNavLinks);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (retryCount = 0) => {
    try {
      const res = await fetchPublicPortfolio();
      if (res && res.success && res.data) {
        const d = res.data;

        // Persist fresh data to localStorage cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(d));
        } catch (e) {}

        // 1. Personal & Hero & About Info
        if (d.profile) {
          setPersonalInfo({
            ...defaultPersonalInfo,
            ...d.profile,
            profileImage: d.profile.profileImage || defaultPersonalInfo.profileImage,
            hero: d.profile.hero || defaultPersonalInfo.hero,
            about: d.profile.about || defaultPersonalInfo.about,
          });
        }

        // 2. Experiences
        if (Array.isArray(d.experiences)) {
          setExperiences(d.experiences);
        }

        // 3. Skill Categories
        if (Array.isArray(d.skillCategories)) {
          setSkillCategories(d.skillCategories);
        }

        // 4. Projects & Categories
        if (Array.isArray(d.projects)) {
          setProjects(d.projects);
        }
        if (Array.isArray(d.projectCategories)) {
          setProjectCategories(d.projectCategories);
        }

        // 5. Education & Languages
        if (Array.isArray(d.education)) {
          setEducationData(d.education);
        }
        if (Array.isArray(d.languages)) {
          setLanguages(d.languages);
        }

        // 6. Certifications
        if (Array.isArray(d.certifications) && d.certifications.length > 0) {
          setCertifications(d.certifications);
          setCertificationData(d.certifications[0]);
        } else if (d.certification) {
          setCertifications([d.certification]);
          setCertificationData(d.certification);
        }

        // 7. Contact Settings & Dynamic WhatsApp / Telegram URLs
        if (d.contactSettings) {
          setContactSettings(d.contactSettings);
          const cs = d.contactSettings;

          const rawPhone = cs.whatsapp?.rawPhone || '9316515672';
          const countryCode = cs.whatsapp?.countryCode || '91';
          const waMsg = encodeURIComponent(cs.whatsapp?.prefilledMessage || '');
          const tgMsg = encodeURIComponent(cs.telegram?.prefilledMessage || '');
          const tgUser = cs.telegram?.username?.replace('@', '') || 'Mohammad_041';

          // Build dynamic socialLinks object matching exact frontend expectations
          const updatedSocialLinks = {
            ...defaultSocialLinks,
            rawPhone: cs.phone || rawPhone,
            formattedPhone: cs.formattedPhone || `+${countryCode} ${rawPhone}`,
            phone: `tel:${cs.phone || rawPhone}`,
            rawEmail: cs.publicEmail || defaultSocialLinks.rawEmail,
            email: `mailto:${cs.publicEmail || defaultSocialLinks.rawEmail}`,
            whatsapp: `https://wa.me/${countryCode}${rawPhone}?text=${waMsg}`,
            telegram: `https://telegram.me/${tgUser}?text=${tgMsg}`,
            telegramApp: `tg://resolve?domain=${tgUser}&text=${tgMsg}`,
            telegramProfile: `https://telegram.me/${tgUser}`,
            telegramUsername: `@${tgUser}`,
          };

          // Override external platforms if provided in socialLinks collection
          if (d.socialLinks && d.socialLinks.length > 0) {
            d.socialLinks.forEach((item) => {
              if (item.platform === 'github') updatedSocialLinks.github = item.url;
              if (item.platform === 'linkedin') updatedSocialLinks.linkedin = item.url;
              if (item.platform === 'instagram') updatedSocialLinks.instagram = item.url;
            });
          }

          // Resume dynamic path: link to active resume or empty if deleted/inactive
          const resumeUrl = d.settings?.resume?.url || '';
          const isResumeActive = d.settings?.resume?.isDownloadActive !== false;
          updatedSocialLinks.resume = resumeUrl;
          updatedSocialLinks.resumeActive = Boolean(resumeUrl && isResumeActive);
          updatedSocialLinks.resumeName = d.settings?.resume?.fileName || 'Momin-Mahmmadbhai-Resume.pdf';

          setSocialLinks(updatedSocialLinks);
        }

        // 8. General Settings (Navigation, SEO, Footer, Approach)
        if (d.settings) {
          setSettings(d.settings);

          if (d.settings.navigationLinks && d.settings.navigationLinks.length > 0) {
            setNavigationLinks(d.settings.navigationLinks.filter((n) => n.isActive !== false));
          }

          if (d.settings.approachSteps && d.settings.approachSteps.length > 0) {
            setDevelopmentApproach(d.settings.approachSteps);
          }

          // Dynamic SEO meta tags update
          if (d.settings.seo) {
            if (d.settings.seo.siteTitle) {
              document.title = d.settings.seo.siteTitle;
            }
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && d.settings.seo.metaDescription) {
              metaDesc.setAttribute('content', d.settings.seo.metaDescription);
            }
          }
        }
      }
    } catch (err) {
      console.warn('[PortfolioContext] Live fetch notice:', err.message);
      // Auto-retry for Render cloud cold-starts (retries up to 4 times with backoff)
      if (retryCount < 4) {
        const delay = Math.min(3000 * Math.pow(1.5, retryCount), 12000);
        setTimeout(() => {
          loadData(retryCount + 1);
        }, delay);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        experiences,
        skillCategories,
        projects,
        projectCategories,
        educationData,
        languages,
        certificationData,
        certifications,
        socialLinks,
        contactSettings,
        settings,
        developmentApproach,
        navigationLinks,
        loading,
        refreshPortfolio: loadData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioProvider');
  }
  return context;
};

export default PortfolioContext;
