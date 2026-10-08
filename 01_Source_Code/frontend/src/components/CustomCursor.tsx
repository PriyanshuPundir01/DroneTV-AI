import React, { useEffect, useState, useRef } from 'react';
import { soundFx } from '../utils/soundEffects';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dronetv_custom_cursor') !== 'false';
    } catch {
      return true;
    }
  });

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInput, setIsInput] = useState<boolean>(false);
  const [targetType, setTargetType] = useState<string>('');
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [trailPath, setTrailPath] = useState<string>('');
  const [trailNodes, setTrailNodes] = useState<{ x: number; y: number; progress: number }[]>([]);

  const droneRef = useRef<HTMLDivElement>(null);
  const lastHoverTarget = useRef<HTMLElement | null>(null);

  // Smooth flight physics refs
  const mousePos = useRef({ x: -100, y: -100 });
  const dronePos = useRef({ x: -100, y: -100 });
  const droneAngle = useRef<number>(0);
  const bankRoll = useRef<number>(0);
  const trailHistory = useRef<TrailPoint[]>([]);
  const animFrameId = useRef<number | null>(null);

  const toggleCursor = () => {
    setIsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dronetv_custom_cursor', String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (!isEnabled) {
      document.body.classList.remove('has-custom-cursor');
      return;
    }

    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        // Spotlight dynamic updates on glass cards
        const card = target.closest('.glass-card') as HTMLElement | null;
        if (card) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }

        const isBtn = Boolean(target.closest('button') || target.getAttribute('role') === 'button');
        const isLink = Boolean(target.closest('a'));
        const isTargetCard = Boolean(target.closest('.four-edge-card') || target.closest('.glass-card') || target.closest('.interactive-target'));
        const isChatbot = Boolean(target.closest('.chatbot-trigger'));

        const isInteractive = isBtn || isLink || isTargetCard || isChatbot;

        const isInputField = Boolean(
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT'
        );

        // Sound trigger on acquiring a new target
        const interactiveParent = (target.closest('button, a, .four-edge-card, .glass-card, .interactive-target') as HTMLElement | null) || (isInputField ? target : null);
        if (interactiveParent && interactiveParent !== lastHoverTarget.current) {
          lastHoverTarget.current = interactiveParent;
          soundFx.playHoverTick();
        } else if (!interactiveParent) {
          lastHoverTarget.current = null;
        }

        setIsHovering(isInteractive);
        setIsInput(isInputField);

        if (isInputField) {
          setTargetType('INPUT MODE');
        } else if (isBtn) {
          setTargetType('LOCK-ON');
        } else if (isLink) {
          setTargetType('NAV-WAYPOINT');
        } else if (isTargetCard) {
          setTargetType('AERIAL INSPECT');
        } else {
          setTargetType('');
        }

        setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
    };

    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Physics flight loop (GPU Lerp & Heading Trajectory)
    const render = () => {
      const now = performance.now();

      // Lerp position towards mouse pointer
      const dx = mousePos.current.x - dronePos.current.x;
      const dy = mousePos.current.y - dronePos.current.y;
      const speed = Math.hypot(dx, dy);

      dronePos.current.x += dx * 0.22;
      dronePos.current.y += dy * 0.22;

      // Calculate flight heading angle
      if (speed > 1.2) {
        const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        let diff = (targetAngle - droneAngle.current) % 360;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        droneAngle.current += diff * 0.16;

        // Banking roll tilt based on horizontal velocity
        const targetRoll = Math.max(-20, Math.min(20, dx * 0.65));
        bankRoll.current += (targetRoll - bankRoll.current) * 0.15;
      } else {
        // Smooth return to upright orientation when hovering
        let diff = (0 - droneAngle.current) % 360;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        droneAngle.current += diff * 0.08;
        bankRoll.current += (0 - bankRoll.current) * 0.12;
      }

      // Add gentle idle hovering float oscillation
      const hoverFloatY = Math.sin(now * 0.0035) * 2.2;
      const hoverFloatX = Math.cos(now * 0.0025) * 1.2;

      const currentX = dronePos.current.x + (speed < 2 ? hoverFloatX : 0);
      const currentY = dronePos.current.y + (speed < 2 ? hoverFloatY : 0);

      // Record gradient contrail points if drone has moved
      const lastPoint = trailHistory.current[0];
      if (!lastPoint || Math.hypot(currentX - lastPoint.x, currentY - lastPoint.y) > 3) {
        trailHistory.current.unshift({
          x: currentX,
          y: currentY,
          timestamp: now
        });
      }

      // Prune trail points older than 420ms
      trailHistory.current = trailHistory.current.filter((p) => now - p.timestamp < 420);

      // Construct smooth SVG Catmull-Rom spline path for gradient ribbon
      const points = trailHistory.current;
      if (points.length >= 2) {
        let pathStr = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          pathStr += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
        }
        setTrailPath(pathStr);

        // Calculate discrete gradient nodes for extra plasma bloom
        const nodes = points.slice(0, 10).map((pt, idx) => ({
          x: pt.x,
          y: pt.y,
          progress: idx / 10
        }));
        setTrailNodes(nodes);
      } else {
        setTrailPath('');
        setTrailNodes([]);
      }

      // Update drone DOM transform with translation, heading rotation, and 3D banking roll
      if (droneRef.current) {
        droneRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${droneAngle.current}deg) skewX(${bankRoll.current * 0.4}deg)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isEnabled, isVisible]);

  // Clean up ripples after animation
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => Date.now() - r.id < 600));
    }, 600);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (!isEnabled) {
    return (
      <button
        onClick={toggleCursor}
        className="cursor-toggle-btn"
        title="Enable Drone Telemetry Crosshair Cursor"
        aria-label="Enable Custom Drone Cursor"
      >
        <span>🛸 Drone Cursor: Off</span>
      </button>
    );
  }

  return (
    <>
      {/* Flight Contrail Gradient SVG Canvas */}
      <svg
        className="drone-trail-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99990,
          overflow: 'visible'
        }}
      >
        <defs>
          {/* Vibrant Multi-Stop Drone Flight Contrail Gradient */}
          <linearGradient id="drone-contrail-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#818cf8" stopOpacity="0.5" />
            <stop offset="85%" stopColor="#c084fc" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>

          {/* Core White Energy Line Gradient */}
          <linearGradient id="drone-core-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#00f2fe" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>

          {/* High-Tech Contrail Glow Filter */}
          <filter id="contrail-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Glowing Gradient Contrail Ribbon */}
        {trailPath && (
          <path
            d={trailPath}
            fill="none"
            stroke="url(#drone-contrail-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#contrail-glow)"
          />
        )}

        {/* Inner High-Intensity Core Filament */}
        {trailPath && (
          <path
            d={trailPath}
            fill="none"
            stroke="url(#drone-core-beam)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Trailing Plasma Beads with Tapering Radii */}
        {trailNodes.map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={Math.max(1.2, 5 * (1 - node.progress))}
            fill={i % 2 === 0 ? '#00f2fe' : '#818cf8'}
            opacity={(1 - node.progress) * 0.75}
            filter="url(#contrail-glow)"
          />
        ))}
      </svg>

      {/* Main Flying Drone Shape Cursor */}
      <div
        ref={droneRef}
        className={`drone-cursor-wrapper ${isHovering ? 'is-hover' : ''} ${
          isClicking ? 'is-clicking' : ''
        } ${isInput ? 'is-input' : ''} ${isVisible ? 'is-visible' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          marginLeft: '-23px',
          marginTop: '-12px',
          transformOrigin: '23px 12px'
        }}
      >
        <svg
          width="46"
          height="46"
          viewBox="0 0 60 60"
          className="drone-svg-model"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Reactor Glow */}
            <filter id="reactor-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Forward Searchlight Cone */}
            <linearGradient id="searchlight-cone" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#00f2fe" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
            </linearGradient>

            {/* Carbon Arm Metal Gradient */}
            <linearGradient id="carbon-arm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#00f2fe" />
            </linearGradient>
          </defs>

          {/* Forward Searchlight Cone (active scan beam ahead of the drone) */}
          <polygon
            points="30,16 6,-24 54,-24"
            fill="url(#searchlight-cone)"
            className="drone-searchlight"
          />

          {/* 4 Carbon-Fiber Motor Arms */}
          {/* Front-Left Arm */}
          <line x1="30" y1="26" x2="12" y2="10" stroke="url(#carbon-arm)" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="26" x2="12" y2="10" stroke="#00f2fe" strokeWidth="0.8" opacity="0.8" />

          {/* Front-Right Arm */}
          <line x1="30" y1="26" x2="48" y2="10" stroke="url(#carbon-arm)" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="26" x2="48" y2="10" stroke="#00f2fe" strokeWidth="0.8" opacity="0.8" />

          {/* Rear-Left Arm */}
          <line x1="30" y1="36" x2="12" y2="50" stroke="url(#carbon-arm)" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="36" x2="12" y2="50" stroke="#00f2fe" strokeWidth="0.8" opacity="0.8" />

          {/* Rear-Right Arm */}
          <line x1="30" y1="36" x2="48" y2="50" stroke="url(#carbon-arm)" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="36" x2="48" y2="50" stroke="#00f2fe" strokeWidth="0.8" opacity="0.8" />

          {/* 4 Spinning Rotor Discs with Propellers */}
          {/* Front-Left Rotor (Port Navigation LED: Red) */}
          <g transform="translate(12, 10)">
            <circle r="9.5" fill="rgba(0, 242, 254, 0.08)" stroke="rgba(0, 242, 254, 0.35)" strokeWidth="0.8" strokeDasharray="3 2" />
            <g className="propeller-spin">
              <line x1="-8.5" y1="0" x2="8.5" y2="0" stroke="rgba(0, 242, 254, 0.85)" strokeWidth="1.5" strokeLinecap="round" />
              <circle r="2" fill="#0f172a" stroke="#00f2fe" strokeWidth="1" />
            </g>
            <circle cx="0" cy="0" r="1.5" fill="#ef4444" className="nav-led-pulse" />
          </g>

          {/* Front-Right Rotor (Starboard Navigation LED: Green) */}
          <g transform="translate(48, 10)">
            <circle r="9.5" fill="rgba(0, 242, 254, 0.08)" stroke="rgba(0, 242, 254, 0.35)" strokeWidth="0.8" strokeDasharray="3 2" />
            <g className="propeller-spin-reverse">
              <line x1="-8.5" y1="0" x2="8.5" y2="0" stroke="rgba(0, 242, 254, 0.85)" strokeWidth="1.5" strokeLinecap="round" />
              <circle r="2" fill="#0f172a" stroke="#00f2fe" strokeWidth="1" />
            </g>
            <circle cx="0" cy="0" r="1.5" fill="#10b981" className="nav-led-pulse" />
          </g>

          {/* Rear-Left Rotor (Aft Beacon LED: Cyan) */}
          <g transform="translate(12, 50)">
            <circle r="9.5" fill="rgba(0, 242, 254, 0.08)" stroke="rgba(0, 242, 254, 0.35)" strokeWidth="0.8" strokeDasharray="3 2" />
            <g className="propeller-spin-reverse">
              <line x1="-8.5" y1="0" x2="8.5" y2="0" stroke="rgba(0, 242, 254, 0.85)" strokeWidth="1.5" strokeLinecap="round" />
              <circle r="2" fill="#0f172a" stroke="#00f2fe" strokeWidth="1" />
            </g>
            <circle cx="0" cy="0" r="1.5" fill="#00f2fe" />
          </g>

          {/* Rear-Right Rotor (Aft Beacon LED: Cyan) */}
          <g transform="translate(48, 50)">
            <circle r="9.5" fill="rgba(0, 242, 254, 0.08)" stroke="rgba(0, 242, 254, 0.35)" strokeWidth="0.8" strokeDasharray="3 2" />
            <g className="propeller-spin">
              <line x1="-8.5" y1="0" x2="8.5" y2="0" stroke="rgba(0, 242, 254, 0.85)" strokeWidth="1.5" strokeLinecap="round" />
              <circle r="2" fill="#0f172a" stroke="#00f2fe" strokeWidth="1" />
            </g>
            <circle cx="0" cy="0" r="1.5" fill="#00f2fe" />
          </g>

          {/* Central Aerodynamic Fuselage Hull */}
          <polygon
            points="30,17 38,26 36,43 24,43 22,26"
            fill="#070d1a"
            stroke="#00f2fe"
            strokeWidth="1.5"
          />

          {/* Canopy Cockpit Shield */}
          <polygon
            points="30,20 35,27 34,39 26,39 25,27"
            fill="#0f172a"
            stroke="rgba(0, 242, 254, 0.55)"
            strokeWidth="0.8"
          />

          {/* Center Fusion Reactor Core */}
          <circle
            cx="30"
            cy="32"
            r="3.2"
            fill={isClicking ? '#10b981' : '#00f2fe'}
            filter="url(#reactor-glow)"
          />

          {/* Forward 4K Cinema Gimbal Camera */}
          <ellipse cx="30" cy="18" rx="3.5" ry="2.2" fill="#070a13" stroke="#00f2fe" strokeWidth="1" />
          <circle cx="30" cy="18" r="1.4" fill="#38bdf8" />

          {/* Precision Laser Aiming Pip (Focal Click Point) */}
          <circle
            cx="30"
            cy="16"
            r="2"
            fill="#ffffff"
            stroke="#00f2fe"
            strokeWidth="1"
            className="drone-laser-pip"
          />
        </svg>

        {/* Dynamic HUD Target Label */}
        {isVisible && (isHovering || isInput) && (
          <div className="reticle-hud-badge drone-badge">
            <span className="reticle-badge-dot" />
            <span className="reticle-badge-text">{isClicking ? 'ENGAGED' : targetType}</span>
          </div>
        )}

        {/* Dynamic Telemetry Coordinates */}
        {isVisible && isHovering && (
          <div className="reticle-hud-coords drone-coords">
            X:{coords.x} Y:{coords.y}
          </div>
        )}
      </div>

      {/* Radar Shockwave Ripples on Click */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="drone-click-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`
          }}
        />
      ))}

      {/* Discreet Toggle Button */}
      <button
        onClick={toggleCursor}
        className="cursor-toggle-btn active"
        title="Toggle between Drone Cursor and System Pointer"
        aria-label="Toggle Custom Cursor"
      >
        <span>🛸 Drone Cursor: Active</span>
      </button>
    </>
  );
};
