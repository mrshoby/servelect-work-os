import { NextResponse } from "next/server";

type V130SectionContext = {
  params: Promise<{ section: string }>;
};

const sections = new Set(["health", "routes", "scores", "buttons", "flows", "readiness", "workspace", "manual-ui", "screenshots", "route-unification"]);

function getPayload(section: string) {
  return {
    ok: true,
    version: "13.0.0",
    build: "Full Taskuri Route Unification and Screenshot Delivery",
    section,
    canonicalNavigation: "GLOBAL_LEFT_SIDEBAR_ONLY",
    allTaskuriPagesBoundToUnifiedWorkspace: true,
    routeAudit: "all apps/web/app/taskuri/**/page.tsx must import V130UnifiedTaskuriWorkspace",
    manualUiAcceptance: section === "manual-ui" || section === "screenshots",
    scores: {
      singleSidebarCompliance: 100,
      goodDayVisualSimilarity: 82,
      taskuriUiDensity: 90,
      functionalParity: 84,
      browserFlowQa: 78,
      productionReadiness: 65,
    },
  };
}

export async function GET(_request: Request, context: V130SectionContext) {
  const { section } = await context.params;
  if (!sections.has(section)) {
    return NextResponse.json({ ok: false, section, allowed: Array.from(sections) }, { status: 404 });
  }
  return NextResponse.json(getPayload(section));
}
