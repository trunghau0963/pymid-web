import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: {
    default: "PYMID - Truy xuất nguồn gốc tổ yến",
    template: "%s | PYMID",
  },
  description:
    "Hệ thống truy xuất nguồn gốc tổ yến PYMID - Truy vết hành trình tổ yến chuyên sâu, chi tiết, đầy đủ nhất",
  keywords: [
    "tổ yến",
    "yến sào",
    "truy xuất nguồn gốc",
    "PYMID",
    "nhà yến",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "PYMID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased bg-background`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
