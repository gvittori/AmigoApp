import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'h-12 px-5 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-amber-600/20 hover:from-amber-500 hover:to-rose-500',
    secondary: 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-200',
    outline: 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
