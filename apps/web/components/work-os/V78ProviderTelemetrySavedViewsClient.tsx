"use client";

import { useMemo, useState } from "react";
import {
  calculateV78Workload,
  createV78RuntimeState,
  runV78MutationCanary,
  runV78ProviderProbe,
  saveV78ServerView,
  syncV78SavedViews,
  v78CurrentReadiness,
  v78GlobalScores,
  v78ProgressScores,
  type V78ProviderKind,
  type V78RuntimeState,
  type V78TaskStatus,
  type V78View
} from "@/lib/enterprise/work-os-v78-provider-telemetry-saved-views";

const statusOrder: V78TaskStatus[] = ["Inbox", "Planning", "In lucru", "Review", "Blocat", "Finalizat"];
const providerOrder: V78ProviderKind[] = ["in_app", "email", "push", "websocket"];

function routeForView(view: V78View): string {
  const map: Record<V78View, string> = {
    taskuri: "/taskuri",
    overview: "/taskuri/overview",
    myWork: "/taskuri/my-work",
    inbox: "/taskuri/inbox",
    tickets: "/taskuri/tickets",
    ticketsNotificari: "/taskuri/tickets-notificari",
    board: "/taskuri/board",
    tabel: "/taskuri/tabel",
    calendar: "/taskuri/calendar",
    calendarGantt: "/taskuri/calendar-gantt",
    workload: "/taskuri/workload",
    workloadAprobari: "/taskuri/workload-aprobari",
    proiecteActive: "/taskuri/proiecte-active",
    proiecteViitoare: "/taskuri/proiecte-viitoare",
    proiecteFinalizate: "/taskuri/proiecte-finalizate",
    forms: "/taskuri/forms",
    timesheets: "/taskuri/timesheets",
    reports: "/taskuri/reports",
    automations: "/taskuri/automations",
    workflows: "/admin/workflows",
    customFields: "/admin/custom-fields",
    gooddayObservability: "/admin/goodday-observability",
    gooddayUiParity: "/work-os/goodday-ui-parity",
    providerRehearsal: "/work-os/provider-rehearsal",
    primaryWriteDryRun: "/work-os/primary-write-dry-run",
    providerTelemetry: "/work-os/provider-telemetry",
    mutationCanary: "/work-os/mutation-canary",
    serverSavedViews: "/admin/server-saved-views"
  };
  return map[view];
}

function badgeTone(value: string): "green" | "amber" | "red" | "blue" | "slate" | "purple" {
  if (["ready", "delivered", "server_synced", "accepted", "Finalizat"].includes(value)) return "green";
  if (["dry_run", "queued", "queued_for_server", "processing", "Review", "Planning"].includes(value)) return "amber";
  if (["blocked", "failed", "Blocat", "Urgent", "Escaladat"].includes(value)) return "red";
  if (["team", "department", "global", "In lucru"].includes(value)) return "blue";
  if (["private"].includes(value)) return "purple";
  return "slate";
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "green" | "amber" | "red" | "blue" | "slate" | "purple" }) {
  const classes = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-rose-200 bg-rose-50 text-rose-700",
    blue: "border-sky-200 bg-sky-50 text-sky-700",
    purple: "border-violet-200 bg-violet-50 text-violet-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600"
  };
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide ${classes[tone]}`}>{children}</span>;
}

function Button({ children, onClick, primary = false }: { children: React.ReactNode; onClick?: () => void; primary?: boolean }) {
  return <button type="button" onClick={onClick} className={`rounded-xl px-3 py-2 text-xs font-black transition ${primary ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{children}</button>;
}

