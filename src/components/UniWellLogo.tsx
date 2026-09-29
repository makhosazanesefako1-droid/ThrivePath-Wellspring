import React from 'react';

interface UniWellLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  inverted?: boolean;
  className?: string;
}

export const UniWellLogo: React.FC<UniWellLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  inverted = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon: Deep navy rounded shield with university well-being leaf/heart */}
      <div
        className={`${iconSizes[size]} rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform hover:scale-105 ${
          inverted ? 'bg-white text-[#173B57]' : 'bg-[#173B57] text-white'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[58%] h-[58%]"
        >
          {/* Well-being leaf arc + university shield motif */}
          <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2Z" fill="currentColor" fillOpacity="0.15" />
          <path d="M12 7c-2.5 0-4.5 2-4.5 4.5 0 3.5 4.5 7.5 4.5 7.5s4.5-4 4.5-7.5C16.5 9 14.5 7 12 7Z" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`font-bold tracking-tight font-heading ${textSizes[size]} ${
            inverted ? 'text-white' : 'text-[#172033]'
          }`}
        >
          UniWell
        </span>
        {showSubtitle && (
          <span
            className={`text-[11px] font-medium tracking-normal mt-0.5 ${
              inverted ? 'text-slate-300' : 'text-[#64748B]'
            }`}
          >
            Your well-being. Your support. Your university.
          </span>
        )}
      </div>
    </div>
  );
};
