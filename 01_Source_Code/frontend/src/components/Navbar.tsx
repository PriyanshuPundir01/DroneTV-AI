import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Bot,
  Layers,
  GraduationCap,
  Mail,
  ShieldCheck,
  Menu,
  X,
  Activity,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

interface NavbarProps {
  activeTab: 'home' | 'services' | 'courses' | 'contact' | 'admin';
  setActiveTab: (tab: 'home' | 'services' | 'courses' | 'contact' | 'admin') => void;
  openChatbot: () => void;
  unreadCount?: number;
  isAdminAuthenticated?: boolean;
  onOpenAdminLogin?: () => void;
  onReplayIntro?: () => void;
}

interface NavItem {
  id: 'home' | 'services' | 'courses' | 'contact' | 'admin';
  label: string;
  icon: any;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openChatbot,
  onReplayIntro
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.checkHealth();
        setBackendOnline(res?.success ?? false);
      } catch {
        setBackendOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Overview', icon: Navigation },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'courses', label: 'Courses & Training', icon: GraduationCap },
    { id: 'contact', label: 'Enquiry', icon: Mail },
    {
      id: 'admin',
      label: 'Admin Portal',
      icon: ShieldCheck,
      badge: 'CRM'
    }
  ];

  const handleNavClick = (id: 'home' | 'services' | 'courses' | 'contact' | 'admin') => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 800,
        backgroundColor: 'rgba(7, 10, 19, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all 0.2s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '10px',
              background: 'var(--gradient-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#070a13' }}>🛸</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#fff'
                }}
              >
                Drone<span style={{ color: 'var(--accent-cyan)' }}>TV</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(0, 242, 254, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  letterSpacing: '0.05em'
                }}
              >
                AI ASSIST
              </span>
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.02em'
              }}
            >
              India's Premier Drone Tech & Academy
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: 'rgba(0, 242, 254, 0.15)',
                      color: 'var(--accent-cyan)',
                      fontWeight: 700
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action & Status Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* API Health indicator */}
          <div
            title={
              backendOnline === true
                ? 'Backend API Connected (Port 5000)'
                : backendOnline === false
                ? 'Backend Offline'
                : 'Connecting to API...'
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background:
                  backendOnline === true
                    ? 'var(--accent-emerald)'
                    : backendOnline === false
                    ? 'var(--accent-rose)'
                    : '#f59e0b',
                boxShadow:
                  backendOnline === true
                    ? '0 0 8px var(--accent-emerald)'
                    : backendOnline === false
                    ? '0 0 8px var(--accent-rose)'
                    : 'none'
              }}
            />
            <span style={{ display: 'none' }} className="status-text">
              {backendOnline === true ? 'API LIVE' : backendOnline === false ? 'API OFFLINE' : 'CHECKING'}
            </span>
            <Activity size={12} color="var(--text-muted)" />
          </div>

          {/* Replay Intro Animation Button */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                padding: '0.4rem 0.75rem'
              }}
              title="Replay DroneTV Introduction Animation"
            >
              <Sparkles size={14} color="var(--accent-cyan)" />
              <span style={{ display: 'none' }} className="status-text">Intro</span>
            </button>
          )}

          {/* Quick Chatbot Trigger */}
          <button
            onClick={openChatbot}
            className="btn btn-primary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Bot size={16} />
            <span>AI Assistant</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-icon mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'rgba(13, 19, 34, 0.98)',
            borderBottom: '1px solid var(--border-accent)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'modal-appear 0.2s ease'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .status-text {
            display: inline !important;
          }
        }
      `}</style>
    </header>
  );
};
