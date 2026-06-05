export type SiteAuditRisk = "low" | "medium" | "high" | "critical";

export type SiteAuditItem = {
  route: string;
  area: string;
  status: "ok" | "watch" | "fixed";
  risk: SiteAuditRisk;
  issue: string;
  fix: string;
};

export const siteAuditItems: SiteAuditItem[] = [
  {
    route: "/taskuri",
    area: "Task management",
    status: "fixed",
    risk: "critical",
    issue: "Pagina randă simultan tabelul complet, Kanban-ul, drawer-ul și calendarul; pe browsere cu localStorage vechi putea apărea freeze.",
    fix: "Randare numai pentru view-ul activ, tabel light, board light, limitare vizuală și reset cheie localStorage la v4."
  },
  {
    route: "Topbar global",
    area: "Layout",
    status: "fixed",
    risk: "medium",
    issue: "Textul de branding/status ocupa spațiu în stânga și putea intra peste bara de search.",
    fix: "Topbar simplificat: search full-width, fără textul SERVELECT WORK OS / Live / Demo auth lângă search."
  },
  {
    route: "/proiecte",
    area: "Project management",
    status: "watch",
    risk: "medium",
    issue: "Vizualizările dense de proiecte/Gantt pot deveni grele când numărul de proiecte crește.",
    fix: "Recomandare v1.0.2: randare pe tab activ + limită de listare + virtualizare pentru timeline."
  },
  {
    route: "/iot",
    area: "Energy monitoring",
    status: "watch",
    risk: "medium",
    issue: "Graficele Recharts și harta/mock cards pot încărca mult DOM dacă sunt afișate toate simultan.",
    fix: "Recomandare v1.0.2: lazy load pentru chart/map și sampling pentru serii mari."
  },
  {
    route: "/echipamente",
    area: "Inventory & logistics",
    status: "watch",
    risk: "low",
    issue: "Catalogul și coada de echipamente trebuie paginate înainte de date reale mari.",
    fix: "Paginare/limitare 50 rânduri pe view și filtre server-side când se activează DB."
  },
  {
    route: "/admin/users",
    area: "RBAC",
    status: "watch",
    risk: "medium",
    issue: "User management este demo/local și nu trebuie considerat securitate reală până la Auth/DB persistent.",
    fix: "v1.1 Database Activation Pack: user persistence, audit log persistent, role enforcement complet."
  }
];

export function getSiteAuditSummary() {
  const total = siteAuditItems.length;
  const fixed = siteAuditItems.filter((item) => item.status === "fixed").length;
  const watch = siteAuditItems.filter((item) => item.status === "watch").length;
  const critical = siteAuditItems.filter((item) => item.risk === "critical").length;

  return {
    total,
    fixed,
    watch,
    critical,
    generatedAt: new Date().toISOString(),
    recommendation: "După deploy, rulează smoke test pe toate rutele publice și verifică manual /taskuri în Incognito + Ctrl+F5."
  };
}
