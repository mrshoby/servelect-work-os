import Link from "next/link";
import type { ReactNode } from "react";
import { getV97PortfolioWorkgraphReporting, type V97Status, type V97Tone, type V97ProgramItem } from "@/lib/enterprise/work-os-v97-portfolio-workgraph-reporting-command";

type V97Mode =
  | "program-board"
  | "workgraph-map"
  | "reporting-command"
  | "sla-evidence"
  | "resource-portfolio"
  | "executive-summary"
  | "saved-layouts"
  | "admin-governance";

type ViewKey = "board" | "list" | "gantt" | "workload" | "reports";

const modeCopy: Record<V97Mode, { eyebrow: string; title: string; subtitle: string; activeView: ViewKey }> = {
  "program-board": {
    eyebrow: "Taskuri · Program board",
    title: "Taskuri workspace — program board",
    subtitle: "Portofoliu, foldere, subproiecte, taskuri și evidențe în același spațiu operațional.",
    activeView: "board",
  },
  "workgraph-map": {
    eyebrow: "Taskuri · WorkGraph",
    title: "WorkGraph operațional",
    subtitle: "Hartă relațională între proiecte, taskuri, decizii, SLA, documente și workload.",
    activeView: "gantt",
  },
  "reporting-command": {
    eyebrow: "Taskuri · Reporting",
    title: "Reporting command center",
    subtitle: "Rapoarte operaționale construite din același task graph, nu dashboard separat.",
    activeView: "reports",
  },
  "sla-evidence": {
    eyebrow: "Taskuri · SLA / evidence",
    title: "SLA & evidence readiness",
    subtitle: "Escalări, checklist-uri, documente și decizii manager în fluxul taskurilor.",
    activeView: "reports",
  },
  "resource-portfolio": {
    eyebrow: "Taskuri · Resource portfolio",
    title: "Resource portfolio & capacity",
    subtitle: "Capacitate, supraîncărcări și planificare pe echipe direct în workspace-ul Taskuri.",
    activeView: "workload",
  },
  "executive-summary": {
    eyebrow: "Taskuri · Executive summary",
    title: "Executive workspace summary",
    subtitle: "Un rezumat dens pentru progres, risc, buget, SLA și decizii fără să părăsești Taskuri.",
    activeView: "reports",
  },
  "saved-layouts": {
    eyebrow: "Taskuri · Saved layouts",
    title: "Saved layouts & density preferences",
    subtitle: "Layout-uri salvate, densitate compactă și navigare rapidă pentru fiecare rol.",
    activeView: "list",
  },
  "admin-governance": {
    eyebrow: "Admin · Taskuri governance",
    title: "Taskuri reporting governance",
    subtitle: "Politici de acces, export, approval și audit pentru workspace-ul canonic Taskuri.",
    activeView: "reports",
  },
};

const viewTabs: Array<{ key: ViewKey; label: string; href: string }> = [
  { key: "board", label: "Board", href: "/taskuri/program-board-v97" },
  { key: "list", label: "List", href: "/taskuri/saved-layouts-v97" },
  { key: "gantt", label: "Timeline", href: "/taskuri/workgraph-map-v97" },
  { key: "workload", label: "Workload", href: "/taskuri/resource-portfolio-v97" },
  { key: "reports", label: "Reports", href: "/taskuri/reporting-command-v97" },
];

const taskColumns = ["Inbox", "Planificat", "În lucru", "Review", "Blocat"];
const people = ["Ioana M.", "Mihai I.", "Andrei P.", "Alexandra R.", "George S."];
const priorities = ["Critical", "High", "Medium", "High", "Critical"];
const departments = ["Proiectare", "Mentenanță", "Digitalizare", "Comercial", "Teren"];

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

function priorityClass(priority: string) {
  if (priority === "Critical") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (priority === "High") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-50 text-slate-600 ring-slate-200";
}

