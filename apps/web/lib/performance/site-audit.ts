export type SiteAuditSeverity = "ok" | "warning" | "critical";

export type SiteAuditRoute = {
  path: string;
  module: string;
  expectedWeight: "light" | "medium" | "heavy";
  risk: SiteAuditSeverity;
  checks: string[];
  fix: string;
};

export const SITE_AUDIT_ROUTES: SiteAuditRoute[] = [
  {
    path: "/",
    module: "Dashboard",
    expectedWeight: "medium",
    risk: "ok",
    checks: ["KPI cards", "My tasks", "team activity", "energy chart"],
    fix: "Menține graficele cu date limitate și evită recalculări globale."
  },
  {
    path: "/taskuri",
    module: "Task Center",
    expectedWeight: "heavy",
    risk: "warning",
    checks: ["randare doar pe view activ", "limitare task cards", "localStorage capped", "drawer lazy state"],
    fix: "Pagina a fost optimizată prin randare pe tab activ și PageHeader compatibil cu actions."
  },
  {
    path: "/proiecte",
    module: "Projects",
    expectedWeight: "heavy",
    risk: "warning",
    checks: ["timeline", "board", "project cards", "documents"],
    fix: "Următorul pas: paginare/lazy render pentru Gantt și documente."
  },
  {
    path: "/crm",
    module: "CRM",
    expectedWeight: "medium",
    risk: "ok",
    checks: ["pipeline columns", "opportunities", "ROI widgets"],
    fix: "Ține pipeline-ul limitat la carduri vizibile."
  },
  {
    path: "/iot",
    module: "Energy / IoT",
    expectedWeight: "heavy",
    risk: "warning",
    checks: ["charts", "alarms", "installations", "map placeholder"],
    fix: "Când intră IoT real, graficele trebuie agregate pe server."
  },
  {
    path: "/echipamente",
    module: "Equipment",
    expectedWeight: "medium",
    risk: "ok",
    checks: ["inventory table", "equipment cards", "serial traceability"],
    fix: "Paginare pentru seriale când apare DB real."
  },
  {
    path: "/mentenanta",
    module: "Maintenance",
    expectedWeight: "medium",
    risk: "ok",
    checks: ["ticket queue", "dispatch", "SLA"],
    fix: "Separare hartă live în componentă lazy când va fi Mapbox."
  },
  {
    path: "/admin/performance",
    module: "Performance Audit",
    expectedWeight: "light",
    risk: "ok",
    checks: ["route inventory", "slowdown risks", "recommended fixes"],
    fix: "Folosit pentru audit rapid după deploy."
  }
];

export function getSitePerformanceAudit() {
  const critical = SITE_AUDIT_ROUTES.filter((route) => route.risk === "critical").length;
  const warning = SITE_AUDIT_ROUTES.filter((route) => route.risk === "warning").length;

  return {
    ok: critical === 0,
    version: "1.0.2",
    generatedAt: new Date().toISOString(),
    summary: {
      totalRoutes: SITE_AUDIT_ROUTES.length,
      critical,
      warning,
      optimizedRoutes: SITE_AUDIT_ROUTES.length - critical - warning
    },
    routes: SITE_AUDIT_ROUTES
  };
}
