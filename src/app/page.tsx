import { Search, CheckCircle, Lock, Leaf } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100">
        <div className="container mx-auto px-4 py-20 md:py-32 text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-emerald-100 text-primary text-sm font-semibold animate-fade-in">
            🌿 Truy xuất nguồn gốc tổ yến
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 text-balance animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            Minh Bạch Từ Tổ Yến Tới Tay Bạn
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto text-pretty animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            Hệ thống truy vết hành trình tổ yến chuyên sâu, chi tiết và đầy đủ nhất. Kiểm soát chất lượng, xác minh nguồn gốc, mua yến an toàn.
          </p>
          <div className="animate-slide-in-up mb-8" style={{ animationDelay: '0.3s' }}>
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Nền tảng toàn diện để bạn theo dõi và xác minh từng bước của tổ yến
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "Truy Xuất Truy Nguồn", desc: "Truy vết hành trình tổ yến chuyên sâu – chi tiết – đầy đủ nhất. Theo dõi mỗi bước từ nhà yến đến tay bạn.", delay: 0 },
            { icon: Lock, title: "Quy Trình Khép Kín", desc: "Kiểm soát toàn bộ nguồn gốc và chống trà trộn tổ yến từ bên ngoài. Bảo vệ chất lượng sản phẩm.", delay: 0.1 },
            { icon: CheckCircle, title: "Mua Yến An Toàn", desc: "Tra cứu thông tin rõ ràng – minh bạch từ nhà yến tới khâu sản xuất. Mua hàng với niềm tin.", delay: 0.2 },
          ].map(({ icon: Icon, title, desc, delay }) => (
            <div key={title} className="group rounded-lg border border-slate-200 bg-white p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-200 animate-slide-in-up" style={{ animationDelay: `${delay}s` }}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-3">
                {title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Cách Thức Hoạt Động
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Ba bước đơn giản để theo dõi nguồn gốc tổ yến
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Quét Mã QR",
                desc: "Quét mã QR trên thùng yến hoặc nhập mã truy xuất vào hệ thống",
                icon: "📱",
              },
              {
                step: "02",
                title: "Xem Thông Tin",
                desc: "Xem chi tiết nguồn gốc nhà yến, nhà sản xuất và quy trình sản xuất",
                icon: "📋",
              },
              {
                step: "03",
                title: "Xác Minh Chất Lượng",
                desc: "Kiểm tra nhật ký khép kín, chứng chỉ và cam kết chất lượng",
                icon: "✅",
              },
            ].map((item, idx) => (
              <div key={item.step} className="flex flex-col items-center animate-slide-in-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white font-bold text-2xl mb-6 shadow-lg group hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm text-center leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 p-12 text-center text-white animate-fade-in shadow-lg">
          <Leaf className="mx-auto h-12 w-12 mb-6 opacity-80 animate-pulse-glow" />
          <h2 className="text-3xl font-bold mb-4">
            Sẵn Sàng Theo Dõi Tổ Yến Của Bạn?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Bắt đầu kiểm tra nguồn gốc tổ yến ngay hôm nay và mua hàng với sự yên tâm
          </p>
          <ScrollToTopButton />
        </div>
      </section>
    </div>
  );
}
