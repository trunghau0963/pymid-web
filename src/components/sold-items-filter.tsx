'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/search-input';
import { DateRangePicker } from '@/components/ui/date-picker';
import { EmptyState, SearchEmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

interface SoldItem {
  id: string;
  name: string;
  image?: string;
  quantity?: number;
  soldDate?: string;
  price?: number;
  description?: string;
  [key: string]: any;
}

interface SoldItemsFilterProps {
  items: SoldItem[];
  onItemClick?: (item: SoldItem) => void;
  className?: string;
  gridCols?: 1 | 2 | 3 | 4;
}

export function SoldItemsFilter({
  items,
  onItemClick,
  className,
  gridCols = 3,
}: SoldItemsFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateRange = (() => {
        if (!startDate && !endDate) return true;
        if (!item.soldDate) return false;
        const itemDate = new Date(item.soldDate);
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      })();

      return matchesSearch && matchesDateRange;
    });
  }, [items, searchQuery, startDate, endDate]);

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={className}>
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm theo ID hoặc tên..."
          />
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Tìm thấy <span className="font-semibold text-slate-900">{filteredItems.length}</span>{' '}
          kết quả
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className={cn('grid gap-4', gridColsClass[gridCols])}>
          {filteredItems.map((item) => (
            <SoldItemCard
              key={item.id}
              item={item}
              onClick={() => onItemClick?.(item)}
            />
          ))}
        </div>
      ) : searchQuery || startDate || endDate ? (
        <SearchEmptyState
          query={searchQuery || 'các tiêu chí được chọn'}
          onClear={() => {
            setSearchQuery('');
            setStartDate(null);
            setEndDate(null);
          }}
        />
      ) : (
        <EmptyState
          title="Chưa có mục bán hàng"
          description="Không có mục bán hàng nào được liệt kê tại thời điểm này."
        />
      )}
    </div>
  );
}

interface SoldItemCardProps {
  item: SoldItem;
  onClick?: () => void;
}

function SoldItemCard({ item, onClick }: SoldItemCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group overflow-hidden rounded-lg border border-slate-200 bg-white',
        'hover:shadow-lg hover:border-primary/30 transition-all duration-200',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Image */}
      {item.image ? (
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
          <span className="text-3xl">📦</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        
        <p className="text-xs text-slate-500 mt-1 font-mono">
          ID: {item.id}
        </p>

        {item.quantity && (
          <p className="text-sm text-slate-600 mt-2">
            Số lượng: <span className="font-medium">{item.quantity}</span>
          </p>
        )}

        {item.price && (
          <p className="text-sm font-semibold text-primary mt-2">
            {item.price.toLocaleString('vi-VN')} ₫
          </p>
        )}

        {item.soldDate && (
          <p className="text-xs text-slate-500 mt-2">
            {new Date(item.soldDate).toLocaleDateString('vi-VN')}
          </p>
        )}

        {onClick && (
          <button
            className={cn(
              'mt-4 w-full px-3 py-2 rounded-lg text-sm font-medium',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 active:bg-primary/80',
              'transition-colors duration-200'
            )}
          >
            Xem Chi Tiết
          </button>
        )}
      </div>
    </div>
  );
}
