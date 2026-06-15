"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  approveV79SharedViewAcl,
  calculateV79Workload,
  createV79RuntimeState,
  createV79SharedView,
  runV79PrimaryWritePilot,
  runV79ProviderCanary,
  transitionV79Task,
  v79CurrentReadiness,
  v79GlobalScores,
  v79ProgressScores,
  type V79AclScope,
  type V79ProviderKind,
  type V79RuntimeState,
  type V79TaskStatus,
  type V79View
} from "@/lib/enterprise/work-os-v79-primary-write-pilot";

const statuses: V79TaskStatus[] = ["Inbox", "Planning", "In lucru", "Review", "Blocat", "Finalizat"];
const providers: V79ProviderKind[] = ["in_app", "email", "push", "websocket"];

function routeForView(view: V79View): string {
  const map: Record<V79View, string> = {
    taskuri: "/taskuri", overview: "/taskuri/overview", myWork: "/taskuri/my-work", inbox: "/taskuri/inbox", tickets: "/taskuri/tickets", ticketsNotificari: "/taskuri/tickets-notificari", board: "/taskuri/board", tabel: "/taskuri/tabel", calendar: "/taskuri/calendar", calendarGantt: "/taskuri/calendar-gantt", workload: "/taskuri/workload", workloadAprobari: "/taskuri/workload-aprobari", proiecteActive: "/taskuri/proiecte-active", proiecteViitoare: "/taskuri/proiecte-viitoare", proiecteFinalizate: "/taskuri/proiecte-finalizate", forms: "/taskuri/forms", timesheets: "/taskuri/timesheets", reports: "/taskuri/reports", automations: "/taskuri/automations",
    workflows: "/admin/workflows", customFields: "/admin/custom-fields", gooddayObservability: "/admin/goodday-observability", serverSavedViews: "/admin/server-saved-views", providerTelemetry: "/admin/provider-telemetry", providerCanaryAdmin: "/admin/provider-canary", sharedViewAclAdmin: "/admin/shared-view-acl", primaryWritePilotAdmin: "/admin/primary-write-pilot",
    gooddayUiParity: "/work-os/goodday-ui-parity", providerRehearsal: "/work-os/provider-rehearsal", primaryWriteDryRun: "/work-os/primary-write-dry-run", mutationCanary: "/work-os/mutation-canary", providerCanary: "/work-os/provider-canary", sharedViewAcl: "/work-os/shared-view-acl", primaryWritePilot: "/work-os/primary-write-pilot"
  };
  return map[view];
}

function tone(value: string): "green" | "amber" | "red" | "blue" | "slate" | "purple" {
  if (["ready", "passed", "server_synced", "live_ready", "Finalizat", "canary_allowed", "pilot_write_ready"].includes(value)) return "green";
  if (["dry_run", "canary", "running", "local_shadow", "Planning", "Review", "warning", "shadow_only"].includes(value)) return "amber";
  if (["blocked", "failed", "rolled_back", "Blocat", "Urgent", "denied", "acl_conflict"].includes(value)) return "red";
  if (["team", "department", "global", "In lucru"].includes(value)) return "blue";
  if (["private"].includes(value)) return "purple";
  return "slate";
}

