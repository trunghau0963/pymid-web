import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getNhaSanXuat,
  getImageUrl,
  getYoutubeEmbedUrl,
  formatDate,
  yearsSince,
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Factory,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { ImageGalleryLightbox } from "@/components/image-gallery-lightbox";
import { NsxTabs } from "./nsx-tabs";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getNhaSanXuat(id);
    return {
      title: `${data.name} - Nhà sản xuất`,
      description:
        data.short_description ||
        `Thông tin nhà sản xuất ${data.name}`,
      openGraph: {
        title: data.name,
        description: data.short_description || `Nhà sản xuất ${data.name}`,
        type: "article",
        locale: "vi_VN",
        images: data.image?.[0]
          ? [{ url: getImageUrl(data.image[0].url) }]
          : data.banner
          ? [{ url: getImageUrl(data.banner.url) }]
          : [],
      },
    };
  } catch {
    return { title: "Nhà sản xuất" };
  }
}

function InfoRow({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="font-medium">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              {value}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
}

export default async function NhaSanXuatPage({ params }: Props) {
  const { id } = await params;

  let data;
  try {
    data = await getNhaSanXuat(id);
  } catch {
    notFound();
  }

  const youtubeEmbed = data.youtube ? getYoutubeEmbedUrl(data.youtube) : null;
  const joinDate = formatDate(data.created_at);
  const years = yearsSince(data.created_at);
  const activeProducts = data.products?.filter((p) => p.active) || [];
  const nhaYens = data.nha_yens || [];
  const kyThuats = data.ky_thuats || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: data.name }]} />
      </div>

      {/* Banner */}
      {data.banner && (
        <div className="rounded-md overflow-hidden mb-6">
          <img
            src={getImageUrl(data.banner.url)}
            alt={data.name}
            className="w-full h-48 md:h-64 object-cover"
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* YouTube / Image */}
        <div className="rounded-md overflow-hidden bg-muted">
          {youtubeEmbed ? (
            <div className="aspect-video">
              <iframe
                src={youtubeEmbed}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={data.name}
              />
            </div>
          ) : data.image?.[0] ? (
            <img
              src={getImageUrl(data.image[0].url)}
              alt={data.name}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-muted-foreground">
              <Factory className="h-16 w-16" />
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="rounded-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Factory className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl text-primary">
                {data.name}
              </CardTitle>
            </div>
            {data.short_description && (
              <p className="text-sm text-muted-foreground">
                {data.short_description}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              label="Mã giấy phép"
              value={data.license}
              icon={ShieldCheck}
            />
            <Separator />
            <InfoRow
              label="Địa chỉ"
              value={data.location?.address}
              icon={MapPin}
            />
            <Separator />
            <InfoRow label="Điện thoại" value={data.phoneNumber} icon={Phone} />
            <Separator />
            <InfoRow label="Email" value={data.email} icon={Mail} />
            <Separator />
            <InfoRow
              label="Website"
              value={data.webpage}
              href={data.webpage?.startsWith("http") ? data.webpage : `https://${data.webpage}`}
              icon={Globe}
            />
            <Separator />
            <InfoRow
              label="Ngày tham gia"
              value={`${joinDate} (${years} năm)`}
              icon={User}
            />
          </CardContent>
        </Card>
      </div>

      {/* Owner Info */}
      {data.owner && (
        <Card className="mb-8 rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Chủ sở hữu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/u/${data.owner.id}`}
              className="flex items-center gap-4 hover:bg-muted/60 p-3 rounded-sm transition-colors"
            >
              <Avatar className="h-12 w-12">
                {data.owner.avatar ? (
                  <AvatarImage
                    src={getImageUrl(data.owner.avatar.url)}
                    alt={data.owner.bio?.fullname || data.owner.username}
                  />
                ) : null}
                <AvatarFallback>
                  {(data.owner.bio?.fullname || data.owner.username)
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {data.owner.bio?.fullname || data.owner.username}
                </p>
                {data.owner.who_am_i && (
                  <p className="text-sm text-muted-foreground">
                    {data.owner.who_am_i}
                  </p>
                )}
              </div>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Gallery - Below Owner */}
      {data.image && data.image.length > 1 && (
        <Card className="mb-8 rounded-xs">
          <CardHeader>
            <CardTitle>Hình ảnh nhà sản xuất</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageGalleryLightbox images={data.image} columns={4} />
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <NsxTabs 
        data={data} 
        activeProducts={activeProducts} 
        nhaYens={nhaYens} 
        kyThuats={kyThuats} 
      />
    </div>
  );
}
