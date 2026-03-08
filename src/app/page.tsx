import { Search, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="container mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Truy Xuất Nguồn Gốc Tổ Yến
          </h1>
          <p className="text-lg md:text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Hệ thống minh bạch từ nhà yến tới khâu sản xuất. Truy vết hành
            trình tổ yến chuyên sâu, chi tiết và đầy đủ nhất.
          </p>
          <div className="max-w-md mx-auto flex rounded-full bg-white overflow-hidden shadow-lg">
            <input
              placeholder="Nhập mã truy xuất (VD: 239)"
              className="flex-1 px-5 py-3 text-foreground outline-none text-sm"
              disabled
            />
            <div className="bg-red-600 hover:bg-red-700 px-5 flex items-center text-white transition-colors">
              <Search className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Search className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Truy Xuất Truy Nguồn
              </h3>
              <p className="text-muted-foreground text-sm">
                Truy vết hành trình tổ yến chuyên sâu – chi tiết – đầy đủ nhất
              </p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Shield className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Quy Trình Khép Kín
              </h3>
              <p className="text-muted-foreground text-sm">
                Kiểm soát nguồn gốc và chống trà trộn tổ yến từ bên ngoài
              </p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <CheckCircle className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Mua Yến An Toàn</h3>
              <p className="text-muted-foreground text-sm">
                Tra cứu thông tin rõ ràng – minh bạch từ nhà yến tới khâu sản
                xuất
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            Cách Thức Hoạt Động
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Quét mã QR",
                desc: "Quét mã QR trên thùng yến hoặc nhập mã truy xuất",
              },
              {
                step: "02",
                title: "Xem thông tin",
                desc: "Xem chi tiết nguồn gốc nhà yến, nhà sản xuất và quy trình",
              },
              {
                step: "03",
                title: "Xác minh chất lượng",
                desc: "Kiểm tra livestream camera, nhật ký khép kín và cam kết",
              },
            ].map((item) => (
              <div key={item.step}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