function Panel({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-sm font-black text-slate-950">{title}</h2>{right}</div>{children}</section>;
}

function Metric({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[11px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{helper}</p></div>;
}

export function V78ProviderTelemetrySavedViewsClient({ view = "overview" }: { view?: V78View }) {
  const [state, setState] = useState<V78RuntimeState>(() => createV78RuntimeState());
  const [selectedProvider, setSelectedProvider] = useState<V78ProviderKind>("in_app");
  const scores = useMemo(() => v78ProgressScores(), []);
  const globals = useMemo(() => v78GlobalScores(), []);
  const readiness = useMemo(() => v78CurrentReadiness(), []);
  const workload = useMemo(() => calculateV78Workload(state), [state]);
  const route = routeForView(view);
  const activeTask = state.tasks.find((task) => task.id === state.selectedTaskId) ?? state.tasks[0];
  const unhealthyProviders = state.providerTelemetry.filter((item) => item.status === "blocked" || item.status === "failed").length;
  const syncedViews = state.savedViews.filter((item) => item.serverState === "server_synced").length;
  const acceptedCanaries = state.canaries.filter((item) => item.state === "accepted" || item.state === "replayed").length;

  function apply(next: V78RuntimeState) {
    setState(next);
  }

  function transitionTask(taskId: string, to: V78TaskStatus) {
    const tasks = state.tasks.map((task) => task.id === taskId ? { ...task, status: to, version: task.version + 1, updatedAt: new Date().toISOString() } : task);
    apply(runV78MutationCanary({ ...state, tasks }, "task"));
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-slate-800 bg-slate-950 p-5 text-white">
          <div className="rounded-3xl bg-emerald-500/10 p-4 ring-1 ring-emerald-400/20">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">SERVELECT</p>
            <h1 className="mt-2 text-2xl font-black">WORK OS</h1>
            <p className="mt-1 text-xs text-slate-400">v7.8.0 · Provider telemetry · mutation canary · server saved views</p>
          </div>
          <nav className="mt-6 space-y-1 text-sm">
            {["/taskuri", "/taskuri/my-work", "/taskuri/tickets-notificari", "/taskuri/board", "/taskuri/tabel", "/taskuri/calendar-gantt", "/taskuri/workload-aprobari", "/taskuri/forms", "/taskuri/timesheets", "/taskuri/reports", "/taskuri/automations", "/work-os/provider-telemetry", "/work-os/mutation-canary", "/admin/server-saved-views"].map((item) => (
              <a key={item} href={item} className={`block rounded-2xl px-3 py-2 font-bold ${item === route ? "bg-emerald-500 text-white" : "text-slate-300 hover:bg-white/10"}`}>{item}</a>
            ))}
          </nav>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            <p className="font-black text-white">Guardrails</p>
            <p className="mt-2">Primary writes sunt încă gated. v7.8 rulează canary + telemetry, nu activează DB primary fără rollback.</p>
          </div>
        </aside>

        <section className="p-5 lg:p-7">
          <header className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-600">GoodDay-like Work OS · real routes</p>
                <h1 className="mt-1 text-3xl font-black text-slate-950">Provider Telemetry, Mutation Canary & Server-Side Saved Views</h1>
                <p className="mt-1 text-sm text-slate-500">Route: {route}. Baseline: {readiness.acceptedBaseline}.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <Button primary onClick={() => apply(runV78ProviderProbe(state, selectedProvider))}>Probe provider</Button>
                <Button onClick={() => apply(saveV78ServerView(state, route, "team"))}>Save server view</Button>
                <Button onClick={() => apply(runV78MutationCanary(state, "task"))}>Run canary</Button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              <Metric label="Visual" value={`${globals.goodDayVisualSimilarity}%`} helper="GoodDay-like UX" />
              <Metric label="Functional" value={`${globals.goodDayFunctionalParity}%`} helper="public parity" />
              <Metric label="Backend/API" value={`${globals.backendApiParity}%`} helper="telemetry + canary" />
              <Metric label="Production" value={`${globals.productionReadiness}%`} helper="readiness" />
              <Metric label="Saved views" value={`${syncedViews}/${state.savedViews.length}`} helper="server synced" />
              <Metric label="Provider issues" value={unhealthyProviders} helper="blocked/failed" />
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_420px]">
            <div className="space-y-5">
              {(["providerTelemetry", "providerRehearsal", "gooddayObservability"].includes(view)) && <ProviderTelemetryPanel state={state} selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} onProbe={(provider) => apply(runV78ProviderProbe(state, provider))} />}
              {(["mutationCanary", "primaryWriteDryRun"].includes(view)) && <MutationCanaryPanel state={state} onRun={(entity) => apply(runV78MutationCanary(state, entity))} />}
              {(["serverSavedViews", "tabel", "myWork", "inbox", "reports"].includes(view)) && <SavedViewsPanel state={state} route={route} onSave={(scope) => apply(saveV78ServerView(state, route, scope))} onSync={() => apply(syncV78SavedViews(state))} />}
              {(["board"].includes(view)) && <BoardPanel state={state} onTransition={transitionTask} />}
              {(["tickets", "ticketsNotificari", "forms"].includes(view)) && <TicketsPanel state={state} onCanary={() => apply(runV78MutationCanary(state, "ticket"))} />}
              {(["calendar", "calendarGantt"].includes(view)) && <TimelinePanel state={state} />}
              {(["workload", "workloadAprobari", "timesheets"].includes(view)) && <WorkloadPanel state={state} workload={workload} onCanary={() => apply(runV78MutationCanary(state, "timesheet"))} />}
              {(["automations", "workflows", "customFields"].includes(view)) && <AutomationPanel state={state} onProbe={() => apply(runV78ProviderProbe(state))} />}
              {(["overview", "taskuri", "gooddayUiParity", "proiecteActive", "proiecteViitoare", "proiecteFinalizate"].includes(view)) && <TaskExecutionPanel state={state} activeTask={activeTask} onSelect={(id) => apply({ ...state, selectedTaskId: id })} onTransition={transitionTask} />}
              <ReportsPanel rows={scores} state={state} />
            </div>

            <aside className="space-y-5">
              <Panel title="Provider switchboard" right={<Badge tone={badgeTone(state.providerTelemetry.find((item) => item.provider === selectedProvider)?.status ?? "blocked")}>{selectedProvider}</Badge>}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {providerOrder.map((provider) => <Button key={provider} primary={provider === selectedProvider} onClick={() => setSelectedProvider(provider)}>{provider}</Button>)}
                </div>
              </Panel>
              <Panel title="Selected task drawer" right={<Badge tone={badgeTone(activeTask.status)}>{activeTask.status}</Badge>}>
                <p className="font-black">{activeTask.code} · {activeTask.title}</p>
                <p className="mt-1 text-xs text-slate-500">{activeTask.project} / {activeTask.folder}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {statusOrder.map((status) => <Button key={status} primary={status === activeTask.status} onClick={() => transitionTask(activeTask.id, status)}>{status}</Button>)}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-50 p-2"><b>{activeTask.comments}</b><p>comments</p></div>
                  <div className="rounded-xl bg-slate-50 p-2"><b>{activeTask.attachments}</b><p>files</p></div>
                  <div className="rounded-xl bg-slate-50 p-2"><b>v{activeTask.version}</b><p>lock</p></div>
                </div>
              </Panel>
              <Panel title="Canary evidence">
                <div className="space-y-2">
                  {state.canaries.slice(0, 5).map((item) => <div key={item.id} className="rounded-xl border border-slate-100 p-3 text-xs"><div className="flex justify-between gap-2"><b>{item.entity} · {item.action}</b><Badge tone={badgeTone(item.state)}>{item.state}</Badge></div><p className="mt-1 text-slate-500">{item.evidence}</p></div>)}
                </div>
              </Panel>
              <Panel title="Audit trail">
                <div className="space-y-2">
                  {state.audit.slice(0, 5).map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-3 text-xs"><b>{item.title}</b><p className="text-slate-500">{item.details}</p></div>)}
                </div>
              </Panel>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function TaskExecutionPanel({ state, activeTask, onSelect, onTransition }: { state: V78RuntimeState; activeTask: V78RuntimeState["tasks"][number]; onSelect: (id: string) => void; onTransition: (id: string, status: V78TaskStatus) => void }) {
  return <Panel title="Task management core · provider-aware"><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Task</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Lock</th></tr></thead><tbody>{state.tasks.map((task) => <tr key={task.id} className={`border-t border-slate-100 ${task.id === activeTask.id ? "bg-emerald-50/50" : "hover:bg-slate-50"}`}><td className="px-3 py-3"><button type="button" onClick={() => onSelect(task.id)} className="text-left font-black">{task.code} · {task.title}</button><p className="text-xs text-slate-500">{task.project} / {task.folder}</p></td><td><select value={task.status} onChange={(event) => onTransition(task.id, event.target.value as V78TaskStatus)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold">{statusOrder.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td><Badge tone={badgeTone(task.priority)}>{task.priority}</Badge></td><td>{state.users.find((user) => user.id === task.assigneeId)?.name ?? "Unassigned"}</td><td>v{task.version}</td></tr>)}</tbody></table></div></Panel>;
}

function ProviderTelemetryPanel({ state, selectedProvider, setSelectedProvider, onProbe }: { state: V78RuntimeState; selectedProvider: V78ProviderKind; setSelectedProvider: (provider: V78ProviderKind) => void; onProbe: (provider?: V78ProviderKind) => void }) {
  return <Panel title="Provider telemetry · delivery health" right={<div className="flex gap-2"><Button onClick={() => onProbe(selectedProvider)}>Probe selected</Button><Button primary onClick={() => onProbe()}>Probe all</Button></div>}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{state.providerTelemetry.map((item) => <button key={item.id} type="button" onClick={() => setSelectedProvider(item.provider)} className={`rounded-2xl border p-4 text-left shadow-sm ${item.provider === selectedProvider ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"}`}><div className="flex justify-between gap-2"><p className="font-black">{item.provider}</p><Badge tone={badgeTone(item.status)}>{item.status}</Badge></div><p className="mt-2 text-2xl font-black">{item.successRate}%</p><p className="text-xs text-slate-500">p95 {item.p95Ms} ms · queued {item.queued} · failed {item.failed}</p><p className="mt-2 text-xs text-slate-500">{item.evidence}</p></button>)}</div><div className="mt-4 grid gap-2 md:grid-cols-3">{state.deliveryEvents.map((event) => <div key={event.id} className="rounded-xl border border-slate-100 p-3 text-xs"><div className="flex justify-between"><b>{event.provider}</b><Badge tone={badgeTone(event.state)}>{event.state}</Badge></div><p className="mt-1 text-slate-500">{event.entity} {event.entityId} · attempt {event.attempt}</p></div>)}</div></Panel>;
}

function SavedViewsPanel({ state, route, onSave, onSync }: { state: V78RuntimeState; route: string; onSave: (scope: "private" | "team" | "department" | "global") => void; onSync: () => void }) {
  return <Panel title="Server-side saved views · filters/table views" right={<div className="flex flex-wrap gap-2"><Button onClick={() => onSave("private")}>Private</Button><Button onClick={() => onSave("team")}>Team</Button><Button onClick={() => onSave("department")}>Department</Button><Button primary onClick={onSync}>Sync queued</Button></div>}><p className="mb-3 text-xs text-slate-500">Current route context: {route}</p><div className="grid gap-3 md:grid-cols-2">{state.savedViews.map((view) => <div key={view.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between gap-2"><p className="font-black">{view.name}</p><Badge tone={badgeTone(view.serverState)}>{view.serverState}</Badge></div><p className="mt-1 text-xs text-slate-500">{view.route} · {view.scope} · {view.department}</p><div className="mt-2 flex flex-wrap gap-1">{view.filters.map((filter) => <Badge key={filter}>{filter}</Badge>)}</div><p className="mt-2 text-xs text-slate-500">Columns: {view.columns.join(", ")} · v{view.version}</p></div>)}</div></Panel>;
}

function MutationCanaryPanel({ state, onRun }: { state: V78RuntimeState; onRun: (entity: "task" | "ticket" | "saved_view" | "notification" | "timesheet") => void }) {
  return <Panel title="Mutation canary · primary write dry-run" right={<div className="flex flex-wrap gap-2"><Button primary onClick={() => onRun("task")}>Task canary</Button><Button onClick={() => onRun("saved_view")}>Saved view</Button><Button onClick={() => onRun("notification")}>Notification</Button></div>}><div className="grid gap-3 md:grid-cols-2">{state.canaries.map((canary) => <div key={canary.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{canary.entity} · {canary.action}</p><Badge tone={badgeTone(canary.state)}>{canary.state}</Badge></div><p className="mt-1 text-xs text-slate-500">lock v{canary.lockVersion} · replica {canary.readReplicaOk ? "OK" : "FAIL"} · {canary.rollbackCheckpoint}</p><p className="mt-2 text-xs text-slate-500">{canary.evidence}</p></div>)}</div></Panel>;
}

function BoardPanel({ state, onTransition }: { state: V78RuntimeState; onTransition: (id: string, status: V78TaskStatus) => void }) {
  return <Panel title="Kanban board · canary protected"><div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">{statusOrder.map((status) => <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="mb-3 flex justify-between"><p className="text-xs font-black uppercase text-slate-500">{status}</p><Badge>{state.tasks.filter((task) => task.status === status).length}</Badge></div><div className="space-y-2">{state.tasks.filter((task) => task.status === status).map((task) => <div key={task.id} className="rounded-xl bg-white p-3 shadow-sm"><p className="text-xs font-bold text-slate-400">{task.code}</p><p className="text-sm font-black">{task.title}</p><div className="mt-2 flex gap-1"><Button onClick={() => onTransition(task.id, "In lucru")}>Work</Button><Button onClick={() => onTransition(task.id, "Review")}>Review</Button></div></div>)}</div></div>)}</div></Panel>;
}

function TicketsPanel({ state, onCanary }: { state: V78RuntimeState; onCanary: () => void }) {
  return <Panel title="Tickets / requests / forms · SLA delivery" right={<Button primary onClick={onCanary}>Ticket canary</Button>}><div className="grid gap-3 md:grid-cols-2">{state.tickets.map((ticket) => <div key={ticket.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{ticket.code} · {ticket.title}</p><Badge tone={badgeTone(ticket.status)}>{ticket.status}</Badge></div><p className="mt-1 text-xs text-slate-500">SLA {ticket.slaDueAt} · assignee {ticket.assigneeId}</p><Badge tone={badgeTone(ticket.severity)}>{ticket.severity}</Badge></div>)}</div></Panel>;
}

function TimelinePanel({ state }: { state: V78RuntimeState }) {
  return <Panel title="Calendar / Gantt / timeline · saved view aware"><div className="space-y-2">{state.tasks.map((task) => <div key={task.id} className="grid grid-cols-[150px_minmax(0,1fr)_80px] items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm"><span className="font-bold">{task.dueDate}</span><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(12, task.estimateMinutes / 5))}%` }} /></div><Badge>v{task.version}</Badge></div>)}</div></Panel>;
}

function WorkloadPanel({ state, workload, onCanary }: { state: V78RuntimeState; workload: ReturnType<typeof calculateV78Workload>; onCanary: () => void }) {
  return <Panel title="Workload / timesheets · canary approval" right={<Button primary onClick={onCanary}>Timesheet canary</Button>}><div className="grid gap-3 md:grid-cols-2">{workload.map((row) => <div key={row.user.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{row.user.name}</p><Badge tone={row.overloaded ? "red" : row.underutilized ? "amber" : "green"}>{row.utilization}%</Badge></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(row.utilization, 100)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{row.assignedTasks.length} taskuri · {row.plannedMinutes} planned · {row.trackedMinutes} tracked</p></div>)}</div><p className="mt-3 text-xs text-slate-500">Users: {state.users.length}. Department scoping stays active.</p></Panel>;
}

function AutomationPanel({ state, onProbe }: { state: V78RuntimeState; onProbe: () => void }) {
  return <Panel title="Automations / workflows / provider retry" right={<Button primary onClick={onProbe}>Run provider probe</Button>}><div className="grid gap-3 md:grid-cols-2">{state.deliveryEvents.map((event) => <div key={event.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between"><p className="font-black">{event.provider}</p><Badge tone={badgeTone(event.state)}>{event.state}</Badge></div><p className="mt-1 text-xs text-slate-500">{event.entity} {event.entityId} · attempt {event.attempt}</p><p className="mt-2 text-xs text-slate-500">Retry: {event.nextRetryAt ?? "not needed"}</p></div>)}</div></Panel>;
}

function ReportsPanel({ rows, state }: { rows: ReturnType<typeof v78ProgressScores>; state: V78RuntimeState }) {
  const visible = rows.slice(0, 10);
  return <Panel title="Reports / analytics · percent to 100%"><div className="grid gap-3 md:grid-cols-2">{visible.map((row) => <div key={row.category} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between gap-2"><p className="text-sm font-black">{row.category}</p><Badge tone="blue">{row.after}%</Badge></div><p className="mt-1 text-xs text-slate-500">{row.improved}</p><p className="mt-1 text-xs text-slate-400">Lipsește: {row.missing}</p></div>)}</div><p className="mt-3 text-xs text-slate-500">Audit events: {state.audit.length}. Canaries: {state.canaries.length}. Delivery events: {state.deliveryEvents.length}.</p></Panel>;
}
