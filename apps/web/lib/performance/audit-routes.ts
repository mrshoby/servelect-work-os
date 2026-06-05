export type SiteAuditRouteCategory =
  | "core"
  | "work-os"
  | "operations"
  | "admin"
  | "api";

export type SiteAuditRoute = {
  path: string;
  label: string;
  category: SiteAuditRouteCategory;
  risk: "low" | "medium" | "high";
  manualChecks: string[];
};

export const siteAuditRoutes: SiteAuditRoute[] = [
  {
    path: "/",
    label: "Home / Command Center",
    category: "core",
    risk: "medium",
    manualChecks: ["KPI cards", "team activity", "energy snapshot", "responsive layout"]
  },
  {
    path: "/dashboard",
    label: "Dashboard alias",
    category: "core",
    risk: "low",
    manualChecks: ["redirect/render", "topbar", "sidebar active state"]
  },
  {
    path: "/taskuri",
    label: "Task Center",
    category: "work-os",
    risk: "high",
    manualChecks: ["no browser freeze", "view tabs", "task drawer", "create modal", "Kanban drag/drop", "filters"]
  },
  {
    path: "/proiecte",
    label: "Projects",
    category: "work-os",
    risk: "high",
    manualChecks: ["timeline", "board", "task lists", "project cards", "no heavy re-render"]
  },
  {
    path: "/calendar",
    label: "Calendar",
    category: "work-os",
    risk: "medium",
    manualChecks: ["calendar cells", "agenda", "responsive"]
  },
  {
    path: "/echipa",
    label: "Team / Workload",
    category: "work-os",
    risk: "medium",
    manualChecks: ["workload bars", "team cards", "responsive"]
  },
  {
    path: "/crm",
    label: "CRM & Sales",
    category: "operations",
    risk: "medium",
    manualChecks: ["pipeline columns", "opportunity cards", "ROI widgets"]
  },
  {
    path: "/iot",
    label: "Energy / IoT",
    category: "operations",
    risk: "high",
    manualChecks: ["charts", "alerts", "installation map mock", "create task action"]
  },
  {
    path: "/echipamente",
    label: "Equipment & Logistics",
    category: "operations",
    risk: "medium",
    manualChecks: ["stock KPIs", "equipment table/cards", "reservations"]
  },
  {
    path: "/mentenanta",
    label: "Maintenance & Dispatch",
    category: "operations",
    risk: "medium",
    manualChecks: ["ticket queue", "SLA badges", "dispatch cards"]
  },
  {
    path: "/finantari",
    label: "Funding & ESG",
    category: "operations",
    risk: "medium",
    manualChecks: ["funding pipeline", "audit cards", "ESG widgets"]
  },
  {
    path: "/documente",
    label: "Documents",
    category: "work-os",
    risk: "low",
    manualChecks: ["document list", "empty/loading states"]
  },
  {
    path: "/rapoarte",
    label: "Reports",
    category: "work-os",
    risk: "medium",
    manualChecks: ["charts", "export cards", "no layout overflow"]
  },
  {
    path: "/administrare",
    label: "Administration",
    category: "admin",
    risk: "medium",
    manualChecks: ["RBAC panels", "admin cards", "links"]
  },
  {
    path: "/action-center",
    label: "Action Center",
    category: "work-os",
    risk: "high",
    manualChecks: ["action queue", "filters", "priority badges", "no long render"]
  },
  {
    path: "/workflows",
    label: "Workflows",
    category: "work-os",
    risk: "medium",
    manualChecks: ["templates", "run workflow action", "execution result"]
  },
  {
    path: "/admin/system",
    label: "System Status",
    category: "admin",
    risk: "medium",
    manualChecks: ["status panels", "readiness", "release version"]
  },
  {
    path: "/admin/audit",
    label: "Audit Log",
    category: "admin",
    risk: "medium",
    manualChecks: ["audit list", "filters", "timestamps"]
  },
  {
    path: "/admin/release",
    label: "Release Console",
    category: "admin",
    risk: "medium",
    manualChecks: ["manifest", "checklist", "readiness"]
  },
  {
    path: "/admin/performance",
    label: "Performance Audit",
    category: "admin",
    risk: "high",
    manualChecks: ["audit table", "route list", "slowdown recommendations"]
  },
  {
    path: "/api/v1/system/status",
    label: "API System Status",
    category: "api",
    risk: "medium",
    manualChecks: ["JSON ok", "dashboard payload", "no TS/runtime errors"]
  },
  {
    path: "/api/v1/system/readiness",
    label: "API Readiness",
    category: "api",
    risk: "medium",
    manualChecks: ["JSON ok", "checks array", "no import errors"]
  },
  {
    path: "/api/v1/performance/audit",
    label: "API Performance Audit",
    category: "api",
    risk: "medium",
    manualChecks: ["JSON ok", "route metrics", "recommendations"]
  },
  {
    path: "/api/v1/performance/deep-audit",
    label: "API Deep Audit Manifest",
    category: "api",
    risk: "low",
    manualChecks: ["JSON ok", "all routes listed"]
  }
];

export const siteAuditRecommendations = [
  "Randează doar tab-ul activ pentru paginile cu view-uri multiple.",
  "Limitează listele mari pe client side și adaugă filtre/paginare.",
  "Mută graficele grele în dynamic imports sau componente lazy.",
  "Schimbă cheia localStorage după modificări majore de store pentru a evita state vechi/corupt.",
  "Evită useEffect care scrie în store pe fiecare render.",
  "Verifică în Incognito când o pagină pare blocată după deploy.",
  "Păstrează topbar-ul curat: search-ul nu trebuie să fie acoperit de badge-uri/text.",
  "Pentru task/board/workload, folosește virtualizare sau slice/paginare până la backend real."
];
