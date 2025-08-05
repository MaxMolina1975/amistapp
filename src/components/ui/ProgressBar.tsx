import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  showValue = false,
  size = 'md',
  variant = 'default',
  className
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variants = {
    default: 'bg-violet-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-slate-600">{label}</span>}
          {showValue && (
            <span className="text-slate-600">{percentage}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', sizes[size], className)}>
        <div
          className={cn('h-full transition-all', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}