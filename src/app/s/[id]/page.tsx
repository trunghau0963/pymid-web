import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getShop,
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
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  ExternalLink,
  Building2,
  Users,
  ShieldCheck,
  FileText,
  Facebook,
} from "lucide-react";
import { RichText } from "@/components/rich-text";
import { ImageGalleryLightbox } from "@/components/image-gallery-lightbox";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getShop(id);
    return {
      title: `${data.name} - Cửa hàng`,
      description:
        data.short_description ||
        `Thông tin cửa hàng ${data.name}`,
      openGraph: {
        title: data.name,
        description: data.short_description || `Cửa hàng ${data.name}`,
        type: "article",
        locale: "vi_VN",
        images: data.image?.[0]
          ? [{ url: getImageUrl(data.image[0].url) }]
          : [],
      },
    };
  } catch {
    return { title: "Cửa hàng" };
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

export default async function ShopPage({ params }: Props) {
  const { id } = await params;

  let data;
  try {
    data = await getShop(id);
  } catch {
    notFound();
  }

  const youtubeEmbed = data.youtube ? getYoutubeEmbedUrl(data.youtube) : null;
  const joinDate = formatDate(data.created_at);
  const years = yearsSince(data.created_at);
  const kyThuats = data.ky_thuats || [];
  const party = data.party;

  // Determine which tabs to show
  const tabs = [
    { id: "info", label: "Thông tin", show: true },
    { id: "party", label: "Nhà phân phối", show: !!party },
    { id: "team", label: `Nhân viên (${kyThuats.length})`, show: kyThuats.length > 0 },
  ].filter((t) => t.show);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: "Trang chủ", href: "/" },
            ...(party ? [{ label: party.name, href: `/p/${party.id}` }] : []),
            { label: data.name }
          ]} 
        />
      </div>

      {/* Status Badge */}
      {!data.active && (
        <div className="mb-4">
          <Badge variant="destructive" className="rounded-sm">
            Cửa hàng tạm đóng
          </Badge>
        </div>
      )}

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
              <Store className="h-16 w-16" />
            </div>
          )}

          <div className="border-t border-border/60 px-5 py-5">
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-semibold text-primary leading-tight">
                {data.name}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.short_description || "Thông tin cửa hàng phân phối chính hãng thuộc hệ sinh thái PYMID."}
            </p>
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
              label="Facebook"
              value={data.facebook ? "Trang Facebook" : null}
              href={data.facebook || undefined}
              icon={Facebook}
            />
            <Separator />
            <InfoRow
              label="Ngày đăng ký"
              value={`${joinDate} (${years} năm)`}
              icon={User}
            />
          </CardContent>
        </Card>
      </div>

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
                Giới thiệu cửa hàng
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

        {/* Party Tab */}
        {party && (
          <TabsContent value="party">
            <Card className="rounded-md border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Nhà phân phối
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/p/${party.id}`}
                  className="block hover:bg-muted/40 p-4 rounded-md transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {party.image?.[0] ? (
                      <img
                        src={getImageUrl(party.image[0].url)}
                        alt={party.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted/60 flex items-center justify-center rounded-md">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground">{party.name}</h3>
                      {party.short_description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {party.short_description}
                        </p>
                      )}
                      {party.location?.address && (
                        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {party.location.address}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {party.license && (
                          <Badge variant="outline" className="rounded-md">
                            {party.license}
                          </Badge>
                        )}
                        {party.code && (
                          <Badge variant="secondary" className="rounded-md">
                            Mã: {party.code}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Party Owner */}
                {party.owner && (
                  <div className="mt-6 pt-4 border-t border-border/60">
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      Chủ nhà phân phối
                    </p>
                    <Link
                      href={`/u/${party.owner.id}`}
                      className="flex items-center gap-3 hover:bg-muted/40 p-2 rounded-md transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        {party.owner.avatar ? (
                          <AvatarImage
                            src={getImageUrl(party.owner.avatar.url)}
                            alt={party.owner.bio?.fullname || party.owner.username}
                          />
                        ) : null}
                        <AvatarFallback>
                          {(party.owner.bio?.fullname || party.owner.username)
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {party.owner.bio?.fullname || party.owner.username}
                        </p>
                        {party.owner.who_am_i && (
                          <p className="text-sm text-muted-foreground">
                            {party.owner.who_am_i}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Team Tab */}
        {kyThuats.length > 0 && (
          <TabsContent value="team">
            <Card className="rounded-md border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Nhân viên cửa hàng ({kyThuats.length})
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

      {/* Gallery */}
      {data.image && data.image.length > 1 && (
        <Card className="mt-8 rounded-md border-border/60">
          <CardHeader>
            <CardTitle>Hình ảnh cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageGalleryLightbox images={data.image} columns={4} />
          </CardContent>
        </Card>
      )}

      {/* Map */}
      {data.location?.lat && data.location?.long && (
        <Card className="mt-8 rounded-md border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Vị trí cửa hàng
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
