import Link from "next/link";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-slate-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
          <span className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">PYMID</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-slate-600 hover:text-primary transition-colors duration-200"
          >
            Trang chủ
          </Link>
          <Link
            href="/"
            className="text-slate-600 hover:text-primary transition-colors duration-200"
          >
            Truy xuất nguồn gốc
          </Link>
          <Link
            href="/"
            className="text-slate-600 hover:text-primary transition-colors duration-200"
          >
            Nhà yến
          </Link>
        </nav>
      </div>
    </header>
  );
}
