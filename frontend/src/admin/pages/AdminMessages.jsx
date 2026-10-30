import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Eye,
  X,
  Send,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Inbox,
  Sparkles,
  RotateCw,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  adminGetMessages,
  adminUpdateMessageStatus,
  adminDeleteMessage,
} from '../../services/api';
import { useToast } from '../components/AdminToast';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

export const AdminMessages = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected message modal
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [inboxRefreshing, setInboxRefreshing] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminGetMessages(token, {
        page,
        limit: 10,
        status: statusFilter,
        search: searchQuery,
      });
      if (res.success) {
        setMessages(Array.isArray(res.data) ? res.data : (res.data?.messages || []));
        setTotalPages(res.pagination?.totalPages || res.data?.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.total || res.data?.pagination?.total || 0);
      }
    } catch (err) {
      showToast('Failed to load messages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInboxRefresh = async () => {
    setInboxRefreshing(true);
    try {
      await fetchMessages();
    } catch {
      showToast('Failed to refresh inbox.', 'error');
    } finally {
      setTimeout(() => setInboxRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMessages();
  };

  const handleToggleStatus = async (msg) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    try {
      const res = await adminUpdateMessageStatus(token, msg._id, nextStatus);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: nextStatus } : m))
        );
        if (selectedMessage && selectedMessage._id === msg._id) {
          setSelectedMessage((prev) => ({ ...prev, status: nextStatus }));
        }
        showToast(`Marked as ${nextStatus}.`, 'success');
      }
    } catch (err) {
      showToast('Failed to update message status.', 'error');
    }
  };

  const handleOpenDetails = async (msg) => {
    setSelectedMessage(msg);
    // If opening an unread message, mark it as read automatically
    if (msg.status === 'unread') {
      try {
        await adminUpdateMessageStatus(token, msg._id, 'read');
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: 'read' } : m))
        );
        setSelectedMessage((prev) => ({ ...prev, status: 'read' }));
      } catch (err) {
        // silent fail for auto-read
      }
    }
  };

  const handleOpenDelete = (msg, e) => {
    if (e) e.stopPropagation();
    setMessageToDelete(msg);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      const res = await adminDeleteMessage(token, messageToDelete._id);
      if (res.success) {
        showToast('Message deleted.', 'success');
        setMessages((prev) => prev.filter((m) => m._id !== messageToDelete._id));
        if (selectedMessage && selectedMessage._id === messageToDelete._id) {
          setSelectedMessage(null);
        }
        setDeleteModalOpen(false);
        setMessageToDelete(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete message.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Helper formatting date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-header-title">
          <div className="admin-page-icon">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1>Inquiry Inbox & Messages</h1>
            <p>Direct inquiries submitted via the public portfolio contact form ({totalCount} total)</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="admin-card"
        style={{
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }} />
          <button
            className={`admin-btn admin-btn-sm ${statusFilter === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => {
              setStatusFilter('all');
              setPage(1);
            }}
          >
            All Messages
          </button>
          <button
            className={`admin-btn admin-btn-sm ${statusFilter === 'unread' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => {
              setStatusFilter('unread');
              setPage(1);
            }}
          >
            Unread
          </button>
          <button
            className={`admin-btn admin-btn-sm ${statusFilter === 'read' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => {
              setStatusFilter('read');
              setPage(1);
            }}
          >
            Read
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-sm admin-btn-secondary"
            onClick={handleInboxRefresh}
            disabled={loading || inboxRefreshing}
            title="Refresh messages inbox"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RotateCw size={13} className={inboxRefreshing ? 'admin-spinner' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1', maxWidth: '360px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
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
              placeholder="Search sender, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-secondary">
            Search
          </button>
        </form>
      </div>

      {/* Messages List */}
      {loading ? (
        <LoadingSkeleton count={5} height="70px" />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Inbox Empty"
          description={
            searchQuery || statusFilter !== 'all'
              ? 'No messages match your active filter.'
              : 'You have no messages yet. Inquiries submitted through your contact form will appear here.'
          }
        />
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Status</th>
                  <th>Sender</th>
                  <th>Subject & Preview</th>
                  <th>Contact Info</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => {
                  const isUnread = msg.status === 'unread';
                  return (
                    <tr
                      key={msg._id}
                      onClick={() => handleOpenDetails(msg)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isUnread ? 'rgba(56, 189, 248, 0.04)' : undefined,
                        fontWeight: isUnread ? 600 : 'normal',
                      }}
                    >
                      <td>
                        <span
                          className={`admin-badge ${isUnread ? 'admin-badge-warning' : 'admin-badge-info'}`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {isUnread ? 'NEW' : 'READ'}
                        </span>
                      </td>

                      <td>
                        <div style={{ color: 'var(--text-primary)', fontWeight: isUnread ? 600 : 500 }}>
                          {msg.name}
                        </div>
                      </td>

                      <td style={{ maxWidth: '320px' }}>
                        <div style={{ color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                          {msg.subject}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {msg.message}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {msg.email}
                        </div>
                        {msg.phone && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                            {msg.phone}
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {formatDate(msg.createdAt)}
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            onClick={() => handleToggleStatus(msg)}
                            title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                          >
                            <CheckCircle size={13} style={{ color: isUnread ? 'var(--text-muted)' : 'var(--accent-emerald)' }} />
                          </button>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            onClick={(e) => handleOpenDelete(msg, e)}
                            title="Delete Message"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  className="admin-btn admin-btn-sm admin-btn-secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MESSAGE DETAILS MODAL */}
      {selectedMessage && (
        <div className="admin-modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="admin-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MessageSquare size={18} style={{ color: 'var(--accent-cyan)' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Inquiry Details</h3>
                </div>
              </div>
              <button className="admin-modal-close" onClick={() => setSelectedMessage(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              {/* Sender Details Header */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedMessage.name}
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Mail size={13} style={{ color: 'var(--accent-cyan)' }} />
                      <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                        {selectedMessage.email}
                      </a>
                    </span>
                    {selectedMessage.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={13} style={{ color: 'var(--accent-emerald)' }} />
                        <span>{selectedMessage.phone}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label" style={{ marginBottom: '0.25rem' }}>Subject</label>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedMessage.subject}
                </div>
              </div>

              {/* Message Body */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="admin-label" style={{ marginBottom: '0.35rem' }}>Message Content</label>
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="admin-btn admin-btn-primary admin-btn-sm"
                  >
                    <Mail size={13} />
                    <span>Reply via Email</span>
                  </a>

                  {selectedMessage.phone && (
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      style={{ color: '#25D366' }}
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp Chat</span>
                    </a>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => handleToggleStatus(selectedMessage)}
                  >
                    {selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                  </button>
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => handleOpenDelete(selectedMessage)}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Inquiry Message"
        message={`Are you sure you want to permanently delete this message from "${messageToDelete?.name}"?`}
        confirmText={deleting ? 'Deleting...' : 'Delete Message'}
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setMessageToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminMessages;
