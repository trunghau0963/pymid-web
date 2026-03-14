import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getNhaYen,
  getSoldNhomToYen,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  MapPin,
  Layers,
  Ruler,
  Hammer,
  ShieldCheck,
  User,
  ExternalLink,
  Package,
  BookOpen,
  Gauge,
  Scissors,
} from "lucide-react";
import { NhomToYenFilter } from "./nhom-to-yen-filter";
import { NhatKyFilter } from "./nhat-ky-filter";
import { RichText } from "@/components/rich-text";
import { ImageGalleryLightbox } from "@/components/image-gallery-lightbox";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getNhaYen(id);
    return {
      title: `${data.name} - Nhà yến`,
      description:
        data.short_description ||
        `Thông tin nhà yến ${data.name}. Số tổ: ${data.so_o_da}, Số tầng: ${data.floor}, Diện tích: ${data.square}m²`,
      openGraph: {
        title: data.name,
        description: data.short_description || `Thông tin nhà yến ${data.name}`,
        type: "article",
        locale: "vi_VN",
        images: data.image?.[0]
          ? [{ url: getImageUrl(data.image[0].url) }]
          : [],
      },
    };
  } catch {
    return { title: "Nhà yến" };
  }
}

export default async function NhaYenPage({ params }: Props) {
  const { id } = await params;

  let data;
  let soldNhomToYens;
  try {
    [data, soldNhomToYens] = await Promise.all([
      getNhaYen(id),
      getSoldNhomToYen(id),
    ]);
  } catch {
    notFound();
  }

  const youtubeEmbed = data.youtube
    ? getYoutubeEmbedUrl(data.youtube)
    : null;

  const joinDate = formatDate(data.created_at);
  const years = yearsSince(data.created_at);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{data.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* YouTube / Image */}
        <div className="rounded-md overflow-hidden border border-border/60 bg-card">
          {youtubeEmbed ? (
            <div className="aspect-video bg-muted/50">
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
              className="w-full aspect-video object-cover bg-muted/50"
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-muted-foreground bg-muted/50">
              <Home className="h-16 w-16" />
            </div>
          )}

          <div className="border-t border-border/60 px-5 py-5">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-semibold text-primary leading-tight">
                Truy Xuất Thông Tin Nhà Yến
              </h1>
            </div>
            <p className="text-base font-semibold text-foreground">{data.name}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {data.short_description || "Thông tin tổng quan và dữ liệu vận hành của nhà yến trong hệ sinh thái PYMID."}
            </p>
          </div>
        </div>

        {/* Info Table */}
        <Card className="rounded-md">
          <CardContent className="pt-5 pb-5">
            <div className="space-y-3">
              <InfoRow
                label="Tên nhà yến"
                value={data.name}
                valueClassName="text-primary font-semibold"
              />
              <Separator />
              {data.phan_cap && (
                <>
                  <InfoRow
                    label="Phân cấp nhà yến"
                    value={data.phan_cap.title}
                    valueClassName="font-semibold"
                  />
                  <Separator />
                </>
              )}
              <InfoRow label="Loại vật liệu đà" value={data.material} />
              <Separator />
              <InfoRow label="Số tổ yến" value={String(data.so_o_da)} />
              <Separator />
              <InfoRow label="Số tầng" value={String(data.floor)} />
              <Separator />
              <InfoRow
                label="Diện tích sàn (m²)"
                value={String(data.square)}
              />
              <Separator />
              <InfoRow
                label="Ngày tham gia PYMID"
                value={`${joinDate} (${years} năm)`}
              />
              <Separator />
              <InfoRow label="Giấy phép PYMID" value={data.license} />
              {data.webpage && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Website</span>
                    <a
                      href={data.webpage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {data.webpage}
                    </a>
                  </div>
                </>
              )}
              {data.facebook && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Facebook</span>
                    <a
                      href={data.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-[200px]"
                    >
                      {data.facebook}
                    </a>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="info" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
          <TabsList className="w-full flex flex-wrap h-auto min-h-14 gap-2 p-2 bg-gradient-to-r from-emerald-50/90 via-slate-50/90 to-emerald-50/90 rounded-md shadow-md shadow-emerald-100/50 border border-emerald-100/50">
            <TabsTrigger
              value="info"
              className="px-3 py-2 rounded-sm bg-transparent text-slate-600 font-medium gap-1.5 text-xs whitespace-nowrap transition-all duration-300 ease-out
                hover:text-primary hover:bg-white/80
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/15"
            >
              <Home className="h-3.5 w-3.5" />
              Nhà yến
            </TabsTrigger>
            <TabsTrigger
              value="sold"
              className="px-3 py-2 rounded-sm bg-transparent text-slate-600 font-medium gap-1.5 text-xs whitespace-nowrap transition-all duration-300 ease-out
                hover:text-primary hover:bg-white/80
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/15"
            >
              <Package className="h-3.5 w-3.5" />
              Đã bán
            </TabsTrigger>
            <TabsTrigger
              value="diary"
              className="px-3 py-2 rounded-sm bg-transparent text-slate-600 font-medium gap-1.5 text-xs whitespace-nowrap transition-all duration-300 ease-out
                hover:text-primary hover:bg-white/80
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/15"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Nhật ký
            </TabsTrigger>
            <TabsTrigger
              value="environment"
              className="px-3 py-2 rounded-sm bg-transparent text-slate-600 font-medium gap-1.5 text-xs whitespace-nowrap transition-all duration-300 ease-out
                hover:text-primary hover:bg-white/80
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/15"
            >
              <Gauge className="h-3.5 w-3.5" />
              Đo lường
            </TabsTrigger>
            <TabsTrigger
              value="owner"
              className="px-3 py-2 rounded-sm bg-transparent text-slate-600 font-medium gap-1.5 text-xs whitespace-nowrap transition-all duration-300 ease-out
                hover:text-primary hover:bg-white/80
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/15"
            >
              <User className="h-3.5 w-3.5" />
              Đại diện
            </TabsTrigger>
            <TabsTrigger
              value="harvest"
              className="px-3 py-2 rounded-sm bg-transparent text-slate-600 font-medium gap-1.5 text-xs whitespace-nowrap transition-all duration-300 ease-out
                hover:text-primary hover:bg-white/80
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/15"
            >
              <Scissors className="h-3.5 w-3.5" />
              Hái tổ
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Thông tin nhà yến */}
        <TabsContent value="info">
          <div className="space-y-6">
            {/* Images Gallery */}
            {data.image && data.image.length > 0 && (
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle className="text-lg">Hình Ảnh Nhà Yến</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageGalleryLightbox images={data.image} columns={4} />
                </CardContent>
              </Card>
            )}

            {/* Detailed Info */}
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Thông Tin Chi Tiết
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <StatCard
                    icon={<Layers className="h-5 w-5" />}
                    label="Số tầng"
                    value={String(data.floor)}
                  />
                  <StatCard
                    icon={<Ruler className="h-5 w-5" />}
                    label="Diện tích"
                    value={`${data.square}m²`}
                  />
                  <StatCard
                    icon={<Home className="h-5 w-5" />}
                    label="Số tổ yến"
                    value={String(data.so_o_da)}
                  />
                  <StatCard
                    icon={<Hammer className="h-5 w-5" />}
                    label="Vật liệu"
                    value={data.material}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            {data.location && (
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Vị Trí Nhà Yến
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.location.address && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {data.location.address}
                    </p>
                  )}
                  <div className="rounded-sm overflow-hidden h-64">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${data.location.lat},${data.location.long}&zoom=15`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      title="Vị trí nhà yến"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab: Thùng tổ yến đã bán */}
        <TabsContent value="sold">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Thùng Tổ Yến Đã Bán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NhomToYenFilter items={soldNhomToYens} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Nhật ký khép kín */}
        <TabsContent value="diary">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Nhật Ký Khép Kín
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NhatKyFilter items={data.nhat_ky_khep_kins || []} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Thông số môi trường / Thiết bị đo lường */}
        <TabsContent value="environment">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Thiết Bị Đo Lường Và Chỉ Số
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.scale_description ? (
                <RichText content={data.scale_description} />
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Chưa có thông tin thiết bị đo lường
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Đại diện nhà yến */}
        <TabsContent value="owner">
          {data.owner ? (
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Đại Diện Nhà Yến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  {data.owner.avatar && (
                    <div className="shrink-0">
                      <img
                        src={getImageUrl(
                          data.owner.avatar.formats?.medium?.url ||
                            data.owner.avatar.url
                        )}
                        alt={
                          data.owner.bio?.fullname || data.owner.username
                        }
                        className="w-40 h-40 rounded-sm object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {data.owner.bio?.fullname || data.owner.username}
                      </h3>
                      {data.owner.who_am_i && (
                        <Badge variant="secondary" className="mt-1">
                          {data.owner.who_am_i}
                        </Badge>
                      )}
                    </div>
                    {data.owner.bio?.description && (
                      <p className="text-sm text-muted-foreground">
                        {data.owner.bio.description}
                      </p>
                    )}
                    {data.owner.bio?.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{data.owner.bio.address}</span>
                      </div>
                    )}
                    <Link
                      href={`/u/${data.owner.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Xem trang cá nhân
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground rounded-md">
                Chưa có thông tin đại diện nhà yến
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Quy trình hái tổ */}
        <TabsContent value="harvest">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                Quy Trình Hái Tổ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.flow_description ? (
                <RichText content={data.flow_description} />
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Chưa có thông tin quy trình hái tổ
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className={valueClassName || "font-medium"}>{value}</span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-sm bg-muted/40 border border-border/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
