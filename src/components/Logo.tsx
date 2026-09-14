import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'icon-only' | 'framed' | 'vertical';
  className?: string;
  lightMode?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | 'banner' | 'custom';
  customSize?: number;
  overlap?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'horizontal', 
  className = '', 
  lightMode = false,
  size = 'md',
  customSize
}) => {
  const uid = React.useId().replace(/:/g, '');

  // Unique Gradient IDs
  const bubbleGradId = `wow-bubble-grad-${uid}`;
  const wowTextGradId = `wow-text-grad-${uid}`;
  const soundWaveGradId = `wow-wave-grad-${uid}`;
  const sparkleGradId = `wow-sparkle-grad-${uid}`;

  // Pixel heights for proportional sizing when className is not specifying height
  const heightMapping = {
    sm: 32,
    md: 44,
    lg: 56,
    banner: 64,
    xl: 76,
    '2xl': 96,
    hero: 120,
    custom: customSize || 48,
  }[size];

  // If variant is icon-only, render just the Speech Bubble Mark
  if (variant === 'icon-only') {
    return (
      <svg 
        viewBox="120 42 260 245" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`shrink-0 select-none ${className}`}
        style={!className.includes('h-') && !className.includes('w-') ? { height: heightMapping, width: 'auto' } : undefined}
        aria-label="WOW Speech Bubble Mark"
        role="img"
      >
        <defs>
          {/* Speech Bubble Perimeter Gradient: Sky Blue to Royal Blue to Electric Purple */}
          <linearGradient id={bubbleGradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#00C8FF" />
            <stop offset="35%" stopColor="#0066FF" />
            <stop offset="70%" stopColor="#3700E0" />
            <stop offset="100%" stopColor="#5E00FF" />
          </linearGradient>

          {/* Equalizer Soundwave Gradient */}
          <linearGradient id={soundWaveGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#004AD9" />
          </linearGradient>

          {/* Sparkles Gradient */}
          <linearGradient id={sparkleGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
        </defs>

        {/* Bubble White Interior Canvas Fill */}
        <path
          d="M 250 56 C 187 56 136 103 136 161 C 136 186 145 208 160 226 C 152 250 138 264 136 266 C 134.5 268 135 270.5 137 272 C 138 273 139 273 140 273 C 165 273 189 258 205 246 C 219 255 234 260 250 260 C 313 260 364 213 364 161 C 364 103 313 56 250 56 Z"
          fill="#FFFFFF"
        />

        {/* Bubble Gradient Perimeter Stroke */}
        <path
          d="M 250 56 C 187 56 136 103 136 161 C 136 186 145 208 160 226 C 152 250 138 264 136 266 C 134.5 268 135 270.5 137 272 C 138 273 139 273 140 273 C 165 273 189 258 205 246 C 219 255 234 260 250 260 C 313 260 364 213 364 161 C 364 103 313 56 250 56 Z"
          stroke={`url(#${bubbleGradId})`}
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Equalizer Soundwave Bars & Sparkles */}
        <circle cx="188" cy="165" r="7.5" fill={`url(#${soundWaveGradId})`} />
        <rect x="201" y="147" width="13" height="36" rx="6.5" fill={`url(#${soundWaveGradId})`} />
        <rect x="220" y="124" width="14" height="82" rx="7" fill={`url(#${soundWaveGradId})`} />
        <rect x="242.5" y="103" width="15" height="124" rx="7.5" fill={`url(#${soundWaveGradId})`} />
        <rect x="266" y="124" width="14" height="82" rx="7" fill={`url(#${soundWaveGradId})`} />
        <rect x="286" y="147" width="13" height="36" rx="6.5" fill={`url(#${soundWaveGradId})`} />
        <circle cx="312" cy="165" r="7.5" fill={`url(#${soundWaveGradId})`} />

        {/* Sparkle Star 1 */}
        <path
          d="M 295 106 L 299.5 89 L 313 84.5 L 299.5 80 L 295 63 L 290.5 80 L 277 84.5 L 290.5 89 Z"
          fill={`url(#${sparkleGradId})`}
        />

        {/* Sparkle Star 2 */}
        <path
          d="M 314 123 L 316.5 115 L 324 113 L 316.5 111 L 314 103 L 311.5 111 L 304 113 L 311.5 115 Z"
          fill={`url(#${sparkleGradId})`}
        />
      </svg>
    );
  }

  // Official Main Logo (Horizontal Brand Lockup: Speech Bubble + WOW + Business & Digital Limited + Slogan)
  return (
    <svg 
      viewBox="0 0 800 250" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 select-none ${className}`}
      style={!className.includes('h-') && !className.includes('w-') ? { height: heightMapping, width: 'auto' } : undefined}
      aria-label="WOW Business & Digital Limited Logo"
      role="img"
    >
      <defs>
        {/* Speech Bubble Perimeter Gradient: Sky Blue to Royal Blue to Electric Purple */}
        <linearGradient id={bubbleGradId} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#00C8FF" />
          <stop offset="35%" stopColor="#0066FF" />
          <stop offset="70%" stopColor="#3700E0" />
          <stop offset="100%" stopColor="#5E00FF" />
        </linearGradient>

        {/* Equalizer Soundwave Gradient */}
        <linearGradient id={soundWaveGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#004AD9" />
        </linearGradient>

        {/* Sparkles Gradient */}
        <linearGradient id={sparkleGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00BFFF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>

        {/* WOW Text Vibrant Gradient */}
        <linearGradient id={wowTextGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A0FF" />
          <stop offset="45%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#003EDB" />
        </linearGradient>
      </defs>

      {/* 1. Speech Bubble Emblem on the Left */}
      <g transform="translate(-115, -34)">
        {/* Bubble White Interior Canvas Fill */}
        <path
          d="M 250 56 C 187 56 136 103 136 161 C 136 186 145 208 160 226 C 152 250 138 264 136 266 C 134.5 268 135 270.5 137 272 C 138 273 139 273 140 273 C 165 273 189 258 205 246 C 219 255 234 260 250 260 C 313 260 364 213 364 161 C 364 103 313 56 250 56 Z"
          fill="#FFFFFF"
        />

        {/* Bubble Gradient Perimeter Stroke */}
        <path
          d="M 250 56 C 187 56 136 103 136 161 C 136 186 145 208 160 226 C 152 250 138 264 136 266 C 134.5 268 135 270.5 137 272 C 138 273 139 273 140 273 C 165 273 189 258 205 246 C 219 255 234 260 250 260 C 313 260 364 213 364 161 C 364 103 313 56 250 56 Z"
          stroke={`url(#${bubbleGradId})`}
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Symmetrical Soundwave Equalizer Bars */}
        <circle cx="188" cy="165" r="7.5" fill={`url(#${soundWaveGradId})`} />
        <rect x="201" y="147" width="13" height="36" rx="6.5" fill={`url(#${soundWaveGradId})`} />
        <rect x="220" y="124" width="14" height="82" rx="7" fill={`url(#${soundWaveGradId})`} />
        <rect x="242.5" y="103" width="15" height="124" rx="7.5" fill={`url(#${soundWaveGradId})`} />
        <rect x="266" y="124" width="14" height="82" rx="7" fill={`url(#${soundWaveGradId})`} />
        <rect x="286" y="147" width="13" height="36" rx="6.5" fill={`url(#${soundWaveGradId})`} />
        <circle cx="312" cy="165" r="7.5" fill={`url(#${soundWaveGradId})`} />

        {/* Sparkle Star 1 */}
        <path
          d="M 295 106 L 299.5 89 L 313 84.5 L 299.5 80 L 295 63 L 290.5 80 L 277 84.5 L 290.5 89 Z"
          fill={`url(#${sparkleGradId})`}
        />

        {/* Sparkle Star 2 */}
        <path
          d="M 314 123 L 316.5 115 L 324 113 L 316.5 111 L 314 103 L 311.5 111 L 304 113 L 311.5 115 Z"
          fill={`url(#${sparkleGradId})`}
        />
      </g>

      {/* 2. Text Brand Lockup on the Right */}
      {/* Line 1: WOW Display Typography */}
      <text 
        x="280" 
        y="126" 
        fill={`url(#${wowTextGradId})`}
        style={{ 
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Inter", sans-serif', 
          fontWeight: 900, 
          fontSize: '110px', 
          letterSpacing: '-1.5px'
        }}
      >
        WOW
      </text>

      {/* Line 2: Business & Digital Limited */}
      <text 
        x="283" 
        y="174" 
        fill={lightMode ? '#FFFFFF' : '#0B1E3D'}
        style={{ 
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Inter", sans-serif', 
          fontWeight: 700, 
          fontSize: '35px', 
          letterSpacing: '-0.3px'
        }}
      >
        Business &amp; Digital Limited
      </text>

      {/* Line 3: TRANSFORMATION • INNOVATION • GROWTH with Accent Lines */}
      <g>
        {/* Left Accent Rule Line */}
        <line 
          x1="284" 
          y1="204" 
          x2="324" 
          y2="204" 
          stroke={lightMode ? '#38BDF8' : '#0066FF'} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />

        {/* Slogan Text */}
        <text 
          x="336" 
          y="209" 
          fill={lightMode ? '#F1F5F9' : '#0B1E3D'}
          style={{ 
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Inter", sans-serif', 
            fontWeight: 800, 
            fontSize: '12px', 
            letterSpacing: '0.17em'
          }}
        >
          TRANSFORMATION <tspan fill={lightMode ? '#38BDF8' : '#0066FF'} fontWeight="900">•</tspan> INNOVATION <tspan fill={lightMode ? '#38BDF8' : '#0066FF'} fontWeight="900">•</tspan> GROWTH
        </text>

        {/* Right Accent Rule Line */}
        <line 
          x1="738" 
          y1="204" 
          x2="784" 
          y2="204" 
          stroke={lightMode ? '#38BDF8' : '#0066FF'} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
      </g>
    </svg>
  );
};
