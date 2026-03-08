import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { Breadcrumb } from "@/components/breadcrumb";
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
  Award,
  Clock,
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-emerald-50 to-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: data.name },
            ]}
            className="mb-6"
          />

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {data.name}
              </h1>
              <p className="text-lg text-slate-600">
                {data.phan_cap && <span>{data.phan_cap.title} • </span>}
                {years > 0 && <span>{years} năm hoạt động</span>}
              </p>
            </div>
            {data.phan_cap && (
              <Badge className="bg-primary text-primary-foreground text-base px-4 py-1.5">
                <Award className="h-4 w-4 mr-2" />
                {data.phan_cap.title}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* YouTube / Image */}
        <div className="rounded-lg overflow-hidden bg-slate-900 shadow-lg">
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
            <Image
              src={getImageUrl(data.image[0].url)}
              alt={data.name}
              width={600}
              height={400}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-slate-400">
              <Home className="h-16 w-16" />
            </div>
          )}
        </div>
        {data.short_description && (
          <p className="text-slate-600 text-center mt-4 text-sm">
            {data.short_description}
          </p>
        )}

        {/* Info Card */}
        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Thông Tin Nhà Yến
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <InfoRow label="Tên nhà yến" value={data.name} />
              <Separator className="bg-slate-200" />
              <InfoRow label="Loại vật liệu đà" value={data.material} />
              <Separator className="bg-slate-200" />
              <InfoRow label="Số tổ yến" value={String(data.so_o_da)} />
              <Separator className="bg-slate-200" />
              <InfoRow label="Số tầng" value={String(data.floor)} />
              <Separator className="bg-slate-200" />
              <InfoRow label="Diện tích sàn" value={`${data.square}m²`} />
              <Separator className="bg-slate-200" />
              <InfoRow
                label="Ngày tham gia"
                value={`${joinDate} (${years} năm)`}
              />
              <Separator className="bg-slate-200" />
              <InfoRow label="Giấy phép" value={data.license} />
              {(data.webpage || data.facebook) && (
                <>
                  <Separator className="bg-slate-200" />
                  <div className="space-y-2 text-sm">
                    {data.webpage && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Website:</span>
                        <a
                          href={data.webpage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors truncate"
                        >
                          {data.webpage}
                        </a>
                      </div>
                    )}
                    {data.facebook && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Facebook:</span>
                        <a
                          href={data.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors truncate"
                        >
                          {data.facebook}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="info" className="space-y-8 mt-12">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-slate-100/50 p-1 rounded-lg border border-slate-200">
          <TabsTrigger
            value="info"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-1.5 text-xs sm:text-sm transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Thông tin</span>
            <span className="sm:hidden">Thông tin</span>
          </TabsTrigger>
          <TabsTrigger
            value="sold"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-1.5 text-xs sm:text-sm transition-colors"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Thùng đã bán</span>
            <span className="sm:hidden">Đã bán</span>
          </TabsTrigger>
          <TabsTrigger
            value="diary"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-1.5 text-xs sm:text-sm transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Nhật ký</span>
            <span className="sm:hidden">Nhật ký</span>
          </TabsTrigger>
          <TabsTrigger
            value="environment"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-1.5 text-xs sm:text-sm transition-colors"
          >
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Thiết bị</span>
            <span className="sm:hidden">Thiết bị</span>
          </TabsTrigger>
          <TabsTrigger
            value="owner"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-1.5 text-xs sm:text-sm transition-colors"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Đại diện</span>
            <span className="sm:hidden">Đại diện</span>
          </TabsTrigger>
          <TabsTrigger
            value="harvest"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg gap-1.5 text-xs sm:text-sm transition-colors"
          >
            <Scissors className="h-4 w-4" />
            <span className="hidden sm:inline">Quy trình</span>
            <span className="sm:hidden">Quy trình</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Thông tin nhà yến */}
        <TabsContent value="info" className="space-y-8">
          {/* Images Gallery */}
          {data.image && data.image.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Hình Ảnh Nhà Yến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.image.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-lg overflow-hidden aspect-square hover:shadow-lg transition-shadow"
                    >
                      <Image
                        src={getImageUrl(img.formats?.medium?.url || img.url)}
                        alt={img.alternativeText || data.name}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Info */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Thông Tin Chi Tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <StatCard
                  icon={<Layers className="h-5 w-5 text-primary" />}
                  label="Số tầng"
                  value={String(data.floor)}
                />
                <StatCard
                  icon={<Ruler className="h-5 w-5 text-primary" />}
                  label="Diện tích"
                  value={`${data.square}m²`}
                />
                <StatCard
                  icon={<Home className="h-5 w-5 text-primary" />}
                  label="Số tổ yến"
                  value={String(data.so_o_da)}
                />
                <StatCard
                  icon={<Hammer className="h-5 w-5 text-primary" />}
                  label="Vật liệu"
                  value={data.material}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          {data.location && (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Vị Trí Nhà Yến
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {data.location.address && (
                  <p className="text-sm text-slate-600 mb-4 px-6 pt-4">
                    {data.location.address}
                  </p>
                )}
                <div className="rounded-lg overflow-hidden h-64">
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
        </TabsContent>

        {/* Tab: Thùng tổ yến đã bán */}
        <TabsContent value="sold">
          <Card className="border-slate-200">
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
          <Card className="border-slate-200">
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
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Thiết Bị Đo Lường
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.scale_description ? (
                <div
                  className="prose prose-sm max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: data.scale_description
                      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
                        const imgUrl = src.startsWith("http")
                          ? src
                          : `https://api.pymid.com${src}`;
                        return `<img src="${imgUrl}" alt="${alt}" class="rounded-lg max-w-full" />`;
                      })
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              ) : (
                <p className="text-slate-500 text-center py-8">
                  Chưa có thông tin thiết bị đo lường
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Đại diện nhà yến */}
        <TabsContent value="owner">
          {data.owner ? (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Đại Diện Nhà Yến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  {data.owner.avatar && (
                    <div className="shrink-0">
                      <Image
                        src={getImageUrl(
                          data.owner.avatar.formats?.medium?.url ||
                            data.owner.avatar.url
                        )}
                        alt={data.owner.bio?.fullname || data.owner.username}
                        width={160}
                        height={160}
                        className="w-40 h-40 rounded-lg object-cover shadow-md"
                      />
                    </div>
                  )}
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900">
                        {data.owner.bio?.fullname || data.owner.username}
                      </h3>
                      {data.owner.who_am_i && (
                        <Badge className="mt-2 bg-primary text-primary-foreground">
                          {data.owner.who_am_i}
                        </Badge>
                      )}
                    </div>
                    {data.owner.bio?.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {data.owner.bio.description}
                      </p>
                    )}
                    {data.owner.bio?.address && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{data.owner.bio.address}</span>
                      </div>
                    )}
                    <Link
                      href={`/u/${data.owner.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Xem trang cá nhân
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200">
              <CardContent className="py-12 text-center text-slate-500">
                Chưa có thông tin đại diện nhà yến
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Quy trình hái tổ */}
        <TabsContent value="harvest">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                Quy Trình Hái Tổ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.flow_description ? (
                <div
                  className="prose prose-sm max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: data.flow_description
                      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
                        const imgUrl = src.startsWith("http")
                          ? src
                          : `https://api.pymid.com${src}`;
                        return `<img src="${imgUrl}" alt="${alt}" class="rounded-lg max-w-full" />`;
                      })
                      .replace(
                        /<iframe([^>]*)><\/iframe>/g,
                        '<div class="aspect-video rounded-lg overflow-hidden"><iframe$1 class="w-full h-full"></iframe></div>'
                      )
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              ) : (
                <p className="text-slate-500 text-center py-8">
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
      <span className="text-slate-600 font-medium">{label}</span>
      <span className={valueClassName || "font-semibold text-slate-900"}>
        {value}
      </span>
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
    <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p className="font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
