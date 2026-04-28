import React from 'react';
import clsx from 'clsx';
import { type LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  icon?: LucideIcon;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon: Icon,
  className,
  disabled,
  ...props 
}: ButtonProps) {
  
  const baseClasses = "flex items-center justify-center gap-2 font-medium px-4 py-2.5 rounded-lg transition-all duration-300 active:scale-95";
  
  const variants = {
    primary: "bg-primary hover:bg-primaryHover text-white shadow-lg shadow-primary/25",
    secondary: "bg-surface hover:bg-surfaceBorder text-textMain",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400"
  };

  return (
    <button 
      disabled={isLoading || disabled}
      className={clsx(baseClasses, variants[variant], className, (isLoading || disabled) && "opacity-70 cursor-not-allowed")}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {children}
          {Icon && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
}
