# 🏠 Pymid Web — Hệ thống Truy xuất nguồn gốc Tổ Yến

> Nền tảng web minh bạch hóa chuỗi cung ứng ngành tổ yến Việt Nam — từ **Nhà yến** → **Nhà sản xuất** → **Nhà phân phối** → **Cửa hàng** → **Người tiêu dùng**.

## ✨ Tính năng

- 🔍 **Truy xuất nguồn gốc** — Nhập mã nhóm tổ yến để xem toàn bộ hành trình sản phẩm
- 🏡 **Nhà yến** — Xem thông tin chi tiết, nhật ký thu hoạch, môi trường, chủ sở hữu
- 🏭 **Nhà sản xuất** — Sản phẩm, giấy phép, quy trình sản xuất
- 🏢 **Nhà phân phối** — Hệ thống cửa hàng, đội ngũ nhân viên
- 🛒 **Cửa hàng** — Vị trí, sản phẩm đang bán, liên hệ
- 👤 **Hồ sơ người dùng** — Quản lý nhà yến, nhà sản xuất, nhà phân phối

## 🛠️ Công nghệ

| Lớp | Công nghệ |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **Tailwind CSS v4** + **shadcn/ui** |
| Language | **TypeScript** |
| Icons | **Lucide React** |
| Font | **Inter** (Google Fonts, Vietnamese subset) |
| API | REST API — `api.pymid.com` |

## 📸 Screenshots

### Trang chủ

| Desktop | Mobile |
|---|---|
| ![Trang chủ - Desktop](capture/home-desktop.png) | ![Trang chủ - Mobile](capture/home-mobile.png) |

### Chi tiết Nhà yến (`/ny/[id]`)

| Desktop | Mobile |
|---|---|
| ![Nhà yến - Desktop](capture/nha-yen-detail-desktop.png) | ![Nhà yến - Mobile](capture/nha-yen-detail-mobile.png) |

### Chi tiết Nhà sản xuất (`/nsx/[id]`)

| Desktop | Mobile |
|---|---|
| ![Nhà sản xuất - Desktop](capture/nha-san-xuat-detail-desktop.png) | ![Nhà sản xuất - Mobile](capture/nha-san-xuat-detail-mobile.png) |

### Chi tiết Nhà phân phối (`/p/[id]`)

| Desktop | Mobile |
|---|---|
| ![Nhà phân phối - Desktop](capture/nha-phan-phoi-detail-desktop.png) | ![Nhà phân phối - Mobile](capture/nha-phan-phoi-detail-mobile.png) |

### Chi tiết Cửa hàng (`/s/[id]`)

| Desktop | Mobile |
|---|---|
| ![Cửa hàng - Desktop](capture/cua-hang-detail-desktop.png) | ![Cửa hàng - Mobile](capture/cua-hang-detail-mobile.png) |

### Truy xuất nguồn gốc — Nhóm tổ yến (`/n/[id]`)

| Desktop | Mobile |
|---|---|
| ![Nhóm tổ yến - Desktop](capture/nhom-to-yen-detail-desktop.png) | ![Nhóm tổ yến - Mobile](capture/nhom-to-yen-detail-mobile.png) |

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── page.tsx              # Trang chủ
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Theme & global styles
│   ├── n/[id]/page.tsx       # Chi tiết Nhóm tổ yến (truy xuất)
│   ├── ny/[id]/page.tsx      # Chi tiết Nhà yến
│   ├── nsx/[id]/page.tsx     # Chi tiết Nhà sản xuất
│   ├── p/[id]/page.tsx       # Chi tiết Nhà phân phối
│   ├── s/[id]/page.tsx       # Chi tiết Cửa hàng
│   └── u/[id]/page.tsx       # Hồ sơ người dùng
├── components/               # Shared components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── search-form.tsx
│   ├── profile-header.tsx
│   ├── content-slider.tsx
│   └── ui/                   # shadcn/ui primitives
└── lib/
    ├── api.ts                # API client & types
    └── utils.ts              # Utilities
```

## 🚀 Bắt đầu

```bash
# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📄 License

MIT
