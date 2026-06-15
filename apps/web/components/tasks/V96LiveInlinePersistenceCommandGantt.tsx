import type { ReactNode } from "react";
import { V96Surface, getV96Payload } from "@/lib/enterprise/work-os-v96-live-inline-persistence-command-gantt";

type Payload = ReturnType<typeof getV96Payload>;
type Props = { surface?: V96Surface };

function tone(value: string) {
  if (["ready", "green", "adapter-ready"].includes(value)) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (["queued", "env-gated", "medium", "pilot", "gated"].includes(value)) return "border-amber-200 bg-amber-50 text-amber-700";
  if (["high", "blocked", "manager_gate", "awaiting_manager_gate", "policy_review"].includes(value)) return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function Badge({ children, value = "ready" }: { children: ReactNode; value?: string }) {
  return <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${tone(value)}`}>{children}</span>;
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="text-xl font-black text-slate-950">{title}</h2>{subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p> : null}</div>{children}</section>;
}

function Hero({ payload, surface }: { payload: Payload; surface: V96Surface }) {
  return <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"><div className="bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950 p-7 text-white"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">SERVELECT EMP · Taskuri canonical workspace · v{payload.version}</p><h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight">Inline persistence, command actions and Gantt conflict control</h1><p className="mt-4 max-w-5xl text-sm leading-7 text-slate-200">Build v9.6.0 continues inside Taskuri: drawer edits, command palette actions, saved view persistence, Gantt conflict detection and notification routing are connected through gated mutation contracts.</p></div><Badge value="ready">{surface}</Badge></div><div className="mt-6 grid gap-2 md:grid-cols-2 xl:grid-cols-4">{payload.navigation.slice(0,4).map((item) => <a key={item.href} href={item.href} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white hover:bg-white/15">{item.label}</a>)}</div></div></section>;
}

function Metrics({ payload }: { payload: Payload }) {
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">{payload.metrics.map((metric) => <div key={metric.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"><div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{metric.label}</div><div className="mt-2 text-2xl font-black text-slate-950">{metric.value}</div><p className="mt-2 text-xs leading-5 text-slate-500">{metric.trend}</p></div>)}</div>;
}

function InlinePersistence({ payload }: { payload: Payload }) {
  return <Card title="Inline persistence adapter" subtitle="Drawer mutations are staged with before/after state, lockVersion, audit envelope and rollback checkpoint before any primary write is allowed."><div className="grid gap-3 xl:grid-cols-3">{payload.mutationQueue.map((mutation) => <article key={mutation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{mutation.id}</div><h3 className="mt-1 font-black text-slate-950">{mutation.task} · {mutation.field}</h3></div><Badge value={mutation.decision}>{mutation.decision}</Badge></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><b>Before</b><br/>{mutation.before}</div><div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><b>After</b><br/>{mutation.after}</div></div><p className="mt-3 text-sm leading-6 text-slate-600">{mutation.auditEnvelope}</p><p className="mt-2 text-xs font-bold text-slate-500">Actor: {mutation.actor} · rollback {mutation.rollback}</p></article>)}</div></Card>;
}

function CommandPalette({ payload }: { payload: Payload }) {
  return <Card title="Command palette actions" subtitle="Fast actions operate on the real Taskuri object model: owner, status, due date, dependencies, watchers and manager gates."><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{payload.commands.map((command) => <div key={command.command} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-black text-slate-950">{command.command}</h3><Badge value="queued">{command.shortcut}</Badge></div><p className="mt-2 text-sm text-slate-600">Target: {command.target}</p><p className="mt-2 text-xs font-bold text-slate-500">Gate: {command.gate}</p><p className="mt-1 text-xs text-slate-500">Result: {command.result}</p></div>)}</div></Card>;
}

function GanttConflicts({ payload }: { payload: Payload }) {
  return <Card title="Gantt conflict review" subtitle="Timeline changes are checked for dependency cycles, capacity overlaps and policy exceptions before becoming task mutations."><div className="space-y-3">{payload.ganttConflicts.map((conflict) => <div key={conflict.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black text-slate-950">{conflict.task} · {conflict.relation}</h3><p className="text-sm text-slate-500">Predecessor: {conflict.predecessor}</p></div><Badge value={conflict.severity}>{conflict.severity}</Badge></div><p className="mt-3 text-sm leading-6 text-slate-600">{conflict.issue}</p><p className="mt-2 text-xs font-bold text-emerald-700">Resolution: {conflict.resolution}</p></div>)}</div></Card>;
}

function Notifications({ payload }: { payload: Payload }) {
  return <Card title="Notification routing" subtitle="Approvals, policy updates and dependency conflicts route to the right lane while providers stay env-gated."><div className="grid gap-3 md:grid-cols-2">{payload.notifications.map((notification) => <article key={notification.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-black text-slate-950">{notification.channel}</h3><Badge value={notification.status}>{notification.status}</Badge></div><p className="mt-2 text-sm text-slate-600">{notification.trigger} → {notification.target}</p><p className="mt-3 text-xs font-bold text-slate-500">{notification.evidence}</p></article>)}</div></Card>;
}

function SavedViews({ payload }: { payload: Payload }) {
  return <Card title="Saved view persistence" subtitle="Saved views become policy-bound records instead of local-only filters."><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.14em] text-slate-400"><tr><th className="p-3">View</th><th className="p-3">Scope</th><th className="p-3">Filters</th><th className="p-3">Policy</th><th className="p-3">Persistence</th></tr></thead><tbody>{payload.savedViews.map((view) => <tr key={view.id} className="border-t border-slate-100"><td className="p-3 font-black text-slate-950">{view.name}<div className="text-xs font-normal text-slate-500">{view.owner}</div></td><td className="p-3">{view.scope}</td><td className="p-3">{view.filters}</td><td className="p-3">{view.policy}</td><td className="p-3"><Badge value={view.persistence}>{view.persistence}</Badge></td></tr>)}</tbody></table></div></Card>;
}

function AuditTrail({ payload }: { payload: Payload }) {
  return <Card title="Task change audit" subtitle="Every inline edit, command action, policy update and notification is represented as auditable activity."><div className="space-y-3">{payload.auditTrail.map((event) => <div key={`${event.at}-${event.target}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><span className="font-black text-slate-950">{event.actor}</span><span className="text-slate-500"> · {event.action}</span></div><Badge value="queued">{event.at}</Badge></div><p className="mt-2 text-sm text-slate-600">{event.target} — {event.detail}</p></div>)}</div></Card>;
}

