import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getNhomToYen,
  getImageUrl,
  getYoutubeEmbedUrl,
  formatDate,
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Weight,
  Calendar,
  Home,
  User,
  ExternalLink,
  Package,
  Droplets,
  Globe,
  Facebook,
  ShieldCheck,
  Play,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getNhomToYen(id);
    return {
      title: `Thùng yến #${data.id} - ${data.nha_yen.name}`,
      description: `Truy xuất nguồn gốc thùng tổ yến #${data.id} từ ${data.nha_yen.name}. Khối lượng: ${data.weight}g, Số tổ: ${data.to_yen_number}, Tỉnh: ${data.province}`,
      openGraph: {
        title: `Thùng yến #${data.id} - ${data.nha_yen.name}`,
        description: `Truy xuất nguồn gốc thùng tổ yến từ ${data.nha_yen.name}`,
        type: "article",
        locale: "vi_VN",
      },
    };
  } catch {
    return { title: "Truy xuất nguồn gốc tổ yến" };
  }
}

export default async function TraceabilityPage({ params }: Props) {
  const { id } = await params;

  let data;
  try {
    data = await getNhomToYen(id);
  } catch {
    notFound();
  }

  const { nha_yen, owner } = data;
  const youtubeEmbed = data.youtube
    ? getYoutubeEmbedUrl(data.youtube)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/ny/${nha_yen.id}`} className="hover:text-foreground">
          {nha_yen.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Thùng yến #{data.id}</span>
      </nav>

      {/* Hero Header */}
      <div className="relative rounded-xs overflow-hidden bg-gradient-to-r from-red-600 to-red-800 text-white p-6 md:p-10 mb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Badge
              variant={data.sold ? "secondary" : "default"}
              className="bg-white/20 text-white border-0 text-sm"
            >
              {data.sold ? "Đã bán" : "Chưa bán"}
            </Badge>
            <Badge className="bg-white/20 text-white border-0 text-sm">
              #{data.id}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Thùng Tổ Yến #{data.id}
          </h1>
          <p className="text-red-100 text-lg">
            Từ{" "}
            <Link
              href={`/ny/${nha_yen.id}`}
              className="underline hover:text-white"
            >
              {nha_yen.name}
            </Link>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<Weight className="h-5 w-5 text-red-600" />}
              label="Khối lượng"
              value={`${data.weight}g`}
            />
            <MetricCard
              icon={<Package className="h-5 w-5 text-red-600" />}
              label="Số tổ"
              value={data.to_yen_number}
            />
            <MetricCard
              icon={<Droplets className="h-5 w-5 text-red-600" />}
              label="TB/tổ"
              value={`${data.weight_per_to_yen}g`}
            />
            <MetricCard
              icon={<MapPin className="h-5 w-5 text-red-600" />}
              label="Tỉnh thành"
              value={data.province}
            />
          </div>

          {/* Description */}
          {data.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-red-600" />
                  Thông Tin Chi Tiết Thùng Yến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none prose-headings:text-red-700"
                  dangerouslySetInnerHTML={{
                    __html: data.description
                      .replace(/\n/g, "<br/>")
                      .replace(/<BR>/g, "<br/>"),
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* YouTube Video */}
          {youtubeEmbed && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="h-5 w-5 text-red-600" />
                  Video Quy Trình Đóng Thùng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-xs overflow-hidden">
                  <iframe
                    src={youtubeEmbed}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video quy trình đóng thùng"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                Thông Tin Thời Gian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <InfoRow label="Ngày tạo" value={formatDate(data.created_at)} />
                <Separator />
                <InfoRow
                  label="Cập nhật lần cuối"
                  value={formatDate(data.updated_at)}
                />
                {data.ke_hoach_san_xuat && (
                  <>
                    <Separator />
                    <InfoRow
                      label="Kế hoạch sản xuất"
                      value={data.ke_hoach_san_xuat.name}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bird Nest House Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="h-5 w-5 text-red-600" />
                Nhà Yến
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nha_yen.image?.[0] && (
                <div className="rounded-xs overflow-hidden">
                  <img
                    src={getImageUrl(nha_yen.image[0].url)}
                    alt={nha_yen.name}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
              <div>
                <Link
                  href={`/ny/${nha_yen.id}`}
                  className="font-semibold text-red-600 hover:underline"
                >
                  {nha_yen.name}
                </Link>
                {nha_yen.short_description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {nha_yen.short_description}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <InfoRow label="Giấy phép" value={nha_yen.license} />
                <InfoRow label="Số tầng" value={String(nha_yen.floor)} />
                <InfoRow label="Diện tích" value={`${nha_yen.square}m²`} />
                <InfoRow label="Vật liệu" value={nha_yen.material} />
                <InfoRow label="Số ổ đã" value={String(nha_yen.so_o_da)} />
              </div>

              {(nha_yen.webpage || nha_yen.facebook) && (
                <>
                  <Separator />
                  <div className="flex gap-2">
                    {nha_yen.webpage && (
                      <a
                        href={nha_yen.webpage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                    {nha_yen.facebook && (
                      <a
                        href={nha_yen.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </a>
                    )}
                  </div>
                </>
              )}

              <Link
                href={`/ny/${nha_yen.id}`}
                className="block w-full text-center py-2 px-4 bg-red-50 text-red-600 rounded-xs text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Xem chi tiết nhà yến →
              </Link>
            </CardContent>
          </Card>

          {/* Owner Info */}
          {owner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  Chủ Nhà Yến
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {owner.avatar && (
                    <img
                      src={getImageUrl(
                        owner.avatar.formats?.thumbnail?.url || owner.avatar.url
                      )}
                      alt={owner.bio?.fullname || owner.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <Link
                      href={`/u/${owner.id}`}
                      className="font-medium hover:text-red-600"
                    >
                      {owner.bio?.fullname || owner.username}
                    </Link>
                    {owner.who_am_i && (
                      <p className="text-xs text-muted-foreground">
                        {owner.who_am_i}
                      </p>
                    )}
                  </div>
                </div>
                {owner.bio?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {owner.bio.description}
                  </p>
                )}
                <Link
                  href={`/u/${owner.id}`}
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
                >
                  Xem trang cá nhân
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Location */}
          {nha_yen.location && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  Vị Trí
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nha_yen.location.address && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {nha_yen.location.address}
                  </p>
                )}
                <div className="rounded-xs overflow-hidden h-48">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${nha_yen.location.lat},${nha_yen.location.long}&zoom=15`}
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
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="text-center">
      <CardContent className="pt-4 pb-3">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
