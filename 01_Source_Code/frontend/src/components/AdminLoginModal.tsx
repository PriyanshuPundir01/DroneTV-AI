import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { api, AdminUser } from '../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
  showToast: (type: 'success' | 'error' | 'info', message: string, title?: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  showToast
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both administrator email and access key.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.loginAdmin(email, password);
      if (res.success && res.data) {
        showToast('success', 'Security clearance verified. Welcome to Admin Portal.', 'Access Granted');
        onSuccess(res.data.user);
        onClose();
      } else {
        throw new Error(res.message || 'Authentication rejected.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Access denied.');
      showToast('error', err.message || 'Authentication failed.', 'Access Denied');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@dronetv.in');
    setPassword('DroneTV@2026');
    setError(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          borderRadius: '16px',
          border: '1px solid var(--border-accent)',
          background: 'rgba(13, 19, 34, 0.98)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), var(--shadow-glow)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(7, 10, 19, 0.9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '2.4rem',
                height: '2.4rem',
                borderRadius: '8px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Lock size={18} color="var(--accent-cyan)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Admin Access Portal</h3>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                DroneTV Internal Flight Operations
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Clearance Notice */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}
          >
            <ShieldCheck size={20} color="var(--accent-indigo)" />
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Enquiries and student records are restricted to authorized DroneTV administrators.
            </div>
          </div>

          {/* Quick Demo Credentials Autofill Pill */}
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(0, 242, 254, 0.05)',
              border: '1px dashed var(--border-accent)',
              marginBottom: '1.25rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.4rem'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                Demo Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                style={{
                  background: 'rgba(0, 242, 254, 0.15)',
                  border: '1px solid var(--border-accent)',
                  color: 'var(--accent-cyan)',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={11} /> Auto-Fill
              </button>
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Email: <span style={{ color: '#fff' }}>admin@dronetv.in</span>
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Key: <span style={{ color: '#fff' }}>DroneTV@2026</span>
            </div>
          </div>

          <form onSubmit={handleLogin} noValidate>
            {error && (
              <div
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fda4af',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '1rem'
                }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="adminEmail">
                <Mail size={13} /> Admin Email
              </label>
              <input
                id="adminEmail"
                type="email"
                placeholder="admin@dronetv.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="adminPassword">
                <Key size={13} /> Security Access Key / Password
              </label>
              <input
                id="adminPassword"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1.5, gap: '0.4rem' }}
              >
                {loading ? <Loader2 size={16} className="spin" /> : <Lock size={16} />}
                <span>{loading ? 'Verifying...' : 'Authorize Login'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
