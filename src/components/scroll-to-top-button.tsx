'use client';

import { Search } from 'lucide-react';

export function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-slate-100 transition-colors"
    >
      <Search className="h-5 w-5" />
      Nhập Mã Truy Xuất
    </button>
  );
}
