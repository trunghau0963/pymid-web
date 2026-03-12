"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Package,
  Home,
  Users,
  ShieldCheck,
  FileText,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RichText } from "@/components/rich-text";
import { RichTextSlider } from "@/components/rich-text-slider";
import { getImageUrl } from "@/lib/api";
import type { NhaSanXuatResponse, UserBasic, ProductItem, NhaYenBasic } from "@/lib/api";

interface NsxTabsProps {
  data: NhaSanXuatResponse;
  activeProducts: ProductItem[];
  nhaYens: NhaYenBasic[];
  kyThuats: UserBasic[];
}

export function NsxTabs({ data, activeProducts, nhaYens, kyThuats }: NsxTabsProps) {
  const PAGE_SIZE = 9;
  const [productPage, setProductPage] = useState(1);

  const totalProducts = activeProducts?.length || 0;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
  const pagedProducts = activeProducts?.slice(
    (productPage - 1) * PAGE_SIZE,
    productPage * PAGE_SIZE
  ) ?? [];

  // Determine which tabs to show
  const tabs = [
    { id: "info", label: "Thông tin", show: true },
    { id: "products", label: `Sản phẩm (${activeProducts?.length || 0})`, show: (activeProducts?.length || 0) > 0 },
    { id: "nha-yen", label: `Nhà yến (${nhaYens?.length || 0})`, show: (nhaYens?.length || 0) > 0 },
    { id: "team", label: `Đội ngũ (${kyThuats?.length || 0})`, show: (kyThuats?.length || 0) > 0 },
    { id: "flow", label: "Quy trình", show: !!data.flow_description },
    { id: "license", label: "Giấy phép", show: !!data.license_description },
    { id: "camera", label: "Camera", show: !!data.cam_description },
  ].filter((t) => t.show);

  return (
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
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
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

      {/* Products Tab */}
      {totalProducts > 0 && (
        <TabsContent value="products">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sản phẩm ({totalProducts})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagedProducts.map((product) => (
                  <Card key={product.id} className="rounded-sm overflow-hidden">
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
                        <Badge variant="secondary" className="mt-2 rounded-sm">
                          HSD: {product.timelife} ngày
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-sm gap-1"
                    disabled={productPage === 1}
                    onClick={() => setProductPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setProductPage(page)}
                        className={`w-8 h-8 rounded-sm text-sm font-medium transition-colors ${
                          page === productPage
                            ? "bg-primary text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-sm gap-1"
                    disabled={productPage === totalPages}
                    onClick={() => setProductPage((p) => p + 1)}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {/* Nhà yến Tab */}
      {(nhaYens?.length || 0) > 0 && (
        <TabsContent value="nha-yen">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Nhà yến liên kết ({nhaYens?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {nhaYens?.map((nhaYen) => (
                  <Link
                    key={nhaYen.id}
                    href={`/ny/${nhaYen.id}`}
                    className="block"
                  >
                    <Card className="rounded-sm overflow-hidden hover:shadow-md transition-shadow">
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
                            <Badge variant="outline" className="rounded-sm">
                              {nhaYen.so_o_da} tổ
                            </Badge>
                          )}
                          {nhaYen.floor && (
                            <Badge variant="outline" className="rounded-sm">
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
      {(kyThuats?.length || 0) > 0 && (
        <TabsContent value="team">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Đội ngũ kỹ thuật ({kyThuats?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kyThuats?.map((user) => (
                  <Link key={user.id} href={`/u/${user.id}`}>
                    <Card className="rounded-sm hover:shadow-md transition-shadow">
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
          <RichTextSlider content={data.flow_description} />
        </TabsContent>
      )}

      {/* License Tab */}
      {data.license_description && (
        <TabsContent value="license">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Giấy phép & Chứng nhận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RichText content={data.license_description} />
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {/* Camera Tab */}
      {data.cam_description && (
        <TabsContent value="camera">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera giám sát
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RichText content={data.cam_description} />
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}
