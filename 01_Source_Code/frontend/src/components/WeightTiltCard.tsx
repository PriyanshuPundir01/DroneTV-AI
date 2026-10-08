import React, { useRef, useState, useCallback } from 'react';

export interface WeightTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  glare?: boolean;
}

export const WeightTiltCard: React.FC<WeightTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 13,
  perspective = 1100,
  glare = true,
  style = {},
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1100px) rotateX(0deg) rotateY(0deg)');
  const [boxShadow, setBoxShadow] = useState<string>('');
  const [borderColor, setBorderColor] = useState<string>('');
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates from center: -1 to +1
    const cx = (x / rect.width - 0.5) * 2;
    const cy = (y / rect.height - 0.5) * 2;

    // Weight tilt physics:
    // Pushing down on any edge makes that edge sink backward (into screen)
    // while the opposite edge rises forward (towards user).
    const rotateX = cy * maxTilt;
    const rotateY = cx * maxTilt;

    // Dynamic directional shadow shifting opposite to the tilt
    const shadowX = -cx * 18;
    const shadowY = -cy * 18;

    setTransform(`perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0px)`);
    setBoxShadow(`${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 38px rgba(0, 0, 0, 0.65), 0 0 25px rgba(0, 242, 254, 0.2)`);
    setBorderColor('rgba(0, 242, 254, 0.55)');

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 1
      });
    }
  }, [maxTilt, perspective, glare]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`);
    setBoxShadow('');
    setBorderColor('');
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [perspective, glare]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`weight-tilt-card ${className}`}
      style={{
        ...style,
        transform,
        boxShadow: boxShadow || (style.boxShadow as string) || undefined,
        borderColor: borderColor || (style.borderColor as string) || undefined,
        transition: isHovered
          ? 'transform 0.08s cubic-bezier(0.2, 0, 0.4, 1), box-shadow 0.1s ease, border-color 0.25s ease'
          : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.4s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform, box-shadow',
        position: 'relative'
      }}
      {...props}
    >
      {children}

      {/* Dynamic Specular 3D Glare Reflection */}
      {glare && (
        <div
          className="weight-tilt-glare"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 15,
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0, 242, 254, 0.18) 0%, rgba(56, 189, 248, 0.05) 45%, transparent 75%)`,
            transition: isHovered ? 'opacity 0.2s ease' : 'opacity 0.5s ease'
          }}
        />
      )}
    </div>
  );
};
