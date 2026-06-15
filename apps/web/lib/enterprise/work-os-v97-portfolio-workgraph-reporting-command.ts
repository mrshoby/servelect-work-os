export const V97_RELEASE_VERSION = "9.7.0";
export const V97_RELEASE_NAME = "Portfolio Program Board, WorkGraph & Reporting Command Layer";

export type V97Status = "ready" | "review" | "blocked" | "gated" | "active";
export type V97Tone = "emerald" | "blue" | "amber" | "rose" | "slate" | "violet";

export interface V97Metric {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: V97Tone;
}

export interface V97ProgramItem {
  id: string;
  code: string;
  title: string;
  client: string;
  phase: string;
  owner: string;
  status: V97Status;
  priority: "critical" | "high" | "medium";
  progress: number;
  budgetEur: number;
  workloadHours: number;
  blockers: number;
  linkedTasks: number;
  evidence: string;
}

export interface V97WorkGraphNode {
  id: string;
  label: string;
  type: "program" | "project" | "task" | "ticket" | "evidence" | "decision" | "workload";
  status: V97Status;
  owner: string;
  weight: number;
}

export interface V97WorkGraphEdge {
  from: string;
  to: string;
  relation: string;
  risk: "low" | "medium" | "high" | "critical";
}

export interface V97ReportCommand {
  id: string;
  title: string;
  scope: string;
  cadence: string;
  owner: string;
  status: V97Status;
  sections: string[];
  evidence: string;
}

export interface V97SavedLayout {
  id: string;
  name: string;
  scope: "personal" | "team" | "department" | "executive";
  density: "compact" | "comfortable";
  defaultView: string;
  policy: string;
  keyboardShortcut: string;
}

export interface V97Readiness {
  taskuriWorkspace: number;
  gooddayParity: number;
  programBoard: number;
  workGraph: number;
  reporting: number;
  governance: number;
  productionWrites: "off-gated";
}

const metrics: V97Metric[] = [
  { id: "programs", label: "Program board", value: "6 programe", detail: "Proiecte, taskuri, tickets și evidence într-un singur board Taskuri.", tone: "emerald" },
  { id: "graph", label: "WorkGraph links", value: "42 relații", detail: "Legături între proiecte, taskuri, decizii, workload și documente.", tone: "blue" },
  { id: "reports", label: "Reporting commands", value: "8 comenzi", detail: "SLA, workload, evidence, governance și executive summary.", tone: "violet" },
  { id: "writes", label: "Production writes", value: "OFF", detail: "Mutațiile reale rămân env-gated și manager-approved.", tone: "amber" },
];

const programs: V97ProgramItem[] = [
  { id: "pg-fv-industrial", code: "PRG-FV-2026-01", title: "Program FV industrial 2026", client: "GreenFactory SA", phase: "Execuție", owner: "Ioana Marinescu", status: "active", priority: "critical", progress: 72, budgetEur: 1840000, workloadHours: 620, blockers: 2, linkedTasks: 38, evidence: "Contract, gantt, avize, poze șantier și decizii manager." },
  { id: "pg-service-sla", code: "PRG-SLA-2026-02", title: "Service & SLA portofoliu mentenanță", client: "Servelect Operations", phase: "Monitorizare", owner: "Mihai Ionescu", status: "review", priority: "high", progress: 81, budgetEur: 260000, workloadHours: 340, blockers: 1, linkedTasks: 24, evidence: "Tickete, SLA inbox, dispatch, rapoarte client." },
  { id: "pg-digital-workos", code: "PRG-DIGI-2026-03", title: "SERVELECT Work OS digitalizare internă", client: "Servelect", phase: "Pilot controlat", owner: "Andrei Popescu", status: "active", priority: "critical", progress: 89, budgetEur: 220000, workloadHours: 510, blockers: 0, linkedTasks: 44, evidence: "Audit route, screenshot, source audit, release gates." },
  { id: "pg-ev-charging", code: "PRG-EV-2026-04", title: "Stații EV & prosumatori B2B", client: "Portofoliu comercial", phase: "Planificare", owner: "Alexandra Rusu", status: "gated", priority: "medium", progress: 46, budgetEur: 430000, workloadHours: 210, blockers: 3, linkedTasks: 19, evidence: "Ofertare, stocuri, decizii buget, request bridge." },
];

const graphNodes: V97WorkGraphNode[] = [
  { id: "program", label: "Program FV industrial", type: "program", status: "active", owner: "Ioana", weight: 100 },
  { id: "project", label: "P-2026-0187 Sistem FV 500 kWp", type: "project", status: "active", owner: "Cristian", weight: 88 },
  { id: "task", label: "Validare tablou AC/DC și protecții", type: "task", status: "review", owner: "Mihai", weight: 72 },
  { id: "ticket", label: "SLA inverter warning", type: "ticket", status: "blocked", owner: "George", weight: 54 },
  { id: "evidence", label: "PV recepție + poze șantier", type: "evidence", status: "ready", owner: "Alexandra", weight: 64 },
  { id: "decision", label: "Decizie manager: schimbare echipament", type: "decision", status: "gated", owner: "Andrei", weight: 69 },
  { id: "workload", label: "Capacitate echipă montaj", type: "workload", status: "active", owner: "Ioana", weight: 77 },
];

