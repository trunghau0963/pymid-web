"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Home,
  Factory,
  Store,
} from "lucide-react";
import { formatDateTime, yearsSince } from "@/lib/api";
import type { UserBasic, NhaYenItem, NhaSanXuatItem, PartyItem } from "@/lib/api";
import {
  NhaYenSlider,
  NhaSanXuatSlider,
  PartySlider,
} from "./user-content-sliders";

interface UserTabsProps {
  user: UserBasic;
  fullname: string;
  nhaYens: NhaYenItem[];
  nhaSanXuats: NhaSanXuatItem[];
  parties: PartyItem[];
  totals: {
    nhaYen: number;
    nhaSanXuat: number;
    party: number;
  };
}

export function UserTabs({ user, fullname, nhaYens, nhaSanXuats, parties, totals }: UserTabsProps) {
  const hasNhaYen = nhaYens.length > 0;
  const hasNhaSanXuat = nhaSanXuats.length > 0;
  const hasParties = parties.length > 0;

  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="w-full flex flex-wrap h-auto min-h-14 gap-2 p-2 bg-gradient-to-r from-emerald-50/80 via-slate-50 to-emerald-50/80 rounded-md justify-start shadow-md shadow-emerald-100/50 border border-emerald-100/50">
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
      </div>

      {/* ───── Profile Tab ───── */}
      <TabsContent value="profile" className="pt-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Info Card */}
          <div className="group relative">
            {/* Card glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 rounded-md blur opacity-0 group-hover:opacity-100 transition duration-500" />
            
            <section className="relative h-full rounded-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-border/40 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-primary via-blue-500 to-primary" />
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Thông tin cá nhân</h3>
                    <p className="text-xs text-slate-400">Thông tin đại diện</p>
                  </div>
                </div>
                
                <dl className="space-y-4">
                  <DL label="Họ và tên" value={fullname} />
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

          {/* Contact Card */}
          <div className="group relative">
            {/* Card glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-primary/20 to-amber-500/20 rounded-md blur opacity-0 group-hover:opacity-100 transition duration-500" />
            
            <section className="relative h-full rounded-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-border/40 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-primary to-amber-400" />
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-amber-400 to-primary flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Liên hệ</h3>
                    <p className="text-xs text-slate-400">Thông tin liên lạc</p>
                  </div>
                </div>
                
                <dl className="space-y-4">
                  {user.bio?.phoneNumber && (
                    <DL label="Số điện thoại" value={user.bio.phoneNumber} isPhone />
                  )}
                  {user.email && (
                    <DL label="Email" value={user.email} isLink />
                  )}
                  {user.bio?.address && (
                    <DL label="Địa chỉ" value={user.bio.address} />
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
      className="relative px-5 py-2.5 gap-2 rounded-sm bg-transparent text-slate-600 font-medium transition-all duration-300 ease-out
        hover:text-primary hover:bg-white/80
        data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/15"
    >
      <span className="transition-transform duration-200">
        {icon}
      </span>
      <span className="hidden sm:inline text-sm font-semibold">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] font-bold bg-slate-200/80 text-slate-500 rounded-full px-2 py-0.5 min-w-[22px] text-center transition-all duration-200
          data-[state=active]:bg-primary data-[state=active]:text-white">
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
