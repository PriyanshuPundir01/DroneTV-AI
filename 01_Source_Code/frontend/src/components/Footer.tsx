import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'services' | 'courses' | 'contact' | 'admin') => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenChat }) => {
  return (
    <footer
      style={{
        backgroundColor: '#05070e',
        borderTop: '1px solid var(--border-subtle)',
        padding: '4rem 0 2rem 0',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Brand info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🛸</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#fff'
                }}
              >
                Drone<span style={{ color: 'var(--accent-cyan)' }}>TV</span>
              </span>
            </div>

            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              India's premier drone technology and DGCA flight training platform. Bridging industry
              aerial solutions with certified next-generation pilot education.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>DGCA Aligned Commercial Framework</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Platform Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                >
                  Overview & Telemetry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                >
                  Enterprise Aerial Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                >
                  DGCA Flight Academy & FPV
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                >
                  Submit Enquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                >
                  Admin CRM Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Chatbot & Services */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>AI Support & Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <button
                  onClick={onOpenChat}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                >
                  Launch Rule-Based AI Assistant
                </button>
              </li>
              <li>Aerial Cinematography 8K</li>
              <li>LiDAR Point Cloud Surveying</li>
              <li>Agricultural Drone Spraying</li>
              <li>Solar & Wind Turbine Thermal Audit</li>
              <li>Student Scholarships & Discounts</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Contact DroneTV</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--accent-cyan)" />
                <span>+91 88043 49999 / +91 63032 30227</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="var(--accent-cyan)" />
                <span>pindipolu@ipageums.com</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={15} color="var(--accent-cyan)" style={{ marginTop: '3px' }} />
                <span>Aero Tech Park, Hyderabad / Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} DroneTV AI Support & Lead Assistant. Reference website context from{' '}
            <a
              href="https://dronetv.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
            >
              DroneTV.in <ExternalLink size={12} style={{ display: 'inline' }} />
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built for IPAGE Group Internship by</span>
            <strong style={{ color: '#f8fafc' }}>Priyanshu Pundir</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};
