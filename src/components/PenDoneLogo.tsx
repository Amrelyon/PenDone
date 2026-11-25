import React from 'react';

interface PenDoneLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const PenDoneLogo: React.FC<PenDoneLogoProps> = ({ size = 'md' }) => {
  const iconDim = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl';

  return (
    <span className="inline-flex items-center gap-2.5 bg-transparent border-0 p-0 whitespace-nowrap shrink-0 select-none">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconDim} shrink-0`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pendoneGoldMark" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F6DC84" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7213" />
          </linearGradient>
        </defs>
        <path
          d="M32 6L50 24L42 49H22L14 24L32 6Z"
          stroke="url(#pendoneGoldMark)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="M32 6V28"
          stroke="url(#pendoneGoldMark)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="32" cy="31" r="3.5" fill="url(#pendoneGoldMark)" />
        <path
          d="M23 55H41"
          stroke="url(#pendoneGoldMark)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-brand ${textSize} leading-none tracking-normal text-[#B4861C] dark:text-[#E5C158]`}
      >
        PenDone
      </span>
    </span>
  );
};
