import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

/**
 * Button Component - shadcn/ui style button with variants
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    default: isDark
      ? 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500'
      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: isDark
      ? 'border border-white/10 bg-transparent text-white hover:bg-white/10 focus:ring-white/20'
      : 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: isDark
      ? 'bg-transparent text-white hover:bg-white/10 focus:ring-white/20'
      : 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    destructive: isDark
      ? 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500'
      : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

