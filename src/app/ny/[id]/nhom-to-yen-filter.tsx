"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/api";
import type { NhomToYenItem } from "@/lib/api";
import { Search, Package } from "lucide-react";

interface Props {
  items: NhomToYenItem[];
}

export function NhomToYenFilter({ items }: Props) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");

  const provinces = useMemo(() => {
    const set = new Set(items.map((item) => item.province).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let result = [...items];

    // Province filter
    if (provinceFilter !== "all") {
      result = result.filter((item) => item.province === provinceFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          String(item.id).includes(q) ||
          item.province?.toLowerCase().includes(q) ||
          String(item.weight).includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        break;
      case "weight-desc":
        result.sort((a, b) => b.weight - a.weight);
        break;
      case "weight-asc":
        result.sort((a, b) => a.weight - b.weight);
        break;
    }

    return result;
  }, [items, search, sortBy, provinceFilter]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Chưa có thùng tổ yến nào được bán</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã, tỉnh, khối lượng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={provinceFilter} onValueChange={(v) => v && setProvinceFilter(v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tỉnh thành" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tỉnh thành</SelectItem>
            {provinces.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
            <SelectItem value="weight-desc">Nặng nhất</SelectItem>
            <SelectItem value="weight-asc">Nhẹ nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Hiển thị {filtered.length} / {items.length} thùng
      </div>

      {/* Table */}
      <div className="rounded-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16">Mã</TableHead>
              <TableHead>Khối lượng</TableHead>
              <TableHead className="hidden sm:table-cell">Số tổ</TableHead>
              <TableHead className="hidden md:table-cell">Tỉnh thành</TableHead>
              <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
              <TableHead className="text-right">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">#{item.id}</TableCell>
                <TableCell>{item.weight}g</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {item.to_yen_number}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.province}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(item.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/n/${item.id}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Xem →
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-6 text-muted-foreground text-sm">
          Không tìm thấy kết quả phù hợp
        </p>
      )}
    </div>
  );
}
