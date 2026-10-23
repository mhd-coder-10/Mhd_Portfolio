/**
 * Centralized API Service for Public Website and Admin Panel
 */

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || '';
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol } = window.location;
    const isEnvLocalhost = !envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1');

    // If accessing from mobile/LAN IP or host machine other than localhost
    if (isEnvLocalhost && hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      let backendPort = '5001';
      try {
        if (envUrl) {
          const parsed = new URL(envUrl);
          backendPort = parsed.port || '5001';
        }
      } catch {
        backendPort = '5001';
      }
      return `${protocol}//${hostname}:${backendPort}`;
    }
  }
  return envUrl || 'http://localhost:5001';
};

export const API_BASE_URL = getApiBaseUrl();

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// Helper for handling JSON API responses
const handleResponse = async (response) => {
  const result = await response.json();
  if (!response.ok) {
    const errorMsg = result.message || 'Request failed';
    const err = new Error(errorMsg);
    err.fieldErrors = result.errors;
    err.status = response.status;
    throw err;
  }
  return result;
};

/* ==========================================================================
   PUBLIC APIs
   ========================================================================== */

/**
 * Fetch unified public portfolio data
 */
export const fetchPublicPortfolio = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/public/portfolio`);
  return handleResponse(response);
};

/**
 * Submit contact form payload
 */
export const submitContactMessage = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your network or try again shortly.');
    }
    throw error;
  }
};

/**
 * Check backend health status
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return { healthy: false };
    return await response.json();
  } catch {
    return { healthy: false };
  }
};

/* ==========================================================================
   ADMIN AUTH & DASHBOARD APIs
   ========================================================================== */

export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const adminGetMe = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/me`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const adminChangePassword = async (token, currentPassword, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/change-password`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(response);
};

export const adminGetStats = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/stats`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

/* ==========================================================================
   PROFILE, HERO & ABOUT
   ========================================================================== */

export const adminGetProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profile`);
  return handleResponse(response);
};

export const adminUpdateProfile = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateHero = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profile/hero`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateAbout = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/profile/about`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/* ==========================================================================
   EXPERIENCE CRUD
   ========================================================================== */

export const adminGetExperiences = async (all = true) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/experiences?all=${all}`);
  return handleResponse(response);
};

export const adminCreateExperience = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/experiences`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateExperience = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/experiences/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminDeleteExperience = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/experiences/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const adminReorderExperiences = async (token, orders) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/experiences/reorder`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ orders }),
  });
  return handleResponse(response);
};

/* ==========================================================================
   SKILLS CRUD
   ========================================================================== */

export const adminGetSkills = async (all = true) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/skills?all=${all}`);
  return handleResponse(response);
};

export const adminCreateSkill = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/skills`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateSkill = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminDeleteSkill = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const adminReorderSkills = async (token, orders) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/skills/reorder`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ orders }),
  });
  return handleResponse(response);
};

export const adminUpdateCategory = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/skills/categories/update`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminDeleteCategory = async (token, categoryName) => {
  const enc = encodeURIComponent(categoryName);
  const response = await fetch(`${API_BASE_URL}/api/v1/skills/categories/delete?categoryName=${enc}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({ categoryName }),
  });
  return handleResponse(response);
};

/* ==========================================================================
   PROJECTS CRUD
   ========================================================================== */

export const adminGetProjects = async (all = true) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects?all=${all}`);
  return handleResponse(response);
};

export const adminCreateProject = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateProject = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminDeleteProject = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const adminReorderProjects = async (token, orders) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/reorder`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ orders }),
  });
  return handleResponse(response);
};

export const adminGetProjectCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/categories`);
  return handleResponse(response);
};

export const adminCreateProjectCategory = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/categories`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateProjectCategory = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminDeleteProjectCategory = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

/* ==========================================================================
   EDUCATION & LANGUAGES
   ========================================================================== */

export const adminGetEducation = async (all = true) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/education?all=${all}`);
  return handleResponse(response);
};

export const adminCreateEducation = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/education`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateEducation = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/education/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminDeleteEducation = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/education/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const adminUpdateLanguages = async (token, languages) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/education/languages`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ languages }),
  });
  return handleResponse(response);
};

/* ==========================================================================
   CERTIFICATIONS
   ========================================================================== */

export const adminGetCertifications = async (all = true) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/certifications?all=${all}`);
  return handleResponse(response);
};

export const adminCreateCertification = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/certifications`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateCertification = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/certifications/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminDeleteCertification = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/certifications/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

/* ==========================================================================
   SOCIAL LINKS
   ========================================================================== */

export const adminGetSocialLinks = async (all = true) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/social-links?all=${all}`);
  return handleResponse(response);
};

export const adminCreateSocialLink = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/social-links`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateSocialLink = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/social-links/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminDeleteSocialLink = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/social-links/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const adminReorderSocialLinks = async (token, orders) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/social-links/reorder`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ orders }),
  });
  return handleResponse(response);
};

/* ==========================================================================
   CONTACT SETTINGS (WhatsApp & Telegram)
   ========================================================================== */

export const adminGetContactSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/contact-settings`);
  return handleResponse(response);
};

export const adminUpdateContactSettings = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/contact-settings`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/* ==========================================================================
   WEBSITE SETTINGS & SEO
   ========================================================================== */

export const adminGetSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings`);
  return handleResponse(response);
};

export const adminUpdateSettings = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateSeo = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/seo`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateResumeSettings = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/resume`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const adminUpdateNavigation = async (token, navigationLinks) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings/navigation`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ navigationLinks }),
  });
  return handleResponse(response);
};

/* ==========================================================================
   MESSAGES MANAGEMENT
   ========================================================================== */

export const adminGetMessages = async (token, { page = 1, limit = 10, status = 'all', search = '' } = {}) => {
  const params = new URLSearchParams({ page, limit, status, search });
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/messages?${params.toString()}`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

export const adminUpdateMessageStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/messages/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

export const adminDeleteMessage = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/messages/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

/* ==========================================================================
   FILE UPLOADS
   ========================================================================== */

export const adminUploadImage = async (token, file, previousUrl = null) => {
  const formData = new FormData();
  formData.append('image', file);
  if (previousUrl) {
    formData.append('previousUrl', previousUrl);
  }
  const response = await fetch(`${API_BASE_URL}/api/v1/upload/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(response);
};

export const adminUploadResume = async (token, file, previousUrl = null) => {
  const formData = new FormData();
  formData.append('resume', file);
  if (previousUrl) {
    formData.append('previousUrl', previousUrl);
  }
  const response = await fetch(`${API_BASE_URL}/api/v1/upload/resume`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(response);
};

export const adminDeleteUploadedFile = async (token, url) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  });
  return handleResponse(response);
};

export const adminDeleteResume = async (token, url = null) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/upload/resume`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  });
  return handleResponse(response);
};

