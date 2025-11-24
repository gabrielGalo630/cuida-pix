import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#F6C90E] text-[#0D0D0D] hover:bg-[#FFE347] shadow-lg hover:shadow-xl hover:scale-105',
      secondary: 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] border border-[#F6C90E]/20',
      outline: 'bg-transparent text-[#F6C90E] border-2 border-[#F6C90E] hover:bg-[#F6C90E]/10',
      ghost: 'bg-transparent text-gray-300 hover:text-[#F6C90E] hover:bg-[#F6C90E]/5',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
