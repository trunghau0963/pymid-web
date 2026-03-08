'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';

interface Shop {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  website?: string;
  image?: string;
  status?: 'active' | 'inactive';
  rating?: number;
}

interface ShopGridProps {
  shops: Shop[];
  onShopClick?: (shop: Shop) => void;
  gridCols?: 2 | 3 | 4;
  className?: string;
  emptyMessage?: string;
}

export function ShopGrid({
  shops,
  onShopClick,
  gridCols = 3,
  className,
  emptyMessage = 'Chưa có cửa hàng nào',
}: ShopGridProps) {
  if (shops.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Không có cửa hàng nào được liệt kê tại thời điểm này."
      />
    );
  }

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridColsClass[gridCols], className)}>
      {shops.map((shop) => (
        <ShopCard
          key={shop.id}
          shop={shop}
          onShopClick={onShopClick}
        />
      ))}
    </div>
  );
}

interface ShopCardProps {
  shop: Shop;
  onShopClick?: (shop: Shop) => void;
}

function ShopCard({ shop, onShopClick }: ShopCardProps) {
  const fullAddress = [shop.address, shop.city].filter(Boolean).join(', ');

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-lg border border-slate-200 bg-white',
        'hover:shadow-lg hover:border-primary/30 transition-all duration-200',
        onShopClick && 'cursor-pointer'
      )}
      onClick={() => onShopClick?.(shop)}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-slate-100">
        {shop.image ? (
          <Image
            src={shop.image}
            alt={shop.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <span className="text-4xl">🏪</span>
          </div>
        )}
        {shop.status && (
          <div className="absolute top-2 right-2">
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-semibold text-white',
                shop.status === 'active' && 'bg-emerald-500',
                shop.status === 'inactive' && 'bg-slate-500'
              )}
            >
              {shop.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
          {shop.name}
        </h3>

        {fullAddress && (
          <div className="flex items-start gap-2 mt-3 text-sm text-slate-600">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
            <p className="line-clamp-2">{fullAddress}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-4 space-y-2">
          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{shop.phone}</span>
            </a>
          )}
          {shop.website && (
            <a
              href={shop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span className="truncate text-primary hover:underline">
                Truy cập website
              </span>
            </a>
          )}
        </div>

        {onShopClick && (
          <Link
            href={`/s/${shop.id}`}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'mt-4 w-full block text-center px-3 py-2 rounded-lg text-sm font-medium',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 active:bg-primary/80',
              'transition-colors duration-200'
            )}
          >
            Xem Chi Tiết
          </Link>
        )}
      </div>
    </div>
  );
}
