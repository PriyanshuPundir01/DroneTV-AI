import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  FastForward,
  Radio,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Compass
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface DroneTVIntroAnimationProps {
  onComplete: () => void;
}

export const DroneTVIntroAnimation: React.FC<DroneTVIntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState<number>(0);
  const [altitude, setAltitude] = useState<number>(0);
  const [rpm, setRpm] = useState<number>(0);
  const [sats, setSats] = useState<number>(4);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getIsMuted());
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Toggle sound
  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const finishIntro = () => {
    setIsExiting(true);
    soundFx.playSuccess();
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  // Listen for Escape or Space to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Multi-phase timeline
  useEffect(() => {
    // Sound effect trigger
    soundFx.playBootSequence();

    // Progress counter (0 to 100% over 3.2s)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 55);

    // Dynamic metrics
    const metricsInterval = setInterval(() => {
      setAltitude((prev) => Math.min(120, +(prev + 3.8).toFixed(1)));
      setRpm((prev) => Math.min(8400, prev + 260));
      setSats((prev) => Math.min(28, prev + 1));
    }, 60);

    // Phase triggers
    const p2Timer = setTimeout(() => {
      setPhase(2);
      soundFx.playRadarPing();
    }, 800);

    const p3Timer = setTimeout(() => {
      setPhase(3);
      soundFx.playTypeTick();
    }, 1700);

    const p4Timer = setTimeout(() => {
      setPhase(4);
      soundFx.playSuccess();
    }, 2700);

    const endTimer = setTimeout(() => {
      finishIntro();
    }, 3800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(metricsInterval);
      clearTimeout(p2Timer);
      clearTimeout(p3Timer);
      clearTimeout(p4Timer);
      clearTimeout(endTimer);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#040711',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: isExiting ? 'none' : 'auto'
      }}
    >
      {/* High-tech Aerospace Background Grid */}
      <div
        className="telemetry-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          pointerEvents: 'none'
        }}
      />

      {/* Cybernetic HUD Vignette & Radial Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0, 242, 254, 0.12) 0%, rgba(4, 7, 17, 0.95) 80%)',
          pointerEvents: 'none'
        }}
      />

      {/* Top HUD Header Info */}
      <div
        style={{
          position: 'absolute',
          top: '1.75rem',
          left: '2rem',
          right: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 10px var(--accent-cyan)'
            }}
          />
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.08em' }}>
            DRONETV FLIGHT OS // v2.4 BOOT LOADER
          </span>
          <span style={{ display: 'none' }} className="desktop-hud-tag">
            • DGCA UIN: DTV-IND-2026-X
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleToggleSound}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              color: isMuted ? 'var(--text-muted)' : 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span>{isMuted ? 'MUTE' : 'AUDIO ON'}</span>
          </button>

          <button
            onClick={finishIntro}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(0, 242, 254, 0.12)',
              border: '1px solid var(--border-accent)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
          >
            <span>SKIP INTRO</span>
            <FastForward size={13} />
          </button>
        </div>
      </div>

      {/* Central Visual Showcase Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '680px',
          width: '90%',
          textAlign: 'center'
        }}
      >
        {/* Animated Hologram Radar & Drone Icon */}
        <div
          style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}
        >
          {/* Concentric rotating radar rings */}
          <div
            style={{
              position: 'absolute',
              width: '190px',
              height: '190px',
              borderRadius: '50%',
              border: '1px dashed rgba(0, 242, 254, 0.3)',
              animation: 'spin 12s linear infinite'
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 242, 254, 0.25)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              background: 'rgba(0, 242, 254, 0.05)'
            }}
          />

          {/* Radar sweep beam */}
          <div
            style={{
              position: 'absolute',
              width: '190px',
              height: '190px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(0, 242, 254, 0.35) 0deg, transparent 60deg)',
              animation: 'radar-sweep 2.8s linear infinite',
              pointerEvents: 'none'
            }}
          />

          {/* Central Animated Quadcopter Icon with Spinning Rotors */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              width: '5.5rem',
              height: '5.5rem',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, rgba(7, 10, 19, 0.9) 80%)',
              border: '2px solid var(--accent-cyan)',
              boxShadow: '0 0 35px rgba(0, 242, 254, 0.5), inset 0 0 20px rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'float-drone 2s ease-in-out infinite'
            }}
          >
            {/* 4 Spinning Rotor Circles */}
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                left: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px dashed var(--accent-cyan)',
                animation: 'spin 0.2s linear infinite'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px dashed var(--accent-cyan)',
                animation: 'spin 0.2s linear infinite'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px dashed var(--accent-cyan)',
                animation: 'spin 0.2s linear infinite'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px dashed var(--accent-cyan)',
                animation: 'spin 0.2s linear infinite'
              }}
            />

            <span style={{ fontSize: '2.5rem' }}>🛸</span>
          </div>
        </div>

        {/* Brand Reveal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid var(--border-accent)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              marginBottom: '0.85rem'
            }}
          >
            <Sparkles size={13} />
            <span>INITIALIZING AERIAL INTELLIGENCE SUITE</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: 0
            }}
          >
            Drone<span style={{ color: 'var(--accent-cyan)', textShadow: '0 0 25px rgba(0, 242, 254, 0.6)' }}>TV</span>{' '}
            <span className="gradient-text">AI ASSIST</span>
          </h1>

          <div
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem',
              letterSpacing: '0.04em'
            }}
          >
            India's Premier DGCA Drone Tech Academy & Enterprise Support Assistant
          </div>
        </div>

        {/* System Diagnostics Checklist */}
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            background: 'rgba(13, 19, 34, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            textAlign: 'left',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: phase >= 1 ? 'var(--accent-emerald)' : 'var(--text-muted)',
              transition: 'all 0.3s ease'
            }}
          >
            <CheckCircle2 size={14} color={phase >= 1 ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
            <span>Predefined Rule Q&A Engine (7 Protocols Loaded)</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: phase >= 2 ? 'var(--accent-emerald)' : 'var(--text-muted)',
              transition: 'all 0.3s ease'
            }}
          >
            <CheckCircle2 size={14} color={phase >= 2 ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
            <span>REST API & Lead Pipeline (/api/enquiries Active)</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: phase >= 3 ? 'var(--accent-emerald)' : 'var(--text-muted)',
              transition: 'all 0.3s ease'
            }}
          >
            <CheckCircle2 size={14} color={phase >= 3 ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
            <span>DGCA Pilot Fleet & Enterprise LiDAR Calibrated</span>
          </div>
        </div>

        {/* Progress Bar & Telemetry Readouts */}
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              marginBottom: '0.5rem'
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>
              {progress < 100 ? 'STARTING FLIGHT SYSTEMS...' : 'ALL SYSTEMS GO • LAUNCHING'}
            </span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{progress}%</span>
          </div>

          {/* Progress Track */}
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--gradient-cyan)',
                borderRadius: '9999px',
                boxShadow: '0 0 12px var(--accent-cyan)',
                transition: 'width 0.1s linear'
              }}
            />
          </div>

          {/* Real-time Telemetry Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginTop: '1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem'
            }}
          >
            <div style={{ padding: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>ALTITUDE</div>
              <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.9rem' }}>{altitude} m</div>
            </div>

            <div style={{ padding: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>MOTOR SPOOL</div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>{rpm} RPM</div>
            </div>

            <div style={{ padding: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>GNSS LOCK</div>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>{sats} SATS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Keyboard Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          zIndex: 10
        }}
      >
        PRESS <span style={{ color: 'var(--accent-cyan)' }}>[ESC]</span> OR <span style={{ color: 'var(--accent-cyan)' }}>[SPACE]</span> TO ENTER IMMEDIATELY
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .desktop-hud-tag {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
};
