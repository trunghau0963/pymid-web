import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getUserNhaYens,
  getUserNhaSanXuats,
  getUserParties,
  getImageUrl,
  formatDateTime,
  yearsSince,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  User,
  ExternalLink,
} from "lucide-react";
import type {
  UserBasic,
  UserNhaYensResponse,
  UserNhaSanXuatsResponse,
  UserPartiesResponse,
} from "@/lib/api";
import { UserTabs } from "./user-tabs";

function InfoRow({
  label,
  value,
  href,
  valueClassName,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
  valueClassName?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      {href ? (
        <a
          href={href}
          className={`text-primary hover:underline inline-flex items-center gap-1 ${valueClassName || ""}`}
        >
          {value}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className={valueClassName || "text-foreground font-medium"}>{value}</span>
      )}
    </div>
  );
}

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchUserData(id: string) {
  const emptyNhaYens = {
    total: 0,
    user: null as UserBasic | null,
    nha_yens: [],
  };
  const emptyNsx = {
    total: 0,
    user: null as UserBasic | null,
    nha_san_xuats: [],
  };
  const emptyParties = {
    total: 0,
    user: null as UserBasic | null,
    parties: [],
  };

  try {
    const [nhaYensRes, nhaSanXuatsRes, partiesRes] = await Promise.all([
      getUserNhaYens(id).catch(
        () => emptyNhaYens as UserNhaYensResponse
      ),
      getUserNhaSanXuats(id).catch(
        () => emptyNsx as UserNhaSanXuatsResponse
      ),
      getUserParties(id).catch(
        () => emptyParties as UserPartiesResponse
      ),
    ]);

    const user =
      nhaYensRes.user || nhaSanXuatsRes.user || partiesRes.user;

    return {
      user,
      nhaYens: nhaYensRes.nha_yens || [],
      nhaSanXuats: nhaSanXuatsRes.nha_san_xuats || [],
      parties: partiesRes.parties || [],
      totals: {
        nhaYen: nhaYensRes.total || 0,
        nhaSanXuat: nhaSanXuatsRes.total || 0,
        party: partiesRes.total || 0,
      },
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchUserData(id);

  if (data?.user) {
    const name = data.user.bio?.fullname || data.user.username;
    return {
      title: `${name} - Thành viên PYMID`,
      description: `${name} - ${data.user.who_am_i || "Thành viên PYMID"}. ${data.user.bio?.description || ""}`.slice(
        0,
        160
      ),
      openGraph: {
        title: `${name} - PYMID`,
        description:
          data.user.bio?.description || `Thành viên PYMID`,
        type: "profile",
        locale: "vi_VN",
      },
    };
  }
  return { title: "Thành viên PYMID" };
}

export default async function UserProfilePage({
  params,
}: Props) {
  const { id } = await params;
  const data = await fetchUserData(id);

  if (!data?.user) {
    notFound();
  }

  const { user, nhaYens, nhaSanXuats, parties, totals } = data;
  const fullname = user.bio?.fullname || user.username;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: fullname }]} />
        </div>
      </div>

      {/* Profile Hero - 2 Column Layout */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left - Profile Image */}
            <div className="rounded-md overflow-hidden bg-card shadow-lg border border-border/40">
              {user.avatar ? (
                <img
                  src={getImageUrl(user.avatar.formats?.medium?.url || user.avatar.url)}
                  alt={fullname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <span className="text-8xl font-bold text-white/90">
                    {fullname.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Right - Info Card */}
            <Card className="rounded-md border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl text-primary">
                    Thông tin đại diện
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <InfoRow label="Họ và tên" value={fullname} valueClassName="text-primary font-semibold" />
                  <Separator />
                  {user.who_am_i && (
                    <>
                      <InfoRow label="Vai trò" value={user.who_am_i} valueClassName="font-semibold" />
                      <Separator />
                    </>
                  )}
                  {user.province && (
                    <>
                      <InfoRow label="Tỉnh/Thành" value={user.province} />
                      <Separator />
                    </>
                  )}
                  <InfoRow label="Tham gia" value={`${formatDateTime(user.created_at)} (${yearsSince(user.created_at)} năm)`} />
                  <Separator />
                  {user.bio?.phoneNumber && (
                    <>
                      <InfoRow label="Điện thoại" value={user.bio.phoneNumber} href={`tel:${user.bio.phoneNumber}`} />
                      <Separator />
                    </>
                  )}
                  {user.email && (
                    <>
                      <InfoRow label="Email" value={user.email} href={`mailto:${user.email}`} />
                      <Separator />
                    </>
                  )}
                  {user.bio?.address && (
                    <InfoRow label="Địa chỉ" value={user.bio.address} />
                  )}
                  {user.show_vip && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Hạng</span>
                        <span className="inline-flex items-center gap-1.5 font-bold text-amber-500 bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-1.5 rounded-full text-xs uppercase tracking-wide shadow-sm border border-amber-200/50">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          VIP
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs - Modern Design with Light Gradient */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <UserTabs 
          user={user}
          fullname={fullname}
          nhaYens={nhaYens}
          nhaSanXuats={nhaSanXuats}
          parties={parties}
          totals={totals}
        />
      </div>
    </div>
  );
}
