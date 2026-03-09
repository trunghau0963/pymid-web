import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getParty,
  getPartyShops,
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
import { Breadcrumb } from "@/components/ui/breadcrumb";
// import { ShopGrid } from "@/components/shop-grid";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  ExternalLink,
  Store,
  Users,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getParty(id);
    return {
      title: `${data.name} - Nhà phân phối`,
      description:
        data.short_description ||
        `Thông tin nhà phân phối ${data.name}`,
      openGraph: {
        title: data.name,
        description: data.short_description || `Nhà phân phối ${data.name}`,
        type: "article",
        locale: "vi_VN",
        images: data.image?.[0]
          ? [{ url: getImageUrl(data.image[0].url) }]
          : [],
      },
    };
  } catch {
    return { title: "Nhà phân phối" };
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
        <div className="font-medium text-foreground">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1"
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

export default async function PartyPage({ params }: Props) {
  const { id } = await params;

  let data;
  let shopsData;
  try {
    [data, shopsData] = await Promise.all([
      getParty(id),
      getPartyShops(id),
    ]);
  } catch {
    notFound();
  }

  const youtubeEmbed = data.youtube ? getYoutubeEmbedUrl(data.youtube) : null;
  const joinDate = formatDate(data.created_at);
  const years = yearsSince(data.created_at);
  const shops = data.shops?.filter((s) => s.active) || [];
  const kyThuats = data.ky_thuats || [];
  const totalShops = shopsData?.total || shops.length;

  // Determine which tabs to show
  const tabs = [
    { id: "info", label: "Thông tin", show: true },
    { id: "shops", label: `Cửa hàng (${totalShops})`, show: totalShops > 0 },
    { id: "team", label: `Đội ngũ (${kyThuats.length})`, show: kyThuats.length > 0 },
  ].filter((t) => t.show);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: data.name }]} />
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* YouTube / Image */}
        <div className="rounded-2xl overflow-hidden bg-muted/50">
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
              <Building2 className="h-16 w-16" />
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl text-primary">
                {data.name}
              </CardTitle>
            </div>
            {data.short_description && (
              <p className="text-sm text-muted-foreground">
                {data.short_description}
              </p>
            )}
            {data.code && (
              <Badge variant="outline" className="w-fit mt-2 rounded-xl">
                Mã: {data.code}
              </Badge>
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
        <Card className="mb-8 rounded-2xl border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Chủ sở hữu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/u/${data.owner.id}`}
              className="flex items-center gap-4 hover:bg-muted/60 p-3 rounded-xl transition-colors"
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
                <p className="font-semibold text-foreground">
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
        <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/40 p-1.5 rounded-2xl border border-border/40">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Giới thiệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.description ? (
                <div
                  className="prose prose-sm max-w-none text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              ) : (
                <p className="text-muted-foreground">Chưa có thông tin</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shops Tab */}
        {totalShops > 0 && (
          <TabsContent value="shops">
            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Cửa hàng ({totalShops})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {shops.map((shop) => (
                    <Link
                      key={shop.id}
                      href={`/s/${shop.id}`}
                      className="block"
                    >
                      <Card className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow border-border/60">
                        {shop.image?.[0] ? (
                          <img
                            src={getImageUrl(shop.image[0].url)}
                            alt={shop.name}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 bg-muted/60 flex items-center justify-center">
                            <Store className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground">{shop.name}</h3>
                          {shop.short_description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {shop.short_description}
                            </p>
                          )}
                          {shop.location?.address && (
                            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1">
                                {shop.location.address}
                              </span>
                            </p>
                          )}
                          {shop.license && (
                            <Badge variant="outline" className="mt-2 rounded-2xl">
                              {shop.license}
                            </Badge>
                          )}
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
            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Đội ngũ ({kyThuats.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kyThuats.map((user) => (
                    <Link key={user.id} href={`/u/${user.id}`}>
                      <Card className="rounded-2xl hover:shadow-md transition-shadow border-border/60">
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
                            <p className="font-semibold truncate text-foreground">
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
      </Tabs>

      {/* Map */}
      {data.location?.lat && data.location?.long && (
        <Card className="mt-8 rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Vị trí
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${data.location.long}!3d${data.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ5JzUwLjMiTiAxMDbCsDQyJzQyLjAiRQ!5e0!3m2!1svi!2svn!4v1234567890!5m2!1svi!2svn`}
                className="w-full h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map"
              />
            </div>
            {data.location.address && (
              <p className="text-sm text-muted-foreground mt-3">
                {data.location.address}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
