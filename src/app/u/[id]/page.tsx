import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getUserNhaYens,
  getUserNhaSanXuats,
  getUserParties,
  getImageUrl,
  formatDateTime,
  yearsSince,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProfileHeader } from "@/components/profile-header";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Home,
  Factory,
  Store,
  ExternalLink,
  Award,
  Calendar,
  Shield,
  ArrowRight,
  Ruler,
  Layers,
  Globe,
} from "lucide-react";
import type {
  NhaYenItem,
  NhaSanXuatItem,
  PartyItem,
  UserBasic,
  UserNhaYensResponse,
  UserNhaSanXuatsResponse,
  UserPartiesResponse,
  ImageItem,
} from "@/lib/api";

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
      <div className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: fullname }]} />
        </div>
      </div>

      {/* Profile Header */}
      <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-background">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <ProfileHeader
            avatar={user.avatar ? getImageUrl(user.avatar.formats?.medium?.url || user.avatar.url) : null}
            name={fullname}
            role={user.who_am_i}
            location={user.province}
            description={user.bio?.description}
            isVip={user.show_vip}
            stats={[
              { n: totals.nhaYen, label: "Nhà yến" },
              { n: totals.nhaSanXuat, label: "Nhà SX" },
              { n: totals.party, label: "Nhà PP" },
            ]}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full h-auto p-0 bg-transparent rounded-none border-b border-slate-200 justify-start gap-0 overflow-x-auto">
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
          <TabsContent value="profile" className="py-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact */}
              <section>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Thông tin liên hệ
                </h3>
                <dl className="divide-y divide-slate-100">
                  <DL label="Họ và tên" value={fullname} />
                  {user.bio?.address && (
                    <DL label="Địa chỉ" value={user.bio.address} />
                  )}
                  {user.bio?.phoneNumber && (
                    <DL label="Số điện thoại" value={user.bio.phoneNumber} />
                  )}
                  {user.email && (
                    <DL label="Email" value={user.email} />
                  )}
                </dl>
              </section>

              {/* Membership */}
              <section>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Thành viên PYMID
                </h3>
                <dl className="divide-y divide-slate-100">
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
              </section>
            </div>
          </TabsContent>

          {/* ───── Nhà yến Tab ───── */}
          {hasNhaYen && (
            <TabsContent value="nha-yen" className="py-8 space-y-5">
              {nhaYens.map((item) => (
                <NhaYenCard key={item.id} item={item} />
              ))}
            </TabsContent>
          )}

          {/* ───── Nhà sản xuất Tab ───── */}
          {hasNhaSanXuat && (
            <TabsContent value="nha-san-xuat" className="py-8 space-y-5">
              {nhaSanXuats.map((item) => (
                <NhaSanXuatCard key={item.id} item={item} />
              ))}
            </TabsContent>
          )}

          {/* ───── Nhà phân phối Tab ───── */}
          {hasParties && (
            <TabsContent value="nha-phan-phoi" className="py-8 space-y-5">
              {parties.map((item) => (
                <PartyCard key={item.id} item={item} />
              ))}
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
      className="px-5 py-3.5 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent text-slate-600 hover:text-foreground transition-colors"
    >
      {icon}
      <span className="hidden sm:inline text-sm">{label}</span>
      {count !== undefined && (
        <span className="text-[11px] font-medium bg-slate-100 text-slate-600 rounded-full px-1.5 py-0.5 min-w-[20px] text-center data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
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
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex py-3 text-sm">
      <dt className="w-36 shrink-0 text-slate-500">{label}</dt>
      <dd
        className={
          highlight
            ? "font-semibold text-amber-600"
            : "text-slate-900"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function Gallery({ images, alt }: { images: ImageItem[]; alt: string }) {
  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-slate-100 rounded-sm flex items-center justify-center">
        <span className="text-slate-300 text-sm">Không có ảnh</span>
      </div>
    );
  }

  const main = images[0];
  const thumbs = images.slice(1, 5);

  return (
    <div className="space-y-2">
      <div className="aspect-[4/3] rounded-sm overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(
            main.formats?.medium?.url || main.url
          )}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      {thumbs.length > 0 && (
        <div className="flex gap-1.5">
          {thumbs.map((img, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-sm overflow-hidden bg-slate-100"
            >
              <img
                src={getImageUrl(
                  img.formats?.thumbnail?.url || img.url
                )}
                alt={`${alt} ${i + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex text-sm border-b border-slate-50 last:border-0">
      <div className="w-[38%] shrink-0 py-2.5 pr-4 text-slate-500">
        {label}
      </div>
      <div className="py-2.5 text-slate-800">{children}</div>
    </div>
  );
}

function DetailLink({
  href,
  label,
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
    >
      {label || "Chi tiết"}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

function ExtLink({ href, text }: { href: string; text?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1 transition-colors"
    >
      {text || href}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

/* ──────────────────────────────
   Item Cards
   ────────────────────────────── */

function NhaYenCard({ item }: { item: NhaYenItem }) {
  const images = [...(item.image || []), ...(item.avatar || [])];

  return (
    <div className="bg-background border border-slate-200 rounded-sm overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[300px] shrink-0 p-5">
          <Gallery images={images} alt={item.name} />
        </div>

        <div className="flex-1 p-5 md:pl-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Home className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-slate-900">
                  {item.name}
                </h3>
              </div>
              {item.phan_cap && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: item.phan_cap.color,
                    color: item.phan_cap.color,
                  }}
                >
                  {item.phan_cap.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {item.is_demo && (
                <Badge variant="secondary" className="text-xs">Demo</Badge>
              )}
              <DetailLink href={`/ny/${item.id}`} />
            </div>
          </div>

          <Separator className="mb-3" />

          {/* Data rows */}
          <div>
            <Row label="Tên nhà yến">
              <Link
                href={`/ny/${item.id}`}
                className="text-primary font-medium hover:underline"
              >
                {item.name}
              </Link>
            </Row>
            {item.location?.address && (
              <Row label="Địa chỉ">
                <span className="text-primary">
                  {item.location.address}
                </span>
                {item.location.lat && item.location.long && (
                  <span className="text-gray-400 text-xs ml-1">
                    {item.location.lat.toFixed(7)},
                    {item.location.long.toFixed(7)}
                  </span>
                )}
              </Row>
            )}
            {item.phan_cap && (
              <Row label="Phân cấp nhà yến">
                <span className="font-semibold" style={{ color: item.phan_cap.color }}>
                  {item.phan_cap.title}
                </span>
              </Row>
            )}
            {item.short_description && (
              <Row label="Mô tả">
                <span className="line-clamp-3 leading-relaxed text-slate-700">
                  {item.short_description}
                </span>
              </Row>
            )}
            <Row label="Số tầng">{item.floor}</Row>
            <Row label="Diện tích sàn (m²)">{item.square}</Row>
            <Row label="Ngày tham gia PYMID">
              {formatDateTime(item.created_at)} (
              {yearsSince(item.created_at)} năm)
            </Row>
            {item.license && (
              <Row label="Giấy phép PYMID">{item.license}</Row>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NhaSanXuatCard({ item }: { item: NhaSanXuatItem }) {
  const images = [...(item.image || []), ...(item.avatar || [])];

  return (
    <div className="bg-background border border-slate-200 rounded-sm overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[300px] shrink-0 p-5">
          <Gallery images={images} alt={item.name} />
        </div>

        <div className="flex-1 p-5 md:pl-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Factory className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-slate-900">
                  {item.name}
                </h3>
              </div>
              {item.nha_san_xuat_phan_cap && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor:
                      item.nha_san_xuat_phan_cap.color,
                    color: item.nha_san_xuat_phan_cap.color,
                  }}
                >
                  {item.nha_san_xuat_phan_cap.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {item.is_demo && (
                <Badge variant="secondary" className="text-xs">Demo</Badge>
              )}
              <DetailLink href={`/nsx/${item.id}`} />
            </div>
          </div>

          <Separator className="mb-3" />

          <div>
            <Row label="Đơn vị sản xuất">
              <Link
                href={`/nsx/${item.id}`}
                className="text-primary font-medium hover:underline"
              >
                {item.code || item.name}
              </Link>
            </Row>
            {item.nha_san_xuat_phan_cap && (
              <Row label="Phân cấp sản xuất">
                <span className="font-semibold" style={{ color: item.nha_san_xuat_phan_cap.color }}>
                  {item.nha_san_xuat_phan_cap.title}
                </span>
              </Row>
            )}
            {item.phoneNumber && (
              <Row label="Hotline">{item.phoneNumber}</Row>
            )}
            <Row label="Diện tích sản (m²)">
              {item.square || "—"}
            </Row>
            <Row label="Công suất SX hằng năm">
              {item.capacity || "—"}
            </Row>
            {item.email && (
              <Row label="Email">
                <a
                  href={`mailto:${item.email}`}
                  className="text-primary hover:underline"
                >
                  {item.email}
                </a>
              </Row>
            )}
            <Row label="Ngày tham gia PYMID">
              {formatDateTime(item.created_at)} (
              {yearsSince(item.created_at)} năm)
            </Row>
            {item.license && (
              <Row label="Giấy phép PYMID">{item.license}</Row>
            )}
            {item.webpage && (
              <Row label="Website">
                <ExtLink href={item.webpage} />
              </Row>
            )}
            {item.facebook && (
              <Row label="Facebook">
                <ExtLink href={item.facebook} />
              </Row>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PartyCard({ item }: { item: PartyItem }) {
  const images = item.image || [];

  return (
    <div className="bg-background border border-slate-200 rounded-sm overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[300px] shrink-0 p-5">
          <Gallery images={images} alt={item.name} />
        </div>

        <div className="flex-1 p-5 md:pl-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">
                {item.name}
              </h3>
            </div>
            <DetailLink href={`/p/${item.id}`} />
          </div>

          <Separator className="mb-3" />

          <div>
            <Row label="Tên nhà phân phối">
              <Link
                href={`/p/${item.id}`}
                className="text-primary font-medium hover:underline"
              >
                {item.name}
              </Link>
            </Row>
            {item.short_description && (
              <Row label="Mô tả">
                <span className="line-clamp-3 leading-relaxed text-slate-700">
                  {item.short_description}
                </span>
              </Row>
            )}
            {item.location?.address && (
              <Row label="Địa chỉ">
                <span className="text-primary">
                  {item.location.address}
                </span>
                {item.location.lat && item.location.long && (
                  <span className="text-slate-400 text-xs ml-1">
                    - {item.location.lat.toFixed(7)},
                    {item.location.long.toFixed(7)}
                  </span>
                )}
              </Row>
            )}
            {item.phoneNumber && (
              <Row label="Hotline">{item.phoneNumber}</Row>
            )}
            {item.email && (
              <Row label="Email">
                <a
                  href={`mailto:${item.email}`}
                  className="text-red-600 hover:underline"
                >
                  {item.email}
                </a>
              </Row>
            )}
            {item.license && (
              <Row label="Giấy phép PYMID">{item.license}</Row>
            )}
            {item.webpage && (
              <Row label="Website">
                <ExtLink href={item.webpage} />
              </Row>
            )}
            {item.facebook && (
              <Row label="Facebook">
                <ExtLink href={item.facebook} />
              </Row>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
