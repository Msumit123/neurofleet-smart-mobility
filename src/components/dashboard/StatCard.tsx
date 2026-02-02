import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: {
      bg: 'bg-card',
      icon: 'bg-muted text-muted-foreground',
      border: 'border-border',
    },
    primary: {
      bg: 'bg-gradient-to-br from-primary/10 to-info/10',
      icon: 'bg-primary/20 text-primary',
      border: 'border-primary/20',
    },
    success: {
      bg: 'bg-gradient-to-br from-success/10 to-success/5',
      icon: 'bg-success/20 text-success',
      border: 'border-success/20',
    },
    warning: {
      bg: 'bg-gradient-to-br from-warning/10 to-warning/5',
      icon: 'bg-warning/20 text-warning',
      border: 'border-warning/20',
    },
    info: {
      bg: 'bg-gradient-to-br from-info/10 to-info/5',
      icon: 'bg-info/20 text-info',
      border: 'border-info/20',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-xl border p-5',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-xl p-3', styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
