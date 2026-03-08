import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            <span className="font-bold text-red-600">PYMID</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Hệ thống truy xuất nguồn gốc tổ yến - Minh bạch từ nhà yến tới
            khâu sản xuất
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PYMID. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
