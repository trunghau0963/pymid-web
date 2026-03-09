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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProfileHeader } from "@/components/profile-header";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Home,
  Factory,
  Store,
} from "lucide-react";
import type {
  UserBasic,
  UserNhaYensResponse,
  UserNhaSanXuatsResponse,
  UserPartiesResponse,
} from "@/lib/api";
import {
  NhaYenSlider,
  NhaSanXuatSlider,
  PartySlider,
} from "./user-content-sliders";

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
  const hasNhaYen = nhaYens.length > 0;
  const hasNhaSanXuat = nhaSanXuats.length > 0;
  const hasParties = parties.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: fullname }]} />
        </div>
      </div>

      {/* Profile Header */}
      <div className="border-b border-border/40 bg-card">
        <div className="max-w-6xl mx-auto">
          <ProfileHeader
            image={user.avatar ? getImageUrl(user.avatar.formats?.medium?.url || user.avatar.url) : undefined}
            name={fullname}
            title={user.who_am_i}
            location={user.province}
            description={user.bio?.description}
            contactInfo={[
              ...(user.bio?.phoneNumber ? [{ label: "Điện thoại", value: user.bio.phoneNumber, icon: <Phone className="h-4 w-4" />, href: `tel:${user.bio.phoneNumber}` }] : []),
              ...(user.bio?.email ? [{ label: "Email", value: user.bio.email, icon: <Mail className="h-4 w-4" />, href: `mailto:${user.bio.email}` }] : []),
              ...(user.province ? [{ label: "Địa chỉ", value: user.province, icon: <MapPin className="h-4 w-4" /> }] : []),
            ]}
          />
        </div>
      </div>

      {/* Tabs - Modern Design with Light Gradient */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="inline-flex h-14 p-1.5 bg-muted/40 rounded-2xl justify-start gap-1.5 overflow-x-auto shadow-lg shadow-primary/[0.04] border border-border/40">
            <Tab value="profile" icon={<User className="h-4 w-4" />} label="Đại diện" />
            {hasNhaYen && (
              <Tab value="nha-yen" icon={<Home className="h-4 w-4" />} label="Nhà yến" count={totals.nhaYen} />
            )}
            {hasNhaSanXuat && (
              <Tab value="nha-san-xuat" icon={<Factory className="h-4 w-4" />} label="Nhà sản xuất" count={totals.nhaSanXuat} />
            )}
            {hasParties && (
              <Tab value="nha-phan-phoi" icon={<Store className="h-4 w-4" />} label="Nhà phân phối" count={totals.party} />
            )}
          </TabsList>

          {/* ───── Profile Tab ───── */}
          <TabsContent value="profile" className="pt-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Card */}
              <div className="group relative">
                {/* Card glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                
                <section className="relative h-full rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-border/40 overflow-hidden">
                  {/* Top accent bar */}
                  <div className="h-1.5 bg-gradient-to-r from-primary via-blue-500 to-primary" />
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Thông tin liên hệ</h3>
                        <p className="text-xs text-muted-foreground">Các thông tin cá nhân</p>
                      </div>
                    </div>
                    
                    <dl className="space-y-4">
                      <DL label="Họ và tên" value={fullname} />
                      {user.bio?.address && (
                        <DL label="Địa chỉ" value={user.bio.address} />
                      )}
                      {user.bio?.phoneNumber && (
                        <DL label="Số điện thoại" value={user.bio.phoneNumber} isPhone />
                      )}
                      {user.email && (
                        <DL label="Email" value={user.email} isLink />
                      )}
                    </dl>
                  </div>
                </section>
              </div>

              {/* Membership Card - Glassmorphism */}
              <div className="group relative">
                {/* Card glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-primary/20 to-amber-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                
                <section className="relative h-full rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-border/40 overflow-hidden">
                  {/* Top accent bar */}
                  <div className="h-1.5 bg-gradient-to-r from-amber-400 via-primary to-amber-400" />
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-primary flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Thành viên PYMID</h3>
                        <p className="text-xs text-muted-foreground">Thông tin thành viên</p>
                      </div>
                    </div>
                    
                    <dl className="space-y-4">
                      {user.who_am_i && (
                        <DL label="Vai trò" value={user.who_am_i} />
                      )}
                      {user.province && (
                        <DL label="Tỉnh/Thành" value={user.province} />
                      )}
                      <DL
                        label="Tham gia"
                        value={`${formatDateTime(user.created_at)} (${yearsSince(user.created_at)} năm)`}
                      />
                      {user.show_vip && (
                        <DL label="Hạng" value="VIP" highlight />
                      )}
                    </dl>
                  </div>
                </section>
              </div>
            </div>
          </TabsContent>

          {/* ───── Nhà yến Tab ───── */}
          {hasNhaYen && (
            <TabsContent value="nha-yen" className="py-8">
              <NhaYenSlider items={nhaYens} />
            </TabsContent>
          )}

          {/* ───── Nhà sản xuất Tab ───── */}
          {hasNhaSanXuat && (
            <TabsContent value="nha-san-xuat" className="py-8">
              <NhaSanXuatSlider items={nhaSanXuats} />
            </TabsContent>
          )}

          {/* ───── Nhà phân phối Tab ───── */}
          {hasParties && (
            <TabsContent value="nha-phan-phoi" className="py-8">
              <PartySlider items={parties} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

/* ──────────────────────────────
   Shared UI primitives
   ────────────────────────────── */

function Tab({
  value,
  icon,
  label,
  count,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <TabsTrigger
      value={value}
      className="relative px-6 py-3 gap-2.5 rounded-xl bg-transparent text-muted-foreground font-medium transition-all duration-300 ease-out
        hover:text-primary hover:bg-white/80
        data-active:bg-white data-active:text-primary data-active:shadow-lg data-active:shadow-primary/20"
    >
      <span className="transition-transform duration-200">
        {icon}
      </span>
      <span className="hidden sm:inline text-sm font-semibold">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] font-bold bg-border text-muted-foreground rounded-full px-2 py-0.5 min-w-[22px] text-center transition-all duration-200
          data-active:bg-primary data-active:text-white">
          {count}
        </span>
      )}
    </TabsTrigger>
  );
}

function DL({
  label,
  value,
  highlight,
  isLink,
  isPhone,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isLink?: boolean;
  isPhone?: boolean;
}) {
  return (
    <div className="group flex items-start gap-4 py-4 border-b border-border/40 last:border-0 transition-all duration-200">
      <dt className="w-28 shrink-0 text-muted-foreground text-sm font-medium pt-0.5">{label}</dt>
      <dd
        className={
          highlight
            ? "inline-flex items-center gap-1.5 font-bold text-amber-500 bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-1.5 rounded-full text-xs uppercase tracking-wide shadow-sm border border-amber-200/50"
            : isLink
            ? "text-primary font-semibold hover:underline underline-offset-2 cursor-pointer"
            : isPhone
            ? "text-foreground/80 font-semibold font-mono tracking-wide"
            : "text-foreground/80 font-medium"
        }
      >
        {highlight && (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {value}
      </dd>
    </div>
  );
}
