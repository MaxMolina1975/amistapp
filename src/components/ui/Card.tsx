import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl shadow-sm border border-slate-200',
      className
    )}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('p-4 border-b border-slate-200', className)}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className }: CardProps) {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('p-4 border-t border-slate-200', className)}>
      {children}
    </div>
  );
};