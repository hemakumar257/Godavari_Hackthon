import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'saffron' | 'turquoise' | 'danger' | 'neutral' | 'demo';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  size = 'sm',
}) => {
  const variantStyles = {
    primary: 'bg-godavari-blue-50 text-godavari-blue-800 border-godavari-blue-200',
    saffron: 'bg-amber-50 text-amber-900 border-amber-200',
    turquoise: 'bg-cyan-50 text-cyan-900 border-cyan-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    demo: 'bg-amber-100 text-amber-950 border-amber-300 font-semibold tracking-wide',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
