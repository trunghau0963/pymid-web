'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn('flex items-center gap-1', className)}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
