import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>}
      <input
        className={`w-full bg-slate-50 border border-amber-200/80 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium transition-all ${
          error ? 'border-rose-500 bg-rose-50/30' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] text-rose-600 mt-1 block font-semibold">{error}</span>}
    </div>
  );
};
