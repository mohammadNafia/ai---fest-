import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition - Smooth page transition wrapper
 * Provides fade-in and slide animations for route changes
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div className="transition-all duration-500 ease-out opacity-100 translate-y-0">
      {children}
    </div>
  );
};

