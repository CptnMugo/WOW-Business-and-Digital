import React from 'react';
import { transparentSymbol } from '../assets/wbdTransparentSymbol';

interface LogoProps {
  variant?: 'horizontal' | 'icon-only' | 'framed' | 'vertical';
  className?: string;
  lightMode?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | 'banner' | 'custom';
  customSize?: number;
  overlap?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', customSize, lightMode = false }) => {
  const height = { sm:32, md:44, lg:56, banner:64, xl:76, '2xl':96, hero:120, custom:customSize || 48 }[size];
  const colour = lightMode ? '#ffffff' : '#0b2d5b';
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" role="img"
    aria-label="WBD, WOW Business & Digital Limited. Evidence, Transformation, Impact."
    className={`block shrink-0 select-none ${className}`}
    style={!className.includes('h-') && !className.includes('w-') ? { height, width:'auto' } : undefined}>
    <svg x="0" y="10" width="205" height="124" viewBox="25 135 460 245" aria-hidden="true"><image href={transparentSymbol} width="512" height="512" /></svg>
    <text x="219" y="111" fill={colour} fontFamily="Arial, Helvetica, sans-serif" fontSize="127" fontWeight="900" letterSpacing="-5">WBD</text>
    <text x="300" y="157" textAnchor="middle" fill={colour} fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="600">WOW Business &amp; Digital Limited</text>
    <text x="300" y="192" textAnchor="middle" fill={colour} fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fontWeight="700" letterSpacing="2">EVIDENCE <tspan fill="#a97726">|</tspan> TRANSFORMATION <tspan fill="#a97726">|</tspan> IMPACT</text>
  </svg>;
};
