import Link from "next/link";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">PYMID</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
          >
            Trang chủ
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
          >
            Truy xuất nguồn gốc
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
          >
            Nhà yến
          </Link>
        </nav>
      </div>
    </header>
  );
}