function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${className}`}>{children}</span>;
}

function Mini({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</div>
    <div className="mt-1 text-lg font-black text-slate-950">{value}</div>
    {sub ? <div className="mt-0.5 text-[11px] font-semibold text-slate-500">{sub}</div> : null}
  </div>;
}

function taskRows(programs: V97ProgramItem[]) {
  return programs.flatMap((program, programIndex) => [0, 1, 2].map((itemIndex) => {
    const index = programIndex * 3 + itemIndex;
    return {
      id: `${program.code}-${itemIndex + 1}`,
      title: [
        `Verifică milestone ${program.phase.toLowerCase()} pentru ${program.title}`,
        `Actualizează evidence ledger și decizie manager`,
        `Sincronizează workload și SLA risk pentru echipă`,
      ][itemIndex],
      project: program.title,
      status: taskColumns[(index + 1) % taskColumns.length],
      owner: people[index % people.length],
      priority: priorities[index % priorities.length],
      department: departments[index % departments.length],
      due: `2026-06-${String(17 + index).padStart(2, "0")}`,
      progress: Math.min(96, Math.max(28, program.progress - itemIndex * 8)),
      comments: 2 + index,
      files: 1 + (index % 4),
      blockers: itemIndex === 2 ? program.blockers : 0,
    };
  }));
}

export function V97PortfolioWorkgraphReportingCommand({ mode }: { mode: V97Mode }) {
  const data = getV97PortfolioWorkgraphReporting();
  const copy = modeCopy[mode];
  const rows = taskRows(data.programs);
  const selectedTask = rows.find((row) => row.blockers > 0) ?? rows[0];

  return <main className="space-y-4" data-surface="goodday-density-workbench">
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-white px-4 py-3 lg:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-600">{copy.eyebrow}</p>
            <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-950 lg:text-3xl">{copy.title}</h1>
            <p className="mt-1 max-w-5xl text-sm leading-6 text-slate-600">{copy.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 lg:block">Ctrl K · comandă rapidă</div>
            <Badge className="bg-amber-50 text-amber-700 ring-amber-200">writes {data.productionWrites}</Badge>
            <Badge className="bg-slate-950 text-white ring-slate-950">v{data.version}</Badge>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
            {viewTabs.map((tab) => <Link key={tab.key} href={tab.href} className={`rounded-xl px-3 py-1.5 text-xs font-black ${copy.activeView === tab.key ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-950"}`}>{tab.label}</Link>)}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <span className="rounded-xl bg-slate-100 px-3 py-2">Filter: Owner / SLA / Department</span>
            <span className="rounded-xl bg-slate-100 px-3 py-2">Sort: Risk first</span>
            <span className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">Saved layout: PM compact</span>
          </div>
        </div>
      </div>

      <div className="grid min-h-[680px] grid-cols-1 bg-slate-50 lg:grid-cols-[245px_minmax(0,1fr)_335px]" data-layout="taskuri-goodday-workbench">
        <aside className="border-b border-slate-200 bg-white p-4 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black text-slate-950">Workspace tree</h2><span className="text-xs font-black text-emerald-600">{data.programs.length}</span></div>
          <div className="space-y-2">
            {data.programs.map((program, index) => <div key={program.id} className={`rounded-2xl border p-3 ${index === 0 ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
              <div className="flex items-center justify-between gap-2"><span className="truncate text-xs font-black text-slate-800">{program.code}</span><Badge className={statusClass(program.status)}>{program.status}</Badge></div>
              <div className="mt-1 line-clamp-2 text-sm font-black text-slate-950">{program.title}</div>
              <div className="mt-2 h-1.5 rounded-full bg-white"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${program.progress}%` }} /></div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px] font-black text-slate-500"><span>{program.linkedTasks} tasks</span><span>{program.blockers} blocaje</span><span>{program.workloadHours}h</span></div>
            </div>)}
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-950 p-3 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">Command nav</p>
            <div className="mt-2 grid gap-1 text-xs font-bold text-slate-200"><span>G P · Program board</span><span>G W · WorkGraph</span><span>G R · Reports</span><span>G S · SLA</span></div>
          </div>
        </aside>

        <section className="min-w-0 p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => <div key={metric.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2"><Badge className={toneClass(metric.tone)}>{metric.label}</Badge><span className="text-xs font-black text-slate-400">live</span></div>
              <div className="mt-2 text-2xl font-black text-slate-950">{metric.value}</div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{metric.detail}</p>
            </div>)}
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm" data-widget="sg-board-grid">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div><h2 className="text-lg font-black text-slate-950">Execution board + task table</h2><p className="text-xs font-semibold text-slate-500">Board, list și timeline folosesc aceleași taskuri și aceeași evidență.</p></div>
              <div className="flex gap-2"><Badge className="bg-white text-slate-700 ring-slate-200">{rows.length} taskuri</Badge><Badge className="bg-rose-50 text-rose-700 ring-rose-200">{rows.filter((row) => row.blockers > 0).length} blockers</Badge></div>
            </div>
            <div className="grid gap-0 xl:grid-cols-5">
              {taskColumns.map((column) => <div key={column} className="border-b border-slate-200 p-3 xl:border-b-0 xl:border-r last:border-r-0">
                <div className="mb-3 flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{column}</span><Badge className="bg-slate-50 text-slate-600 ring-slate-200">{rows.filter((row) => row.status === column).length}</Badge></div>
                <div className="space-y-2">
                  {rows.filter((row) => row.status === column).slice(0, 3).map((row) => <article key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 hover:border-emerald-200 hover:bg-emerald-50/40">
                    <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-black uppercase text-slate-400">{row.id}</span><Badge className={priorityClass(row.priority)}>{row.priority}</Badge></div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-black leading-5 text-slate-950">{row.title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500">{row.project}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-500"><span>{row.owner}</span><span>{row.due}</span></div>
                    <div className="mt-2 h-1.5 rounded-full bg-white"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${row.progress}%` }} /></div>
                  </article>)}
                </div>
              </div>)}
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm" data-widget="sg-timeline-grid">
              <div className="flex items-center justify-between"><h2 className="font-black text-slate-950">Timeline / WorkGraph</h2><Badge className="bg-blue-50 text-blue-700 ring-blue-200">dependencies</Badge></div>
              <div className="mt-4 space-y-3">
                {data.graphEdges.map((edge, index) => <div key={`${edge.from}-${edge.to}`} className="grid grid-cols-[90px_1fr_70px] items-center gap-3 text-xs">
                  <span className="font-black text-slate-500">{edge.from}</span>
                  <div className="relative h-7 rounded-full bg-slate-100"><div className={`absolute left-0 top-0 h-7 rounded-full ${edge.risk === "high" || edge.risk === "critical" ? "bg-rose-200" : "bg-emerald-200"}`} style={{ width: `${44 + index * 8}%` }} /><span className="absolute inset-0 flex items-center justify-center font-black text-slate-700">{edge.relation}</span></div>
                  <span className="text-right font-black text-slate-500">{edge.to}</span>
                </div>)}
              </div>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between"><h2 className="font-black text-slate-950">Reporting commands</h2><Badge className="bg-violet-50 text-violet-700 ring-violet-200">{data.reportCommands.length}</Badge></div>
              <div className="mt-4 space-y-2">
                {data.reportCommands.map((command) => <div key={command.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-black text-slate-950">{command.title}</h3><p className="text-xs text-slate-500">{command.scope} · {command.cadence}</p></div><Badge className={statusClass(command.status)}>{command.status}</Badge></div>
                  <div className="mt-2 flex flex-wrap gap-1">{command.sections.slice(0, 4).map((section) => <span key={section} className="rounded-lg bg-white px-2 py-1 text-[10px] font-black text-slate-500 ring-1 ring-slate-200">{section}</span>)}</div>
                </div>)}
              </div>
            </article>
          </div>
        </section>

        <aside className="border-t border-slate-200 bg-white p-4 lg:border-l lg:border-t-0" data-widget="sg-task-drawer">
          <div className="flex items-center justify-between gap-2"><h2 className="text-sm font-black text-slate-950">Task drawer</h2><Badge className="bg-emerald-50 text-emerald-700 ring-emerald-200">selected</Badge></div>
          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{selectedTask.id}</p>
            <h3 className="mt-2 text-xl font-black leading-7 text-slate-950">{selectedTask.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{selectedTask.project}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Mini label="Owner" value={selectedTask.owner} />
              <Mini label="Due" value={selectedTask.due} />
              <Mini label="Priority" value={selectedTask.priority} />
              <Mini label="Files" value={`${selectedTask.files}`} sub={`${selectedTask.comments} updates`} />
            </div>
            <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-black text-slate-500">Checklist</span><span className="text-xs font-black text-emerald-600">{selectedTask.progress}%</span></div>
              {["Clarificare owner", "Document evidence", "Manager gate", "Client update"].map((item, index) => <div key={item} className="flex items-center gap-2 py-1 text-xs font-semibold text-slate-600"><span className={`h-3 w-3 rounded ${index < 2 ? "bg-emerald-500" : "bg-slate-200"}`} />{item}</div>)}
            </div>
            <div className="mt-4 rounded-2xl bg-slate-950 p-3 text-white">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-300">Activity composer</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">Scrie update, cere aprobare, atașează evidence sau rulează comandă de status — toate env-gated.</p>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-black text-slate-950">Saved layouts</h2>
            <div className="mt-3 space-y-2">{data.savedLayouts.map((layout) => <div key={layout.id} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200"><div><p className="text-xs font-black text-slate-800">{layout.name}</p><p className="text-[11px] text-slate-500">{layout.scope} · {layout.density}</p></div><span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">{layout.keyboardShortcut}</span></div>)}</div>
          </div>
        </aside>
      </div>
    </section>
  </main>;
}