const graphEdges: V97WorkGraphEdge[] = [
  { from: "program", to: "project", relation: "contains", risk: "low" },
  { from: "project", to: "task", relation: "requires", risk: "medium" },
  { from: "task", to: "evidence", relation: "needs evidence", risk: "medium" },
  { from: "ticket", to: "decision", relation: "escalates to", risk: "high" },
  { from: "decision", to: "workload", relation: "changes capacity", risk: "medium" },
  { from: "workload", to: "program", relation: "affects delivery", risk: "medium" },
];

const reportCommands: V97ReportCommand[] = [
  { id: "rep-exec", title: "Executive program summary", scope: "Portofoliu proiecte", cadence: "săptămânal", owner: "Director Operațional", status: "ready", sections: ["progress", "budget", "risks", "decisions"], evidence: "Program board + WorkGraph + SLA status." },
  { id: "rep-sla", title: "SLA & escalation report", scope: "Mentenanță / service", cadence: "zilnic", owner: "Service Manager", status: "active", sections: ["tickets", "breach risk", "owner response", "client impact"], evidence: "SLA inbox, task activity, provider ledger." },
  { id: "rep-workload", title: "Workload capacity forecast", scope: "Echipe montaj / proiectare", cadence: "săptămânal", owner: "HR Ops", status: "review", sections: ["capacity", "overload", "approvals", "timesheet"], evidence: "Calendar capacity + task estimates + manager gates." },
  { id: "rep-evidence", title: "Evidence readiness pack", scope: "Recepție / documente", cadence: "milestone", owner: "Quality Lead", status: "gated", sections: ["files", "checklists", "PV", "photos"], evidence: "Files/evidence ledger + checklist quality gates." },
];

const savedLayouts: V97SavedLayout[] = [
  { id: "layout-exec", name: "Executive compact command", scope: "executive", density: "compact", defaultView: "Program board", policy: "read-most, approve decisions", keyboardShortcut: "G then P" },
  { id: "layout-pm", name: "Project manager delivery", scope: "team", density: "comfortable", defaultView: "WorkGraph map", policy: "mutate gated task fields", keyboardShortcut: "G then W" },
  { id: "layout-service", name: "SLA service desk", scope: "department", density: "compact", defaultView: "SLA report", policy: "escalate tickets", keyboardShortcut: "G then S" },
  { id: "layout-field", name: "Field evidence focus", scope: "team", density: "comfortable", defaultView: "Evidence readiness", policy: "attach evidence, request review", keyboardShortcut: "G then E" },
];

const readiness: V97Readiness = {
  taskuriWorkspace: 97,
  gooddayParity: 94,
  programBoard: 91,
  workGraph: 88,
  reporting: 86,
  governance: 92,
  productionWrites: "off-gated",
};

export function getV97PortfolioWorkgraphReporting() {
  return {
    version: V97_RELEASE_VERSION,
    release: V97_RELEASE_NAME,
    navigation: "Taskuri canonical; /work-os compatibility only; no parallel shell",
    productionWrites: "OFF / pilot gated",
    metrics,
    programs,
    graphNodes,
    graphEdges,
    reportCommands,
    savedLayouts,
    readiness,
    nextBuild: "v9.8.0 — Advanced portfolio permissions, report exports and real persisted layout preferences",
  };
}

export function getV97Slice(name: string) {
  const data = getV97PortfolioWorkgraphReporting();
  switch (name) {
    case "program-board": return { ok: true, version: data.version, programs: data.programs, metrics: data.metrics };
    case "workgraph": return { ok: true, version: data.version, nodes: data.graphNodes, edges: data.graphEdges };
    case "reporting": return { ok: true, version: data.version, commands: data.reportCommands };
    case "sla-evidence": return { ok: true, version: data.version, reports: data.reportCommands.filter((item) => item.id === "rep-sla" || item.id === "rep-evidence") };
    case "resource-portfolio": return { ok: true, version: data.version, programs: data.programs.map((program) => ({ code: program.code, workloadHours: program.workloadHours, blockers: program.blockers, owner: program.owner })) };
    case "saved-layouts": return { ok: true, version: data.version, layouts: data.savedLayouts };
    case "readiness": return { ok: true, version: data.version, readiness: data.readiness, productionWrites: data.productionWrites };
    default: return { ok: true, version: data.version, release: data.release, metrics: data.metrics, readiness: data.readiness };
  }
}