function ManagerGates({ payload }: { payload: Payload }) {
  return <Card title="Manager gate inbox" subtitle="Approval decisions are pulled from queued task mutations and conflict reviews."><div className="grid gap-3 xl:grid-cols-3">{payload.tasks.map((task) => <article key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{task.code}</div><h3 className="mt-1 font-black text-slate-950">{task.title}</h3></div><Badge value={task.mutationState}>{task.mutationState}</Badge></div><p className="mt-3 text-sm text-slate-600">{task.project} · {task.owner}</p><p className="mt-2 text-xs font-bold text-slate-500">lockVersion {task.lockVersion} · rollback {task.rollback}</p><div className="mt-3 flex flex-wrap gap-2">{task.watchers.map((watcher) => <span key={watcher} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">{watcher}</span>)}</div></article>)}</div></Card>;
}

function Readiness({ payload }: { payload: Payload }) {
  return <Card title="Release readiness" subtitle="v9.6 keeps global writes off and adds stronger execution contracts before primary persistence."><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{payload.readiness.map((item) => <div key={item.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-black text-slate-950">{item.category}</h3><Badge value={item.status}>{item.percent}%</Badge></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white ring-1 ring-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.percent}%` }} /></div><p className="mt-3 text-sm leading-6 text-slate-600">{item.evidence}</p></div>)}</div></Card>;
}

export default function V96LiveInlinePersistenceCommandGantt({ surface = "inline-persistence" }: Props) {
  const payload = getV96Payload(surface);
  return <main className="space-y-5"><Hero payload={payload} surface={surface} /><Metrics payload={payload} />{surface === "inline-persistence" && <InlinePersistence payload={payload} />}{surface === "command-palette" && <CommandPalette payload={payload} />}{surface === "gantt-conflicts" && <GanttConflicts payload={payload} />}{surface === "notification-routing" && <Notifications payload={payload} />}{surface === "saved-view-persistence" && <SavedViews payload={payload} />}{surface === "task-change-audit" && <AuditTrail payload={payload} />}{surface === "manager-gate-inbox" && <ManagerGates payload={payload} />}{surface === "admin-governance" && <><InlinePersistence payload={payload} /><GanttConflicts payload={payload} /><Notifications payload={payload} /></>}<Readiness payload={payload} /></main>;
}
