"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  applyV71Mutation,
  buildMutationRequest,
  calculateV70Workload,
  createV71InitialState,
  createV71Snapshot,
  exportV70Csv,
  v71BuildReportStandard,
  v71DomainStatus,
  v71GlobalScores,
  v71ProgressScores,
  V71_RELEASE_VERSION,
  type V71AuditEvent,
  type V71MutationAction,
  type V71MutationEntity,
  type V71WriteMode
} from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";
import type { V70State } from "@/lib/enterprise/work-os-v70-goodday-parity-hardening";

export type V71BackendView = "overview" | "tasks" | "tickets" | "forms" | "notifications" | "workflows" | "custom-fields" | "saved-views" | "timesheets" | "workload" | "automations" | "reports" | "admin";

const views: { id: V71BackendView; label: string; route: string }[] = [
  { id: "overview", label: "Backend overview", route: "/work-os/backend-mutations" },
  { id: "tasks", label: "Task mutations", route: "/taskuri/overview" },
  { id: "tickets", label: "Tickets API", route: "/taskuri/tickets-notificari" },
  { id: "forms", label: "Request forms", route: "/taskuri/forms" },
  { id: "notifications", label: "Server notifications", route: "/notifications" },
  { id: "workflows", label: "Workflows", route: "/admin/workflows" },
  { id: "custom-fields", label: "Custom fields", route: "/admin/custom-fields" },
  { id: "saved-views", label: "Saved views", route: "/taskuri/tabel" },
  { id: "timesheets", label: "Timesheets", route: "/taskuri/timesheets" },
  { id: "workload", label: "Workload", route: "/taskuri/workload-aprobari" },
  { id: "automations", label: "Automations", route: "/taskuri/automations" },
  { id: "reports", label: "Reports", route: "/taskuri/reports" },
  { id: "admin", label: "Admin adapter", route: "/admin/backend-mutations" }
];

function loadInitialState() {
  if (typeof window === "undefined") return createV71InitialState();
  const raw = window.localStorage.getItem("servelect-work-os-v71-runtime-state");
  if (!raw) return createV71InitialState();
  try {
    return JSON.parse(raw) as V70State;
  } catch {
    return createV71InitialState();
  }
}

function saveState(state: V70State) {
  if (typeof window !== "undefined") window.localStorage.setItem("servelect-work-os-v71-runtime-state", JSON.stringify(state));
}

function Panel(props: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold text-slate-950">{props.title}</h2>{props.action}</div>{props.children}</section>;
}

function Pill(props: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return <button onClick={props.onClick} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${props.active ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}>{props.children}</button>;
}

