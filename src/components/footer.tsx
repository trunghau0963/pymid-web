import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary text-lg">PYMID</span>
            </div>
            <p className="text-sm text-slate-600">
              Hệ thống truy xuất nguồn gốc tổ yến
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-slate-900">Sản phẩm</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary transition-colors">Trang chủ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Truy xuất nguồn gốc</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Nhà yến</a></li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-slate-900">Liên hệ</h3>
            <p className="text-sm text-slate-600">
              Minh bạch từ nhà yến tới khâu sản xuất
            </p>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} PYMID. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Privacy Policy • Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
