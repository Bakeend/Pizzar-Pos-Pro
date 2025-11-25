
import React from 'react';

interface BrandLogoProps {
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="crust-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.2"/>
      </filter>
    </defs>
    {/* Crust */}
    <circle cx="50" cy="50" r="45" fill="#FFB300" stroke="#E65100" strokeWidth="4" filter="url(#crust-shadow)"/>
    {/* Cheese */}
    <circle cx="50" cy="50" r="39" fill="#FFF176" />
    {/* Cuts */}
    <path d="M50 12 L50 88 M18 32 L82 68 M82 32 L18 68" stroke="#FBC02D" strokeWidth="2" strokeLinecap="round" />
    {/* Pepperoni */}
    <g fill="#D32F2F">
      <circle cx="50" cy="30" r="5.5" />
      <circle cx="69" cy="41" r="5.5" />
      <circle cx="69" cy="62" r="5.5" />
      <circle cx="50" cy="73" r="5.5" />
      <circle cx="31" cy="62" r="5.5" />
      <circle cx="31" cy="41" r="5.5" />
      <circle cx="50" cy="51" r="6" />
    </g>
    {/* Highlights */}
    <g fill="#FFCDD2" opacity="0.8">
      <circle cx="48.5" cy="28.5" r="1.5" />
      <circle cx="67.5" cy="39.5" r="1.5" />
      <circle cx="67.5" cy="60.5" r="1.5" />
      <circle cx="48.5" cy="71.5" r="1.5" />
      <circle cx="29.5" cy="60.5" r="1.5" />
      <circle cx="29.5" cy="39.5" r="1.5" />
      <circle cx="48.5" cy="49.5" r="2" />
    </g>
  </svg>
);

export default BrandLogo;
