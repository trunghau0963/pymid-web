const API_BASE = "https://api.pymid.com";

async function fetchAPI<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 60 },
    ...init,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Nhóm tổ yến (traceability) - /n/[id]
export async function getNhomToYen(id: string) {
  return fetchAPI<NhomToYenResponse>(`/nhom-to-yens/web/${id}`);
}

// Nhà yến detail - /ny/[id]
export async function getNhaYen(id: string) {
  return fetchAPI<NhaYenResponse>(`/nha-yens/web/${id}?type=ALL`);
}

// Sold nhom-to-yen for a nha-yen
export async function getSoldNhomToYen(nhaYenId: string) {
  return fetchAPI<NhomToYenItem[]>(
    `/nha-yens/sold-nhom-to-yen/web/${nhaYenId}`
  );
}

// User data response types
export interface UserNhaYensResponse {
  total: number;
  user: UserBasic;
  nha_yens: NhaYenItem[];
}

export interface UserNhaSanXuatsResponse {
  total: number;
  user: UserBasic;
  nha_san_xuats: NhaSanXuatItem[];
}

export interface UserPartiesResponse {
  total: number;
  user: UserBasic;
  parties: PartyItem[];
}

// User nha-yen list
export async function getUserNhaYens(
  userId: string,
  limit = 50,
  start = 0
) {
  return fetchAPI<UserNhaYensResponse>(
    `/nha-yens/user/web/${userId}?_limit=${limit}&_start=${start}`
  );
}

// User nha-san-xuat list
export async function getUserNhaSanXuats(
  userId: string,
  limit = 50,
  start = 0
) {
  return fetchAPI<UserNhaSanXuatsResponse>(
    `/nha-san-xuats/user/web/${userId}?_limit=${limit}&_start=${start}`
  );
}

// User parties (nha phan phoi)
export async function getUserParties(
  userId: string,
  limit = 50,
  start = 0
) {
  return fetchAPI<UserPartiesResponse>(
    `/parties/user/web/${userId}?_limit=${limit}&_start=${start}`
  );
}

// Nhà sản xuất (manufacturer) - /nsx/[id]
export async function getNhaSanXuat(id: string) {
  return fetchAPI<NhaSanXuatResponse>(`/nha-san-xuats/web/${id}`);
}

// Nhà phân phối (distributor) - /p/[id]
export async function getParty(id: string) {
  return fetchAPI<PartyResponse>(`/parties/web/${id}`);
}

// Danh sách cửa hàng của nhà phân phối
export async function getPartyShops(partyId: string, limit = 200, start = 0) {
  return fetchAPI<ShopsListResponse>(
    `/shops/parties/web/${partyId}?_limit=${limit}&_start=${start}`
  );
}

// Cửa hàng (shop) - /s/[id]
export async function getShop(id: string) {
  return fetchAPI<ShopResponse>(`/shops/web/${id}`);
}

// ---- Types ----

export interface NhomToYenResponse {
  id: number;
  youtube: string | null;
  type: string | null;
  weight: number;
  sold: boolean;
  description: string;
  weight_per_to_yen: number;
  province: string;
  to_yen_number: string;
  price: number | null;
  show_market: boolean;
  created_at: string;
  updated_at: string;
  nha_yen: NhaYenBasic;
  owner: UserBasic;
  contract: ContractInfo | null;
  qrcode: QRCodeInfo | null;
  ke_hoach_san_xuat: KeHoachSanXuat | null;
  avatar: AvatarItem[];
  to_yens: ToYenItem[];
  children: NhomToYenChild[];
}

export interface NhaYenBasic {
  id: number;
  name: string;
  description: string;
  short_description: string;
  youtube: string | null;
  floor: number;
  square: number;
  so_o_da: number;
  material: string;
  license: string;
  webpage: string | null;
  facebook: string | null;
  is_demo: boolean;
  phan_cap: PhanCap | null;
  owner: UserBasic;
  location: LocationInfo | null;
  published_at: number;
  created_at: string;
  updated_at: string;
  flow_description: string;
  scale_description: string;
  image: ImageItem[];
  avatar: ImageItem[];
  domain: DomainInfo | null;
}

export interface NhaYenResponse {
  id: number;
  name: string;
  description: string;
  short_description: string;
  youtube: string | null;
  floor: number;
  square: number;
  so_o_da: number;
  material: string;
  license: string;
  webpage: string | null;
  facebook: string | null;
  phan_cap: PhanCap | null;
  owner: UserBasic;
  location: LocationInfo | null;
  published_at: number;
  created_at: string;
  updated_at: string;
  flow_description: string;
  scale_description: string;
  image: ImageItem[];
  avatar: ImageItem[];
  nhom_to_yens: NhomToYenItem[];
  nhat_ky_khep_kins: NhatKyKhepKinItem[];
}

export interface UserBasic {
  id: number;
  username: string;
  email: string;
  who_am_i: string;
  province: string;
  file_id: string | null;
  show_vip: boolean;
  uid: string | null;
  bio: BioInfo | null;
  avatar: ImageItem | null;
  banner: ImageItem | null;
  created_at: string;
  updated_at: string;
}

export interface BioInfo {
  id: number;
  email: string;
  phoneNumber: string;
  address: string;
  fullname: string;
  description: string;
  full_description: string | null;
  location: LocationInfo | null;
}

