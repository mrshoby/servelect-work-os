import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "18.0.0",
    build: "PROCUREMENT_COSTURI_ACHIZITII_BUGETARE_FULL_FLOW_ON_V15_BASELINE",
    baseline: "taskuri-ui-v15-goodday-baseline-restored",
    visualShellPolicy: "PRESERVE_EXISTING_V15_SHELL_NO_NEW_SHELL",
    runtime: "REAL_LOCAL_PERSISTENT",
    modules: ["Costuri & Aprovizionare", "Achiziții", "Bugetare", "RFQ", "Furnizori", "Oferte", "Comenzi", "Facturi", "Garanții"],
    flows: {
      procurement: ["create-request", "add-materials", "convert-rfq", "choose-suppliers", "add-offers", "compare", "select-recommended", "generate-po", "set-delivery", "mark-delay", "alert", "invoice", "warranty", "project-link"],
      qa: ["source-audit", "dead-buttons", "functional-flow", "route-api", "browser-flow", "manual-ui-required"]
    },
    percentages: {
      "Costuri & Aprovizionare": "45% -> 78%",
      "Achiziții": "38% -> 76%",
      "Bugetare": "35% -> 68%",
      "GoodDay functional parity": "80% -> 84%",
      "Production readiness": "84% -> 86%"
    }
  });
}
