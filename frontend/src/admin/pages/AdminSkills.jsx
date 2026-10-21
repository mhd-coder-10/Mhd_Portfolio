import React, { useState, useEffect, useMemo } from 'react';
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Loader2,
  X,
  Save,
  Layers,
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
  FolderKanban,
  ListFilter,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetSkills,
  adminCreateSkill,
  adminUpdateSkill,
  adminDeleteSkill,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import { usePortfolioData } from '../../context/PortfolioContext';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const defaultCategories = [
  'Programming Languages',
  'Frontend Development',
  'Backend & Real-Time',
  'Databases & Caching',
  'State Management',
  'AI & Cloud Services',
  'DevOps & Observability',
  'Testing & Security',
  'Tools & Concepts',
];

const availableIcons = [
  { name: 'Layout', icon: Layers, label: 'Layout / UI' },
  { name: 'Server', icon: Server, label: 'Server / Backend' },
  { name: 'Database', icon: Database, label: 'Database' },
  { name: 'ShieldCheck', icon: ShieldCheck, label: 'Security / Auth' },
  { name: 'Share2', icon: Share2, label: 'API / Network' },
  { name: 'CheckSquare', icon: CheckSquare, label: 'Testing / QA' },
  { name: 'Wrench', icon: Wrench, label: 'Tools / Utilities' },
  { name: 'Sparkles', icon: Sparkles, label: 'AI / Innovation' },
  { name: 'Terminal', icon: Terminal, label: 'Terminal / CLI' },
  { name: 'Globe', icon: Globe, label: 'Web / Cloud' },
  { name: 'Cloud', icon: Cloud, label: 'Cloud / DevOps' },
  { name: 'Code2', icon: Code2, label: 'Code / Language' },
  { name: 'Zap', icon: Zap, label: 'Performance' },
  { name: 'Cpu', icon: Cpu, label: 'Core / Architecture' },
];

const categoryIcons = {
  'Programming Languages': 'Code2',
  'Frontend Development': 'Layout',
  'Backend & Real-Time': 'Server',
  'Databases & Caching': 'Database',
  'State Management': 'Share2',
  'AI & Cloud Services': 'Sparkles',
  'DevOps & Observability': 'Cloud',
  'Testing & Security': 'ShieldCheck',
  'Tools & Concepts': 'Wrench',
};

const initialSkillState = {
  name: '',
  category: 'Frontend Development',
  categoryIcon: 'Layout',
  level: 'Core Competency',
  desc: '',
  displayOrder: 0,
  isActive: true,
};

