'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface ContentSliderProps {
  children: ReactNode[];
  autoPlayInterval?: number;
  className?: string;
}

export function ContentSlider({
  children,
  autoPlayInterval = 10000,
  className = '',
}: ContentSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalSlides = children.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isPlaying || totalSlides <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, goToNext, autoPlayInterval, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  if (totalSlides === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        Không có dữ liệu
      </div>
    );
  }

  if (totalSlides === 1) {
    return <div className={className}>{children[0]}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Slider Content */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-5">
        {/* Left: Pagination dots */}
        <div className="flex items-center gap-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Center: Counter */}
        <div className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">{currentIndex + 1}</span>
          <span className="mx-1">/</span>
          <span>{totalSlides}</span>
        </div>

        {/* Right: Navigation controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`p-2 rounded-full border transition-colors ${
              isPlaying
                ? 'bg-primary text-white border-primary hover:bg-primary/90'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }`}
            aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
            title={isPlaying ? 'Dừng tự động (Space)' : 'Tự động chuyển (Space)'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          {/* Prev */}
          <button
            onClick={goToPrev}
            className="p-2 rounded-full border border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-colors"
            aria-label="Previous slide"
            title="Trước (←)"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Next */}
          <button
            onClick={goToNext}
            className="p-2 rounded-full border border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-colors"
            aria-label="Next slide"
            title="Tiếp (→)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar (auto-play indicator) */}
      {isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden rounded-t-sm">
          <div
            className="h-full bg-primary animate-progress-bar"
            style={{
              animationDuration: `${autoPlayInterval}ms`,
            }}
            key={currentIndex}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress-bar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress-bar {
          animation: progress-bar linear forwards;
        }
      `}</style>
    </div>
  );
}
