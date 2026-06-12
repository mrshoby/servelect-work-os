"use client";

import { useMemo, useState } from "react";
import { createShadowWrite, createV74RuntimeState, processV74NotificationQueue, replayRollback, V74EntityKind, V74RuntimeState, v74CurrentReadiness, V74_RELEASE_VERSION, v74GlobalScores, v74ProgressScores } from "@/lib/enterprise/work-os-v74-db-backed-shadow-writes";

type V74View = "overview" | "writes" | "locks" | "queue" | "rollback" | "tasks" | "tickets" | "forms" | "timesheets" | "workload" | "automations" | "reports" | "admin";

const tabs: { key: V74View; label: string }[] = [
  { key: "overview", label: "DB shadow overview" },
  { key: "writes", label: "Shadow writes" },
  { key: "locks", label: "Optimistic locks" },
  { key: "queue", label: "Notification worker" },
  { key: "rollback", label: "Rollback replay" },
  { key: "tasks", label: "Task writes" },
  { key: "tickets", label: "Ticket writes" },
  { key: "forms", label: "Request forms" },
  { key: "timesheets", label: "Timesheets" },
  { key: "workload", label: "Workload" },
  { key: "automations", label: "Automations" },
  { key: "reports", label: "Reports" },
  { key: "admin", label: "Admin DB gate" }
];

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 text-3xl font-black text-slate-950">{value}</p></div>;
}

function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>{action}</div>{children}</section>;
}

