"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  applyV72ShadowMutation,
  calculateV72Workload,
  createV72RuntimeState,
  exportV72Csv,
  markV72ServerNotificationRead,
  rollbackV72ShadowRecord,
  v72BuildReportStandard,
  v72DomainStatus,
  v72GlobalScores,
  v72ProgressScores,
  V72_RELEASE_VERSION,
  V72_STORAGE_KEY,
  type V72RuntimeState
} from "@/lib/enterprise/work-os-v72-prisma-shadow-records";
import type { V71MutationAction, V71MutationEntity, V71WriteMode } from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";

export type V72ShadowView = "overview" | "records" | "rollback" | "notifications" | "tasks" | "tickets" | "forms" | "timesheets" | "workload" | "automations" | "reports" | "admin";

const viewTabs: { id: V72ShadowView; label: string; route: string }[] = [
  { id: "overview", label: "Shadow overview", route: "/work-os/prisma-shadow-records" },
  { id: "records", label: "Shadow records", route: "/work-os/prisma-shadow-records" },
  { id: "rollback", label: "Rollback evidence", route: "/work-os/prisma-shadow-records" },
  { id: "notifications", label: "Server notifications", route: "/notifications" },
  { id: "tasks", label: "Task shadow writes", route: "/taskuri/overview" },
  { id: "tickets", label: "Ticket shadow writes", route: "/taskuri/tickets-notificari" },
  { id: "forms", label: "Request forms", route: "/taskuri/forms" },
  { id: "timesheets", label: "Timesheets", route: "/taskuri/timesheets" },
  { id: "workload", label: "Workload", route: "/taskuri/workload-aprobari" },
  { id: "automations", label: "Automations", route: "/taskuri/automations" },
  { id: "reports", label: "Reports", route: "/taskuri/reports" },
  { id: "admin", label: "Admin shadow", route: "/admin/prisma-shadow-records" }
];

function loadRuntime() {
  if (typeof window === "undefined") return createV72RuntimeState();
  const raw = window.localStorage.getItem(V72_STORAGE_KEY);
  if (!raw) return createV72RuntimeState();
  try {
    return JSON.parse(raw) as V72RuntimeState;
  } catch {
    return createV72RuntimeState();
  }
}

function saveRuntime(runtime: V72RuntimeState) {
  if (typeof window !== "undefined") window.localStorage.setItem(V72_STORAGE_KEY, JSON.stringify(runtime));
}

function Panel(props: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold text-slate-950">{props.title}</h2>{props.action}</div>{props.children}</section>;
}

function Pill(props: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return <button onClick={props.onClick} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${props.active ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}>{props.children}</button>;
}

function Metric(props: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">{props.label}</p><p className="mt-1 text-2xl font-black text-slate-950">{props.value}</p></div>;
}

