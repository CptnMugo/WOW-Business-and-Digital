import React from 'react';
import { compact, primaryHorizontal, primaryStacked } from '../assets/wbdLogoData';

interface LogoProps {
  variant?: 'horizontal' | 'icon-only' | 'framed' | 'vertical';
  className?: string;
  lightMode?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | 'banner' | 'custom';
  customSize?: number;
  overlap?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'horizontal', className = '', size = 'md', customSize }) => {
  const height = {
    sm: 32, md: 44, lg: 56, banner: 64, xl: 76,
    '2xl': 96, hero: 120, custom: customSize || 48,
  }[size];

  return <img
    src={variant === 'icon-only' ? compact : variant === 'vertical' || variant === 'framed' ? primaryStacked : primaryHorizontal}
    alt="WBD — WOW Business & Digital Limited. Evidence, Transformation, Impact."
    className={`block shrink-0 select-none object-contain rounded-md bg-white ${className}`}
    style={!className.includes('h-') && !className.includes('w-') ? { height, width: 'auto' } : undefined}
  />;
};
