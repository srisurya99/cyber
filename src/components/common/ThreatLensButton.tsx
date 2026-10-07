import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ButtonVariant = 
  | 'primary'      // Blue primary actions (Start Safety Check)
  | 'prominent'    // Prominent action (Analyze Image or Video)
  | 'secondary'    // Secondary neutral action (Check Link, Try Another File)
  | 'outline'      // Subtle outlined button (View Analysis, View Details)
  | 'safety'       // Prominent safety-focused red action (Get Immediate Help)
  | 'ghost';       // Minimalist text action

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ThreatLensButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
}

export const ThreatLensButton: React.FC<ThreatLensButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold transition-all duration-150 select-none
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  const sizeClasses = {
    sm: 'text-xs min-h-[36px] px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm min-h-[44px] px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base min-h-[50px] px-6 py-3.5 rounded-xl gap-2.5',
  }[size];

  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs hover:shadow-sm
      border border-transparent cursor-pointer
    `,
    prominent: `
      bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md
      border border-blue-500/20 cursor-pointer font-bold
    `,
    secondary: `
      bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200/80
      cursor-pointer
    `,
    outline: `
      bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900
      border border-slate-300 shadow-2xs cursor-pointer
    `,
    safety: `
      bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-xs hover:shadow-sm
      border border-transparent cursor-pointer font-bold
    `,
    ghost: `
      bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900
      cursor-pointer
    `,
  }[variant];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className={`${iconSizes} shrink-0`} />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={`${iconSizes} shrink-0`} />
      )}
    </button>
  );
};
