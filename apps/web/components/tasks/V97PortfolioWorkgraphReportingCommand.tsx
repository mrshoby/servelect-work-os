import Link from "next/link";
import { getV97PortfolioWorkgraphReporting, type V97Tone, type V97Status } from "@/lib/enterprise/work-os-v97-portfolio-workgraph-reporting-command";

type V97Mode =
  | "program-board"
  | "workgraph-map"
  | "reporting-command"
  | "sla-evidence"
  | "resource-portfolio"
  | "executive-summary"
  | "saved-layouts"
  | "admin-governance";

const modeCopy: Record<V97Mode, { eyebrow: string; title: string; subtitle: string }> = {
  "program-board": {
    eyebrow: "Taskuri · Portfolio program board",
    title: "Program board operațional",
    subtitle: "Proiecte, taskuri, tickets, evidence și workload într-un singur workspace Taskuri, fără aplicație separată.",
  },
  "workgraph-map": {
    eyebrow: "Taskuri · Cross-module WorkGraph",
    title: "Hartă WorkGraph proiecte-taskuri-decizii",
    subtitle: "Relații vizibile între program, proiect, task, ticket, evidence, decizie și capacitate.",
  },
  "reporting-command": {
    eyebrow: "Taskuri · Reporting command layer",
    title: "Comenzi de raportare operațională",
    subtitle: "Sinteze SLA, workload, evidence readiness și exec summary generate din același nucleu Taskuri.",
  },
  "sla-evidence": {
    eyebrow: "Taskuri · SLA & evidence readiness",
    title: "SLA, fișiere și readiness pentru recepție",
    subtitle: "Leagă escalation inbox, files/evidence ledger și checklist quality gates de rapoarte verificabile.",
  },
  "resource-portfolio": {
    eyebrow: "Taskuri · Resource portfolio",
    title: "Portofoliu capacitate și workload",
    subtitle: "Agregă workload pe programe și evidențiază blocaje înainte să afecteze calendarul sau SLA-ul.",
  },
  "executive-summary": {
    eyebrow: "Taskuri · Executive summary",
    title: "Executive summary pentru portofoliu",
    subtitle: "O singură vedere pentru progres, risc, decizii, buget și readiness, fără dashboard paralel.",
  },
  "saved-layouts": {
    eyebrow: "Taskuri · Saved layouts & density",
    title: "Layout-uri salvate și densitate workspace",
    subtitle: "Preferințe compacte/comfortable, shortcut-uri și politici pe rol pentru experiență GoodDay-like.",
  },
  "admin-governance": {
    eyebrow: "Admin · Taskuri governance",
    title: "Governance reporting & WorkGraph controls",
    subtitle: "Admin controlează politici de raportare, acces la layout-uri și gates pentru rapoarte executive.",
  },
};

function toneClass(tone: V97Tone) {
  const map: Record<V97Tone, string> = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
  };
  return map[tone];
}

function statusClass(status: V97Status) {
  const map: Record<V97Status, string> = {
    ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    review: "bg-blue-50 text-blue-700 ring-blue-200",
    blocked: "bg-rose-50 text-rose-700 ring-rose-200",
    gated: "bg-amber-50 text-amber-700 ring-amber-200",
    active: "bg-violet-50 text-violet-700 ring-violet-200",
  };
  return map[status];
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${className}`}>{children}</span>;
}

function Percent({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
    <div className="flex items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</span><b className="text-slate-950">{value}%</b></div>
    <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${value}%` }} /></div>
  </div>;
}