export interface LocationInfo {
  id: number;
  lat: number;
  long: number;
  youtube: string;
  address: string | null;
}

export interface PhanCap {
  id: number;
  title: string;
  description: string;
  color: string;
}

export interface DomainInfo {
  id: number;
  name: string;
  domain: string;
  title: string;
}

export interface ImageItem {
  id: number;
  name: string;
  alternativeText: string;
  width: number;
  height: number;
  url: string;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
}

export interface ImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface ContractInfo {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface QRCodeInfo {
  id: number;
  file_id: string;
  created_at: string;
  updated_at: string;
}

export interface KeHoachSanXuat {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AvatarItem {
  id: number;
  file_id: string;
}

export interface ToYenItem {
  id: number;
  weight: number;
  description: string;
}

export interface NhomToYenChild {
  id: number;
  weight: number;
}

export interface NhomToYenItem {
  id: number;
  weight: number;
  sold: boolean;
  province: string;
  to_yen_number: string;
  description: string;
  created_at: string;
  updated_at: string;
  avatar: AvatarItem[];
}

export interface NhatKyKhepKinItem {
  id: number;
  title: string;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
  images: ImageItem[];
}

export interface NhaYenItem {
  id: number;
  name: string;
  description: string;
  short_description: string;
  floor: number;
  square: number;
  so_o_da: number;
  material: string;
  license: string;
  youtube: string | null;
  webpage: string | null;
  facebook: string | null;
  is_demo: boolean;
  created_at: string;
  published_at: number;
  phan_cap: PhanCap | null;
  location: LocationInfo | null;
  image: ImageItem[];
  avatar: ImageItem[];
}

export interface NhaSanXuatItem {
  id: number;
  name: string;
  code: string;
  description: string;
  short_description: string;
  youtube: string | null;
  license: string | null;
  webpage: string | null;
  facebook: string | null;
  phoneNumber: string | null;
  email: string | null;
  square: number | null;
  capacity: number | null;
  is_demo: boolean;
  created_at: string;
  nha_san_xuat_phan_cap: PhanCap | null;
  location: LocationInfo | null;
  image: ImageItem[];
  avatar: ImageItem[];
}

export interface PartyItem {
  id: number;
  name: string;
  code: string;
  description: string;
  short_description: string;
  youtube: string | null;
  phoneNumber: string | null;
  email: string | null;
  license: string | null;
  webpage: string | null;
  facebook: string | null;
  created_at: string;
  location: LocationInfo | null;
  image: ImageItem[];
}

// Nhà sản xuất Response (full)
export interface NhaSanXuatResponse {
  id: number;
  name: string;
  description: string;
  short_description: string;
  youtube: string | null;
  phoneNumber: string | null;
  email: string | null;
  webpage: string | null;
  facebook: string | null;
  license: string | null;
  flow_description: string | null;
  scale_description: string | null;
  packing_description: string | null;
  license_description: string | null;
  cam_description: string | null;
  created_at: string;
  updated_at: string;
  owner: UserBasic;
  location: LocationInfo | null;
  image: ImageItem[];
  avatar: ImageItem[];
  banner: ImageItem | null;
  ky_thuats: UserBasic[];
  products: ProductItem[];
  nha_yens: NhaYenBasic[];
}

export interface ProductItem {
  id: number;
  name: string;
  description: string | null;
  short_description: string | null;
  weight: number | null;
  timelife: number | null;
  youtube: string | null;
  active: boolean;
  image: ImageItem[];
  avatar: ImageItem[];
  banner: ImageItem | null;
}

// Nhà phân phối Response (full)
export interface PartyResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  short_description: string;
  youtube: string | null;
  phoneNumber: string | null;
  email: string | null;
  license: string | null;
  webpage: string | null;
  facebook: string | null;
  created_at: string;
  updated_at: string;
  owner: UserBasic;
  location: LocationInfo | null;
  image: ImageItem[];
  shops: ShopBasic[];
  ky_thuats: UserBasic[];
}

export interface ShopBasic {
  id: number;
  name: string;
  description: string;
  short_description: string;
  license: string | null;
  webpage: string | null;
  facebook: string | null;
  youtube: string | null;
  phoneNumber: string | null;
  email: string | null;
  active: boolean;
  location: LocationInfo | null;
  avatar: ImageItem[];
  image: ImageItem[];
}

export interface ShopsListResponse {
  total: number;
  shops: ShopListItem[];
}

export interface ShopListItem {
  id: number;
  name: string;
  description: string;
  short_description: string;
  license: string | null;
  active: boolean;
  location: LocationInfo | null;
  avatar: ImageItem[];
  image: ImageItem[];
  party: {
    id: number;
    name: string;
  };
}

// Cửa hàng Response (full)
export interface ShopResponse {
  id: number;
  name: string;
  description: string;
  short_description: string;
  license: string | null;
  webpage: string | null;
  facebook: string | null;
  youtube: string | null;
  phoneNumber: string | null;
  email: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  location: LocationInfo | null;
  avatar: ImageItem[];
  image: ImageItem[];
  party: PartyResponse;
  ky_thuats: UserBasic[];
}

export function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^?&"'>]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function yearsSince(dateStr: string): number {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor(
    (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
}
