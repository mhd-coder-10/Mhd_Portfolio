import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Loader2,
  X,
  Save,
  Layers,
  Sparkles,
  ListFilter,
  FolderKanban,
  Tag,
} from 'lucide-react';
import { GithubIcon } from '../../components/SocialIcons';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetProjectCategories,
  adminCreateProjectCategory,
  adminUpdateProjectCategory,
  adminDeleteProjectCategory,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { ImageUploader } from '../components/ImageUploader';

const initialProjectState = {
  name: '',
  badge: 'Featured Case Study',
  tagline: '',
  overview: '',
  category: 'MERN Stack',
  status: 'Production System',
  technologies: [],
  features: [],
  contributions: [],
  image: '',
  hasDemo: false,
  demoUrl: '',
  hasGithub: false,
  githubUrl: '',
  availabilityNote: 'Code repository and architecture demo available upon professional inquiry.',
  featured: true,
  isActive: true,
  displayOrder: 0,
};

export const AdminProjects = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  // Tab state: 'projects' or 'categories'
  const [activeTab, setActiveTab] = useState('projects');

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Project Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialProjectState);
  const [saving, setSaving] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Project Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
  });
  const [savingCategory, setSavingCategory] = useState(false);

  // Category Delete Modal state
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  // Dynamic input helpers
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [expandedAdminTechs, setExpandedAdminTechs] = useState({});

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await adminGetProjects(true);
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      showToast('Failed to load projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await adminGetProjectCategories();
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load project categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      displayOrder: categories.length + 1,
    });
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name || '',
      description: cat.description || '',
      displayOrder: cat.displayOrder || 0,
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const trimmed = categoryFormData.name.trim();
    if (!trimmed) {
      showToast('Category name is required.', 'error');
      return;
    }

    setSavingCategory(true);
    try {
      if (editingCategory) {
        const res = await adminUpdateProjectCategory(token, editingCategory._id, {
          name: trimmed,
          description: categoryFormData.description,
          displayOrder: categoryFormData.displayOrder,
        });
        if (res.success) {
          showToast(`Category "${trimmed}" updated successfully!`, 'success');
          setCategoryModalOpen(false);
          fetchCategories();
          fetchProjects();
          refreshPortfolio();
        }
      } else {
        const res = await adminCreateProjectCategory(token, {
          name: trimmed,
          description: categoryFormData.description,
          displayOrder: categoryFormData.displayOrder,
        });
        if (res.success) {
          showToast(`Category "${trimmed}" created successfully!`, 'success');
          setCategoryModalOpen(false);
          fetchCategories();
          refreshPortfolio();
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to save category.', 'error');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleOpenDeleteCategory = (cat) => {
    setCategoryToDelete(cat);
    setDeleteCategoryModalOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeletingCategory(true);
    try {
      const res = await adminDeleteProjectCategory(token, categoryToDelete._id);
      if (res.success) {
        showToast(res.message || 'Category deleted successfully.', 'success');
        setDeleteCategoryModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
        fetchProjects();
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete category.', 'error');
    } finally {
      setDeletingCategory(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    const defaultCat = categories.length > 0 ? categories[0].name : 'MERN Stack';
    setFormData({
      ...initialProjectState,
      category: defaultCat,
      displayOrder: projects.length,
    });
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setTechInput('');
    setFeatureInput('');
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingId(project._id);
    const catExists = categories.some((c) => c.name === project.category);
    setIsCustomCategory(!catExists && Boolean(project.category));
    setCustomCategoryInput(!catExists && Boolean(project.category) ? project.category : '');
    setFormData({
      name: project.name || '',
      badge: project.badge || '',
      tagline: project.tagline || '',
      overview: project.overview || '',
      category: project.category || (categories[0]?.name || 'MERN Stack'),
      status: project.status || 'Production System',
      technologies: Array.isArray(project.technologies) ? [...project.technologies] : [],
      features: Array.isArray(project.features) ? [...project.features] : [],
      contributions: Array.isArray(project.contributions) ? [...project.contributions] : [],
      image: project.image || '',
      hasDemo: Boolean(project.hasDemo),
      demoUrl: project.demoUrl || '',
      hasGithub: Boolean(project.hasGithub),
      githubUrl: project.githubUrl || '',
      availabilityNote: project.availabilityNote || '',
      featured: project.featured !== undefined ? project.featured : true,
      isActive: project.isActive !== undefined ? project.isActive : true,
      displayOrder: project.displayOrder || 0,
    });
    setTechInput('');
    setFeatureInput('');
    setModalOpen(true);
  };

  const handleAddTech = (e) => {
    if (e && e.key && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = techInput.trim();
    if (!trimmed) return;
    if (!formData.technologies.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, technologies: [...prev.technologies, trimmed] }));
    }
    setTechInput('');
  };

  const handleRemoveTech = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleAddFeature = (e) => {
    if (e && e.key && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, features: [...prev.features, trimmed] }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.tagline.trim() || !formData.category.trim()) {
      showToast('Please provide Project Name, Tagline, and Category.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await adminUpdateProject(token, editingId, formData);
        if (res.success) {
          showToast('Project updated successfully!', 'success');
          setProjects((prev) =>
            prev.map((item) => (item._id === editingId ? res.data : item))
          );
          setModalOpen(false);
          refreshPortfolio();
        }
      } else {
        const res = await adminCreateProject(token, formData);
        if (res.success) {
          showToast('New project created successfully!', 'success');
          setProjects((prev) => [...prev, res.data]);
          setModalOpen(false);
          refreshPortfolio();
        }
      }
    } catch (err) {
      showToast(err.message || 'Operation failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      const res = await adminDeleteProject(token, projectToDelete._id);
      if (res.success) {
        showToast('Project deleted successfully.', 'success');
        setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
        setDeleteModalOpen(false);
        setProjectToDelete(null);
        refreshPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete project.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (project) => {
    try {
      const updated = { ...project, isActive: !project.isActive };
      const res = await adminUpdateProject(token, project._id, { isActive: updated.isActive });
      if (res.success) {
        setProjects((prev) =>
          prev.map((item) => (item._id === project._id ? { ...item, isActive: updated.isActive } : item))
        );
        showToast(`Project marked as ${updated.isActive ? 'active' : 'inactive'}.`, 'success');
        refreshPortfolio();
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  // Filter & search
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-title">
          <div className="admin-page-icon">
            {activeTab === 'categories' ? <Layers size={24} /> : <FolderGit2 size={24} />}
          </div>
          <div>
            <h1>{activeTab === 'categories' ? 'Project Categories' : 'Projects & Case Studies'}</h1>
            <p>
              {activeTab === 'categories'
                ? 'Create, edit, and organize project taxonomy categories for portfolio showcase'
                : 'Manage production portfolio projects, tech stacks, live links, and features'}
            </p>
          </div>
        </div>
        {activeTab === 'categories' ? (
          <button className="admin-btn admin-btn-primary" onClick={handleOpenCreateCategory}>
            <Plus size={16} />
            <span>Add New Category</span>
          </button>
        ) : (
          <button className="admin-btn admin-btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.75rem',
          paddingBottom: '0.2rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'projects' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            color: activeTab === 'projects' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <FolderGit2 size={17} />
          <span>Projects List</span>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'projects' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {projects.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'categories' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            color: activeTab === 'categories' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Layers size={17} />
          <span>Manage Categories</span>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'categories' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {categories.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PROJECTS LIST */}
      {activeTab === 'projects' && (
        <>
          {/* Filter & Search Bar */}
          <div
            className="admin-card"
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Filter size={16} style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }} />
              <button
                className={`admin-btn admin-btn-sm ${selectedCategory === 'All' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setSelectedCategory('All')}
              >
                All ({projects.length})
              </button>
              {categories.map((cat) => {
                const count = projects.filter((p) => p.category === cat.name).length;
                return (
                  <button
                    key={cat._id || cat.name}
                    className={`admin-btn admin-btn-sm ${selectedCategory === cat.name ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '320px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Search projects or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.2rem' }}
              />
            </div>
          </div>

      {/* Projects Grid / Content */}
      {loading ? (
        <LoadingSkeleton count={4} height="180px" />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No Projects Found"
          description={
            searchQuery || selectedCategory !== 'All'
              ? 'No projects match your filter or search query.'
              : 'You have not added any projects yet. Click below to add your first case study.'
          }
          actionLabel="Add Project"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="admin-responsive-cards-grid">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="admin-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                opacity: project.isActive ? 1 : 0.65,
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
            >
              {/* Card Header with Image Thumbnail or Badges */}
              {project.image ? (
                <div
                  style={{
                    position: 'relative',
                    height: '140px',
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                    margin: '-1.5rem -1.5rem 1rem -1.5rem',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Floating Tags */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'flex',
                      gap: '0.4rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span className="admin-badge admin-badge-info" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.8)' }}>
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="admin-badge admin-badge-success" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.8)' }}>
                        <Star size={11} style={{ marginRight: '3px' }} /> Featured
                      </span>
                    )}
                  </div>
                  {/* Active switch floating on right */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(project)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.25rem 0.5rem',
                      color: project.isActive ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                    title="Click to toggle active state on public site"
                  >
                    {project.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>{project.isActive ? 'Active' : 'Hidden'}</span>
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.85rem',
                    paddingBottom: '0.65rem',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="admin-badge admin-badge-info">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="admin-badge admin-badge-success">
                        <Star size={11} style={{ marginRight: '3px' }} /> Featured
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(project)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.25rem 0.5rem',
                      color: project.isActive ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                    title="Click to toggle active state on public site"
                  >
                    {project.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>{project.isActive ? 'Active' : 'Hidden'}</span>
                  </button>
                </div>
              )}

              {/* Title & Tagline */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {project.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    #{project.displayOrder}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--accent-cyan)',
                    marginBottom: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {project.tagline}
                </p>

                {project.overview && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.45,
                    }}
                  >
                    {project.overview}
                  </p>
                )}

                {/* Tech Badges */}
                {(() => {
                  const isExp = Boolean(expandedAdminTechs[project._id]);
                  const visible = isExp ? project.technologies : project.technologies?.slice(0, 5);
                  return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem', alignItems: 'center' }}>
                      {visible?.map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setExpandedAdminTechs((p) => ({ ...p, [project._id]: !p[project._id] }))}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.72rem',
                            color: 'var(--accent-cyan)',
                            cursor: 'pointer',
                            padding: '0.1rem 0.3rem',
                            fontWeight: 600,
                          }}
                        >
                          {isExp ? 'Show less' : `+${project.technologies.length - 5} more`}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Card Footer Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.85rem',
                  marginTop: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-sm"
                      style={{
                        padding: '0.28rem 0.6rem',
                        fontSize: '0.75rem',
                        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15))',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        color: 'var(--accent-cyan)',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                      title={`Open Live Website: ${project.demoUrl}`}
                    >
                      <ExternalLink size={12} />
                      <span>Live Demo</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="admin-btn admin-btn-sm"
                      style={{
                        padding: '0.28rem 0.6rem',
                        fontSize: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed',
                        opacity: 0.45,
                      }}
                      title="No Live URL configured"
                    >
                      <ExternalLink size={12} />
                      <span>Live (N/A)</span>
                    </button>
                  )}
                  {project.hasGithub && project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-sm admin-btn-secondary"
                      style={{ padding: '0.28rem 0.55rem', fontSize: '0.75rem' }}
                      title="Open Repository"
                    >
                      <GithubIcon size={12} />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    onClick={() => handleOpenEdit(project)}
                    title="Edit Project"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => handleOpenDelete(project)}
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}

      {/* TAB 2: MANAGE CATEGORIES */}
      {activeTab === 'categories' && (
        <div>
          {categoriesLoading ? (
            <LoadingSkeleton count={3} height="120px" />
          ) : categories.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No Categories Available"
              description="Create your first project category to organize your projects on the portfolio."
              actionLabel="Add New Category"
              onAction={handleOpenCreateCategory}
            />
          ) : (
            <div className="admin-responsive-cards-grid">
              {categories.map((cat) => (
                <div
                  key={cat._id || cat.name}
                  className="admin-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-cyan)',
                            flexShrink: 0,
                          }}
                        >
                          <Layers size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                            {cat.name}
                          </h3>
                          {cat.description && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className="admin-badge admin-badge-info"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {cat.projectCount || 0} {cat.projectCount === 1 ? 'Project' : 'Projects'}
                      </span>
                    </div>

                    {cat.projectNames && cat.projectNames.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.75rem' }}>
                        {cat.projectNames.map((pName, pIdx) => (
                          <span
                            key={pIdx}
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {pName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.75rem 0 0 0', fontStyle: 'italic' }}>
                        No projects currently assigned to this category.
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.5rem',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '0.85rem',
                      marginTop: '1.25rem',
                    }}
                  >
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleOpenEditCategory(cat)}
                      title="Edit Category Name"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleOpenDeleteCategory(cat)}
                      title="Delete Category"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT PROJECT MODAL */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderGit2 size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '1.25rem', flex: 1 }}>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">
                    Project Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Enterprise HRMS Platform"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Badge Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Featured Case Study, Production System"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Tagline / Short Summary <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Scalable Human Resource Management System with Role-Based Access"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  required
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label className="admin-label" style={{ margin: 0 }}>Category <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        setCustomCategoryInput('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-cyan)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {isCustomCategory ? 'Choose from list' : '+ Custom'}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Type custom category name..."
                      value={customCategoryInput}
                      onChange={(e) => {
                        setCustomCategoryInput(e.target.value);
                        setFormData({ ...formData, category: e.target.value });
                      }}
                      required
                    />
                  ) : (
                    <select
                      className="admin-input"
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomCategory(true);
                          setCustomCategoryInput('');
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c._id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                      <option value="__NEW__">+ Add Custom Category...</option>
                    </select>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Status Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Production System, MVP Delivered"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Detailed Overview</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Detailed architectural breakdown, business value, and technical challenges solved..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                />
              </div>

              {/* Technologies List */}
              <div className="admin-form-group">
                <label className="admin-label">Technologies Used</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Type tech name (e.g. React.js, Node.js) and press Enter"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => handleAddTech()}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {formData.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="admin-badge admin-badge-info"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {t}
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveTech(idx)}
                      />
                    </span>
                  ))}
                  {formData.technologies.length === 0 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      No technologies added yet.
                    </span>
                  )}
                </div>
              </div>

              {/* Key Features Bullet Points */}
              <div className="admin-form-group">
                <label className="admin-label">Key Architectural Features</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Add a core feature bullet point..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleAddFeature}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => handleAddFeature()}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {formData.features.map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.35rem 0.6rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <span>• {feat}</span>
                      <X
                        size={13}
                        style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                        onClick={() => handleRemoveFeature(idx)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Image */}
              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Cover Image / Screenshot"
                hint="Upload a project mockup/screenshot or paste a direct asset URL."
              />

              {/* Demo & GitHub Links */}
              <div className="admin-card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  External Links & Availability
                </h4>

                <div className="admin-grid-2" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '0.35rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.hasDemo}
                        onChange={(e) => setFormData({ ...formData, hasDemo: e.target.checked })}
                      />
                      <span>Enable Live Demo Link</span>
                    </label>
                    {formData.hasDemo && (
                      <input
                        type="url"
                        className="admin-input"
                        placeholder="https://yourdemo.app"
                        value={formData.demoUrl}
                        onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      />
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '0.35rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.hasGithub}
                        onChange={(e) => setFormData({ ...formData, hasGithub: e.target.checked })}
                      />
                      <span>Enable GitHub Code Link</span>
                    </label>
                    {formData.hasGithub && (
                      <input
                        type="url"
                        className="admin-input"
                        placeholder="https://github.com/..."
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Repository Inquiry Note</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Notice displayed if code is proprietary"
                    value={formData.availabilityNote}
                    onChange={(e) => setFormData({ ...formData, availabilityNote: e.target.value })}
                  />
                </div>
              </div>

              {/* Toggles & Display Order */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  background: 'var(--bg-secondary)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Display on Public Website</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Display Order:</label>
                  <input
                    type="number"
                    className="admin-input"
                    style={{ width: '70px', padding: '0.35rem 0.5rem' }}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="admin-spinner" />
                      <span>Saving Project...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingId ? 'Save Changes' : 'Create Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone and will immediately remove this case study from the portfolio.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Project'}
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
      />

      {/* =========================================================================
          CATEGORY MODAL (ADD / EDIT PROJECT CATEGORY)
         ========================================================================= */}
      {categoryModalOpen && (
        <div className="admin-modal-overlay" onClick={() => !savingCategory && setCategoryModalOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3>{editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Project Category'}</h3>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setCategoryModalOpen(false)}
                disabled={savingCategory}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ padding: '1.25rem', overflowY: 'auto' }}>
              <div className="admin-form-group">
                <label className="admin-label">
                  Category Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. AI Platforms, Full-Stack & Cloud, Mobile Apps"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description (Optional)</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="Brief description of this project classification..."
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Display Order</label>
                <input
                  type="number"
                  className="admin-input"
                  value={categoryFormData.displayOrder}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setCategoryModalOpen(false)}
                  disabled={savingCategory}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={savingCategory}>
                  {savingCategory ? (
                    <>
                      <Loader2 size={16} className="admin-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={deleteCategoryModalOpen}
        title="Delete Project Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? Linked projects will be safely reassigned to remaining categories.`}
        confirmText={deletingCategory ? 'Deleting...' : 'Delete Category'}
        type="danger"
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => {
          setDeleteCategoryModalOpen(false);
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminProjects;
