import React, { useState } from 'react';

interface SummitLogoProps {
  className?: string;
}

export const SummitLogo: React.FC<SummitLogoProps> = ({ className = "w-12 h-12" }) => {
  const [imgError, setImgError] = useState<boolean>(false);

  return (
    <div className={`${className} flex items-center justify-center`}>
      {!imgError ? (
        <img 
          src="/Summit-Logo.png" 
          alt="Baghdad AI Summit Logo" 
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
          AI
        </div>
      )}
    </div>
  );
};

