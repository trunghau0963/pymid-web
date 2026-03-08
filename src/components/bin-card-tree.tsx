'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface BinChild {
  id: string;
  name: string;
  quantity?: number;
  status?: string;
  image?: string;
  children?: BinChild[];
}

interface BinCardTreeProps {
  item: BinChild;
  level?: number;
  onItemClick?: (item: BinChild) => void;
  className?: string;
}

export function BinCardTree({
  item,
  level = 0,
  onItemClick,
  className,
}: BinCardTreeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = level * 24;

  return (
    <div className={className}>
      <div
        className={cn(
          'flex items-start gap-4 p-4 rounded-lg border transition-all duration-200',
          'hover:border-primary/50 hover:shadow-md cursor-pointer',
          'bg-white border-slate-200',
          isExpanded && hasChildren && 'border-primary/30 bg-primary/5'
        )}
        style={{ paddingLeft: `calc(1rem + ${paddingLeft}px)` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onItemClick?.(item);
        }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={cn(
              'mt-2 p-1 hover:bg-primary/10 rounded transition-all duration-200',
              'flex-shrink-0'
            )}
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 text-primary transition-transform duration-200',
                !isExpanded && '-rotate-90'
              )}
            />
          </button>
        )}

        {/* Image */}
        {item.image && (
          <div className="flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              width={60}
              height={60}
              className="w-16 h-16 rounded-lg object-cover border border-slate-200"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            {item.name}
          </h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            {item.id && (
              <div>
                <span className="text-slate-500">ID:</span>
                <span className="ml-2 font-mono text-primary">{item.id}</span>
              </div>
            )}
            {item.quantity && (
              <div>
                <span className="text-slate-500">Số lượng:</span>
                <span className="ml-2 text-slate-900">{item.quantity}</span>
              </div>
            )}
            {item.status && (
              <div>
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    item.status === 'active' && 'bg-emerald-100 text-emerald-700',
                    item.status === 'inactive' && 'bg-slate-100 text-slate-700',
                    item.status === 'pending' && 'bg-amber-100 text-amber-700'
                  )}
                >
                  {item.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Expand Indicator */}
        {hasChildren && (
          <div className="text-xs text-slate-500 whitespace-nowrap mt-2">
            {item.children!.length} thùng con
          </div>
        )}
      </div>

      {/* Nested Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-2 mt-2">
          {item.children!.map((child) => (
            <BinCardTree
              key={child.id}
              item={child}
              level={level + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BinCardTreeRootProps {
  items: BinChild[];
  onItemClick?: (item: BinChild) => void;
  className?: string;
}

export function BinCardTreeRoot({
  items,
  onItemClick,
  className,
}: BinCardTreeRootProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <BinCardTree
          key={item.id}
          item={item}
          level={0}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}
