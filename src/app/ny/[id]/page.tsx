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
        <div className="rounded-2xl overflow-hidden bg-muted">
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
              <Home className="h-16 w-16" />
            </div>
          )}
          {data.short_description && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              {data.short_description}
            </div>
          )}
        </div>

        {/* Info Table */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Home className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl text-primary">
                Truy Xuất Thông Tin Nhà Yến
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
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
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1.5 bg-muted/40 p-1.5 rounded-2xl border border-border/40">
          <TabsTrigger
            value="info"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl gap-1.5 text-xs sm:text-sm transition-all duration-200"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Thông tin nhà yến</span>
            <span className="sm:hidden">Nhà yến</span>
          </TabsTrigger>
          <TabsTrigger
            value="sold"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl gap-1.5 text-xs sm:text-sm transition-all duration-200"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Thùng tổ yến đã bán</span>
            <span className="sm:hidden">Đã bán</span>
          </TabsTrigger>
          <TabsTrigger
            value="diary"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl gap-1.5 text-xs sm:text-sm transition-all duration-200"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Nhật ký khép kín</span>
            <span className="sm:hidden">Nhật ký</span>
          </TabsTrigger>
          <TabsTrigger
            value="environment"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl gap-1.5 text-xs sm:text-sm transition-all duration-200"
          >
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Thiết bị đo lường</span>
            <span className="sm:hidden">Thiết bị</span>
          </TabsTrigger>
          <TabsTrigger
            value="owner"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl gap-1.5 text-xs sm:text-sm transition-all duration-200"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Đại diện nhà yến</span>
            <span className="sm:hidden">Đại diện</span>
          </TabsTrigger>
          <TabsTrigger
            value="harvest"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl gap-1.5 text-xs sm:text-sm transition-all duration-200"
          >
            <Scissors className="h-4 w-4" />
            <span className="hidden sm:inline">Quy trình hái tổ</span>
            <span className="sm:hidden">Hái tổ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Thông tin nhà yến */}
        <TabsContent value="info">
          <div className="space-y-6">
            {/* Images Gallery */}
            {data.image && data.image.length > 0 && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Hình Ảnh Nhà Yến</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {data.image.map((img) => (
                      <div
                        key={img.id}
                        className="rounded-xl overflow-hidden aspect-square"
                      >
                        <img
                          src={getImageUrl(
                            img.formats?.medium?.url || img.url
                          )}
                          alt={img.alternativeText || data.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Info */}
            <Card className="rounded-2xl">
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
              <Card className="rounded-2xl">
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
                  <div className="rounded-xl overflow-hidden h-64">
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
          <Card className="rounded-2xl">
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
          <Card className="rounded-2xl">
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
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Thiết Bị Đo Lường Và Chỉ Số
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.scale_description ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: data.scale_description
                      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
                        const imgUrl = src.startsWith("http")
                          ? src
                          : `https://api.pymid.com${src}`;
                        return `<img src="${imgUrl}" alt="${alt}" class="rounded-xl max-w-full" />`;
                      })
                      .replace(/\n/g, "<br/>"),
                  }}
                />
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
            <Card className="rounded-2xl">
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
                        className="w-40 h-40 rounded-xl object-cover"
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
              <CardContent className="py-8 text-center text-muted-foreground rounded-2xl">
                Chưa có thông tin đại diện nhà yến
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Quy trình hái tổ */}
        <TabsContent value="harvest">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                Quy Trình Hái Tổ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.flow_description ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: data.flow_description
                      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
                        const imgUrl = src.startsWith("http")
                          ? src
                          : `https://api.pymid.com${src}`;
                        return `<img src="${imgUrl}" alt="${alt}" class="rounded-xl max-w-full" />`;
                      })
                      .replace(
                        /<iframe([^>]*)><\/iframe>/g,
                        '<div class="aspect-video rounded-xl overflow-hidden"><iframe$1 class="w-full h-full"></iframe></div>'
                      )
                      .replace(/\n/g, "<br/>"),
                  }}
                />
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
    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
