import React from 'react';

interface ThriveLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textColor?: string;
}

export const ThriveLogo: React.FC<ThriveLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-slate-900',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* ThrivePath Forest Green Rounded Leaf Mark matching pictures */}
      <div
        className={`${iconSizes[size]} rounded-lg bg-[#09392b] text-white flex items-center justify-center shrink-0 shadow-xs`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[60%] h-[60%]"
        >
          {/* Stylized Leaf Curve */}
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold tracking-tight font-display ${textSizes[size]} ${textColor}`}>
          ThrivePath
        </span>
      )}
    </div>
  );
};
