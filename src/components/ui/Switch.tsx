import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  warningVariant?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  warningVariant = false,
}) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
      checked
        ? warningVariant
          ? 'bg-rose-50 border-rose-300 shadow-sm'
          : 'bg-amber-50/80 border-amber-300 shadow-sm'
        : 'bg-slate-50 border-amber-200/60'
    }`}>
      <div>
        <span className={`text-xs font-bold block ${checked && warningVariant ? 'text-rose-900' : 'text-slate-800'}`}>
          {label}
        </span>
        {description && <span className="text-[11px] text-slate-500 mt-0.5 block">{description}</span>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
          checked ? (warningVariant ? 'bg-rose-600' : 'bg-amber-600') : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
