'use client';

import { useState, useCallback } from 'react';
import { format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  className?: string;
  maxDate?: Date;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
  maxDate = new Date(),
}: DateRangePickerProps) {
  const [startInput, setStartInput] = useState(
    startDate ? format(startDate, 'yyyy-MM-dd') : ''
  );
  const [endInput, setEndInput] = useState(
    endDate ? format(endDate, 'yyyy-MM-dd') : ''
  );

  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStartInput(e.target.value);
    if (e.target.value) {
      const date = new Date(e.target.value);
      onStartDateChange(startOfDay(date));
    } else {
      onStartDateChange(null);
    }
  }, [onStartDateChange]);

  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEndInput(e.target.value);
    if (e.target.value) {
      const date = new Date(e.target.value);
      onEndDateChange(endOfDay(date));
    } else {
      onEndDateChange(null);
    }
  }, [onEndDateChange]);

  const handleClear = useCallback(() => {
    setStartInput('');
    setEndInput('');
    onStartDateChange(null);
    onEndDateChange(null);
  }, [onStartDateChange, onEndDateChange]);

  const maxDateStr = format(maxDate, 'yyyy-MM-dd');

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2 flex-1">
        <Calendar className="h-4 w-4 text-slate-400" />
        <input
          type="date"
          value={startInput}
          onChange={handleStartDateChange}
          max={maxDateStr}
          className={cn(
            'px-3 py-2 rounded-lg',
            'border border-slate-200 bg-white',
            'text-sm text-slate-900',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'transition-all duration-200'
          )}
        />
        <span className="text-slate-400 text-sm">đến</span>
        <input
          type="date"
          value={endInput}
          onChange={handleEndDateChange}
          max={maxDateStr}
          className={cn(
            'px-3 py-2 rounded-lg',
            'border border-slate-200 bg-white',
            'text-sm text-slate-900',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'transition-all duration-200'
          )}
        />
      </div>
      {(startDate || endDate) && (
        <button
          onClick={handleClear}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Xóa ngày"
        >
          <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
        </button>
      )}
    </div>
  );
}