function ProgressRows() {
  return <div className="space-y-4">{v74ProgressScores().slice(0, 8).map((row) => <div key={row.category}><div className="flex items-center justify-between gap-4 text-sm font-black"><span>{row.category}</span><span>{row.current}%</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.current}%` }} /></div><p className="mt-1 text-xs text-slate-500">{row.progress}</p></div>)}</div>;
}

function downloadCsv(name: string, rows: Record<string, string | number | undefined>[]) {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => JSON.stringify(row[column] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${name}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

const entitySamples: { entity: V74EntityKind; label: string; action: string; route: string }[] = [
  { entity: "task", label: "Task status update", action: "update_status", route: "/taskuri/overview" },
  { entity: "ticket", label: "Ticket SLA escalation", action: "escalate", route: "/taskuri/tickets-notificari" },
  { entity: "requestForm", label: "Request submission", action: "submit", route: "/taskuri/forms" },
  { entity: "notification", label: "Server notification", action: "queue_delivery", route: "/notifications" },
  { entity: "timesheet", label: "Timesheet approval", action: "approve", route: "/taskuri/timesheets" },
  { entity: "automation", label: "Automation execution", action: "run", route: "/taskuri/automations" }
];

export function V74DbBackedShadowWritesClient({ view = "overview" }: { view?: V74View }) {
  const [activeView, setActiveView] = useState<V74View>(view);
  const [runtime, setRuntime] = useState<V74RuntimeState>(() => createV74RuntimeState());
  const [apiHealth, setApiHealth] = useState("not checked");
  const scores = v74GlobalScores();
  const readiness = v74CurrentReadiness();
  const delivered = runtime.queue.filter((job) => job.status === "delivered").length;
  const activeLocks = runtime.locks.filter((lock) => lock.status === "active").length;

  const lastAudit = useMemo(() => {
    const lastWrite = runtime.shadowWrites[0];
    if (!lastWrite) return "Nu există mutații în această sesiune.";
    return `${lastWrite.entity} ${lastWrite.action} -> ${lastWrite.status} · rollback ${lastWrite.rollbackId}`;
  }, [runtime.shadowWrites]);

  function runWrite(entity: V74EntityKind, action: string, route: string) {
    setRuntime((state) => createShadowWrite(state, { entity, action, route, entityId: entity === "task" ? "SWO-1001" : entity === "ticket" ? "TCK-401" : undefined, payload: { source: "v7.4-ui", route } }));
  }

  async function probeApi() {
    try {
      const response = await fetch("/api/v1/work-os/v74-db-shadow/health", { cache: "no-store" });
      setApiHealth(response.ok ? "ok" : `http ${response.status}`);
    } catch (error) {
      setApiHealth(error instanceof Error ? error.message : "failed");
    }
  }

  function exportReport(kind: "writes" | "locks" | "queue" | "rollback") {
    if (kind === "writes") downloadCsv("v74-shadow-writes", runtime.shadowWrites.map((item) => ({ id: item.id, entity: item.entity, action: item.action, status: item.status, version: item.version, rollbackId: item.rollbackId })));
    if (kind === "locks") downloadCsv("v74-locks", runtime.locks.map((item) => ({ id: item.id, entity: item.entity, entityId: item.entityId, status: item.status, version: item.version })));
    if (kind === "queue") downloadCsv("v74-notification-queue", runtime.queue.map((item) => ({ id: item.id, entity: item.entity, status: item.status, attempts: item.attempts, route: item.route })));
    if (kind === "rollback") downloadCsv("v74-rollback-evidence", runtime.rollbackEvidence.map((item) => ({ id: item.id, writeId: item.writeId, entity: item.entity, status: item.status, evidence: item.evidence })));
  }

  return <main className="mx-auto max-w-7xl space-y-7 p-6 text-slate-900">
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[0.45em] text-emerald-600">SERVELECT WORK OS · v{V74_RELEASE_VERSION}</p><h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight text-slate-950">DB-backed Shadow Writes, Notification Worker & Optimistic Locking</h1><p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">v7.4.0 continuă strict după v7.3.0: leagă contractele de shadow writes de un adapter DB-ready, adaugă optimistic locking pe mutații și introduce worker de notificări cu retry. Primary Prisma writes rămân gated până la backup, rollback și audit de acces.</p></div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"><p className="font-black">Runtime status</p><p>v{runtime.version} loaded. DB shadow locked mode active.</p><select className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2" value={runtime.writeMode} onChange={() => undefined}><option value="db_shadow_locked">db_shadow_locked</option></select></div>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-4 lg:grid-cols-7"><Stat label="GoodDay parity" value={`${scores.goodDayParity}%`} /><Stat label="Backend/API" value={`${scores.backendApiReal}%`} /><Stat label="Production" value={`${scores.productionReadiness}%`} /><Stat label="Writes" value={runtime.shadowWrites.length} /><Stat label="Locks" value={activeLocks} /><Stat label="Delivered" value={delivered} /><Stat label="Queue" value={runtime.queue.length} /></div>
      <div className="mt-6 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.key} onClick={() => setActiveView(tab.key)} className={`rounded-full border px-4 py-2 text-sm font-black ${activeView === tab.key ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-800 hover:border-emerald-300"}`}>{tab.label}</button>)}</div>
    </section>

    <section className="grid gap-7 xl:grid-cols-[1fr_360px]">
      <div className="space-y-7">
        {activeView === "overview" && <Panel title="DB-backed shadow readiness" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={probeApi}>Probe API</button>}><p className="mb-4 text-sm text-slate-600">API health: <strong>{apiHealth}</strong></p><div className="grid gap-3 md:grid-cols-2">{runtime.gates.map((gate) => <div key={gate.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-4"><p className="font-black">{gate.label}</p><span className={`rounded-full px-2 py-1 text-xs font-black ${gate.status === "passed" ? "bg-emerald-50 text-emerald-700" : gate.status === "blocked" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{gate.status}</span></div><p className="mt-2 text-sm text-slate-600">{gate.evidence}</p><p className="mt-2 text-xs text-slate-500">Next: {gate.nextAction}</p></div>)}</div></Panel>}
        {activeView === "writes" && <Panel title="Shadow write ledger" action={<button onClick={() => runWrite("task", "update_status", "/taskuri/overview")} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white">Create shadow write</button>}><div className="space-y-3">{runtime.shadowWrites.length === 0 && <p className="text-sm text-slate-500">Nu există shadow writes în sesiune. Creează o mutație.</p>}{runtime.shadowWrites.map((write) => <div key={write.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{write.entity} · {write.action}</p><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">v{write.version} · {write.status}</span></div><p className="mt-1 text-xs text-slate-500">{write.id} · lock {write.lockId} · rollback {write.rollbackId}</p><p className="mt-2 text-sm text-slate-600">{write.beforeHash} → {write.afterHash}</p></div>)}</div></Panel>}
        {activeView === "locks" && <Panel title="Optimistic locking"><div className="space-y-3">{runtime.locks.length === 0 && <p className="text-sm text-slate-500">Nu există locks încă. Rulează o mutație.</p>}{runtime.locks.map((lock) => <div key={lock.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{lock.entity} {lock.entityId}</p><p className="mt-1 text-sm text-slate-600">version {lock.version} · {lock.status} · owner {lock.ownerId}</p><p className="mt-1 text-xs text-slate-500">expires {lock.expiresAt}</p></div>)}</div></Panel>}
        {activeView === "queue" && <Panel title="Notification delivery worker" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => setRuntime(processV74NotificationQueue)}>Process queue</button>}><div className="space-y-3">{runtime.queue.map((job) => <div key={job.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{job.payloadTitle}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{job.status}</span></div><p className="mt-1 text-sm text-slate-600">{job.channel} · attempts {job.attempts}/{job.maxAttempts} · {job.route}</p>{job.lastError && <p className="mt-1 text-xs text-red-600">{job.lastError}</p>}</div>)}</div></Panel>}
        {activeView === "rollback" && <Panel title="Rollback replay evidence" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runtime.rollbackEvidence[0] && setRuntime((state) => replayRollback(state, runtime.rollbackEvidence[0].id))}>Verify latest rollback</button>}><div className="space-y-3">{runtime.rollbackEvidence.length === 0 && <p className="text-sm text-slate-500">Nu există rollback evidence. Creează un shadow write.</p>}{runtime.rollbackEvidence.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{item.entity} · {item.status}</p><p className="mt-1 text-sm text-slate-600">{item.evidence}</p><p className="mt-1 text-xs text-slate-500">{item.previousHash} → {item.nextHash}</p></div>)}</div></Panel>}
        {activeView === "tasks" && <Panel title="Task DB-shadow writes"><div className="grid gap-3 md:grid-cols-2">{entitySamples.filter((item) => item.entity === "task").map((item) => <button key={item.label} onClick={() => runWrite(item.entity, item.action, item.route)} className="rounded-2xl border border-slate-200 p-4 text-left"><p className="font-black">{item.label}</p><p className="mt-1 text-sm text-slate-600">{item.route}</p></button>)}</div></Panel>}
        {activeView === "tickets" && <Panel title="Ticket DB-shadow writes"><button onClick={() => runWrite("ticket", "escalate", "/taskuri/tickets-notificari")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Escalate TCK-401 with lock + rollback + queue</button></Panel>}
        {activeView === "forms" && <Panel title="Request form shadow writes"><button onClick={() => runWrite("requestForm", "submit", "/taskuri/forms")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Submit request form to DB-shadow adapter</button></Panel>}
        {activeView === "timesheets" && <Panel title="Timesheet DB-shadow writes"><button onClick={() => runWrite("timesheet", "submit", "/taskuri/timesheets")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Submit timesheet shadow write</button></Panel>}
        {activeView === "workload" && <Panel title="Workload after DB-shadow writes"><div className="grid gap-3 md:grid-cols-3"><Stat label="Task writes" value={runtime.shadowWrites.filter((item) => item.entity === "task").length} /><Stat label="Ticket writes" value={runtime.shadowWrites.filter((item) => item.entity === "ticket").length} /><Stat label="Queue" value={runtime.queue.length} /></div></Panel>}
        {activeView === "automations" && <Panel title="Automation worker readiness" action={<button onClick={() => runWrite("automation", "run_rule", "/taskuri/automations")} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white">Run automation write</button>}><p className="text-sm text-slate-600">Automation executions create DB-shadow records and notification queue jobs. Real background worker provider remains gated.</p></Panel>}
        {activeView === "reports" && <Panel title="Reports / CSV evidence"><div className="grid gap-3 md:grid-cols-4"><button onClick={() => exportReport("writes")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Export writes CSV</button><button onClick={() => exportReport("locks")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Export locks CSV</button><button onClick={() => exportReport("queue")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Export queue CSV</button><button onClick={() => exportReport("rollback")} className="rounded-2xl border border-slate-200 p-4 text-left font-black">Export rollback CSV</button></div></Panel>}
        {activeView === "admin" && <Panel title="Production gates and NEXT_BUILD_PLAN"><pre className="max-h-[520px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-emerald-100">{JSON.stringify({ readiness, scores, nextBuild: "v7.5.0 - Conflict Resolution, Access Inheritance & Real Attachment Storage" }, null, 2)}</pre></Panel>}
      </div>
      <aside className="space-y-6"><Panel title="Audit stream"><p className="text-sm text-slate-600">{lastAudit}</p></Panel><Panel title="Progress after v7.4.0"><ProgressRows /></Panel><Panel title="Current gaps"><ul className="list-disc space-y-2 pl-5 text-sm text-slate-600"><li>Primary Prisma writes remain gated.</li><li>Email/push/websocket providers are not active.</li><li>Attachment storage is not yet real.</li><li>Conflict resolution UI is next-build scope.</li></ul></Panel></aside>
    </section>
  </main>;
}
