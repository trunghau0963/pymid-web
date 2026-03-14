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
  Users,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { RichText } from "@/components/rich-text";
import { ShopSlider } from "@/components/shop-slider";

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
              <Building2 className="h-16 w-16" />
            </div>
          )}

          <div className="border-t border-border/60 px-5 py-5">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-semibold text-primary leading-tight">
                {data.name}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.short_description || "Thông tin nhà phân phối chính hãng trong hệ sinh thái PYMID."}
            </p>
            {data.code && (
              <Badge variant="outline" className="w-fit mt-3 rounded-sm">
                Mã: {data.code}
              </Badge>
            )}
          </div>
        </div>

        {/* Info Card */}
        <Card className="rounded-md border-border/60">
          <CardContent className="space-y-1 pt-5 pb-5">
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
        <Card className="mb-8 rounded-md border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
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
        <TabsList className="w-full flex flex-wrap h-auto min-h-14 gap-2 p-2 bg-gradient-to-r from-emerald-50/80 via-slate-50 to-emerald-50/80 rounded-md shadow-md shadow-emerald-100/50 border border-emerald-100/50">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-4 py-2.5 rounded-sm bg-transparent text-slate-600 font-medium transition-all duration-300 ease-out
                hover:text-primary hover:bg-white/80
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/15"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <Card className="rounded-md border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Giới thiệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.description ? (
                <RichText content={data.description} />
              ) : (
                <p className="text-muted-foreground">Chưa có thông tin</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shops Tab - Slideshow */}
        {totalShops > 0 && (
          <TabsContent value="shops">
            <ShopSlider items={shops} />
          </TabsContent>
        )}

        {/* Team Tab */}
        {kyThuats.length > 0 && (
          <TabsContent value="team">
            <Card className="rounded-md border-border/60">
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
                      <Card className="rounded-md hover:shadow-md transition-shadow border-border/60">
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
        <Card className="mt-8 rounded-md border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Vị trí
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.location.address && (
              <p className="text-sm text-slate-600 mb-3 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                {data.location.address}
              </p>
            )}
            <div className="rounded-lg overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${data.location.long}!3d${data.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ5JzUwLjMiTiAxMDbCsDQyJzQyLjAiRQ!5e0!3m2!1svi!2svn!4v1234567890!5m2!1svi!2svn`}
                className="w-full h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
