'use client';

import { Package, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="mb-4">
        {icon || <Package className="h-12 w-12 text-slate-300" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 active:bg-primary/80',
            'transition-colors duration-200'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function SearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <EmptyState
      title="Không tìm thấy kết quả"
      description={`Không có kết quả nào cho "${query}". Vui lòng thử tìm kiếm với từ khóa khác.`}
      icon={<Search className="h-12 w-12 text-slate-300" />}
      action={{
        label: 'Xóa tìm kiếm',
        onClick: onClear,
      }}
    />
  );
}
