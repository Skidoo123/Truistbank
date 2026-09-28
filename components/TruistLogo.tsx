'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const TruistLogo: React.FC<LogoProps> = ({ className = '', size = 36 }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* High resolution PNG image logo */}
      <img
        src="/truist-logo.png"
        alt="Truist Logo"
        style={{ width: `${size}px`, height: `${size}px` }}
        className="object-contain rounded"
      />
    </div>
  );
};