function Badge({ children, toneName = "slate" }: { children: ReactNode; toneName?: "green" | "amber" | "red" | "blue" | "slate" | "purple" }) {
  const classes = { green: "border-emerald-200 bg-emerald-50 text-emerald-700", amber: "border-amber-200 bg-amber-50 text-amber-700", red: "border-rose-200 bg-rose-50 text-rose-700", blue: "border-sky-200 bg-sky-50 text-sky-700", purple: "border-violet-200 bg-violet-50 text-violet-700", slate: "border-slate-200 bg-slate-50 text-slate-600" };
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide ${classes[toneName]}`}>{children}</span>;
}

function Button({ children, onClick, primary = false }: { children: ReactNode; onClick?: () => void; primary?: boolean }) {
  return <button type="button" onClick={onClick} className={`rounded-xl px-3 py-2 text-xs font-black transition ${primary ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{children}</button>;
}

function Panel({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-sm font-black text-slate-950">{title}</h2>{right}</div>{children}</section>;
}

function Metric({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[11px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{helper}</p></div>;
}

export function V79PrimaryWritePilotClient({ view = "overview" }: { view?: V79View }) {
  const [state, setState] = useState<V79RuntimeState>(() => createV79RuntimeState());
  const [selectedProvider, setSelectedProvider] = useState<V79ProviderKind>("email");
  const route = routeForView(view);
  const scores = useMemo(() => v79ProgressScores(), []);
  const globals = useMemo(() => v79GlobalScores(), []);
  const readiness = useMemo(() => v79CurrentReadiness(), []);
  const workload = useMemo(() => calculateV79Workload(state), [state]);

  const runProvider = (provider?: V79ProviderKind) => setState((current) => runV79ProviderCanary(current, provider));
  const runPilot = (entity: "task" | "ticket" | "saved_view" | "notification" | "timesheet" = "task") => setState((current) => runV79PrimaryWritePilot(current, entity));
  const saveAcl = (scope: V79AclScope) => setState((current) => createV79SharedView(current, route, scope));
  const approveAcl = (viewId: string) => setState((current) => approveV79SharedViewAcl(current, viewId));
  const transition = (taskId: string, status: V79TaskStatus) => setState((current) => transitionV79Task(current, taskId, status));

  return <div className="min-h-screen bg-slate-50 text-slate-900"><div className="flex min-h-screen"><aside className="hidden w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 p-5 text-white lg:flex"><div className="mb-6"><p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">SERVELECT</p><h1 className="mt-2 text-xl font-black">Work OS</h1><p className="mt-1 text-xs text-slate-400">v9.0.1 · Unified Taskuri Navigation / Release Truth Fix</p></div>{["Overview", "My Work", "Inbox", "Board", "Table", "Calendar", "Workload", "Forms", "Timesheets", "Reports", "Automations"].map((item) => <div key={item} className={`mb-1 rounded-xl px-3 py-2 text-sm font-bold ${route.toLowerCase().includes(item.toLowerCase().replace(" ", "-")) ? "bg-emerald-500 text-white" : "text-slate-300 hover:bg-slate-900"}`}>{item}</div>)}<div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs font-black uppercase text-slate-400">Production gate</p><p className="mt-1 text-lg font-black text-emerald-300">{globals.productionReadiness}%</p><p className="mt-1 text-xs text-slate-400">Primary writes globally disabled; pilot only.</p></div></aside><main className="min-w-0 flex-1"><header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wide text-emerald-600">GoodDay-like Taskuri · real routes</p><h2 className="text-2xl font-black">Provider Canary Activation, Shared View ACL & Primary Write Pilot</h2><p className="text-xs text-slate-500">{route} · baseline {readiness.acceptedBaseline}</p></div><div className="flex flex-wrap gap-2"><Button onClick={() => runProvider(selectedProvider)}>Run {selectedProvider} canary</Button><Button onClick={() => saveAcl("team")}>Save team view</Button><Button primary onClick={() => runPilot("task")}>Run primary pilot</Button></div></div></header><div className="grid gap-5 p-5"><div className="grid gap-3 md:grid-cols-4"><Metric label="GoodDay parity" value={`${globals.goodDayFunctionalParity}%`} helper="Functional parity after v7.9." /><Metric label="Backend/API" value={`${globals.backendApiParity}%`} helper="API + canary + ACL pilot." /><Metric label="Primary gate" value={state.primaryWritesGloballyEnabled ? "Open" : "Closed"} helper="Closed by design; pilot only." /><Metric label="Screenshot baseline" value="22/22" helper="v7.8 accepted clean." /></div><ProviderPanel state={state} selectedProvider={selectedProvider} onSelect={setSelectedProvider} onRun={runProvider} /><TaskPanel state={state} onTransition={transition} />{["board", "calendar", "calendarGantt"].includes(view) && <BoardPanel state={state} onTransition={transition} />}{["tickets", "ticketsNotificari", "forms"].includes(view) && <TicketsPanel state={state} onPilot={() => runPilot("ticket")} />}{["workload", "workloadAprobari", "timesheets"].includes(view) && <WorkloadPanel workload={workload} onPilot={() => runPilot("timesheet")} />}{["reports", "gooddayObservability", "providerCanary", "providerCanaryAdmin"].includes(view) && <ReportsPanel rows={scores} state={state} />}{["automations", "providerRehearsal"].includes(view) && <AutomationPanel state={state} onRun={() => runProvider()} />}{["serverSavedViews", "sharedViewAcl", "sharedViewAclAdmin", "tabel", "myWork", "inbox"].includes(view) && <SharedViewPanel state={state} route={route} onSave={saveAcl} onApprove={approveAcl} />}{["primaryWritePilot", "primaryWritePilotAdmin", "primaryWriteDryRun", "mutationCanary", "workflows", "customFields"].includes(view) && <PrimaryPilotPanel state={state} onRun={runPilot} />}</div></main></div></div>;
}

function ProviderPanel({ state, selectedProvider, onSelect, onRun }: { state: V79RuntimeState; selectedProvider: V79ProviderKind; onSelect: (provider: V79ProviderKind) => void; onRun: (provider?: V79ProviderKind) => void }) {
  return <Panel title="Provider canary activation · delivery readiness" right={<div className="flex flex-wrap gap-2"><select value={selectedProvider} onChange={(event) => onSelect(event.target.value as V79ProviderKind)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold">{providers.map((provider) => <option key={provider} value={provider}>{provider}</option>)}</select><Button onClick={() => onRun(selectedProvider)}>Selected canary</Button><Button primary onClick={() => onRun()}>Run all safe canaries</Button></div>}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{state.providers.map((provider) => <button key={provider.id} type="button" onClick={() => onSelect(provider.provider)} className={`rounded-2xl border p-4 text-left shadow-sm ${selectedProvider === provider.provider ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"}`}><div className="flex justify-between gap-2"><p className="font-black">{provider.provider}</p><Badge toneName={tone(provider.health)}>{provider.health}</Badge></div><p className="mt-2 text-2xl font-black">{provider.successRate}%</p><p className="text-xs text-slate-500">{provider.mode} · {provider.secretSource} · p95 {provider.p95Ms}ms</p><p className="mt-2 text-xs text-slate-500">queued {provider.queueDepth} · delivered {provider.delivered} · failed {provider.failed}</p><p className="mt-2 text-xs text-slate-500">{provider.evidence}</p></button>)}</div></Panel>;
}

function TaskPanel({ state, onTransition }: { state: V79RuntimeState; onTransition: (taskId: string, status: V79TaskStatus) => void }) {
  return <Panel title="Task management core · canary write protected"><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Task</th><th>Status</th><th>Priority</th><th>Owner</th><th>Write gate</th></tr></thead><tbody>{state.tasks.map((task) => <tr key={task.id} className="border-t border-slate-100"><td className="px-3 py-3"><p className="font-black">{task.code} · {task.title}</p><p className="text-xs text-slate-500">{task.project} / {task.folder}</p></td><td><select value={task.status} onChange={(event) => onTransition(task.id, event.target.value as V79TaskStatus)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td><Badge toneName={tone(task.priority)}>{task.priority}</Badge></td><td>{state.users.find((user) => user.id === task.assigneeId)?.name ?? "Unassigned"}</td><td><Badge toneName={tone(task.writeState)}>{task.writeState}</Badge></td></tr>)}</tbody></table></div></Panel>;
}

function BoardPanel({ state, onTransition }: { state: V79RuntimeState; onTransition: (taskId: string, status: V79TaskStatus) => void }) {
  return <Panel title="Board / Kanban · primary pilot dry-run"><div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">{statuses.map((status) => <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="mb-3 flex justify-between"><p className="text-xs font-black uppercase text-slate-500">{status}</p><Badge>{state.tasks.filter((task) => task.status === status).length}</Badge></div><div className="space-y-2">{state.tasks.filter((task) => task.status === status).map((task) => <div key={task.id} className="rounded-xl bg-white p-3 shadow-sm"><p className="text-xs font-bold text-slate-400">{task.code}</p><p className="text-sm font-black">{task.title}</p><div className="mt-2 flex gap-1"><Button onClick={() => onTransition(task.id, "In lucru")}>Work</Button><Button onClick={() => onTransition(task.id, "Review")}>Review</Button></div></div>)}</div></div>)}</div></Panel>;
}

function TicketsPanel({ state, onPilot }: { state: V79RuntimeState; onPilot: () => void }) {
  return <Panel title="Tickets / requests / forms · provider canary" right={<Button primary onClick={onPilot}>Ticket pilot</Button>}><div className="grid gap-3 md:grid-cols-2">{state.tickets.map((ticket) => <div key={ticket.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{ticket.code} · {ticket.title}</p><Badge toneName={tone(ticket.status)}>{ticket.status}</Badge></div><p className="mt-1 text-xs text-slate-500">SLA {ticket.slaDueAt} · assignee {ticket.assigneeId}</p><div className="mt-2 flex gap-2"><Badge toneName={tone(ticket.severity)}>{ticket.severity}</Badge><Badge toneName="blue">{ticket.provider}</Badge></div></div>)}</div></Panel>;
}

function WorkloadPanel({ workload, onPilot }: { workload: ReturnType<typeof calculateV79Workload>; onPilot: () => void }) {
  return <Panel title="Workload / timesheets · pilot approvals" right={<Button primary onClick={onPilot}>Timesheet pilot</Button>}><div className="grid gap-3 md:grid-cols-2">{workload.map((row) => <div key={row.user.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{row.user.name}</p><Badge toneName={row.overloaded ? "red" : row.underutilized ? "amber" : "green"}>{row.utilization}%</Badge></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(row.utilization, 100)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{row.assignedTasks.length} taskuri · {row.plannedMinutes} planned · {row.trackedMinutes} tracked</p></div>)}</div></Panel>;
}

function SharedViewPanel({ state, route, onSave, onApprove }: { state: V79RuntimeState; route: string; onSave: (scope: V79AclScope) => void; onApprove: (viewId: string) => void }) {
  return <Panel title="Server-side saved views · shared view ACL" right={<div className="flex flex-wrap gap-2"><Button onClick={() => onSave("private")}>Private</Button><Button onClick={() => onSave("team")}>Team</Button><Button onClick={() => onSave("department")}>Department</Button><Button primary onClick={() => onSave("global")}>Global</Button></div>}><p className="mb-3 text-xs text-slate-500">Current route context: {route}</p><div className="grid gap-3 md:grid-cols-2">{state.sharedViews.map((view) => <div key={view.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between gap-2"><p className="font-black">{view.name}</p><Badge toneName={tone(view.aclState)}>{view.aclState}</Badge></div><p className="mt-1 text-xs text-slate-500">{view.route} · {view.scope} · {view.department}</p><div className="mt-2 flex flex-wrap gap-1">{view.permissions.map((permission) => <Badge key={permission}>{permission}</Badge>)}</div><div className="mt-3 flex justify-between"><p className="text-xs text-slate-500">sync v{view.syncVersion}</p><Button onClick={() => onApprove(view.id)}>Approve ACL</Button></div></div>)}</div></Panel>;
}

function PrimaryPilotPanel({ state, onRun }: { state: V79RuntimeState; onRun: (entity: "task" | "ticket" | "saved_view" | "notification" | "timesheet") => void }) {
  return <Panel title="Primary write pilot · gated rollback evidence" right={<div className="flex flex-wrap gap-2"><Button primary onClick={() => onRun("task")}>Task pilot</Button><Button onClick={() => onRun("saved_view")}>Saved view</Button><Button onClick={() => onRun("notification")}>Notification</Button></div>}><div className="grid gap-3 md:grid-cols-2">{state.pilots.map((pilot) => <div key={pilot.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{pilot.entity} · {pilot.action}</p><Badge toneName={tone(pilot.state)}>{pilot.state}</Badge></div><p className="mt-1 text-xs text-slate-500">{pilot.writeState} · lock v{pilot.lockVersion} · {pilot.rollbackCheckpoint}</p><pre className="mt-2 overflow-hidden rounded-xl bg-slate-950 p-3 text-[11px] text-emerald-200">{pilot.dryRunSql}</pre><p className="mt-2 text-xs text-slate-500">{pilot.evidence}</p></div>)}</div></Panel>;
}

function AutomationPanel({ state, onRun }: { state: V79RuntimeState; onRun: () => void }) {
  return <Panel title="Automations · provider canary queue" right={<Button primary onClick={onRun}>Run safe provider canaries</Button>}><div className="grid gap-3 md:grid-cols-2">{state.providers.map((provider) => <div key={provider.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{provider.provider}</p><Badge toneName={tone(provider.mode)}>{provider.mode}</Badge></div><p className="mt-1 text-xs text-slate-500">Queue {provider.queueDepth} · delivered {provider.delivered} · failed {provider.failed}</p><p className="mt-2 text-xs text-slate-500">{provider.nextAction}</p></div>)}</div></Panel>;
}

function ReportsPanel({ rows, state }: { rows: ReturnType<typeof v79ProgressScores>; state: V79RuntimeState }) {
  return <Panel title="Reports / analytics · percent to 100%"><div className="grid gap-3 md:grid-cols-2">{rows.slice(0, 12).map((row) => <div key={row.category} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between gap-2"><p className="text-sm font-black">{row.category}</p><Badge toneName="blue">{row.after}%</Badge></div><p className="mt-1 text-xs text-slate-500">{row.improved}</p><p className="mt-1 text-xs text-slate-400">Lipsește: {row.missing}</p></div>)}</div><p className="mt-3 text-xs text-slate-500">Audit events: {state.audit.length}. Pilots: {state.pilots.length}. Providers: {state.providers.length}.</p></Panel>;
}

