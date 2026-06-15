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
  version: "9.0.2",
  name: "Release Manifest Contract & Typecheck Stabilization",
  date: "2026-06-15",
};

export const RELEASE_VERSION = SERVELECT_WORK_OS_LATEST_RELEASE.version;
export const RELEASE_NAME = SERVELECT_WORK_OS_LATEST_RELEASE.name;
export const RELEASE_CHANNEL = "Unified Taskuri Navigation / Production Pilot Cutover";

const gates: ReleaseGate[] = [
  {
    id: "REL-902-01",
    title: "Single canonical navigation",
    label: "Navigation truth",
    status: "passed",
    owner: "Platform / UX",
    action: "Taskuri este meniul principal canonic; shell-ul intern Work OS nu mai trebuie să apară ca meniu paralel.",
    evidence: "Rutele /taskuri, /admin și /work-os folosesc aceeași versiune vizibilă și aceeași logică de release truth.",
    required: true,
  },
  {
    id: "REL-902-02",
    title: "Release manifest contract restored",
    label: "TypeScript release contract",
    status: "passed",
    owner: "Frontend / TypeScript",
    action: "Manifestul exportă toate câmpurile folosite de /admin/release și /api/v1/release/*.",
    evidence: "getReleaseManifest, getReleaseChecklist, ReleaseGateStatus, productionScore, blockers, warnings, planned, app și summary sunt disponibile.",
    required: true,
  },
  {
    id: "REL-902-03",
    title: "No stale v7.9.0 release label",
    label: "Version truth",
    status: "passed",
    owner: "Release QA",
    action: "Auditul local și live verifică să nu mai apară v7.9.0 / Provider Canary în suprafețele principale.",
    evidence: "Versiunea vizibilă este v9.0.2 · Unified Taskuri Navigation / Production Pilot Cutover.",
    required: true,
  },
  {
    id: "REL-902-04",
    title: "Production pilot remains gated",
    label: "Safe writes",
    status: "warning",
    owner: "Platform / Security",
    action: "Păstrează global production writes off până când provider dispatch, webhook intake și DB ledger sunt validate cu secrete reale.",
    evidence: "v9.0.2 repară contractul și navigația, dar nu activează scrieri globale live.",
    required: true,
  },
  {
    id: "REL-902-05",
    title: "DB-backed dispatch worker",
    label: "Next build",
    status: "planned",
    owner: "Backend / Work OS",
    action: "v9.1.0 trebuie să introducă ledger real pentru provider dispatch și webhook intake, nu doar readiness panels.",
    evidence: "NEXT_BUILD_PLAN.md mută următorul pas spre DB-backed provider dispatch worker și task mutation pilot.",
    required: false,
  },
];

export function getReleaseManifest(): ReleaseManifest {
  return {
    product: "SERVELECT WORK OS",
    latestVersion: "9.0.2",
    releaseName: "Release Manifest Contract & Typecheck Stabilization",
    releaseDate: "2026-06-15",
    visibleVersionLabel: "v9.0.2 · Unified Taskuri Navigation / Production Pilot Cutover",
    navigationPolicy: "single-canonical-taskuri-menu",
    globalWrites: "disabled",
    app: {
      name: "SERVELECT WORK OS",
      channel: "Unified Taskuri Navigation / Production Pilot Cutover",
      version: "9.0.2",
      build: "v9.0.2-release-manifest-contract-fix",
    },
    summary: {
      capabilities: 42,
      actionItems: 18,
      criticalActions: 4,
      workflowExecutions: 12,
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
        version: "9.0.0",
        title: "Production Pilot Cutover",
        date: "2026-06-15",
        summary: "Production pilot cutover console, live provider dispatch, signed webhook hardening și GoodDay-like command layer.",
        routes: ["/taskuri/command-center-v90", "/taskuri/action-required", "/admin/production-pilot-cutover"],
        status: "warning",
      },
      {
        id: "v9-0-1-navigation-version-truth",
        version: "9.0.1",
        title: "Navigation + Version Truth Fix",
        date: "2026-06-15",
        summary: "Elimină shell-ul intern dublu, curăță etichetele v7.9.0 și aliniază meniul principal la Taskuri.",
        routes: ["/taskuri", "/taskuri/command-center-v90", "/admin/release", "/api/v1/release/manifest"],
        status: "warning",
      },
      {
        id: "v9-0-2-release-manifest-contract",
        version: "9.0.2",
        title: "Release Manifest Contract Fix",
        date: "2026-06-15",
        summary: "Repară contractul TypeScript pentru release manifest, admin release și system status ca să treacă typecheck.",
        routes: ["/admin/release", "/api/v1/release/manifest", "/api/v1/release/checklist", "/api/v1/system/status"],
        status: "passed",
      },
    ],
    nextRecommendedVersions: [
      {
        version: "9.1.0",
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
    version: "9.0.2",
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
