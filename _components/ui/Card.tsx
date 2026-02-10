// components/ui/Card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-lg shadow-sm ${paddingStyles[padding]} ${hoverStyles} ${className} transition-all duration-300`}
    >
      {children}
    </div>
  );
};
