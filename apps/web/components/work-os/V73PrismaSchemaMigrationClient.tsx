"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  V73_RELEASE_VERSION,
  V73_STORAGE_KEY,
  applyV73ShadowWrite,
  createV73RuntimeState,
  processV73NotificationQueue,
  v73CurrentReadiness,
  v73GlobalScores,
  v73ProgressScores,
  type V73RuntimeState
} from "@/lib/enterprise/work-os-v73-prisma-schema-migration";

type ViewKey = "overview" | "tables" | "writes" | "rollback" | "queue" | "tasks" | "tickets" | "forms" | "timesheets" | "workload" | "automations" | "reports" | "admin";

const tabs: { key: ViewKey; label: string }[] = [
  { key: "overview", label: "Migration overview" },
  { key: "tables", label: "Shadow tables" },
  { key: "writes", label: "Shadow writes" },
  { key: "rollback", label: "Rollback evidence" },
  { key: "queue", label: "Notification queue" },
  { key: "tasks", label: "Task writes" },
  { key: "tickets", label: "Ticket writes" },
  { key: "forms", label: "Request forms" },
  { key: "timesheets", label: "Timesheets" },
  { key: "workload", label: "Workload" },
  { key: "automations", label: "Automations" },
  { key: "reports", label: "Reports" },
  { key: "admin", label: "Admin migration" }
];

function loadRuntime(): V73RuntimeState {
  if (typeof window === "undefined") return createV73RuntimeState();
  try {
    const raw = window.localStorage.getItem(V73_STORAGE_KEY);
    if (!raw) return createV73RuntimeState();
    const parsed = JSON.parse(raw) as V73RuntimeState;
    if (parsed.version !== V73_RELEASE_VERSION) return createV73RuntimeState();
    return parsed;
  } catch {
    return createV73RuntimeState();
  }
}

function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>{action}</div>
    {children}
  </section>;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></div>;
}

