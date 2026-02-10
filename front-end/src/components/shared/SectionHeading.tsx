import React from 'react';
import type { Theme } from '@/types';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  theme?: Theme;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  align = "center", 
  theme = 'dark' 
}) => (
  <div className={`mb-16 ${align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"} gradient-underline`}>
    <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${
      theme === 'light' ? 'text-gray-900' : 'text-white'
    }`}>{title}</h2>
    <div className={`h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6 ${align === "left" || align === "right" ? "" : "mx-auto"} animate-fadeInUp`}></div>
    {subtitle && <p className={`text-lg max-w-2xl leading-relaxed font-light ${
      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
    }`}>{subtitle}</p>}
  </div>
);

