"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContentSlider } from "@/components/content-slider";
import { Store, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/api";
import type { ShopBasic, ImageItem } from "@/lib/api";
import { ImageGalleryLightbox } from "@/components/image-gallery-lightbox";

const EMPTY_VALUE = "____";

function ShopGallery({ images, alt }: { images: ImageItem[]; alt: string }) {
  if (!images.length) {
    return (
      <div className="h-[280px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
        <Store className="w-12 h-12 text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="h-[280px] rounded-xl overflow-hidden">
        <img
          src={getImageUrl(images[0].formats?.medium?.url || images[0].url)}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.slice(1, 5).map((img, i) => (
            <div key={i} className="w-14 h-14 shrink-0 rounded-lg overflow-hidden">
              <img
                src={getImageUrl(img.formats?.thumbnail?.url || img.url)}
                alt={`${alt} ${i + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
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
