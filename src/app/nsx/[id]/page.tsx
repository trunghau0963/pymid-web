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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProfileHeader } from "@/components/profile-header";
import {
  Factory,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  ExternalLink,
  Package,
  Home,
  Users,
  ShieldCheck,
  Play,
  FileText,
  Camera,
} from "lucide-react";

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

  // Determine which tabs to show
  const tabs = [
    { id: "info", label: "Thông tin", show: true },
    { id: "products", label: `Sản phẩm (${activeProducts.length})`, show: activeProducts.length > 0 },
    { id: "nha-yen", label: `Nhà yến (${nhaYens.length})`, show: nhaYens.length > 0 },
    { id: "team", label: `Đội ngũ (${kyThuats.length})`, show: kyThuats.length > 0 },
    { id: "flow", label: "Quy trình", show: !!data.flow_description },
    { id: "license", label: "Giấy phép", show: !!data.license_description },
    { id: "camera", label: "Camera", show: !!data.cam_description },
  ].filter((t) => t.show);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: data.name }]} />
      </div>

      {/* Banner */}
      {data.banner && (
        <div className="rounded-xs overflow-hidden mb-6">
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
        <div className="rounded-xs overflow-hidden bg-muted">
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
        <Card className="rounded-xs">
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
        <Card className="mb-8 rounded-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Chủ sở hữu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/u/${data.owner.id}`}
              className="flex items-center gap-4 hover:bg-muted p-3 rounded-xs transition-colors"
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

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xs">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-xs data-[state=active]:bg-background"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <Card className="rounded-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Giới thiệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.description ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              ) : (
                <p className="text-muted-foreground">Chưa có thông tin</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        {activeProducts.length > 0 && (
          <TabsContent value="products">
            <Card className="rounded-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sản phẩm ({activeProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeProducts.map((product) => (
                    <Card key={product.id} className="rounded-xs overflow-hidden">
                      {product.image?.[0] ? (
                        <img
                          src={getImageUrl(product.image[0].url)}
                          alt={product.name}
                          className="w-full h-40 object-cover"
                        />
                      ) : product.banner ? (
                        <img
                          src={getImageUrl(product.banner.url)}
                          alt={product.name}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-muted flex items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2">
                          {product.name}
                        </h3>
                        {product.short_description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {product.short_description}
                          </p>
                        )}
                        {product.timelife && (
                          <Badge variant="secondary" className="mt-2 rounded-xs">
                            HSD: {product.timelife} ngày
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Nhà yến Tab */}
        {nhaYens.length > 0 && (
          <TabsContent value="nha-yen">
            <Card className="rounded-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Nhà yến liên kết ({nhaYens.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {nhaYens.map((nhaYen) => (
                    <Link
                      key={nhaYen.id}
                      href={`/ny/${nhaYen.id}`}
                      className="block"
                    >
                      <Card className="rounded-xs overflow-hidden hover:shadow-md transition-shadow">
                        {nhaYen.image?.[0] ? (
                          <img
                            src={getImageUrl(nhaYen.image[0].url)}
                            alt={nhaYen.name}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 bg-muted flex items-center justify-center">
                            <Home className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{nhaYen.name}</h3>
                          {nhaYen.short_description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {nhaYen.short_description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {nhaYen.so_o_da && (
                              <Badge variant="outline" className="rounded-xs">
                                {nhaYen.so_o_da} tổ
                              </Badge>
                            )}
                            {nhaYen.floor && (
                              <Badge variant="outline" className="rounded-xs">
                                {nhaYen.floor} tầng
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Team Tab */}
        {kyThuats.length > 0 && (
          <TabsContent value="team">
            <Card className="rounded-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Đội ngũ kỹ thuật ({kyThuats.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kyThuats.map((user) => (
                    <Link key={user.id} href={`/u/${user.id}`}>
                      <Card className="rounded-xs hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            {user.avatar ? (
                              <AvatarImage
                                src={getImageUrl(user.avatar.url)}
                                alt={user.bio?.fullname || user.username}
                              />
                            ) : null}
                            <AvatarFallback>
                              {(user.bio?.fullname || user.username)
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {user.bio?.fullname || user.username}
                            </p>
                            {user.who_am_i && (
                              <p className="text-sm text-muted-foreground truncate">
                                {user.who_am_i}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Flow Tab */}
        {data.flow_description && (
          <TabsContent value="flow">
            <Card className="rounded-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Quy trình sản xuất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.flow_description }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* License Tab */}
        {data.license_description && (
          <TabsContent value="license">
            <Card className="rounded-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Giấy phép & Chứng nhận
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.license_description }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Camera Tab */}
        {data.cam_description && (
          <TabsContent value="camera">
            <Card className="rounded-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera giám sát
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.cam_description }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Gallery */}
      {data.image && data.image.length > 1 && (
        <Card className="mt-8 rounded-xs">
          <CardHeader>
            <CardTitle>Hình ảnh nhà sản xuất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.image.map((img) => (
                <div key={img.id} className="rounded-xs overflow-hidden">
                  <img
                    src={getImageUrl(img.url)}
                    alt={img.alternativeText || data.name}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
