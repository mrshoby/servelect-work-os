export type AuditRoute = {
  path: string;
  label: string;
  category: "core" | "work" | "operations" | "admin" | "api";
  maxMs: number;
  critical: boolean;
};

export const siteAuditRoutes: AuditRoute[] = [
  { path: "/", label: "Dashboard", category: "core", maxMs: 2200, critical: true },
  { path: "/taskuri", label: "Taskuri", category: "work", maxMs: 2500, critical: true },
  { path: "/proiecte", label: "Proiecte", category: "work", maxMs: 2500, critical: true },
  { path: "/calendar", label: "Calendar", category: "work", maxMs: 2500, critical: false },
  { path: "/echipa", label: "Echipă / Workload", category: "work", maxMs: 2500, critical: false },
  { path: "/crm", label: "CRM & Vânzări", category: "operations", maxMs: 2600, critical: true },
  { path: "/iot", label: "Monitorizare IoT", category: "operations", maxMs: 2600, critical: true },
  { path: "/echipamente", label: "Echipamente", category: "operations", maxMs: 2600, critical: true },
  { path: "/mentenanta", label: "Mentenanță", category: "operations", maxMs: 2600, critical: true },
  { path: "/finantari-esg", label: "Finanțări & ESG", category: "operations", maxMs: 2600, critical: false },
  { path: "/documente", label: "Documente", category: "work", maxMs: 2500, critical: false },
  { path: "/rapoarte", label: "Rapoarte", category: "core", maxMs: 2500, critical: false },
  { path: "/hr-admin", label: "HR & Admin", category: "admin", maxMs: 2500, critical: true },
  { path: "/action-center", label: "Action Center", category: "work", maxMs: 2500, critical: true },
  { path: "/workflows", label: "Workflow-uri", category: "work", maxMs: 2500, critical: true },
  { path: "/enterprise", label: "Enterprise v1.1", category: "core", maxMs: 2400, critical: true },
  { path: "/admin/system", label: "System Status", category: "admin", maxMs: 2400, critical: true },
  { path: "/admin/performance", label: "Performance Audit", category: "admin", maxMs: 2400, critical: true },
  { path: "/admin/release", label: "Release Console", category: "admin", maxMs: 2400, critical: false },
  { path: "/admin/roadmap", label: "Roadmap", category: "admin", maxMs: 2400, critical: false },
  { path: "/admin/quality", label: "Quality Gates", category: "admin", maxMs: 2400, critical: false },
  { path: "/api/v1/system/status", label: "API System Status", category: "api", maxMs: 1200, critical: true },
  { path: "/api/v1/system/readiness", label: "API System Readiness", category: "api", maxMs: 1200, critical: true },
  { path: "/api/v1/performance/audit", label: "API Performance Audit", category: "api", maxMs: 1200, critical: true },
  { path: "/api/v1/performance/deep-audit", label: "API Deep Audit", category: "api", maxMs: 1200, critical: false },
  { path: "/api/v1/enterprise/release", label: "API v1.1 Release", category: "api", maxMs: 1200, critical: true },
  { path: "/api/v1/enterprise/site-map", label: "API Site Map", category: "api", maxMs: 1200, critical: false }
];

export function getRouteAuditManifest() {
  return {
    generatedAt: new Date().toISOString(),
    routeCount: siteAuditRoutes.length,
    criticalRouteCount: siteAuditRoutes.filter((route) => route.critical).length,
    categories: Array.from(new Set(siteAuditRoutes.map((route) => route.category))),
    routes: siteAuditRoutes
  };
}
