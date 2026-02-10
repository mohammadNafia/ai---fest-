import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Card Component - shadcn/ui style card with hover effects
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  onClick 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseClasses = `rounded-xl border transition-all duration-300 ${
    isDark 
      ? 'bg-white/5 border-white/10' 
      : 'bg-white border-gray-200'
  } ${onClick ? 'cursor-pointer' : ''} ${className}`;

  if (hover && onClick) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={{ 
          scale: 1.02,
          boxShadow: isDark 
            ? '0 10px 30px rgba(59, 130, 246, 0.2)' 
            : '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ 
          scale: 1.01,
          boxShadow: isDark 
            ? '0 8px 25px rgba(59, 130, 246, 0.15)' 
            : '0 8px 25px rgba(0, 0, 0, 0.08)'
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    } ${className}`}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();
  return (
    <p className={`text-sm ${
      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    } ${className}`}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

