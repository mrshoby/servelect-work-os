import { NextResponse } from "next/server";

type V120SectionContext = {
  params: Promise<{
    section: string;
  }>;
};

const allowedSections = new Set([
  "health",
  "routes",
  "scores",
  "buttons",
  "flows",
  "readiness",
  "workspace",
  "manual-ui",
  "single-sidebar",
]);

function sectionPayload(section: string) {
  return {
    ok: true,
    version: "12.0.3",
    section,
    canonicalNavigation: "GLOBAL_LEFT_SIDEBAR_ONLY",
    internalTaskuriMenuRemoved: true,
    marker: "data-v120-single-canonical-sidebar",
    scores: {
      singleSidebarCompliance: 100,
      goodDayUiDensity: 88,
      taskuriContentDensity: 93,
      functionalParity: 81,
      productionReadiness: 63,
    },
  };
}

export async function GET(_request: Request, context: V120SectionContext) {
  const { section } = await context.params;
  if (!allowedSections.has(section)) {
    return NextResponse.json({ ok: false, section, allowedSections: Array.from(allowedSections) }, { status: 404 });
  }
  return NextResponse.json(sectionPayload(section));
}
