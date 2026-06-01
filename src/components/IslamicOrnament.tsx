import React from 'react';

interface OrnamentProps {
  color: string;
  size?: number;
  className?: string;
}

export const IslamicCorner: React.FC<OrnamentProps> = ({ color, size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ pointerEvents: 'none' }}
      id="islamic-corner-ornament-svg"
    >
      <path
        d="M5 5H95V15H15V95H5V5Z"
        fill={color}
        fillOpacity="0.2"
      />
      <path
        d="M10 10H90V13H13V90H10V10Z"
        fill={color}
        fillOpacity="0.8"
      />
      <path
        d="M20 20H80C80 20 65 35 50 35C35 35 20 20 20 20Z"
        fill={color}
        fillOpacity="0.4"
      />
      <path
        d="M20 20V80C20 80 35 65 35 50C35 35 20 20 20 20Z"
        fill={color}
        fillOpacity="0.4"
      />
      <circle cx="50" cy="50" r="6" fill={color} />
      <circle cx="28" cy="28" r="4" fill={color} />
      <path
        d="M0 0 L15 15 M0 0 L0 30 M0 0 L30 0"
        stroke={color}
        strokeWidth="3"
      />
    </svg>
  );
};

export const IslamicDivider: React.FC<OrnamentProps> = ({ color, size = 120, className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 select-none ${className}`} style={{ width: size }} id="islamic-divider-ornament">
      <div className="h-[1px] flex-1 opacity-40 bg-gradient-to-r from-transparent to-current" style={{ backgroundColor: color }} />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color }}
        id="islamic-divider-star-svg"
      >
        <path
          d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
          fill="currentColor"
          fillOpacity="0.9"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" className="text-white" />
      </svg>
      <div className="h-[1px] flex-1 opacity-40 bg-gradient-to-l from-transparent to-current" style={{ backgroundColor: color }} />
    </div>
  );
};

export const IslamicPatternBackground: React.FC<{ color: string; opacity?: number }> = ({
  color,
  opacity = 0.03,
}) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        opacity: opacity,
      }}
      id="islamic-pattern-background"
    />
  );
};
