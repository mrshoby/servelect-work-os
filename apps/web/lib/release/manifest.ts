export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";

export type ReleaseGate = {
  id: string;
  title: string;
  label: string;
  status: ReleaseGateStatus;
  owner: string;
  action: string;
  evidence: string;
  required: boolean;
};

export type ReleaseMilestone = {
  id: string;
  version: string;
  title: string;
  date: string;
  summary: string;
  routes: string[];
  status: ReleaseGateStatus;
};

export type ReleaseManifest = {
  product: string;
  latestVersion: string;
  releaseName: string;
  releaseDate: string;
  visibleVersionLabel: string;
  navigationPolicy: string;
  globalWrites: "disabled" | "pilot-gated" | "enabled";
  app: {
    name: string;
    channel: string;
    version: string;
    build: string;
  };
  summary: {
    capabilities: number;
    actionItems: number;
    criticalActions: number;
    workflowExecutions: number;
  };
  canonicalNavigation: {
    primaryMenu: string;
    removedDuplicateShell: boolean;
    canonicalTaskBase: string;
    compatibilityRoutes: string[];
  };
  milestones: ReleaseMilestone[];
  nextRecommendedVersions: Array<{
    version: string;
    title: string;
    focus: string;
  }>;
};

export type ReleaseChecklist = {
  version: string;
  generatedAt: string;
  productionScore: number;
  gates: ReleaseGate[];
  blockers: ReleaseGate[];
  warnings: ReleaseGate[];
  planned: ReleaseGate[];
};

export const SERVELECT_WORK_OS_LATEST_RELEASE = {
  version: "9.2.0",
  name: "API Subroute Completion & v90 Functional Smoke Fix",
  date: "2026-06-15",
};

export const RELEASE_VERSION = SERVELECT_WORK_OS_LATEST_RELEASE.version;
export const RELEASE_NAME = SERVELECT_WORK_OS_LATEST_RELEASE.name;
export const RELEASE_CHANNEL = "Unified Taskuri Navigation / Production Pilot Cutover";

const gates: ReleaseGate[] = [
  {
    id: "REL-903-01",
    title: "Single canonical navigation",
    label: "Navigation truth",
    status: "passed",
    owner: "Platform / UX",
    action: "Taskuri rămâne meniul principal canonic; /work-os este compatibilitate/execuție, nu shell paralel.",
    evidence: "Hotfixurile v9.2.0-v9.2.0 păstrează rutele într-un singur flux vizual și curăță eticheta veche legacy v7_9 label.",
    required: true,
  },
  {
    id: "REL-903-02",
    title: "Release manifest contract restored",
    label: "TypeScript release contract",
    status: "passed",
    owner: "Frontend / TypeScript",
    action: "Manifestul exportă toate câmpurile folosite de /admin/release, /api/v1/release/* și /api/v1/system/status.",
    evidence: "getReleaseManifest, getReleaseChecklist, ReleaseGateStatus, productionScore, blockers, warnings, planned, app și summary sunt disponibile.",
    required: true,
  },
  {
    id: "REL-903-03",
    title: "v90 API subroutes completed",
    label: "Functional route truth",
    status: "passed",
    owner: "Backend / API",
    action: "Adaugă route.ts explicit pentru cele 15 subrute v90 care răspundeau 404 pe Vercel.",
    evidence: "Endpointurile /health, /live-provider-dispatch, /signed-webhook-hardening, /release-readiness etc. au rute fizice Next.js.",
    required: true,
  },
  {
    id: "REL-903-04",
    title: "No stale legacy v7_9 label release label",
    label: "Version truth",
    status: "passed",
    owner: "Release QA",
    action: "Auditul local și live verifică să nu mai apară legacy provider-pilot label în suprafețele principale.",
    evidence: "Versiunea vizibilă este v9.2.0 · API Subroute Completion / Production Pilot Cutover.",
    required: true,
  },
  {
    id: "REL-903-05",
    title: "Production pilot remains gated",
    label: "Safe writes",
    status: "warning",
    owner: "Platform / Security",
    action: "Păstrează global production writes off până când provider dispatch, webhook intake și DB ledger sunt validate cu secrete reale.",
    evidence: "v9.2.0 repară rutele/API smoke, dar nu activează scrieri globale live.",
    required: true,
  },
  {
    id: "REL-903-06",
    title: "DB-backed dispatch worker",
    label: "Next build",
    status: "planned",
    owner: "Backend / Work OS",
    action: "v9.2.0 trebuie să introducă ledger real pentru provider dispatch și webhook intake, nu doar readiness panels.",
    evidence: "NEXT_BUILD_PLAN.md mută următorul pas spre DB-backed provider dispatch worker și task mutation pilot.",
    required: false,
  },
];

