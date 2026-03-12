"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContentSlider } from "@/components/content-slider";
import { Store, MapPin, ExternalLink, ArrowRight, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/api";
import type { ShopBasic, ImageItem } from "@/lib/api";

const EMPTY_VALUE = "____";
const THUMBNAIL_COUNT = 4;

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
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
      <div className="relative max-w-[90vw] max-h-[85vh]">
        <img
          src={getImageUrl(currentImage.formats?.large?.url || currentImage.url)}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-sm bg-black/50 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-12 h-12 shrink-0 rounded-lg overflow-hidden transition-all ${
                i === currentIndex ? "ring-2 ring-white scale-110" : "opacity-50 hover:opacity-100"
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

  if (!mounted) return null;
  return createPortal(content, document.body);
}

/* ──────────────────────────────
   Shop Gallery with Lightbox
   ────────────────────────────── */

function ShopGallery({ images, alt }: { images: ImageItem[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const thumbnailSlots = Array.from({ length: THUMBNAIL_COUNT }, (_, i) => images[i] || null);

  if (!images.length) {
    return (
      <div className="flex flex-col">
        <div className="h-[280px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-sm flex items-center justify-center">
          <Store className="w-12 h-12 text-slate-300" />
        </div>
        <div className="flex gap-2 mt-2">
          {thumbnailSlots.map((_, i) => (
            <div
              key={i}
              className="w-14 h-14 shrink-0 rounded-lg bg-slate-100 border-2 border-dashed border-slate-200"
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
        {/* Main Image with Zoom */}
        <div className="relative h-[280px] rounded-sm overflow-hidden bg-slate-100 group">
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
              <ZoomIn className="w-6 h-6 text-slate-700" />
            </span>
          </button>
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails - Clickable */}
        <div className="flex gap-2 mt-2">
          {thumbnailSlots.map((img, i) =>
            img ? (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 transition-all duration-200 ${
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
                className="w-14 h-14 shrink-0 rounded-lg bg-slate-100 border-2 border-dashed border-slate-200"
              />
            )
          )}
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex text-sm py-2 border-b border-slate-100 last:border-0">
      <div className="w-[40%] shrink-0 pr-3 text-slate-500">{label}</div>
      <div className="text-slate-800 flex-1 break-words">{children || EMPTY_VALUE}</div>
    </div>
  );
}

function ShopCard({ item }: { item: ShopBasic }) {
  const images = [...(item.image || []), ...(item.avatar || [])];

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm min-h-[420px]">
      <div className="flex flex-col lg:flex-row h-full">
        <div className="lg:w-[350px] shrink-0 p-4 bg-slate-50">
          <ShopGallery images={images} alt={item.name} />
        </div>
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
            </div>
            <Link
              href={`/s/${item.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Chi tiết
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!item.active && (
            <Badge variant="destructive" className="self-start mb-3 text-xs">
              Tạm đóng
            </Badge>
          )}

          <Separator className="mb-3" />

          <div className="flex-1">
            <Row label="Tên cửa hàng">
              <Link href={`/s/${item.id}`} className="text-primary font-medium hover:underline">
                {item.name}
              </Link>
            </Row>
            <Row label="Mô tả">
              {item.short_description ? (
                <span className="line-clamp-2 leading-relaxed text-slate-700">{item.short_description}</span>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Địa chỉ">
              {item.location?.address ? (
                <span className="text-primary">{item.location.address}</span>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Điện thoại">{item.phoneNumber || EMPTY_VALUE}</Row>
            <Row label="Email">
              {item.email ? (
                <a href={`mailto:${item.email}`} className="text-primary hover:underline">{item.email}</a>
              ) : EMPTY_VALUE}
            </Row>
            <Row label="Giấy phép">{item.license || EMPTY_VALUE}</Row>
            <Row label="Website">
              {item.webpage ? (
                <a href={item.webpage} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                  {item.webpage} <ExternalLink className="h-3 w-3" />
                </a>
              ) : EMPTY_VALUE}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopSlider({ items }: { items: ShopBasic[] }) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        Không có cửa hàng nào
      </div>
    );
  }

  return (
    <ContentSlider autoPlayInterval={10000}>
      {items.map((item) => (
        <ShopCard key={item.id} item={item} />
      ))}
    </ContentSlider>
  );
}