export function V97PortfolioWorkgraphReportingCommand({ mode }: { mode: V97Mode }) {
  const data = getV97PortfolioWorkgraphReporting();
  const copy = modeCopy[mode];
  const showPrograms = ["program-board", "resource-portfolio", "executive-summary", "admin-governance"].includes(mode);
  const showGraph = ["workgraph-map", "executive-summary", "admin-governance"].includes(mode);
  const showReports = ["reporting-command", "sla-evidence", "executive-summary", "admin-governance"].includes(mode);
  const showLayouts = ["saved-layouts", "executive-summary", "admin-governance"].includes(mode);

  return <main className="space-y-6">
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">{copy.eyebrow}</p>
            <h1 className="mt-3 max-w-5xl text-3xl font-black tracking-tight lg:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-200">{copy.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-right backdrop-blur">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-200">Release</div>
            <div className="mt-1 text-2xl font-black">v{data.version}</div>
            <div className="mt-1 text-xs text-slate-300">writes {data.productionWrites}</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/taskuri/workspace-overview-v93" className="rounded-2xl bg-white/10 px-4 py-2 text-xs font-black text-white ring-1 ring-white/15">Workspace</Link>
          <Link href="/taskuri/timeline-dependencies-v94" className="rounded-2xl bg-white/10 px-4 py-2 text-xs font-black text-white ring-1 ring-white/15">Timeline</Link>
          <Link href="/taskuri/collaboration-hub-v95" className="rounded-2xl bg-white/10 px-4 py-2 text-xs font-black text-white ring-1 ring-white/15">Collaboration</Link>
          <Link href="/taskuri/inline-persistence-v96" className="rounded-2xl bg-white/10 px-4 py-2 text-xs font-black text-white ring-1 ring-white/15">Persistence</Link>
        </div>
      </div>
      <div className="grid gap-3 bg-slate-50 p-5 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => <div key={metric.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <Badge className={toneClass(metric.tone)}>{metric.label}</Badge>
          <div className="mt-3 text-3xl font-black text-slate-950">{metric.value}</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{metric.detail}</p>
        </div>)}
      </div>
    </section>

    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <Percent label="Taskuri workspace" value={data.readiness.taskuriWorkspace} />
      <Percent label="GoodDay parity" value={data.readiness.gooddayParity} />
      <Percent label="Program board" value={data.readiness.programBoard} />
      <Percent label="WorkGraph" value={data.readiness.workGraph} />
      <Percent label="Reporting" value={data.readiness.reporting} />
      <Percent label="Governance" value={data.readiness.governance} />
    </section>

    {showPrograms ? <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">Program board</p><h2 className="mt-1 text-2xl font-black text-slate-950">Programe conectate la execuție</h2></div>
        <Badge className="bg-amber-50 text-amber-700 ring-amber-200">Global writes OFF</Badge>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {data.programs.map((program) => <article key={program.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{program.code}</p><h3 className="mt-1 text-xl font-black text-slate-950">{program.title}</h3><p className="mt-1 text-sm text-slate-600">{program.client} · {program.phase} · owner {program.owner}</p></div><Badge className={statusClass(program.status)}>{program.status}</Badge></div>
          <div className="mt-4 grid gap-3 md:grid-cols-4"><Mini label="Progress" value={`${program.progress}%`} /><Mini label="Budget" value={`${Math.round(program.budgetEur / 1000)}k€`} /><Mini label="Workload" value={`${program.workloadHours}h`} /><Mini label="Tasks" value={`${program.linkedTasks}`} /></div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{program.evidence}</p>
        </article>)}
      </div>
    </section> : null}

    {showGraph ? <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-2xl font-black text-slate-950">WorkGraph nodes</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{data.graphNodes.map((node) => <div key={node.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{node.type}</p><h3 className="mt-1 font-black text-slate-950">{node.label}</h3><p className="mt-1 text-xs text-slate-500">Owner {node.owner} · weight {node.weight}</p></div><Badge className={statusClass(node.status)}>{node.status}</Badge></div></div>)}</div></article>
      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-2xl font-black text-slate-950">Relations</h2><div className="mt-4 space-y-3">{data.graphEdges.map((edge) => <div key={`${edge.from}-${edge.to}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="font-black text-slate-950">{edge.from} → {edge.to}</p><p className="mt-1 text-sm text-slate-600">{edge.relation}</p><Badge className={edge.risk === "high" || edge.risk === "critical" ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-blue-50 text-blue-700 ring-blue-200"}>risk {edge.risk}</Badge></div>)}</div></article>
    </section> : null}

    {showReports ? <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-2xl font-black text-slate-950">Reporting command layer</h2><div className="mt-4 grid gap-4 xl:grid-cols-2">{data.reportCommands.map((command) => <article key={command.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black text-slate-950">{command.title}</h3><p className="mt-1 text-sm text-slate-600">{command.scope} · {command.cadence} · {command.owner}</p></div><Badge className={statusClass(command.status)}>{command.status}</Badge></div><div className="mt-3 flex flex-wrap gap-2">{command.sections.map((section) => <Badge key={section} className="bg-white text-slate-700 ring-slate-200">{section}</Badge>)}</div><p className="mt-3 text-sm leading-6 text-slate-600">{command.evidence}</p></article>)}</div></section> : null}

    {showLayouts ? <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-2xl font-black text-slate-950">Saved layouts & command navigation</h2><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data.savedLayouts.map((layout) => <article key={layout.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-600">{layout.scope}</p><h3 className="mt-2 font-black text-slate-950">{layout.name}</h3><p className="mt-2 text-sm text-slate-600">{layout.defaultView} · {layout.density}</p><p className="mt-2 text-xs text-slate-500">{layout.policy}</p><Badge className="mt-3 inline-flex bg-slate-950 text-white ring-slate-900">{layout.keyboardShortcut}</Badge></article>)}</div></section> : null}
  </main>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</div><div className="mt-1 text-lg font-black text-slate-950">{value}</div></div>;
}
