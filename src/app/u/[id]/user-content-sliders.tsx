'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContentSlider } from "@/components/content-slider";
import {
  Home,
  Factory,
  Store,
  ExternalLink,
  ArrowRight,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getImageUrl, formatDateTime, yearsSince } from "@/lib/api";
import type {
  NhaYenItem,
  NhaSanXuatItem,
  PartyItem,
  ImageItem,
} from "@/lib/api";

const EMPTY_VALUE = "____";

/* ──────────────────────────────
   Image Lightbox Modal
   ────────────────────────────── */

function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: ImageItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="relative max-w-[90vw] max-h-[85vh]">
        <img
          src={getImageUrl(currentImage.formats?.large?.url || currentImage.url)}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl bg-black/50 backdrop-blur-sm">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-12 h-12 rounded-lg overflow-hidden transition-all ${
                i === currentIndex
                  ? "ring-2 ring-white scale-110"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={getImageUrl(img.formats?.thumbnail?.url || img.url)}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────
   Shared UI primitives
   ────────────────────────────── */

const THUMBNAIL_COUNT = 5;
const MAIN_IMAGE_HEIGHT = "h-[320px]";

function Gallery({ images, alt }: { images: ImageItem[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Always show 5 thumbnail slots
  const thumbnailSlots = Array.from({ length: THUMBNAIL_COUNT }, (_, i) => images[i] || null);

  if (!images.length) {
    return (
      <div className="flex flex-col">
        <div className={`${MAIN_IMAGE_HEIGHT} bg-gradient-to-br from-muted to-muted rounded-xl flex items-center justify-center`}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-muted-foreground text-sm">Chưa có hình ảnh</span>
          </div>
        </div>
        {/* Empty thumbnail placeholders */}
        <div className="flex gap-2 mt-3">
          {thumbnailSlots.map((_, i) => (
            <div
              key={i}
              className="w-14 h-14 shrink-0 rounded-lg bg-muted/60 border-2 border-dashed border-border/60"
            />
          ))}
        </div>
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];

  return (
    <>
      <div className="flex flex-col">
        {/* Main Image - Fixed Height */}
        <div className={`relative ${MAIN_IMAGE_HEIGHT} rounded-xl overflow-hidden bg-muted/60 group`}>
          <img
            src={getImageUrl(activeImage.formats?.large?.url || activeImage.formats?.medium?.url || activeImage.url)}
            alt={alt}
            className="w-full h-full object-cover"
          />
          {/* Zoom Button Overlay */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300"
          >
            <span className="p-3 rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
              <ZoomIn className="w-6 h-6 text-foreground/80" />
            </span>
          </button>
          {/* Image indicator */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
        
        {/* Thumbnails - Always 5 slots */}
        <div className="flex gap-2 mt-3">
          {thumbnailSlots.map((img, i) => (
            img ? (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-muted/60 transition-all duration-200 ${
                  i === activeIndex
                    ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-md"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                }`}
              >
                <img
                  src={getImageUrl(img.formats?.thumbnail?.url || img.url)}
                  alt={`${alt} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <div
                key={i}
                className="w-14 h-14 shrink-0 rounded-lg bg-muted/60 border-2 border-dashed border-border/60"
              />
            )
        ))}
      </div>
    </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex text-sm py-2 border-b border-border/40 last:border-0">
      <div className="w-[40%] shrink-0 pr-3 text-muted-foreground">
        {label}
      </div>
      <div className="text-foreground flex-1 break-words">{children || EMPTY_VALUE}</div>
    </div>
  );
}

function DetailLink({ href, label }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
    >
      {label || "Chi tiết"}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function ExtLink({ href, text }: { href?: string | null; text?: string }) {
  if (!href) return <span className="text-muted-foreground">{EMPTY_VALUE}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1 transition-colors"
    >
      {text || href}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

/* ──────────────────────────────
   Item Cards - Fixed Height Layout
   ────────────────────────────── */

const CARD_MIN_HEIGHT = "min-h-[480px]";

function NhaYenCard({ item }: { item: NhaYenItem }) {
  const images = [...(item.image || []), ...(item.avatar || [])];

  return (
    <div className={`bg-white border border-border/60 rounded-lg overflow-hidden shadow-sm ${CARD_MIN_HEIGHT}`}>
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section - Larger */}
        <div className="lg:w-[380px] shrink-0 p-4 bg-muted/40">
          <Gallery images={images} alt={item.name} />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              {item.is_demo && (
                <Badge variant="secondary" className="text-xs">Demo</Badge>
              )}
              <DetailLink href={`/ny/${item.id}`} />
            </div>
          </div>

          {item.phan_cap && (
            <span
              className="inline-flex self-start text-xs font-medium px-2.5 py-1 rounded-full border mb-3"
              style={{
                borderColor: item.phan_cap.color,
                color: item.phan_cap.color,
              }}
            >
              {item.phan_cap.title}
            </span>
          )}

          <Separator className="mb-3" />

          {/* Data Rows - Always show all fields */}
          <div className="flex-1">
            <Row label="Tên nhà yến">
              <Link href={`/ny/${item.id}`} className="text-primary font-medium hover:underline">
                {item.name}
              </Link>
            </Row>
            <Row label="Địa chỉ">
              {item.location?.address ? (
                <>
                  <span className="text-primary">{item.location.address}</span>
                  {item.location.lat && item.location.long && (
                    <span className="text-muted-foreground text-xs ml-1">
                      {item.location.lat.toFixed(4)},{item.location.long.toFixed(4)}
                    </span>
                  )}
                </>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Phân cấp nhà yến">
              {item.phan_cap ? (
                <span className="font-semibold" style={{ color: item.phan_cap.color }}>
                  {item.phan_cap.title}
                </span>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Mô tả">
              {item.short_description ? (
                <span className="line-clamp-2 leading-relaxed text-foreground/80">
                  {item.short_description}
                </span>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Số tầng">{item.floor || EMPTY_VALUE}</Row>
            <Row label="Diện tích sàn (m²)">{item.square || EMPTY_VALUE}</Row>
            <Row label="Ngày tham gia PYMID">
              {item.created_at ? `${formatDateTime(item.created_at)} (${yearsSince(item.created_at)} năm)` : EMPTY_VALUE}
            </Row>
            <Row label="Giấy phép PYMID">{item.license || EMPTY_VALUE}</Row>
          </div>
        </div>
      </div>
    </div>
  );
}

function NhaSanXuatCard({ item }: { item: NhaSanXuatItem }) {
  const images = [...(item.image || []), ...(item.avatar || [])];

  return (
    <div className={`bg-white border border-border/60 rounded-lg overflow-hidden shadow-sm ${CARD_MIN_HEIGHT}`}>
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section - Larger */}
        <div className="lg:w-[380px] shrink-0 p-4 bg-muted/40">
          <Gallery images={images} alt={item.name} />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              {item.is_demo && (
                <Badge variant="secondary" className="text-xs">Demo</Badge>
              )}
              <DetailLink href={`/nsx/${item.id}`} />
            </div>
          </div>

          {item.nha_san_xuat_phan_cap && (
            <span
              className="inline-flex self-start text-xs font-medium px-2.5 py-1 rounded-full border mb-3"
              style={{
                borderColor: item.nha_san_xuat_phan_cap.color,
                color: item.nha_san_xuat_phan_cap.color,
              }}
            >
              {item.nha_san_xuat_phan_cap.title}
            </span>
          )}

          <Separator className="mb-3" />

          {/* Data Rows - Always show all fields */}
          <div className="flex-1">
            <Row label="Đơn vị sản xuất">
              <Link href={`/nsx/${item.id}`} className="text-primary font-medium hover:underline">
                {item.code || item.name}
              </Link>
            </Row>
            <Row label="Phân cấp sản xuất">
              {item.nha_san_xuat_phan_cap ? (
                <span className="font-semibold" style={{ color: item.nha_san_xuat_phan_cap.color }}>
                  {item.nha_san_xuat_phan_cap.title}
                </span>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Hotline">{item.phoneNumber || EMPTY_VALUE}</Row>
            <Row label="Diện tích sản (m²)">{item.square || EMPTY_VALUE}</Row>
            <Row label="Công suất SX hằng năm">{item.capacity || EMPTY_VALUE}</Row>
            <Row label="Email">
              {item.email ? (
                <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                  {item.email}
                </a>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Ngày tham gia PYMID">
              {item.created_at ? `${formatDateTime(item.created_at)} (${yearsSince(item.created_at)} năm)` : EMPTY_VALUE}
            </Row>
            <Row label="Giấy phép PYMID">{item.license || EMPTY_VALUE}</Row>
            <Row label="Website">
              <ExtLink href={item.webpage} />
            </Row>
            <Row label="Facebook">
              <ExtLink href={item.facebook} />
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartyCard({ item }: { item: PartyItem }) {
  const images = item.image || [];

  return (
    <div className={`bg-white border border-border/60 rounded-lg overflow-hidden shadow-sm ${CARD_MIN_HEIGHT}`}>
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section - Larger */}
        <div className="lg:w-[380px] shrink-0 p-4 bg-muted/40">
          <Gallery images={images} alt={item.name} />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
            </div>
            <DetailLink href={`/p/${item.id}`} />
          </div>

          <Separator className="mb-3" />

          {/* Data Rows - Always show all fields */}
          <div className="flex-1">
            <Row label="Tên nhà phân phối">
              <Link href={`/p/${item.id}`} className="text-primary font-medium hover:underline">
                {item.name}
              </Link>
            </Row>
            <Row label="Mô tả">
              {item.short_description ? (
                <span className="line-clamp-2 leading-relaxed text-foreground/80">
                  {item.short_description}
                </span>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Địa chỉ">
              {item.location?.address ? (
                <>
                  <span className="text-primary">{item.location.address}</span>
                  {item.location.lat && item.location.long && (
                    <span className="text-muted-foreground text-xs ml-1">
                      {item.location.lat.toFixed(4)},{item.location.long.toFixed(4)}
                    </span>
                  )}
                </>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Hotline">{item.phoneNumber || EMPTY_VALUE}</Row>
            <Row label="Email">
              {item.email ? (
                <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                  {item.email}
                </a>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Giấy phép PYMID">{item.license || EMPTY_VALUE}</Row>
            <Row label="Website">
              <ExtLink href={item.webpage} />
            </Row>
            <Row label="Facebook">
              <ExtLink href={item.facebook} />
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────
   Slider Wrappers
   ────────────────────────────── */

export function NhaYenSlider({ items }: { items: NhaYenItem[] }) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Không có nhà yến nào
      </div>
    );
  }

  return (
    <ContentSlider autoPlayInterval={10000}>
      {items.map((item) => (
        <NhaYenCard key={item.id} item={item} />
      ))}
    </ContentSlider>
  );
}

export function NhaSanXuatSlider({ items }: { items: NhaSanXuatItem[] }) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Không có nhà sản xuất nào
      </div>
    );
  }

  return (
    <ContentSlider autoPlayInterval={10000}>
      {items.map((item) => (
        <NhaSanXuatCard key={item.id} item={item} />
      ))}
    </ContentSlider>
  );
}

export function PartySlider({ items }: { items: PartyItem[] }) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Không có nhà phân phối nào
      </div>
    );
  }

  return (
    <ContentSlider autoPlayInterval={10000}>
      {items.map((item) => (
        <PartyCard key={item.id} item={item} />
      ))}
    </ContentSlider>
  );
}
