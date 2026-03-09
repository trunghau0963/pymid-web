'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { value: 'n', label: 'Thùng tổ yến', placeholder: 'Nhập mã thùng (VD: 239)' },
  { value: 'ny', label: 'Nhà yến', placeholder: 'Nhập mã nhà yến (VD: 3)' },
  { value: 'nsx', label: 'Nhà sản xuất', placeholder: 'Nhập mã nhà sản xuất (VD: 3)' },
  { value: 'p', label: 'Nhà phân phối', placeholder: 'Nhập mã nhà phân phối (VD: 1)' },
  { value: 's', label: 'Cửa hàng', placeholder: 'Nhập mã cửa hàng (VD: 1)' },
  { value: 'u', label: 'Trang giới thiệu', placeholder: 'Nhập mã người dùng (VD: 7)' },
];

interface SearchFormProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function SearchForm({ className = '', variant = 'default' }: SearchFormProps) {
  const router = useRouter();
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.value === category) || CATEGORIES[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    router.push(`/${category}/${code.trim()}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-border/60 bg-card text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={selectedCategory.placeholder}
          className="flex-1 px-4 py-2 rounded-xl border border-border/60 bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200 text-sm shadow-sm"
        />
        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/25"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* Category Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat.value
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={selectedCategory.placeholder}
              className="w-full px-5 py-3.5 rounded-xl border border-border/60 bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200 text-base shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim() || isLoading}
            className="px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span className="hidden sm:inline">Tìm Kiếm</span>
            <span className="sm:hidden">Tìm</span>
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Chọn loại truy xuất và nhập mã để xem thông tin chi tiết
        </p>
      </div>
    </form>
  );
}
