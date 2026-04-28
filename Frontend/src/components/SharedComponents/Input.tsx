import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
}

export default function Input({ label, icon: Icon, rightElement, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center ml-1">
        <label className="text-sm font-medium text-textMuted">{label}</label>
        {rightElement}
      </div>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />}
        <input
          className={`glass-input w-full ${Icon ? '!pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
}
