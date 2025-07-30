import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  onClose?: () => void;
}

export function Alert({
  children,
  variant = 'info',
  className,
  onClose
}: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
      icon: Info
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-700',
      icon: CheckCircle
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-700',
      icon: AlertTriangle
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      icon: AlertCircle
    }
  };

  const Icon = variants[variant].icon;

  return (
    <div className={cn(
      'rounded-lg border p-4',
      variants[variant].bg,
      variants[variant].text,
      className
    )}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 shrink-0" />
        <div className="ml-3 flex-1">
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 shrink-0 hover:opacity-75"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}