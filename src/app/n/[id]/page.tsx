import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { Breadcrumb } from "@/components/ui/breadcrumb";
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
  Award,
  Clock,
} from "lucide-react";
import { RichText } from "@/components/rich-text";

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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-primary/[0.04] to-background border-b border-border/40">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Nhà yến", href: `/ny/${nha_yen.id}` },
              { label: `Thùng yến #${data.id}` },
            ]}
            className="mb-6"
          />

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">
                Thùng Tổ Yến #{data.id}
              </h1>
              <p className="text-lg text-muted-foreground">
                Từ{" "}
                <Link
                  href={`/ny/${nha_yen.id}`}
                  className="text-primary hover:underline font-medium"
                >
                  {nha_yen.name}
                </Link>
              </p>
            </div>
            <div className="flex gap-2">
              <Badge
                className={data.sold ? "bg-primary/10 text-primary border border-primary/20" : "bg-accent/10 text-accent border border-accent/20"}
              >
                {data.sold ? "✓ Đã bán" : "Chưa bán"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<Weight className="h-5 w-5 text-primary" />}
              label="Khối lượng"
              value={`${data.weight}g`}
            />
            <MetricCard
              icon={<Package className="h-5 w-5 text-primary" />}
              label="Số tổ"
              value={data.to_yen_number}
            />
            <MetricCard
              icon={<Droplets className="h-5 w-5 text-primary" />}
              label="TB/tổ"
              value={`${data.weight_per_to_yen}g`}
            />
            <MetricCard
              icon={<MapPin className="h-5 w-5 text-primary" />}
              label="Tỉnh thành"
              value={data.province}
            />
          </div>

          {/* Description */}
          {data.description && (
            <Card className="border-border/60 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Thông Tin Chi Tiết Thùng Yến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RichText content={data.description} />
              </CardContent>
            </Card>
          )}

          {/* YouTube Video */}
          {youtubeEmbed && (
            <Card className="border-border/60 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Video Quy Trình Đóng Thùng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted/50">
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
          <Card className="border-border/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Thông Tin Thời Gian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <InfoRow label="Ngày tạo" value={formatDate(data.created_at)} />
                <Separator className="bg-border/50" />
                <InfoRow
                  label="Cập nhật lần cuối"
                  value={formatDate(data.updated_at)}
                />
                {data.ke_hoach_san_xuat && (
                  <>
                    <Separator className="bg-border/50" />
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
        <div className="space-y-8">
          {/* Bird Nest House Info */}
          <Card className="border-border/60 rounded-2xl shadow-lg shadow-primary/[0.04] hover:shadow-xl hover:shadow-primary/[0.06] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Nhà Yến
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nha_yen.image?.[0] && (
                <div className="rounded-xl overflow-hidden">
                  <Image
                    src={getImageUrl(nha_yen.image[0].url)}
                    alt={nha_yen.name}
                    width={300}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
              <div>
                <Link
                  href={`/ny/${nha_yen.id}`}
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  {nha_yen.name}
                </Link>
                {nha_yen.short_description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {nha_yen.short_description}
                  </p>
                )}
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-2 text-sm">
                <InfoRow label="Giấy phép" value={nha_yen.license} />
                <InfoRow label="Số tầng" value={String(nha_yen.floor)} />
                <InfoRow label="Diện tích" value={`${nha_yen.square}m²`} />
                <InfoRow label="Vật liệu" value={nha_yen.material} />
                <InfoRow label="Số ổ đã" value={String(nha_yen.so_o_da)} />
              </div>

              {(nha_yen.webpage || nha_yen.facebook) && (
                <>
                  <Separator className="bg-border/50" />
                  <div className="flex gap-2 flex-wrap">
                    {nha_yen.webpage && (
                      <a
                        href={nha_yen.webpage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
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
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
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
                className="block w-full text-center py-2.5 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm shadow-primary/20"
              >
                Xem chi tiết nhà yến →
              </Link>
            </CardContent>
          </Card>

          {/* Owner Info */}
          {owner && (
            <Card className="border-border/60 rounded-2xl shadow-lg shadow-primary/[0.04] hover:shadow-xl hover:shadow-primary/[0.06] transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Chủ Nhà Yến
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {owner.avatar && (
                    <Image
                      src={getImageUrl(
                        owner.avatar.formats?.thumbnail?.url || owner.avatar.url
                      )}
                      alt={owner.bio?.fullname || owner.username}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <Link
                      href={`/u/${owner.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
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
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Xem trang cá nhân
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Location */}
          {nha_yen.location && (
            <Card className="border-border/60 rounded-2xl shadow-lg shadow-primary/[0.04] hover:shadow-xl hover:shadow-primary/[0.06] transition-all duration-300 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Vị Trí
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {nha_yen.location.address && (
                  <p className="text-sm text-muted-foreground mb-3 px-6 pt-4">
                    {nha_yen.location.address}
                  </p>
                )}
                <div className="rounded-lg overflow-hidden h-48">
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
    <Card className="text-center border-border/60 rounded-2xl hover:shadow-lg hover:shadow-primary/[0.04] transition-all duration-300">
      <CardContent className="pt-5 pb-4">
        <div className="flex justify-center mb-3">{icon}</div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
        <p className="font-bold text-lg text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}
