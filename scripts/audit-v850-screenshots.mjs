import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "https://servelect-work-os-web.vercel.app";
const outDir = path.join(process.cwd(), "audit-results", "v850-screenshots");

const routes = [
  "/taskuri",
  "/taskuri/overview",
  "/taskuri/my-work",
  "/taskuri/tickets-notificari",
  "/taskuri/board",
  "/taskuri/tabel",
  "/taskuri/calendar-gantt",
  "/taskuri/workload-aprobari",
  "/taskuri/forms",
  "/taskuri/timesheets",
  "/taskuri/reports",
  "/taskuri/automations",
  "/admin/workflows",
  "/admin/custom-fields",
  "/admin/primary-write-pilot",
  "/admin/production-pilot-readiness",
  "/admin/primary-write-session-provider",
  "/admin/auth-session-audit-outbox",
  "/admin/prisma-audit-outbox-transaction-pilot",
  "/admin/database-adapter-dispatch-worker",
  "/admin/enterprise-department-suite",
  "/work-os/primary-write-pilot",
  "/work-os/production-pilot-readiness",
  "/work-os/primary-write-session-provider",
  "/work-os/auth-session-audit-outbox",
  "/work-os/prisma-audit-outbox-transaction-pilot",
  "/work-os/database-adapter-dispatch-worker",
  "/work-os/enterprise-department-suite",
];

function slug(route) {
  return route.replace(/^\/+/, "").replaceAll("/", "_") || "home";
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });

  const report = [];
  report.push("# V8.5.0 Screenshot Audit Report");
  report.push("");
  report.push(`BaseUrl: ${baseUrl}`);
  report.push("");
  report.push("| Route | Result | HTTP | PNG | Bytes | Note |");
  report.push("|---|---:|---:|---|---:|---|");

  let passed = 0;

  for (const route of routes) {
    const url = `${baseUrl.replace(/\/$/, "")}${route}`;
    const pngName = `${slug(route)}.png`;
    const pngPath = path.join(outDir, pngName);
    try {
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      const status = response?.status() ?? 0;
      if (status >= 200 && status < 300) {
        await page.screenshot({ path: pngPath, fullPage: true });
        const stat = await fs.stat(pngPath);
        passed += 1;
        report.push(`| ${route} | PASS | ${status} | ${pngName} | ${stat.size} | OK |`);
        console.log(`${route} -> PASS HTTP ${status} | ${pngName} | ${stat.size} bytes`);
      } else {
        report.push(`| ${route} | FAIL | ${status} | NO_PNG | 0 | Non-2xx |`);
        console.log(`${route} -> FAIL HTTP ${status}`);
      }
    } catch (error) {
      const note = String(error?.message || error).replaceAll("|", "/").replace(/\s+/g, " ").slice(0, 180);
      report.push(`| ${route} | FAIL | ERR | NO_PNG | 0 | ${note} |`);
      console.log(`${route} -> FAIL ${note}`);
    }
  }

  await browser.close();

  report.splice(3, 0, `Captured clean: ${passed} / ${routes.length}`);
  await fs.mkdir(path.join(process.cwd(), "audit-results"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), "audit-results", "V8_5_0_SCREENSHOT_AUDIT_REPORT.md"), report.join("\n"), "utf8");

  console.log(`v8.5.0 screenshot audit captured clean: ${passed} / ${routes.length}`);
  if (passed !== routes.length) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