function ProgressRows() {
  return <div className="space-y-4">{v73ProgressScores().slice(0, 8).map((row) => <div key={row.category}><div className="flex justify-between gap-3 text-sm font-black"><span>{row.category}</span><span>{row.current}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.current}%` }} /></div><p className="mt-1 text-xs text-slate-500">{row.progress}</p></div>)}</div>;
}

export function V73PrismaSchemaMigrationClient({ view = "overview" }: { view?: ViewKey }) {
  const [activeView, setActiveView] = useState<ViewKey>(view);
  const [runtime, setRuntime] = useState<V73RuntimeState>(() => createV73RuntimeState());
  const [apiHealth, setApiHealth] = useState("not checked");
  const scores = v73GlobalScores();
  const readiness = v73CurrentReadiness();

  useEffect(() => setRuntime(loadRuntime()), []);
  useEffect(() => {
    try { window.localStorage.setItem(V73_STORAGE_KEY, JSON.stringify(runtime)); } catch {}
  }, [runtime]);

  const delivered = useMemo(() => runtime.notificationQueue.filter((item) => item.status === "delivered").length, [runtime.notificationQueue]);

  async function probeApi() {
    try {
      const response = await fetch("/api/v1/work-os/v73-schema-migration/health", { cache: "no-store" });
      setApiHealth(response.ok ? "ok" : `http ${response.status}`);
    } catch (error) {
      setApiHealth(error instanceof Error ? error.message : "failed");
    }
  }

  function runWrite(entity: string, action = "update") {
    setRuntime((current) => applyV73ShadowWrite(current, { entity, action, payload: { id: `${entity}_${Date.now()}`, source: "v7.3 ui" } }));
  }

  function exportCsv(type: "writes" | "rollback" | "queue" | "tables") {
    const source = type === "writes" ? runtime.shadowWrites : type === "rollback" ? runtime.rollbackCheckpoints : type === "queue" ? runtime.notificationQueue : runtime.tables;
    const csv = [Object.keys(source[0] ?? { empty: "" }).join(","), ...source.map((row) => Object.values(row).map((value) => JSON.stringify(value ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `servelect-v73-${type}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <main className="space-y-7">
    <section className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[0.45em] text-emerald-600">SERVELECT WORK OS · v{V73_RELEASE_VERSION}</p><h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight text-slate-950">Prisma Schema Migration, Shadow Table Writes & Notification Delivery Queue</h1><p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">v7.3.0 continuă strict după v7.2.3: curăță etichetele de versiune, adaugă schema/migration SQL pentru shadow tables, pregătește scrieri pe tabele shadow și introduce notification delivery queue. Primary DB rămâne blocat până la backup, rollback și pilot controlat.</p></div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"><p className="font-black">Runtime status</p><p>v{runtime.version} loaded. Prisma shadow table readiness active.</p><select className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2" value={runtime.writeMode} onChange={() => undefined}><option value="prisma_shadow_tables">prisma_shadow_tables</option></select></div>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-4 lg:grid-cols-7"><Stat label="GoodDay parity" value={`${scores.goodDayParity}%`} /><Stat label="Backend/API" value={`${scores.backendApiReal}%`} /><Stat label="Production" value={`${scores.productionReadiness}%`} /><Stat label="Tables" value={runtime.tables.length} /><Stat label="Shadow writes" value={runtime.shadowWrites.length} /><Stat label="Delivered" value={delivered} /><Stat label="Queue" value={runtime.notificationQueue.length} /></div>
      <div className="mt-6 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.key} onClick={() => setActiveView(tab.key)} className={`rounded-full border px-4 py-2 text-sm font-black ${activeView === tab.key ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-800 hover:border-emerald-300"}`}>{tab.label}</button>)}</div>
    </section>

    <section className="grid gap-7 xl:grid-cols-[1fr_360px]">
      <div className="space-y-7">
        {activeView === "overview" && <Panel title="Migration readiness" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={probeApi}>Probe API</button>}>
          <p className="mb-4 text-sm text-slate-600">API health: <strong>{apiHealth}</strong></p>
          <div className="grid gap-3 md:grid-cols-2">{runtime.gates.map((gate) => <div key={gate.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{gate.label}</p><span className={`rounded-full px-2 py-1 text-xs font-black ${gate.status === "passed" ? "bg-emerald-50 text-emerald-700" : gate.status === "blocked" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{gate.status}</span></div><p className="mt-2 text-sm text-slate-600">{gate.evidence}</p></div>)}</div>
        </Panel>}

        {activeView === "tables" && <Panel title="Prisma shadow table plan" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => exportCsv("tables")}>Export tables CSV</button>}>
          <div className="grid gap-3 md:grid-cols-2">{runtime.tables.map((table) => <div key={table.table} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-black">{table.table}</p><p className="text-sm text-slate-600">{table.entity} · {table.owner}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{table.status}</span></div><p className="mt-3 text-xs text-slate-500">{table.columns.join(", ")}</p><p className="mt-2 text-sm text-slate-600">{table.acceptance}</p></div>)}</div>
        </Panel>}

        {activeView === "writes" && <Panel title="Shadow table writes ledger" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runWrite("task", "update")}>Create task shadow write</button>}>
          <div className="space-y-3">{runtime.shadowWrites.length === 0 && <p className="text-sm text-slate-500">Nu există încă shadow writes în sesiune. Rulează o mutație.</p>}{runtime.shadowWrites.map((write) => <div key={write.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{write.table} · {write.action}</p><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{write.status}</span></div><p className="mt-1 text-xs text-slate-500">{write.id} · rollback {write.rollbackId}</p><p className="mt-2 text-sm text-slate-600">{write.beforeHash} → {write.afterHash}</p></div>)}</div>
        </Panel>}

        {activeView === "rollback" && <Panel title="Rollback checkpoints" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => exportCsv("rollback")}>Export rollback CSV</button>}>
          <div className="space-y-3">{runtime.rollbackCheckpoints.length === 0 && <p className="text-sm text-slate-500">Nu există rollback checkpoint. Creează un shadow write.</p>}{runtime.rollbackCheckpoints.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{item.table} · {item.mode}</p><p className="mt-1 text-sm text-slate-600">{item.evidence}</p><p className="mt-2 text-xs text-slate-500">{item.status} · {item.shadowWriteId}</p></div>)}</div>
        </Panel>}

        {activeView === "queue" && <Panel title="Notification delivery queue" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => setRuntime(processV73NotificationQueue)}>Process queue</button>}>
          <div className="space-y-3">{runtime.notificationQueue.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{item.notificationId}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{item.status}</span></div><p className="mt-1 text-sm text-slate-600">{item.channel} · attempts {item.attempts} · {item.route}</p></div>)}</div>
        </Panel>}

        {activeView === "tasks" && <Panel title="Task shadow table write" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runWrite("task", "create")}>Create task write</button>}><p className="text-sm text-slate-600">Task create/update now targets work_os_shadow_tasks in readiness mode. Primary DB remains gated.</p></Panel>}
        {activeView === "tickets" && <Panel title="Ticket shadow table write" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runWrite("ticket", "update")}>Escalate ticket write</button>}><p className="text-sm text-slate-600">Ticket escalation creates shadow row, rollback checkpoint and notification queue item.</p></Panel>}
        {activeView === "forms" && <Panel title="Request form shadow write" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runWrite("requestForm", "create")}>Submit request write</button>}><p className="text-sm text-slate-600">Request forms are prepared for shadow table writes before client portal storage.</p></Panel>}
        {activeView === "timesheets" && <Panel title="Timesheet shadow write" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runWrite("timeEntry", "create")}>Add time write</button>}><p className="text-sm text-slate-600">Time entries and timesheets are shadow-ready before pontaj/payroll sync.</p></Panel>}
        {activeView === "workload" && <Panel title="Workload after table writes"><div className="grid gap-3 md:grid-cols-3"><Stat label="Capacity source" value="shadow" /><Stat label="Planned writes" value={runtime.shadowWrites.filter((item) => item.entity === "task").length} /><Stat label="Queue" value={runtime.notificationQueue.length} /></div></Panel>}
        {activeView === "automations" && <Panel title="Automation queue readiness" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runWrite("automation", "run",)}>Run automation write</button>}><p className="text-sm text-slate-600">Automation executions are queued as shadow writes. Worker retries remain next-build scope.</p></Panel>}
        {activeView === "reports" && <Panel title="Reports / CSV evidence"><div className="grid gap-3 md:grid-cols-3"><button onClick={() => exportCsv("writes")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Export writes CSV</button><button onClick={() => exportCsv("rollback")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Export rollback CSV</button><button onClick={() => exportCsv("queue")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Export queue CSV</button></div></Panel>}
        {activeView === "admin" && <Panel title="Production gates and NEXT_BUILD_PLAN"><pre className="max-h-[520px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-emerald-100">{JSON.stringify({ readiness, scores, nextBuild: "v7.4.0 - DB-backed Shadow Writes, Notification Worker & Optimistic Locking" }, null, 2)}</pre></Panel>}
      </div>

      <aside className="space-y-6"><Panel title="Progress after v7.3.0"><ProgressRows /></Panel><Panel title="Current gaps"><ul className="list-disc space-y-2 pl-5 text-sm text-slate-600"><li>Primary Prisma writes are still gated.</li><li>Email/push/websocket delivery remains queue-ready, not delivered.</li><li>Attachment storage is not yet real.</li><li>Optimistic locking is planned for v7.4.0.</li></ul></Panel></aside>
    </section>
  </main>;
}

