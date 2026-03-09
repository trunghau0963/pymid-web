import { firefox } from "playwright";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = resolve(__dirname, "../capture");
const BASE_URL = "http://localhost:3000";

mkdirSync(CAPTURE_DIR, { recursive: true });

const tabPages = [
  {
    path: "/ny/1",
    prefix: "nha-yen",
    label: "Bird Nest House Detail",
    tabs: ["info", "sold", "diary", "environment", "owner", "harvest"],
  },
  {
    path: "/s/1",
    prefix: "shop",
    label: "Shop Detail",
    tabs: ["info", "party"],
  },
  {
    path: "/u/5",
    prefix: "user",
    label: "User Profile",
    tabs: ["profile", "nha-yen", "nha-san-xuat", "nha-phan-phoi"],
  },
];

async function main() {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const { path, prefix, label, tabs } of tabPages) {
    console.log(`\n--- ${label} (${path})`);
    const page = await context.newPage();
    const url = `${BASE_URL}${path}`;

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2000);

      const tabButtons = page.locator('button[role="tab"]');
      const count = await tabButtons.count();
      console.log(`  Found ${count} tabs`);

      for (let i = 0; i < count && i < tabs.length; i++) {
        const btn = tabButtons.nth(i);
        const text = (await btn.textContent())?.trim();
        await btn.click();
        await page.waitForTimeout(1500);

        const filename = `${prefix}-tab-${tabs[i]}-desktop.png`;
        await page.screenshot({
          path: resolve(CAPTURE_DIR, filename),
          fullPage: true,
        });
        console.log(`  OK ${filename} ("${text}")`);
      }
    } catch (err) {
      console.error(`  FAIL: ${err.message}`);
    }

    await page.close();
  }

  await context.close();
  await browser.close();
  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