function ProgressRows() {
  return <div className="space-y-3">{v72ProgressScores().slice(0, 8).map((item) => <div key={item.category}><div className="flex justify-between text-sm font-black"><span>{item.category}</span><span>{item.current}%</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.current}%` }} /></div><p className="mt-1 text-xs text-slate-500">{item.progress}</p></div>)}</div>;
}

export function V72PrismaShadowRecordsClient({ view = "overview" }: { view?: V72ShadowView }) {
  const [runtime, setRuntime] = useState<V72RuntimeState>(() => loadRuntime());
  const [activeView, setActiveView] = useState<V72ShadowView>(view);
  const [apiStatus, setApiStatus] = useState("not checked");
  const scores = v72GlobalScores();
  const workload = useMemo(() => calculateV72Workload(runtime), [runtime]);
  const report = useMemo(() => v72BuildReportStandard(), []);

  function commitRuntime(next: V72RuntimeState) {
    setRuntime(next);
    saveRuntime(next);
  }

  function runShadow(entity: V71MutationEntity, action: V71MutationAction, payload: Record<string, unknown> = {}) {
    const outcome = applyV72ShadowMutation(runtime, { entity, action, payload, writeMode: runtime.writeMode });
    commitRuntime(outcome.runtime);
  }

  function changeWriteMode(mode: V71WriteMode) {
    commitRuntime({ ...runtime, writeMode: mode, generatedAt: new Date().toISOString() });
  }

  function rollbackFirst() {
    const record = runtime.shadowRecords.find((item) => item.status === "shadow_written");
    if (!record) return;
    commitRuntime(rollbackV72ShadowRecord(runtime, record.id));
  }

  function markAllRead() {
    commitRuntime(markV72ServerNotificationRead(runtime));
  }

  function exportCsv(type: "shadow" | "rollback" | "notifications" | "tasks" | "tickets" | "workload" | "timesheets") {
    const blob = new Blob([exportV72Csv(runtime, type)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `servelect-v72-${type}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function probeApi() {
    try {
      const response = await fetch("/api/v1/work-os/v72-shadow-records/health", { cache: "no-store" });
      setApiStatus(`${response.status} ${response.ok ? "OK" : "FAIL"}`);
    } catch (error) {
      setApiStatus(error instanceof Error ? error.message : "API probe failed");
    }
  }

  return <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
    <section className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-emerald-600">SERVELECT WORK OS · v{V72_RELEASE_VERSION}</p>
          <h1 className="text-3xl font-black text-slate-950">Prisma Shadow Records, Rollback Evidence & Server Notification Store</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">v7.2.3 continuă exact după v7.1.1: adaugă ledger de shadow records, rollback evidence și server notification store. Primary DB rămâne blocat până când există migration, backup și rollback confirmat.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-black">Runtime status</p>
          <p>v{runtime.version} loaded. Prisma shadow readiness active.</p>
          <select value={runtime.writeMode} onChange={(event) => changeWriteMode(event.target.value as V71WriteMode)} className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2">
            <option value="local_persistent">local_persistent</option>
            <option value="api_shadow">api_shadow</option>
            <option value="prisma_shadow_ready">prisma_shadow_ready</option>
            <option value="prisma_primary_gated">prisma_primary_gated</option>
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-7">
        <Metric label="GoodDay parity" value={`${scores.goodDayParity}%`} />
        <Metric label="Backend/API" value={`${scores.backendApiReal}%`} />
        <Metric label="Production" value={`${scores.productionReadiness}%`} />
        <Metric label="Shadow records" value={String(runtime.shadowRecords.length)} />
        <Metric label="Rollback" value={String(runtime.rollbackEvidence.length)} />
        <Metric label="Server notif." value={String(runtime.serverNotifications.length)} />
        <Metric label="Unread" value={String(runtime.serverNotifications.filter((item) => !item.read).length)} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{viewTabs.map((tab) => <Pill key={tab.id} active={activeView === tab.id} onClick={() => setActiveView(tab.id)}>{tab.label}</Pill>)}</div>
    </section>

    <section className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-6">
        {activeView === "overview" && <Panel title="Prisma shadow readiness" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={probeApi}>Probe API</button>}>
          <p className="mb-4 text-sm text-slate-600">API health: <span className="font-black text-slate-950">{apiStatus}</span></p>
          <div className="grid gap-3 md:grid-cols-2">{v72DomainStatus().map((domain) => <div key={domain.domain} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{domain.domain}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{domain.score}%</span></div><p className="mt-1 text-xs text-slate-500">{domain.apiRoute}</p><p className="mt-2 text-sm text-slate-600">{domain.backendTarget} · risc {domain.risk}</p></div>)}</div>
        </Panel>}

        {activeView === "records" && <Panel title="Shadow records ledger" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runShadow("task", "update", { taskId: "t_pif_docs", comment: "Shadow ledger probe v7.2" })}>Create shadow record</button>}>
          <div className="space-y-3">{runtime.shadowRecords.length === 0 && <p className="text-sm text-slate-500">Nu există încă shadow records. Rulează o mutație.</p>}{runtime.shadowRecords.map((record) => <div key={record.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{record.entity} · {record.action}</p><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{record.status}</span></div><p className="mt-1 text-xs text-slate-500">{record.id} · rollback {record.rollbackEvidenceId}</p><p className="mt-2 text-sm text-slate-600">before {record.beforeHash} → after {record.afterHash}</p></div>)}</div>
        </Panel>}

        {activeView === "rollback" && <Panel title="Rollback evidence" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={rollbackFirst}>Rollback first available</button>}>
          <div className="space-y-3">{runtime.rollbackEvidence.length === 0 && <p className="text-sm text-slate-500">Nu există rollback evidence. Creează un shadow record.</p>}{runtime.rollbackEvidence.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{item.entity} · {item.rollbackMode}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{item.evidenceStatus}</span></div><p className="mt-1 text-xs text-slate-500">{item.reason}</p><p className="mt-2 text-sm text-slate-600">{item.beforeHash} → {item.afterHash}</p></div>)}</div>
        </Panel>}

        {activeView === "notifications" && <Panel title="Server notification store" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={markAllRead}>Mark all read</button>}>
          <div className="space-y-3">{runtime.serverNotifications.map((notification) => <div key={notification.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{notification.title}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{notification.read ? "read" : "unread"}</span></div><p className="mt-1 text-sm text-slate-600">{notification.body}</p><p className="mt-2 text-xs text-slate-500">{notification.delivery} · {notification.route}</p></div>)}</div>
        </Panel>}

        {activeView === "tasks" && <Panel title="Task shadow mutations" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runShadow("task", "create", { title: "Task creat în Prisma shadow v7.2", estimateMinutes: 180 })}>Create task shadow</button>}>
          <div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Task</th><th>Status</th><th>Priority</th><th>Due</th><th>Action</th></tr></thead><tbody>{runtime.v70State.tasks.map((task) => <tr key={task.id} className="border-t border-slate-100"><td className="p-3 font-black">{task.code} · {task.title}</td><td className="p-3">{task.status}</td><td className="p-3">{task.priority}</td><td className="p-3">{task.dueDate}</td><td className="p-3"><button className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700" onClick={() => runShadow("task", "update", { taskId: task.id, comment: "Update prin v7.2 shadow" })}>Update</button></td></tr>)}</tbody></table></div>
        </Panel>}

        {activeView === "tickets" && <Panel title="Ticket shadow writes" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runShadow("ticket", "create", { title: "Ticket creat în shadow v7.2", severity: "High" })}>Create ticket shadow</button>}>
          <div className="grid gap-3 md:grid-cols-2">{runtime.v70State.tickets.map((ticket) => <div key={ticket.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{ticket.code} · {ticket.title}</p><p className="mt-1 text-sm text-slate-600">{ticket.status} · {ticket.severity} · SLA {ticket.slaDueAt}</p><div className="mt-3 flex gap-2"><button className="rounded-full border px-3 py-1 text-xs font-bold" onClick={() => runShadow("ticket", "update", { ticketId: ticket.id, status: "Escaladat" })}>Escalate</button><button className="rounded-full border px-3 py-1 text-xs font-bold" onClick={() => runShadow("ticket", "convert", { ticketId: ticket.id })}>Convert to task</button></div></div>)}</div>
        </Panel>}

        {activeView === "forms" && <Panel title="Request form shadow submissions" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runShadow("requestForm", "create", { title: "Formular nou v7.2" })}>Create form</button>}>
          <div className="grid gap-3 md:grid-cols-2">{runtime.v70State.requestForms.map((form) => <div key={form.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{form.name}</p><p className="text-sm text-slate-600">Target {form.target} · Department {form.department} · submissions {form.submissions}</p><button className="mt-3 rounded-full border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700" onClick={() => runShadow("requestForm", "create", { formId: form.id, client: "Demo Client", problem: "Cerere shadow" })}>Submit demo request</button></div>)}</div>
        </Panel>}

        {activeView === "timesheets" && <Panel title="Timesheet shadow records" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runShadow("timeEntry", "create", { minutes: 45, taskId: "t_pif_docs" })}>Add time</button>}>
          <div className="grid gap-3 md:grid-cols-2">{runtime.v70State.timesheets.map((sheet) => <div key={sheet.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{sheet.id}</p><p className="text-sm text-slate-600">{sheet.status} · {sheet.totalMinutes} min</p><div className="mt-3 flex gap-2"><button className="rounded-full border px-3 py-1 text-xs font-bold" onClick={() => runShadow("timesheet", "update", { timesheetId: sheet.id, status: "Submitted" })}>Submit</button><button className="rounded-full border px-3 py-1 text-xs font-bold" onClick={() => runShadow("timesheet", "approve", { timesheetId: sheet.id })}>Approve</button></div></div>)}</div>
        </Panel>}

        {activeView === "workload" && <Panel title="Workload from shadow-ready records">
          <div className="grid gap-3 md:grid-cols-2">{workload.map((row) => <div key={row.user.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between font-black"><span>{row.user.name}</span><span>{row.utilization}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(row.utilization, 100)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{row.assignedTasks.length} taskuri · {row.plannedMinutes} / {row.capacityMinutes} min</p></div>)}</div>
        </Panel>}

        {activeView === "automations" && <Panel title="Automation shadow execution" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runShadow("automation", "run", { automationId: "auto_iot_ticket" })}>Run automation test</button>}>
          <div className="grid gap-3 md:grid-cols-2">{runtime.v70State.automations.map((rule) => <div key={rule.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{rule.name}</p><p className="text-sm text-slate-600">{rule.trigger} → {rule.action} · runs {rule.runs}</p></div>)}</div>
        </Panel>}

        {activeView === "reports" && <Panel title="Reports / CSV evidence">
          <div className="grid gap-3 md:grid-cols-3">{(["shadow", "rollback", "notifications", "tasks", "tickets", "workload", "timesheets"] as const).map((type) => <button key={type} onClick={() => exportCsv(type)} className="rounded-2xl border border-slate-200 p-4 text-left font-black hover:border-emerald-300">Export {type} CSV</button>)}</div>
        </Panel>}

        {activeView === "admin" && <Panel title="Production gates and next build plan"><pre className="max-h-[460px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-emerald-100">{JSON.stringify({ snapshot: { version: V72_RELEASE_VERSION, writeMode: runtime.writeMode, shadowRecords: runtime.shadowRecords.length, rollbackEvidence: runtime.rollbackEvidence.length, serverNotifications: runtime.serverNotifications.length }, report }, null, 2)}</pre></Panel>}
      </div>

      <aside className="space-y-6">
        <Panel title="Audit stream"><div className="space-y-3">{runtime.auditEvents.length === 0 && <p className="text-sm text-slate-500">Nu există mutații în această sesiune.</p>}{runtime.auditEvents.slice(0, 8).map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 p-3"><p className="font-black">{item.entity} · {item.action}</p><p className="text-xs text-slate-500">{item.status} · {item.message}</p></div>)}</div></Panel>
        <Panel title="Progress after v7.2"><ProgressRows /></Panel>
      </aside>
    </section>
  </main>;
}

