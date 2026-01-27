import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'before:bg-primary';
      case 'success':
        return 'before:bg-status-approved';
      case 'warning':
        return 'before:bg-status-pending';
      case 'danger':
        return 'before:bg-destructive';
      default:
        return 'before:bg-primary';
    }
  };

  return (
    <div className={cn('stat-card', getVariantStyles(), className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <p className={cn('text-xs font-medium', trend.isPositive ? 'text-status-approved' : 'text-destructive')}>
              {trend.isPositive ? '+' : ''}
              {trend.value}% from last period
            </p>
          )}
        </div>
        {icon && <div className="rounded-lg bg-accent p-3 text-accent-foreground">{icon}</div>}
      </div>
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showPercentage = true,
  variant = 'default',
  className,
}) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-status-approved';
      case 'warning':
        return 'bg-status-pending';
      case 'danger':
        return 'bg-destructive';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="font-medium">{percentage}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getVariantClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface DistributionBarProps {
  items: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  className?: string;
}

export const DistributionBar: React.FC<DistributionBarProps> = ({ items, className }) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {items.map((item, index) => {
          const width = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div
              key={index}
              className={cn('transition-all duration-500', item.color)}
              style={{ width: `${width}%` }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={cn('h-3 w-3 rounded-full', item.color)} />
            <span className="text-sm text-muted-foreground">
              {item.label}: <span className="font-medium text-foreground">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
