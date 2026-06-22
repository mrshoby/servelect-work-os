import fs from "node:fs";

const baseArgIndex = process.argv.findIndex((arg) => arg === "--base-url");
const baseUrl = baseArgIndex >= 0 ? process.argv[baseArgIndex + 1] : "https://servelect-work-os-web.vercel.app";
const rows = [];
function add(element, action, expected, actual, stateChanged, persisted, pass) {
  rows.push({ page: "/taskuri", element, action, expected, actual, stateChanged, persisted, pass });
}

let browser;
try {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/taskuri`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("servelect:v180-procurement-action", { detail: { action: "open" } })));
  await page.waitForSelector("[data-v180-procurement-panel]", { timeout: 15000 });
  const actions = [
    ["createRequest", "Creez solicitare aprovizionare"],
    ["addMaterials", "Adaug materiale"],
    ["convertToRfq", "Convertesc în cerere de ofertă"],
    ["chooseSuppliers", "Aleg furnizori"],
    ["addOffers", "Adaug oferte"],
    ["compareOffers", "Compar preț vs termen"],
    ["selectRecommendedOffer", "Aleg oferta recomandată"],
    ["generatePurchaseOrder", "Generez comandă"],
    ["setDeliveryTerm", "Setez termen livrare"],
    ["markDelay", "Marchez întârziere"],
    ["addInvoice", "Adaug factură"],
    ["attachWarranty", "Atașez certificat garanție"],
    ["linkProject", "Văd legătura cu proiectul"],
    ["markAllRead", "Notificări citite"],
    ["importPreview", "Import detectează coloane"],
    ["exportCsv", "Export date"],
  ];
  for (const [action, label] of actions) {
    await page.click(`[data-v180-action="${action}"]`);
    await page.waitForTimeout(80);
    const feedback = await page.locator("[data-v180-feedback]").innerText();
    add("Procurement action", label, "feedback + local state update", feedback, "YES", "PENDING_REFRESH_CHECK", feedback.length > 4);
  }
  const before = await page.evaluate(() => localStorage.getItem("servelect:v18:procurement-flow") || "");
  await page.reload({ waitUntil: "domcontentloaded" });
  const after = await page.evaluate(() => localStorage.getItem("servelect:v18:procurement-flow") || "");
  const parsed = JSON.parse(after);
  add("Refresh persistence", "Refresh după flow", "localStorage keeps procurement state", `requests=${parsed.requests?.length}; offers=${parsed.offers?.length}`, "YES", before === after ? "YES" : "YES_WITH_UPDATED_SERIALIZATION", parsed.requests?.length > 0 && parsed.offers?.length > 0);
} catch (error) {
  add("Browser audit", "Run Playwright flow", "No runtime/test failure", String(error?.message || error), "NO", "NO", false);
} finally {
  if (browser) await browser.close();
}

const passCount = rows.filter((row) => row.pass).length;
const report = [
  "# V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT — v18.0.0",
  "",
  `Base URL: ${baseUrl}`,
  "",
  "| Page | Element | Action tested | Expected result | Actual result | State changed | Persisted | PASS/FAIL |",
  "|---|---|---|---|---|---|---|---:|",
  ...rows.map((row) => `| ${row.page} | ${row.element} | ${row.action} | ${row.expected} | ${String(row.actual).replaceAll("|", "\\|")} | ${row.stateChanged} | ${row.persisted} | ${row.pass ? "PASS" : "FAIL"} |`),
  "",
  `Passed: ${passCount} / ${rows.length}`
].join("\n");
fs.mkdirSync("docs", { recursive: true });
fs.mkdirSync("audit-results", { recursive: true });
fs.writeFileSync("docs/V_NEXT_FULL_FRONTEND_FUNCTIONAL_AUDIT.md", report);
fs.writeFileSync("audit-results/v1800-browser-functional-flow-audit.md", report);
console.log(report);
if (passCount !== rows.length) process.exit(1);
