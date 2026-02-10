import React, { forwardRef, InputHTMLAttributes, useId } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input Component - shadcn/ui style input with validation states
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const generatedId = useId();
    const inputId = props.id || generatedId;

    const inputClasses = `w-full px-3 py-2 rounded-lg border transition-colors ${
      error
        ? isDark
          ? 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-red-400/20'
          : 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
        : isDark
        ? 'border-white/10 bg-white/5 focus:border-blue-500 focus:ring-blue-500/20'
        : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'
    } focus:outline-none focus:ring-2 ${
      isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
    } ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={`block text-sm font-medium mb-1.5 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className={`mt-1.5 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