export function V71BackendMutationAdapterClient({ view = "overview" }: { view?: V71BackendView }) {
  const [state, setState] = useState<V70State>(() => loadInitialState());
  const [writeMode, setWriteMode] = useState<V71WriteMode>("api_shadow");
  const [selectedView, setSelectedView] = useState<V71BackendView>(view);
  const [audit, setAudit] = useState<V71AuditEvent[]>([]);
  const [lastMessage, setLastMessage] = useState("v7.1.0 loaded. API shadow adapter active.");
  const [apiStatus, setApiStatus] = useState("not checked");

  const scores = v71GlobalScores();
  const workload = useMemo(() => calculateV70Workload(state), [state]);
  const snapshot = useMemo(() => createV71Snapshot(writeMode), [writeMode]);
  const activeView = selectedView;

  function runMutation(entity: V71MutationEntity, action: V71MutationAction, payload: Record<string, unknown> = {}) {
    const request = buildMutationRequest(entity, action, payload, "u_andrei", "Super Admin", "Management", writeMode);
    const result = applyV71Mutation(state, request);
    if (result.data) {
      const next = result.data as V70State;
      setState(next);
      saveState(next);
    }
    setAudit((items) => [result.auditEvent, ...items].slice(0, 12));
    setLastMessage(result.message);
  }

  async function probeApi() {
    try {
      const response = await fetch("/api/v1/work-os/v71-mutations/health", { cache: "no-store" });
      setApiStatus(`${response.status} ${response.ok ? "OK" : "FAIL"}`);
    } catch (error) {
      setApiStatus(error instanceof Error ? error.message : "API probe failed");
    }
  }

  function exportCsv(type: "tasks" | "tickets" | "workload" | "timesheets") {
    const blob = new Blob([exportV70Csv(state, type)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `servelect-v71-${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    runMutation("task", "read", { export: type });
  }

  return <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
    <section className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-emerald-600">SERVELECT WORK OS · v{V71_RELEASE_VERSION}</p>
          <h1 className="text-3xl font-black text-slate-950">Backend Mutation Adapter, Server Notifications & Multi-User Records</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">v7.1.0 mută funcțiile GoodDay-like din local-only către contracte API, repository adapter, audit events, server notification readiness și RBAC pe mutații. Prisma primary rămâne gated până la rollout controlat.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-black">Runtime status</p>
          <p>{lastMessage}</p>
          <select value={writeMode} onChange={(event) => setWriteMode(event.target.value as V71WriteMode)} className="mt-3 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2">
            <option value="local_persistent">local_persistent</option>
            <option value="api_shadow">api_shadow</option>
            <option value="prisma_shadow_ready">prisma_shadow_ready</option>
            <option value="prisma_primary_gated">prisma_primary_gated</option>
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-7">
        <Metric label="GoodDay parity" value={`${scores.goodDayParity}%`} />
        <Metric label="Local real" value={`${scores.realLocalFunctionality}%`} />
        <Metric label="Backend/API" value={`${scores.backendApiReal}%`} />
        <Metric label="Production" value={`${scores.productionReadiness}%`} />
        <Metric label="Tasks" value={String(state.tasks.length)} />
        <Metric label="Tickets" value={String(state.tickets.length)} />
        <Metric label="Unread" value={String(state.notifications.filter((item) => !item.read).length)} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {views.map((item) => <Pill key={item.id} active={activeView === item.id} onClick={() => setSelectedView(item.id)}>{item.label}</Pill>)}
      </div>
    </section>

    <section className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-6">
        {activeView === "overview" && <Panel title="Mutation adapter readiness" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={probeApi}>Probe API</button>}>
          <p className="mb-4 text-sm text-slate-600">API health: <span className="font-black text-slate-950">{apiStatus}</span></p>
          <div className="grid gap-3 md:grid-cols-2">
            {v71DomainStatus().map((domain) => <div key={domain.domain} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between"><p className="font-black">{domain.domain}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{domain.score}%</span></div><p className="mt-1 text-xs text-slate-500">{domain.apiRoute}</p><p className="mt-2 text-sm text-slate-600">{domain.backendTarget} · risc {domain.risk}</p></div>)}
          </div>
        </Panel>}

        {activeView === "tasks" && <Panel title="Task mutations" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("task", "create", { title: "Task creat prin v7.1 API shadow" })}>Create task</button>}>
          <div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Task</th><th>Status</th><th>Priority</th><th>Due</th><th>Action</th></tr></thead><tbody>{state.tasks.map((task) => <tr key={task.id} className="border-t border-slate-100"><td className="p-3 font-black">{task.code} · {task.title}</td><td className="p-3">{task.status}</td><td className="p-3">{task.priority}</td><td className="p-3">{task.dueDate}</td><td className="p-3"><button className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700" onClick={() => runMutation("task", "update", { taskId: task.id, comment: "Comentariu generat de v7.1 adapter" })}>Update</button></td></tr>)}</tbody></table></div>
        </Panel>}

        {activeView === "tickets" && <Panel title="Tickets / Requests server adapter" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("ticket", "create", { title: "Ticket creat prin API shadow", severity: "High" })}>Create ticket</button>}>
          <div className="grid gap-3 md:grid-cols-2">{state.tickets.map((ticket) => <div key={ticket.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{ticket.code} · {ticket.title}</p><p className="text-sm text-slate-500">{ticket.status} · {ticket.severity} · SLA {ticket.slaDueAt}</p><div className="mt-3 flex gap-2"><button className="rounded-full border px-3 py-1 text-xs font-bold" onClick={() => runMutation("ticket", "update", { ticketId: ticket.id, status: "Escaladat" })}>Escalate</button><button className="rounded-full border px-3 py-1 text-xs font-bold" onClick={() => runMutation("ticket", "convert", { ticketId: ticket.id })}>Convert to task</button></div></div>)}</div>
        </Panel>}

        {activeView === "forms" && <Panel title="Request forms and submissions" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("requestForm", "create", { name: "Formular client v7.1" })}>Create form</button>}>
          <div className="grid gap-3 md:grid-cols-2">{state.requestForms.map((form) => <div key={form.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{form.name}</p><p className="text-sm text-slate-500">Target {form.target} · {form.department} · submissions {form.submissions}</p><button className="mt-3 rounded-full border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700" onClick={() => runMutation("requestForm", "update", { formId: form.id })}>Submit demo request</button></div>)}</div>
        </Panel>}

        {activeView === "notifications" && <Panel title="Server notification model" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("notification", "markRead", {})}>Mark all read</button>}>
          <div className="space-y-3">{state.notifications.map((item) => <div key={item.id} className={`rounded-2xl border p-4 ${item.read ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50"}`}><p className="font-black">{item.title}</p><p className="text-sm text-slate-600">{item.body}</p><p className="text-xs text-slate-400">{item.route}</p></div>)}</div>
        </Panel>}

        {activeView === "workflows" && <Panel title="Workflow mutation and validation gates" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("workflow", "update", {})}>Harden workflow</button>}>
          {state.workflows.map((workflow) => <div key={workflow.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{workflow.name}</p><p className="text-sm text-slate-500">Approval gates: {workflow.approvalGateStatuses.join(", ")}</p><div className="mt-3 flex flex-wrap gap-2">{Object.entries(workflow.transitions).slice(0, 8).map(([from, to]) => <span key={from} className="rounded-full border px-3 py-1 text-xs font-bold">{from} → {to.join(" / ") || "locked"}</span>)}</div></div>)}
        </Panel>}

        {activeView === "custom-fields" && <Panel title="Custom fields and task types API" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("customField", "create", { name: "Camp API v7.1" })}>Add field</button>}>
          <div className="grid gap-3 md:grid-cols-2">{state.customFields.map((field) => <div key={field.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{field.name}</p><p className="text-sm text-slate-500">{field.type} · {field.required ? "required" : "optional"}</p></div>)}</div>
        </Panel>}

        {activeView === "saved-views" && <Panel title="Saved views server-ready CRUD" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("savedView", "create", { name: "View API v7.1", shared: true })}>Create saved view</button>}>
          <div className="space-y-3">{state.savedViews.map((viewItem) => <div key={viewItem.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{viewItem.name}</p><p className="text-sm text-slate-500">{viewItem.scope} · {viewItem.shared ? "shared" : "private"} · {viewItem.route}</p><button className="mt-2 text-xs font-bold text-red-600" onClick={() => runMutation("savedView", "delete", { viewId: viewItem.id })}>delete</button></div>)}</div>
        </Panel>}

        {activeView === "timesheets" && <Panel title="Time tracking and timesheet API" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("timeEntry", "create", { minutes: 45, note: "Lucru v7.1" })}>Add time</button>}>
          <div className="grid gap-3 md:grid-cols-2">{state.timesheets.map((sheet) => <div key={sheet.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{sheet.id}</p><p className="text-sm text-slate-500">{sheet.status} · {sheet.totalMinutes} min</p><div className="mt-3 flex gap-2"><button className="rounded-full border px-3 py-1 text-xs font-bold" onClick={() => runMutation("timesheet", "update", { timesheetId: sheet.id })}>Submit</button><button className="rounded-full border px-3 py-1 text-xs font-bold" onClick={() => runMutation("timesheet", "approve", { timesheetId: sheet.id })}>Approve</button></div></div>)}</div>
        </Panel>}

        {activeView === "workload" && <Panel title="Workload after mutations"><div className="grid gap-3 md:grid-cols-2">{workload.map((row) => <div key={row.user.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{row.user.name}</p><span className="font-black">{row.utilization}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(row.utilization, 100)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{row.assignedTasks.length} taskuri · {row.plannedMinutes} / {row.capacityMinutes} min</p></div>)}</div></Panel>}

        {activeView === "automations" && <Panel title="Automation shadow runs" action={<button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => runMutation("automation", "run", { automationId: state.automations[0]?.id })}>Run rule</button>}>
          <div className="grid gap-3 md:grid-cols-2">{state.automations.map((rule) => <div key={rule.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{rule.name}</p><p className="text-sm text-slate-500">{rule.trigger} → {rule.action} · runs {rule.runs}</p></div>)}</div>
        </Panel>}

        {activeView === "reports" && <Panel title="Reports and CSV export"><div className="grid gap-3 md:grid-cols-2">{(["tasks", "tickets", "workload", "timesheets"] as const).map((type) => <button key={type} onClick={() => exportCsv(type)} className="rounded-2xl border border-slate-200 p-5 text-left font-black hover:border-emerald-300">Export {type} CSV</button>)}</div></Panel>}

        {activeView === "admin" && <Panel title="Production gates and next build plan"><pre className="max-h-[420px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-emerald-100">{JSON.stringify({ snapshot: { version: snapshot.version, writeMode: snapshot.writeMode }, report: v71BuildReportStandard(), scores: v71ProgressScores() }, null, 2)}</pre></Panel>}
      </div>

      <aside className="space-y-6">
        <Panel title="Audit stream">
          <div className="space-y-3">{audit.length === 0 && <p className="text-sm text-slate-500">Nu există mutații în această sesiune.</p>}{audit.map((event) => <div key={event.id} className="rounded-2xl border border-slate-200 p-3"><p className="text-sm font-black">{event.entity} · {event.action} · {event.status}</p><p className="text-xs text-slate-500">{event.message}</p></div>)}</div>
        </Panel>
        <Panel title="Progress after v7.1.0">
          <div className="space-y-3">{v71ProgressScores().slice(0, 8).map((row) => <div key={row.category}><div className="flex justify-between text-xs font-bold"><span>{row.category}</span><span>{row.current}%</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.current}%` }} /></div></div>)}</div>
        </Panel>
      </aside>
    </section>
  </main>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p></div>;
}
