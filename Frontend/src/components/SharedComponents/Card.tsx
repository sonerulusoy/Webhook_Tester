import { type LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface CardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  className?: string;
}

export default function Card({ label, value, change, trend, icon: Icon, className }: CardProps) {
  return (
    <div className={clsx("glass-panel p-6 flex flex-col justify-between h-40 relative overflow-hidden group", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <Icon className="w-24 h-24" />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <span className="text-sm font-medium text-textMuted">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      
      <div className="relative z-10 mt-4">
        <div className="text-3xl font-bold text-textMain">{value}</div>
        {change && trend && (
          <div className={`text-xs mt-2 flex items-center gap-1 font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className="text-lg leading-none">{trend === 'up' ? '↗' : '↘'}</span>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
