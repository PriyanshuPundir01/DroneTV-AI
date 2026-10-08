import React from 'react';
import { WeightTiltCard } from './WeightTiltCard';
import {
  Compass,
  ArrowRight,
  Bot,
  Award,
  Users,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface HeroProps {
  onOpenChat: () => void;
  onExploreCourses: () => void;
  onExploreServices: () => void;
  onReplayIntro?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenChat,
  onExploreCourses,
  onExploreServices,
  onReplayIntro
}) => {
  return (
    <section
      style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3.5rem',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          {/* Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Tag badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '9999px',
                  background: 'rgba(0, 242, 254, 0.1)',
                  border: '1px solid var(--border-accent)',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}
              >
                <Sparkles size={14} />
                NEXT-GEN DRONE TECH & FLIGHT ACADEMY
              </span>

              {onReplayIntro && (
                <button
                  onClick={onReplayIntro}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '9999px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Replay DroneTV Start Animation"
                >
                  <Sparkles size={11} color="var(--accent-cyan)" />
                  <span>Replay Start Animation</span>
                </button>
              )}
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: '-0.03em'
              }}
            >
              Elevate Your Future with{' '}
              <span className="gradient-text">DroneTV Aerial Intelligence</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: '620px'
              }}
            >
              From DGCA-certified commercial pilot training to enterprise LiDAR surveying,
              cinematography broadcasting, and precision agriculture. Experience 24/7 rule-based
              AI support and instant enquiry fulfillment.
            </p>

            {/* CTA Group */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                paddingTop: '0.5rem'
              }}
            >
              <button onClick={onOpenChat} className="btn btn-primary">
                <Bot size={18} />
                <span>Ask AI Assistant</span>
              </button>

              <button onClick={onExploreCourses} className="btn btn-secondary">
                <span>View Certified Courses</span>
                <ArrowRight size={16} />
              </button>

              <button onClick={onExploreServices} className="btn btn-outline">
                <Compass size={16} />
                <span>Enterprise Services</span>
              </button>
            </div>

            {/* Highlights row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                paddingTop: '1rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>DGCA Authorized Framework</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>100% Practical Simulator & Flight Hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>Instant Enquiry Routing</span>
              </div>
            </div>
          </div>

          {/* Right Visual Dashboard Widget with 3D Weight Tilt */}
          <WeightTiltCard
            className="glass-card"
            maxTilt={10}
            style={{
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              background: 'radial-gradient(circle at 80% 20%, rgba(0, 242, 254, 0.08), rgba(15, 23, 42, 0.95))'
            }}
          >
            {/* Telemetry Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--accent-emerald)',
                    boxShadow: '0 0 10px var(--accent-emerald)'
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  AERIAL TELEMETRY RADAR • ACTIVE
                </span>
              </div>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                FREQ: 5.8GHz | HD LINK
              </span>
            </div>

            {/* Radar Sweep Graphic */}
            <div
              style={{
                position: 'relative',
                height: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed rgba(0, 242, 254, 0.2)',
                borderRadius: '16px',
                background: 'rgba(7, 10, 19, 0.6)',
                overflow: 'hidden'
              }}
            >
              {/* Concentric rings */}
              <div
                style={{
                  position: 'absolute',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: '1px solid rgba(0, 242, 254, 0.15)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '1px solid rgba(0, 242, 254, 0.25)'
                }}
              />

              {/* Sweeping radar needle */}
              <div
                style={{
                  position: 'absolute',
                  width: '220px',
                  height: '220px',
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg at 50% 50%, rgba(0, 242, 254, 0.3) 0deg, transparent 60deg)',
                  animation: 'radar-sweep 4s linear infinite',
                  pointerEvents: 'none'
                }}
              />

              {/* Center Drone Icon with Interactive Hover & Ping */}
              <div
                onClick={() => soundFx.playRadarPing()}
                title="Telemetry Drone Target • Click to Ping Radar"
                style={{
                  position: 'relative',
                  zIndex: 2,
                  width: '4.25rem',
                  height: '4.25rem',
                  borderRadius: '50%',
                  background: 'rgba(0, 242, 254, 0.18)',
                  border: '1.5px solid var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(0, 242, 254, 0.45)',
                  animation: 'float-drone 3s ease-in-out infinite',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="interactive-target"
              >
                <span style={{ fontSize: '1.9rem', userSelect: 'none' }}>🛸</span>
              </div>

              {/* Waypoint Blips */}
              <div
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '30%',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-amber)',
                  boxShadow: '0 0 8px var(--accent-amber)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '28%',
                  right: '25%',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-emerald)',
                  boxShadow: '0 0 8px var(--accent-emerald)'
                }}
              />
            </div>

            {/* Quick Live Stats Pill Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginTop: '1.5rem'
              }}
            >
              <div
                style={{
                  padding: '0.75rem',
                  background: 'rgba(13, 19, 34, 0.7)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DGCA FLEET</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  Small/Med
                </div>
              </div>

              <div
                style={{
                  padding: '0.75rem',
                  background: 'rgba(13, 19, 34, 0.7)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MAX RANGE</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  15+ KM
                </div>
              </div>

              <div
                style={{
                  padding: '0.75rem',
                  background: 'rgba(13, 19, 34, 0.7)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RESOLUTION</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  8K Cinema
                </div>
              </div>
            </div>
          </WeightTiltCard>
        </div>

        {/* Global Key Metrics Bar with 3D Weight Tilt */}
        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}
        >
          <WeightTiltCard className="glass-card" maxTilt={12} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '12px',
                background: 'rgba(0, 242, 254, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={24} color="var(--accent-cyan)" />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>5,200+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Certified Drone Pilots</div>
            </div>
          </WeightTiltCard>

          <WeightTiltCard className="glass-card" maxTilt={12} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={24} color="var(--accent-emerald)" />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>140+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Enterprise Deployments</div>
            </div>
          </WeightTiltCard>

          <WeightTiltCard className="glass-card" maxTilt={12} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={24} color="var(--accent-amber)" />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>99.8%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>DGCA Examination Pass Rate</div>
            </div>
          </WeightTiltCard>

          <WeightTiltCard className="glass-card" maxTilt={12} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={24} color="var(--accent-indigo)" />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>&lt; 2 Min</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>AI Response Resolution</div>
            </div>
          </WeightTiltCard>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .hero-grid {
            gridTemplateColumns: 1.15fr 0.85fr !important;
          }
        }
      `}</style>
    </section>
  );
};