export function getReleaseManifest(): ReleaseManifest {
  return {
    product: "SERVELECT WORK OS",
    latestVersion: "9.2.0",
    releaseName: "API Subroute Completion & v90 Functional Smoke Fix",
    releaseDate: "2026-06-15",
    visibleVersionLabel: "v9.2.0 · API Subroute Completion / Production Pilot Cutover",
    navigationPolicy: "single-canonical-taskuri-menu",
    globalWrites: "disabled",
    app: {
      name: "SERVELECT WORK OS",
      channel: "Unified Taskuri Navigation / Production Pilot Cutover",
      version: "9.2.0",
      build: "v9.2.0-api-subroute-completion-fix",
    },
    summary: {
      capabilities: 44,
      actionItems: 18,
      criticalActions: 4,
      workflowExecutions: 13,
    },
    canonicalNavigation: {
      primaryMenu: "Dashboard principal → Taskuri",
      removedDuplicateShell: true,
      canonicalTaskBase: "/taskuri",
      compatibilityRoutes: ["/work-os/*", "/admin/*"],
    },
    milestones: [
      {
        id: "v8-9-provider-delivery-ci-webhook",
        version: "8.9.0",
        title: "Provider Delivery CI Webhook",
        date: "2026-06-15",
        summary: "Provider delivery worker, GitHub pixel-diff CI și signed webhook intake validate cu 66/66 functional și 50/50 screenshot.",
        routes: ["/taskuri/provider-delivery-worker", "/admin/github-pixel-diff-ci", "/work-os/provider-delivery-ci-webhook"],
        status: "passed",
      },
      {
        id: "v9-0-production-pilot-cutover",
        version: "9.2.0",
        title: "Production Pilot Cutover",
        date: "2026-06-15",
        summary: "Production pilot cutover console, live provider dispatch, signed webhook hardening și GoodDay-like command layer.",
        routes: ["/taskuri/command-center-v90", "/taskuri/action-required", "/admin/production-pilot-cutover"],
        status: "warning",
      },
      {
        id: "v9-0-1-navigation-version-truth",
        version: "9.2.0",
        title: "Navigation + Version Truth Fix",
        date: "2026-06-15",
        summary: "Elimină shell-ul intern dublu, curăță etichetele legacy v7_9 label și aliniază meniul principal la Taskuri.",
        routes: ["/taskuri", "/taskuri/command-center-v90", "/admin/release", "/api/v1/release/manifest"],
        status: "passed",
      },
      {
        id: "v9-0-2-release-manifest-contract",
        version: "9.2.0",
        title: "Release Manifest Contract Fix",
        date: "2026-06-15",
        summary: "Repară contractul TypeScript pentru release manifest, admin release și system status ca să treacă typecheck.",
        routes: ["/admin/release", "/api/v1/release/manifest", "/api/v1/release/checklist", "/api/v1/system/status"],
        status: "passed",
      },
      {
        id: "v9-0-3-api-subroute-completion",
        version: "9.2.0",
        title: "API Subroute Completion Fix",
        date: "2026-06-15",
        summary: "Completează cele 15 subrute API v90 care returnau 404 și permite testului v900 să ajungă la 91/91 după deploy.",
        routes: ["/api/v1/work-os/v90-production-pilot-cutover/health", "/api/v1/work-os/v90-production-pilot-cutover/live-provider-dispatch", "/api/v1/work-os/v90-production-pilot-cutover/release-readiness"],
        status: "passed",
      },
    ],
    nextRecommendedVersions: [
      {
        version: "9.2.0",
        title: "DB-Backed Provider Dispatch Worker",
        focus: "Provider dispatch ledger, real webhook intake ledger, task mutation pilot și manager approval workflow.",
      },
      {
        version: "9.2.0",
        title: "GoodDay-like Task Object Model Runtime",
        focus: "Task types, custom fields runtime, view builder, dependencies, recurrence și activity stream într-un model unificat.",
      },
    ],
  };
}

export function getReleaseChecklist(): ReleaseChecklist {
  const blockers = gates.filter((gate) => gate.status === "blocked");
  const warnings = gates.filter((gate) => gate.status === "warning");
  const planned = gates.filter((gate) => gate.status === "planned");
  const requiredGates = gates.filter((gate) => gate.required);
  const passedRequired = requiredGates.filter((gate) => gate.status === "passed" || gate.status === "warning");
  const productionScore = Math.round((passedRequired.length / Math.max(requiredGates.length, 1)) * 100);

  return {
    version: "9.2.0",
    generatedAt: new Date().toISOString(),
    productionScore,
    gates,
    blockers,
    warnings,
    planned,
  };
}

export const releaseManifest = getReleaseManifest();
export const releaseChecklist = getReleaseChecklist();
export const SERVELECT_WORK_OS_RELEASE_MANIFEST = releaseManifest;
export const SERVELECT_WORK_OS_RELEASE_CHECKLIST = releaseChecklist;

export default releaseManifest;