export const AdminSkills = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const { refreshPortfolio } = usePortfolioData();

  // Tab State: 'skills' | 'categories'
  const [activeTab, setActiveTab] = useState('skills');

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Skill Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialSkillState);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryIcon, setCustomCategoryIcon] = useState('Layout');
  const [saving, setSaving] = useState(false);

  // Skill Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Category Modal State (Add / Edit Category)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    icon: 'Layout',
    initialSkill: '',
  });
  const [savingCategory, setSavingCategory] = useState(false);

  // Category Delete Modal State
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryDeleteCount, setCategoryDeleteCount] = useState(0);
  const [deletingCategory, setDeletingCategory] = useState(false);

  // Compute unique categories dynamically from actual skills
  const allCategories = useMemo(() => {
    const set = new Set();
    skills.forEach((s) => {
      if (s.category && s.category.trim()) {
        set.add(s.category.trim());
      }
    });
    return Array.from(set);
  }, [skills]);

  // Compute category statistics for Category Management Tab
  const categoryStats = useMemo(() => {
    return allCategories.map((catName) => {
      const catSkills = skills.filter((s) => s.category === catName);
      const iconName = catSkills[0]?.categoryIcon || categoryIcons[catName] || 'Layout';
      return {
        name: catName,
        icon: iconName,
        count: catSkills.length,
        skills: catSkills,
      };
    });
  }, [allCategories, skills]);

  const fetchSkills = async () => {
    try {
      const res = await adminGetSkills(true);
      if (res.success) {
        setSkills(res.data);
      }
    } catch (err) {
      showToast('Failed to load skills.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // --- Skill Handlers ---
  const handleOpenCreateSkill = () => {
    setEditingId(null);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setCustomCategoryIcon('Layout');
    setFormData({
      ...initialSkillState,
      category: selectedCategory !== 'All' ? selectedCategory : (allCategories[0] || 'Frontend Development'),
      categoryIcon: categoryIcons[selectedCategory] || 'Layout',
      displayOrder: skills.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditSkill = (skill) => {
    setEditingId(skill._id);
    const isCustom = !allCategories.includes(skill.category) && !defaultCategories.includes(skill.category);
    setIsCustomCategory(isCustom);
    setCustomCategoryName(isCustom ? skill.category : '');
    setCustomCategoryIcon(skill.categoryIcon || 'Layout');
    setFormData({
      name: skill.name || '',
      category: skill.category || (allCategories[0] || defaultCategories[0]),
      categoryIcon: skill.categoryIcon || categoryIcons[skill.category] || 'Layout',
      level: skill.level || 'Core Competency',
      desc: skill.desc || '',
      displayOrder: skill.displayOrder || 0,
      isActive: skill.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    const finalCategory = isCustomCategory ? customCategoryName.trim() : formData.category.trim();
    if (!finalCategory) {
      showToast('Please provide a valid category name.', 'error');
      return;
    }

    setSaving(true);
    try {
      const finalIcon = isCustomCategory
        ? customCategoryIcon
        : categoryIcons[finalCategory] || formData.categoryIcon || 'Layout';

      const payload = {
        ...formData,
        category: finalCategory,
        categoryIcon: finalIcon,
      };
      if (editingId) {
        await adminUpdateSkill(token, editingId, payload);
        showToast('Skill updated successfully!', 'success');
      } else {
        await adminCreateSkill(token, payload);
        showToast('Skill created successfully!', 'success');
      }
      setModalOpen(false);
      fetchSkills();
      refreshPortfolio();
    } catch (err) {
      showToast(err.message || 'Failed to save skill.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkillConfirm = async () => {
    if (!skillToDelete) return;
    setDeleting(true);
    try {
      await adminDeleteSkill(token, skillToDelete._id);
      showToast('Skill deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setSkillToDelete(null);
      fetchSkills();
      refreshPortfolio();
    } catch (err) {
      showToast(err.message || 'Failed to delete skill.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // --- Category Handlers ---
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      icon: 'Layout',
      initialSkill: 'Core Skill',
    });
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      icon: cat.icon || 'Layout',
      initialSkill: '',
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const trimmedName = categoryFormData.name.trim();
    if (!trimmedName) {
      showToast('Category name cannot be empty.', 'error');
      return;
    }

    setSavingCategory(true);
    try {
      if (editingCategory) {
        // Update category name & icon across all its skills
        await adminUpdateCategory(token, {
          oldCategoryName: editingCategory.name,
          newCategoryName: trimmedName,
          categoryIcon: categoryFormData.icon,
        });
        showToast(`Category "${trimmedName}" updated successfully!`, 'success');
      } else {
        // Create new category by adding its initial skill
        await adminCreateSkill(token, {
          name: categoryFormData.initialSkill?.trim() || 'Core Proficiency',
          category: trimmedName,
          categoryIcon: categoryFormData.icon,
          level: 'Proficient',
          desc: 'Primary foundational skill for this category.',
          displayOrder: 1,
          isActive: true,
        });
        showToast(`Category "${trimmedName}" created successfully!`, 'success');
      }
      setCategoryModalOpen(false);
      fetchSkills();
      refreshPortfolio();
    } catch (err) {
      showToast(err.message || 'Failed to save category.', 'error');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleOpenDeleteCategory = (cat) => {
    setCategoryToDelete(cat.name);
    setCategoryDeleteCount(cat.count);
    setDeleteCategoryModalOpen(true);
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete) return;
    setDeletingCategory(true);
    try {
      await adminDeleteCategory(token, categoryToDelete);
      showToast(`Category "${categoryToDelete}" deleted.`, 'success');
      setDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
      fetchSkills();
      refreshPortfolio();
    } catch (err) {
      showToast(err.message || 'Failed to delete category.', 'error');
    } finally {
      setDeletingCategory(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  const getIconComponent = (iconName) => {
    const item = availableIcons.find((i) => i.name === iconName);
    return item ? item.icon : Layers;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Technical Skills & Categories</h1>
          <p className="admin-page-desc">
            Manage your full-stack technical competencies, organized under flexible categories with icons.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'skills' ? (
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleOpenCreateSkill}>
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          ) : (
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleOpenCreateCategory}>
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
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
          onClick={() => setActiveTab('skills')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'skills' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            color: activeTab === 'skills' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <ListFilter size={17} />
          <span>Skills List</span>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'skills' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {skills.length}
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
          <FolderKanban size={17} />
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
            {allCategories.length}
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SKILLS LIST
         ========================================================================= */}
      {activeTab === 'skills' && (
        <>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`admin-btn admin-btn-sm ${selectedCategory === 'All' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            >
              All Categories ({skills.length})
            </button>
            {allCategories.map((cat) => {
              const count = skills.filter((s) => s.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`admin-btn admin-btn-sm ${selectedCategory === cat ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {loading ? (
            <LoadingSkeleton count={6} />
          ) : filteredSkills.length === 0 ? (
            <EmptyState
              icon={Cpu}
              title="No Skills Found"
              description={
                selectedCategory !== 'All'
                  ? `No skills found under "${selectedCategory}". Click Add Skill to create one.`
                  : 'Start building your skills toolkit by adding technical competencies.'
              }
              actionText="Add Technical Skill"
              onAction={handleOpenCreateSkill}
            />
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Skill Name</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Short Description</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkills.map((skill) => (
                    <tr key={skill._id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{skill.name}</strong>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-info">
                          {skill.category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                        {skill.level}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: '280px' }}>
                        {skill.desc || '—'}
                      </td>
                      <td>
                        {skill.isActive ? (
                          <span className="admin-badge admin-badge-success">Active</span>
                        ) : (
                          <span className="admin-badge admin-badge-danger">Hidden</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => handleOpenEditSkill(skill)}
                            title="Edit Skill"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => {
                              setSkillToDelete(skill);
                              setDeleteModalOpen(true);
                            }}
                            title="Delete Skill"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          TAB 2: MANAGE CATEGORIES (View, Update, Delete)
         ========================================================================= */}
      {activeTab === 'categories' && (
        <div>
          {categoryStats.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No Categories Available"
              description="Create your first skill category to organize your technical capabilities."
              actionText="Add New Category"
              onAction={handleOpenCreateCategory}
            />
          ) : (
            <div className="admin-responsive-cards-grid">
              {categoryStats.map((cat, idx) => {
                const IconComponent = getIconComponent(cat.icon);
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div>
                      {/* Category Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: 'var(--radius-md)',
                              background: 'rgba(56, 189, 248, 0.1)',
                              color: 'var(--accent-cyan)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconComponent size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                              {cat.name}
                            </h3>
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              Icon: {cat.icon}
                            </span>
                          </div>
                        </div>

                        <span
                          className="admin-badge admin-badge-info"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {cat.count} {cat.count === 1 ? 'Skill' : 'Skills'}
                        </span>
                      </div>

                      {/* Skills Preview Chips */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.4rem',
                          margin: '1rem 0 1.25rem 0',
                          minHeight: '48px',
                        }}
                      >
                        {cat.skills.length === 0 ? (
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No active skills in this category yet.
                          </span>
                        ) : (
                          cat.skills.slice(0, 7).map((s, sIdx) => (
                            <span
                              key={sIdx}
                              style={{
                                fontSize: '0.76rem',
                                padding: '0.2rem 0.55rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {s.name}
                            </span>
                          ))
                        )}
                        {cat.skills.length > 7 && (
                          <span
                            style={{
                              fontSize: '0.76rem',
                              padding: '0.2rem 0.55rem',
                              color: 'var(--accent-cyan)',
                            }}
                          >
                            +{cat.skills.length - 7} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category Action Controls */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setActiveTab('skills');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-cyan)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: 0,
                        }}
                      >
                        <span>View Skills</span>
                        <ArrowRight size={14} />
                      </button>

                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => handleOpenEditCategory(cat)}
                          title="Rename or change category icon"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleOpenDeleteCategory(cat)}
                          title="Delete category"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD / EDIT SKILL MODAL
         ========================================================================= */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {editingId ? 'Edit Technical Skill' : 'Add Technical Skill'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="admin-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(90vh - 75px)' }}>
              <div className="admin-form-group">
                <label className="admin-label">Skill Name</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. React.js, Express.js, MongoDB"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Category</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(!isCustomCategory);
                      if (!isCustomCategory) {
                        setCustomCategoryName('');
                        setCustomCategoryIcon('Layout');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '0.2rem 0.4rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {isCustomCategory ? '← Select Existing Category' : '+ Add New Category'}
                  </button>
                </div>

                {isCustomCategory ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      placeholder="Enter new category name (e.g. Cloud & DevOps)"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                    />
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                        Category Icon
                      </label>
                      <select
                        className="admin-select"
                        value={customCategoryIcon}
                        onChange={(e) => setCustomCategoryIcon(e.target.value)}
                      >
                        {availableIcons.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.label} ({item.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <select
                    className="admin-select"
                    value={formData.category}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__NEW__') {
                        setIsCustomCategory(true);
                        setCustomCategoryName('');
                      } else {
                        setFormData({
                          ...formData,
                          category: val,
                          categoryIcon: categoryIcons[val] || formData.categoryIcon || 'Layout',
                        });
                      }
                    }}
                  >
                    {(allCategories.length > 0 ? allCategories : defaultCategories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__NEW__">+ Add Custom Category...</option>
                  </select>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Proficiency Level</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Core Competency, Advanced, Proficient, Core Skill"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Descriptor</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Component architecture, Hooks, Virtual DOM"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                />
              </div>

              <div style={{ margin: '1rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active & Displayed on Public Portfolio</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                  {saving ? <Loader2 size={16} className="spin-animation" /> : <Save size={16} />}
                  <span>{saving ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD / EDIT CATEGORY MODAL
         ========================================================================= */}
      {categoryModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setCategoryModalOpen(false)}>
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
              </h2>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="admin-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(90vh - 75px)' }}>
              <div className="admin-form-group">
                <label className="admin-label">Category Name</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Cloud & DevOps, Mobile Architecture"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                />
                {editingCategory && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Renaming this will automatically update all {editingCategory.count} skills currently inside this category.
                  </p>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Category Icon</label>
                <select
                  className="admin-select"
                  value={categoryFormData.icon}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                >
                  {availableIcons.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.label} ({item.name})
                    </option>
                  ))}
                </select>
              </div>

              {!editingCategory && (
                <div className="admin-form-group">
                  <label className="admin-label">Initial Skill in this Category</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Docker, AWS, React Native"
                    value={categoryFormData.initialSkill}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, initialSkill: e.target.value })}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    A starter skill to initialize this new category in your portfolio.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setCategoryModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingCategory} className="admin-btn admin-btn-primary">
                  {savingCategory ? <Loader2 size={16} className="spin-animation" /> : <Save size={16} />}
                  <span>{savingCategory ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Skill Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteSkillConfirm}
        title="Delete Skill"
        message={`Are you sure you want to delete "${skillToDelete?.name}"? It will no longer appear in your skills showcase.`}
        loading={deleting}
      />

      {/* Delete Category Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteCategoryModalOpen}
        onClose={() => setDeleteCategoryModalOpen(false)}
        onConfirm={handleDeleteCategoryConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete}"? This will permanently delete the category and all ${categoryDeleteCount} skill(s) inside it from your portfolio.`}
        loading={deletingCategory}
      />
    </div>
  );
};

export default AdminSkills;
