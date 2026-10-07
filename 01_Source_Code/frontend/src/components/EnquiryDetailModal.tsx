import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MessageSquare,
  ShieldAlert,
  Save,
  Trash2,
  CheckCircle,
  Clock,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Enquiry, EnquiryStatus } from '../types/enquiry';

interface EnquiryDetailModalProps {
  enquiry: Enquiry | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: EnquiryStatus, notes?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  enquiry,
  onClose,
  onStatusChange,
  onDelete
}) => {
  if (!enquiry) return null;

  const [currentStatus, setCurrentStatus] = useState<EnquiryStatus>(enquiry.status);
  const [adminNotes, setAdminNotes] = useState(enquiry.adminNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await onStatusChange(enquiry._id, currentStatus, adminNotes);
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the enquiry from "${enquiry.name}"? This action cannot be undone.`
      )
    ) {
      setIsDeleting(true);
      try {
        await onDelete(enquiry._id);
        onClose();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const statusOptions: EnquiryStatus[] = ['New', 'Contacted', 'In Progress', 'Closed'];

  const getStatusBadgeStyle = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'Contacted':
        return { bg: 'rgba(129, 140, 248, 0.15)', text: '#a5b4fc', border: 'rgba(129, 140, 248, 0.3)' };
      case 'In Progress':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Closed':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    }
  };

  const badgeStyle = getStatusBadgeStyle(currentStatus);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(13, 19, 34, 0.95)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Enquiry Details</h3>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: badgeStyle.bg,
                  color: badgeStyle.text,
                  border: `1px solid ${badgeStyle.border}`,
                  fontWeight: 700
                }}
              >
                {currentStatus}
              </span>
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ID: {enquiry._id}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* User Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(7, 10, 19, 0.6)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '10px',
                  background: 'rgba(0, 242, 254, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <User size={18} color="var(--accent-cyan)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                  {enquiry.name}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Mail size={18} color="var(--accent-indigo)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#f8fafc' }}>
                  <a href={`mailto:${enquiry.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {enquiry.email}
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Phone size={18} color="var(--accent-emerald)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Phone</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                  <a href={`tel:${enquiry.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {enquiry.phone}
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Tag size={18} color="var(--accent-amber)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>User Category</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                  {enquiry.userType}
                </div>
              </div>
            </div>
          </div>

          {/* Interest & Timestamp */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)' }}>
              <Briefcase size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Service or Course of Interest:</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {enquiry.interest}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <Clock size={13} />
              <span>Created: {new Date(enquiry.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Full Customer Message */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              background: 'rgba(7, 10, 19, 0.8)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem'
              }}
            >
              <MessageSquare size={14} /> Customer Enquiry Message:
            </div>
            <p style={{ color: '#f8fafc', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {enquiry.message}
            </p>
          </div>

          {/* Status Selector & Admin Notes */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(13, 19, 34, 0.9)',
              border: '1px solid var(--border-accent)'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
              Update Operational Status:
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {statusOptions.map((st) => {
                const isSelected = currentStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setCurrentStatus(st)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#070a13' : 'var(--text-secondary)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {st}
                  </button>
                );
              })}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="adminNotes">
                Internal Operations Notes:
              </label>
              <input
                id="adminNotes"
                type="text"
                placeholder="e.g. Called candidate; confirmed eligibility for Batch 5."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(7, 10, 19, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-danger btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <Trash2 size={14} />
            <span>Delete Lead</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Save size={14} />
              <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
