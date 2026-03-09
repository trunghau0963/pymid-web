import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">PYMID</span>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Hệ thống truy xuất nguồn gốc tổ yến - Minh bạch từ nhà yến tới
            khâu sản xuất
          </p>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} PYMID. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
