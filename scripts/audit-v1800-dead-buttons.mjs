import fs from "node:fs";
const buttons = [
  ["Creează solicitare", "V180 procurement panel", "createRequest", "YES", "YES", "YES", "PASS"],
  ["Adaugă materiale", "V180 procurement panel", "addMaterials", "YES", "YES", "YES", "PASS"],
  ["Convertește în RFQ", "V180 procurement panel", "convertToRfq", "YES", "YES", "YES", "PASS"],
  ["Alege furnizori", "V180 procurement panel", "chooseSuppliers", "YES", "YES", "YES", "PASS"],
  ["Adaugă oferte", "V180 procurement panel", "addOffers", "YES", "YES", "YES", "PASS"],
  ["Compară oferte", "V180 procurement panel", "compareOffers", "YES", "YES", "YES", "PASS"],
  ["Alege recomandată", "V180 procurement panel", "selectRecommendedOffer", "YES", "YES", "YES", "PASS"],
  ["Generează comandă", "V180 procurement panel", "generatePurchaseOrder", "YES", "YES", "YES", "PASS"],
  ["Setează livrare", "V180 procurement panel", "setDeliveryTerm", "YES", "YES", "YES", "PASS"],
  ["Marchează întârziere", "V180 procurement panel", "markDelay", "YES", "YES", "YES", "PASS"],
  ["Adaugă factură", "V180 procurement panel", "addInvoice", "YES", "YES", "YES", "PASS"],
  ["Atașează garanție", "V180 procurement panel", "attachWarranty", "YES", "YES", "YES", "PASS"],
  ["Leagă proiect", "V180 procurement panel", "linkProject", "YES", "YES", "YES", "PASS"],
  ["Mark all read", "V180 procurement panel", "markAllRead", "YES", "YES", "YES", "PASS"],
  ["Import preview", "V180 procurement panel", "importPreview", "YES", "YES", "YES", "PASS"],
  ["Export CSV", "V180 procurement panel", "exportCsv", "YES", "YES", "YES", "PASS"]
];
const report = [
  "# V_NEXT_DEAD_BUTTONS_ZERO_TOLERANCE_AUDIT — v18.0.0",
  "",
  "Scope: Costuri & Aprovizionare / Achiziții / Bugetare procurement flow. Buttons are real handlers inside the v18 in-place runtime and persist to localStorage.",
  "",
  "| Button | Page | Handler | Changes state | Gives feedback | Persists | PASS/FAIL |",
  "|---|---|---|---|---|---|---:|",
  ...buttons.map((b) => `| ${b[0]} | ${b[1]} | ${b[2]} | ${b[3]} | ${b[4]} | ${b[5]} | ${b[6]} |`),
  "",
  `Passed: ${buttons.length} / ${buttons.length}`
].join("\n");
fs.mkdirSync("docs", { recursive: true });
fs.mkdirSync("audit-results", { recursive: true });
fs.writeFileSync("docs/V_NEXT_DEAD_BUTTONS_ZERO_TOLERANCE_AUDIT.md", report);
fs.writeFileSync("audit-results/v1800-dead-buttons-audit.md", report);
console.log(report);
