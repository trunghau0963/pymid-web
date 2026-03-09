# Pymid Web — Bird's Nest Traceability System

> A web platform that brings transparency to Vietnam's bird's nest supply chain — from **Bird Nest House** → **Manufacturer** → **Distributor** → **Shop** → **Consumer**.

## Features

- **Traceability** — Enter a batch code to view the full product journey
- **Bird Nest House** — Detailed info, harvest diary, environment monitoring, owner
- **Manufacturer** — Products, licenses, production process
- **Distributor** — Shop network, team members
- **Shop** — Location, products for sale, contact info
- **User Profile** — Manage bird nest houses, manufacturers, distributors

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **Tailwind CSS v4** + **shadcn/ui** |
| Language | **TypeScript** |
| Icons | **Lucide React** |
| Font | **Inter** (Google Fonts, Vietnamese subset) |
| API | REST API — `api.pymid.com` |

## Screenshots

### Home Page

| Desktop | Mobile |
|---|---|
| ![Home - Desktop](capture/home-desktop.png) | ![Home - Mobile](capture/home-mobile.png) |

### Bird Nest House Detail (`/ny/[id]`)

| Desktop | Mobile |
|---|---|
| ![Bird Nest House - Desktop](capture/nha-yen-detail-desktop.png) | ![Bird Nest House - Mobile](capture/nha-yen-detail-mobile.png) |

**Tab views:**

| Info | Sold Batches | Diary |
|---|---|---|
| ![Info](capture/nha-yen-tab-info-desktop.png) | ![Sold](capture/nha-yen-tab-sold-desktop.png) | ![Diary](capture/nha-yen-tab-diary-desktop.png) |

| Devices | Owner | Harvest Process |
|---|---|---|
| ![Devices](capture/nha-yen-tab-environment-desktop.png) | ![Owner](capture/nha-yen-tab-owner-desktop.png) | ![Harvest](capture/nha-yen-tab-harvest-desktop.png) |

### Manufacturer Detail (`/nsx/[id]`)

| Desktop | Mobile |
|---|---|
| ![Manufacturer - Desktop](capture/nha-san-xuat-detail-desktop.png) | ![Manufacturer - Mobile](capture/nha-san-xuat-detail-mobile.png) |

### Distributor Detail (`/p/[id]`)

| Desktop | Mobile |
|---|---|
| ![Distributor - Desktop](capture/nha-phan-phoi-detail-desktop.png) | ![Distributor - Mobile](capture/nha-phan-phoi-detail-mobile.png) |

### Shop Detail (`/s/[id]`)

| Desktop | Mobile |
|---|---|
| ![Shop - Desktop](capture/cua-hang-detail-desktop.png) | ![Shop - Mobile](capture/cua-hang-detail-mobile.png) |

**Tab views:**

| Info | Distributor |
|---|---|
| ![Info](capture/shop-tab-info-desktop.png) | ![Distributor](capture/shop-tab-party-desktop.png) |

### Traceability — Batch Detail (`/n/[id]`)

| Desktop | Mobile |
|---|---|
| ![Batch - Desktop](capture/nhom-to-yen-detail-desktop.png) | ![Batch - Mobile](capture/nhom-to-yen-detail-mobile.png) |

### User Profile (`/u/[id]`)

| Desktop | Mobile |
|---|---|
| ![User - Desktop](capture/user-profile-desktop.png) | ![User - Mobile](capture/user-profile-mobile.png) |

**Tab views:**

| Profile | Bird Nest Houses |
|---|---|
| ![Profile](capture/user-tab-profile-desktop.png) | ![Bird Nest Houses](capture/user-tab-nha-yen-desktop.png) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Theme & global styles
│   ├── n/[id]/page.tsx       # Batch traceability detail
│   ├── ny/[id]/page.tsx      # Bird nest house detail
│   ├── nsx/[id]/page.tsx     # Manufacturer detail
│   ├── p/[id]/page.tsx       # Distributor detail
│   ├── s/[id]/page.tsx       # Shop detail
│   └── u/[id]/page.tsx       # User profile
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

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## License

MIT
