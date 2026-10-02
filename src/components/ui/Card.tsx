import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-amber-200/80 rounded-3xl p-5 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:border-amber-300 hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
