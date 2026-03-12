'use client';

import { Search } from 'lucide-react';

export function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary rounded-md font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg shadow-black/10 hover:shadow-xl hover:scale-[1.02]"
    >
      <Search className="h-5 w-5" />
      Nhập Mã Truy Xuất
    </button>
  );
}
