import { Search, CheckCircle, Lock, Leaf } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/[0.04] to-accent/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.08] via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold animate-fade-in border border-primary/10">
            🌿 Truy xuất nguồn gốc tổ yến
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 text-balance animate-slide-in-up tracking-tight leading-[1.1]" style={{ animationDelay: '0.1s' }}>
            Minh Bạch Từ Tổ Yến{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Tới Tay Bạn</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty animate-slide-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Hệ thống truy vết hành trình tổ yến chuyên sâu, chi tiết và đầy đủ nhất. Kiểm soát chất lượng, xác minh nguồn gốc, mua yến an toàn.
          </p>
          <div className="animate-slide-in-up mb-8" style={{ animationDelay: '0.3s' }}>
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nền tảng toàn diện để bạn theo dõi và xác minh từng bước của tổ yến
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "Truy Xuất Truy Nguồn", desc: "Truy vết hành trình tổ yến chuyên sâu – chi tiết – đầy đủ nhất. Theo dõi mỗi bước từ nhà yến đến tay bạn.", delay: 0 },
            { icon: Lock, title: "Quy Trình Khép Kín", desc: "Kiểm soát toàn bộ nguồn gốc và chống trà trộn tổ yến từ bên ngoài. Bảo vệ chất lượng sản phẩm.", delay: 0.1 },
            { icon: CheckCircle, title: "Mua Yến An Toàn", desc: "Tra cứu thông tin rõ ràng – minh bạch từ nhà yến tới khâu sản xuất. Mua hàng với niềm tin.", delay: 0.2 },
          ].map(({ icon: Icon, title, desc, delay }) => (
            <div key={title} className="group rounded-md border border-border/60 bg-card p-8 hover:shadow-xl hover:shadow-primary/[0.06] hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 animate-slide-in-up" style={{ animationDelay: `${delay}s` }}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-md bg-primary/[0.08] group-hover:bg-primary/[0.14] transition-colors duration-300">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-3 tracking-tight">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 border-y border-border/40 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
              Cách Thức Hoạt Động
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ba bước đơn giản để theo dõi nguồn gốc tổ yến
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
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
                <div className="inline-flex h-18 w-18 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-3xl mb-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3 text-center tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm text-center leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-14 text-center text-white animate-fade-in shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/[0.08] via-transparent to-transparent" />
          <div className="relative">
            <Leaf className="mx-auto h-12 w-12 mb-8 opacity-90 animate-pulse-glow" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5 tracking-tight">
              Sẵn Sàng Theo Dõi Tổ Yến Của Bạn?
            </h2>
            <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              Bắt đầu kiểm tra nguồn gốc tổ yến ngay hôm nay và mua hàng với sự yên tâm
            </p>
            <ScrollToTopButton />
          </div>
        </div>
      </section>
    </div>
  );
}
