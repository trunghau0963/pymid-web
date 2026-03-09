import { firefox } from "playwright";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = resolve(__dirname, "../capture");
const BASE_URL = "http://localhost:3000";

mkdirSync(CAPTURE_DIR, { recursive: true });

const pages = [
  { path: "/", name: "home", label: "Trang chủ" },
  { path: "/ny/1", name: "nha-yen-detail", label: "Chi tiết Nhà yến" },
  { path: "/nsx/1", name: "nha-san-xuat-detail", label: "Chi tiết Nhà sản xuất" },
  { path: "/p/1", name: "nha-phan-phoi-detail", label: "Chi tiết Nhà phân phối" },
  { path: "/s/1", name: "cua-hang-detail", label: "Chi tiết Cửa hàng" },
  { path: "/n/55", name: "nhom-to-yen-detail", label: "Chi tiết Nhóm tổ yến (Truy xuất nguồn gốc)" },
  { path: "/u/1", name: "user-profile", label: "Hồ sơ người dùng" },
];

async function main() {
  const browser = await firefox.launch({ headless: true });

  // Desktop screenshots (1440×900)
  console.log("📸 Taking desktop screenshots (1440×900)...\n");
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const { path, name, label } of pages) {
    const page = await desktopContext.newPage();
    const url = `${BASE_URL}${path}`;
    console.log(`  → ${label} (${url})`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      // Wait for images/fonts to settle
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: resolve(CAPTURE_DIR, `${name}-desktop.png`),
        fullPage: true,
      });
      console.log(`    ✅ ${name}-desktop.png`);
    } catch (err) {
      console.error(`    ❌ Failed: ${err.message}`);
    }
    await page.close();
  }
  await desktopContext.close();

  // Mobile screenshots (390×844 — iPhone 14 Pro)
  console.log("\n📱 Taking mobile screenshots (390×844)...\n");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });

  for (const { path, name, label } of pages) {
    const page = await mobileContext.newPage();
    const url = `${BASE_URL}${path}`;
    console.log(`  → ${label} (${url})`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: resolve(CAPTURE_DIR, `${name}-mobile.png`),
        fullPage: true,
      });
      console.log(`    ✅ ${name}-mobile.png`);
    } catch (err) {
      console.error(`    ❌ Failed: ${err.message}`);
    }
    await page.close();
  }
  await mobileContext.close();

  await browser.close();
  console.log("\n🎉 All screenshots saved to ./capture/");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
