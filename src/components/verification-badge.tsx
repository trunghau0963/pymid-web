'use client';

import { CheckCircle2, Shield, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BadgeType = 'verified' | 'certified' | 'vip';

interface VerificationBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const badgeConfig = {
  verified: {
    icon: CheckCircle2,
    label: 'Đã xác minh',
    color: 'text-emerald-600 bg-emerald-50',
  },
  certified: {
    icon: Award,
    label: 'Đã chứng nhận',
    color: 'text-amber-600 bg-amber-50',
  },
  vip: {
    icon: Shield,
    label: 'VIP',
    color: 'text-primary bg-primary/10',
  },
};

export function VerificationBadge({
  type,
  size = 'md',
  label,
  className,
}: VerificationBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-2.5 py-1.5 gap-1.5',
    lg: 'text-base px-3 py-2 gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{label || config.label}</span>
    </div>
  );
}

interface BadgeGroupProps {
  badges: { type: BadgeType; label?: string }[];
  className?: string;
}

export function BadgeGroup({ badges, className }: BadgeGroupProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges.map((badge, index) => (
        <VerificationBadge key={index} {...badge} size="sm" />
      ))}
    </div>
  );
}
