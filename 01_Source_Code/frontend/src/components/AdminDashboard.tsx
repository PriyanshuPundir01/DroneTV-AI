import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  ChevronDown,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  ArrowUpDown,
  Layers,
  Users,
  Briefcase,
  LogOut,
  UserCheck
} from 'lucide-react';
import { Enquiry, EnquiryStatus, EnquiryStats } from '../types/enquiry';
import { api, AdminUser } from '../services/api';
import { EnquiryDetailModal } from './EnquiryDetailModal';

interface AdminDashboardProps {
  showToast: (type: 'success' | 'error' | 'info', message: string, title?: string) => void;
  adminUser?: AdminUser | null;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  showToast,
  adminUser,
  onLogout
}) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const [resList, resStats] = await Promise.all([
        api.getEnquiries({
          search: searchTerm,
          userType: userTypeFilter,
          status: statusFilter,
          sortBy,
          sortOrder,
          limit: 50
        }),
        api.getStats().catch(() => null)
      ]);

      if (resList.success) {
        setEnquiries(resList.data || []);
      }
      if (resStats && resStats.success) {
        setStats(resStats.data);
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to fetch enquiries from server.', 'API Error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, userTypeFilter, statusFilter, sortBy, sortOrder, showToast]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEnquiries();
    }, 250);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchEnquiries]);

  const handleStatusQuickChange = async (
    id: string,
    newStatus: EnquiryStatus,
    adminNotes?: string
  ) => {
    try {
      const res = await api.updateEnquiry(id, { status: newStatus, adminNotes });
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus, adminNotes: adminNotes ?? item.adminNotes } : item))
        );
        showToast('success', `Status updated to "${newStatus}".`, 'Enquiry Updated');
        // Refresh stats
        api.getStats().then((s) => s?.success && setStats(s.data));
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update status.', 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.deleteEnquiry(id);
      if (res.success) {
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        showToast('success', 'Enquiry lead deleted permanently.', 'Deleted');
        api.getStats().then((s) => s?.success && setStats(s.data));
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete enquiry.', 'Error');
    }
  };

  const exportToCSV = () => {
    if (enquiries.length === 0) {
      showToast('info', 'No enquiries available to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'UserType', 'Interest', 'Status', 'Message', 'CreatedAt'];
    const rows = enquiries.map((e) => [
      e._id,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      e.userType,
      `"${e.interest.replace(/"/g, '""')}"`,
      e.status,
      `"${(e.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      e.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DroneTV_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Exported enquiries to CSV file.');
  };

  const getStatusBadgeClass = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return 'badge-new';
      case 'Contacted':
        return 'badge-contacted';
      case 'In Progress':
        return 'badge-progress';
      case 'Closed':
        return 'badge-closed';
    }
  };

  const getUserTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'Student':
        return 'badge-student';
      case 'Customer':
        return 'badge-customer';
      default:
        return 'badge-other';
    }
  };

  return (
    <section style={{ padding: '3.5rem 0 5rem 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Dashboard Title & Actions Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={22} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.75rem', color: '#fff' }}>Admin Enquiry Dashboard</h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Manage incoming student applications, enterprise drone booking requests, and commercial leads.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            {adminUser && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontSize: '0.8rem',
                  color: '#c7d2fe'
                }}
              >
                <UserCheck size={14} color="#818cf8" />
                <span>
                  <strong>{adminUser.name}</strong> ({adminUser.email})
                </span>
              </div>
            )}

            <button
              onClick={() => fetchEnquiries()}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem' }}
              title="Refresh leads list"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportToCSV}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
              title="Export filtered records to CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="btn btn-danger btn-sm"
                style={{ gap: '0.4rem' }}
                title="Log out of Admin Portal"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Leads
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {stats?.total ?? enquiries.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>
              Live in Database
            </div>
          </div>

          <div
            className="glass-card"
            style={{ padding: '1.25rem', borderLeft: '3px solid #38bdf8' }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              New Submissions
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>
              {stats?.byStatus?.new ?? enquiries.filter((e) => e.status === 'New').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Requires Action
            </div>
          </div>

          <div
            className="glass-card"
            style={{ padding: '1.25rem', borderLeft: '3px solid #a5b4fc' }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Contacted
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a5b4fc', marginTop: '0.25rem' }}>
              {stats?.byStatus?.contacted ?? enquiries.filter((e) => e.status === 'Contacted').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Initial Outreach
            </div>
          </div>

          <div
            className="glass-card"
            style={{ padding: '1.25rem', borderLeft: '3px solid #fbbf24' }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              In Progress
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.25rem' }}>
              {stats?.byStatus?.inProgress ?? enquiries.filter((e) => e.status === 'In Progress').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Active Counselling / Quote
            </div>
          </div>

          <div
            className="glass-card"
            style={{ padding: '1.25rem', borderLeft: '3px solid #34d399' }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Closed / Enrolled
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
              {stats?.byStatus?.closed ?? enquiries.filter((e) => e.status === 'Closed').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Converted
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, interest or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', fontSize: '0.875rem' }}
            />
          </div>

          {/* Filters Group */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* User Type Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Type:</span>
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="form-select"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="All">All User Types</option>
                <option value="Student">Student</option>
                <option value="Customer">Customer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem' }}
              title="Toggle sort direction"
            >
              <ArrowUpDown size={14} />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        {/* Table View of Enquiries */}
        <div
          className="glass-card"
          style={{
            overflow: 'hidden',
            borderRadius: '16px'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem'
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'rgba(7, 10, 19, 0.9)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <th style={{ padding: '1rem 1.25rem' }}>Name & Contact</th>
                  <th style={{ padding: '1rem' }}>User Category</th>
                  <th style={{ padding: '1rem' }}>Service / Course Interest</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Date Received</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent-cyan)' }}>
                      <RefreshCw size={24} className="spin" style={{ margin: '0 auto 0.75rem auto' }} />
                      <div>Loading enquiries from database...</div>
                    </td>
                  </tr>
                )}

                {!loading && enquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <AlertCircle size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                      <div style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 600 }}>
                        No enquiries match your search or filter.
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Try clearing filters or submitting an enquiry from the homepage or chatbot.
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  enquiries.map((enquiry) => (
                    <tr
                      key={enquiry._id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.15s ease'
                      }}
                      className="table-row"
                    >
                      {/* Name & Contact */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                          {enquiry.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {enquiry.email}
                        </div>
                        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {enquiry.phone}
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${getUserTypeBadgeClass(enquiry.userType)}`}>
                          {enquiry.userType}
                        </span>
                      </td>

                      {/* Interest */}
                      <td style={{ padding: '1rem', maxWidth: '240px' }}>
                        <div style={{ color: '#f8fafc', fontWeight: 500 }}>{enquiry.interest}</div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '220px'
                          }}
                        >
                          {enquiry.message}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td style={{ padding: '1rem' }}>
                        <select
                          value={enquiry.status}
                          onChange={(e) =>
                            handleStatusQuickChange(enquiry._id, e.target.value as EnquiryStatus)
                          }
                          className={`badge ${getStatusBadgeClass(enquiry.status)}`}
                          style={{
                            cursor: 'pointer',
                            outline: 'none',
                            borderWidth: '1px'
                          }}
                        >
                          <option value="New" style={{ background: '#0f172a', color: '#38bdf8' }}>
                            New
                          </option>
                          <option value="Contacted" style={{ background: '#0f172a', color: '#a5b4fc' }}>
                            Contacted
                          </option>
                          <option value="In Progress" style={{ background: '#0f172a', color: '#fbbf24' }}>
                            In Progress
                          </option>
                          <option value="Closed" style={{ background: '#0f172a', color: '#34d399' }}>
                            Closed
                          </option>
                        </select>
                      </td>

                      {/* Created date */}
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(enquiry.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="btn btn-secondary btn-icon btn-sm"
                            title="View full enquiry details"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete enquiry from "${enquiry.name}"?`)) {
                                handleDelete(enquiry._id);
                              }
                            }}
                            className="btn btn-danger btn-icon btn-sm"
                            title="Delete enquiry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer info */}
          <div
            style={{
              padding: '0.9rem 1.25rem',
              backgroundColor: 'rgba(7, 10, 19, 0.7)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}
          >
            <div>
              Showing {enquiries.length} {enquiries.length === 1 ? 'record' : 'records'}
            </div>
            <div className="mono">REST Endpoints: GET/POST/PATCH/DELETE /api/enquiries</div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <EnquiryDetailModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onStatusChange={handleStatusQuickChange}
          onDelete={handleDelete}
        />
      )}

      <style>{`
        .table-row:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;
