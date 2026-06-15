import type { ReactNode } from "react";
import { V95Surface, getV95Payload } from "@/lib/enterprise/work-os-v95-goodday-collaboration-sla";

type Props = { surface?: V95Surface };

function tone(value: string) {
  if (["ready", "approved", "green"].includes(value)) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (["queued", "scheduled", "amber"].includes(value)) return "border-amber-200 bg-amber-50 text-amber-700";
  if (["blocked", "needs_approval", "pending"].includes(value)) return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function Badge({ children, value = "ready" }: { children: ReactNode; value?: string }) {
  return <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${tone(value)}`}>{children}</span>;
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="text-xl font-black text-slate-950">{title}</h2>{subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p> : null}</div>{children}</section>;
}

function MetricGrid({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">{payload.metrics.map((metric) => <div key={metric.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"><div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{metric.label}</div><div className="mt-2 text-2xl font-black text-slate-950">{metric.value}</div><p className="mt-2 text-xs leading-5 text-slate-500">{metric.trend}</p></div>)}</div>;
}

function Hero({ payload, surface }: { payload: ReturnType<typeof getV95Payload>; surface: V95Surface }) {
  return <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"><div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-7 text-white"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">SERVELECT EMP · Taskuri canonical workspace · v{payload.version}</p><h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight">Collaboration, files, SLA and decision operations</h1><p className="mt-4 max-w-5xl text-sm leading-7 text-slate-200">Build v9.5.0 continues inside Taskuri only: updates, checklists, evidence files, SLA inbox, workload forecast and decision register are connected to task execution.</p></div><Badge value="ready">{surface}</Badge></div><div className="mt-6 grid gap-2 md:grid-cols-2 xl:grid-cols-4">{payload.navigation.slice(0,4).map((item) => <a key={item.href} href={item.href} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white hover:bg-white/15">{item.label}</a>)}</div></div></section>;
}

function Collaboration({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <Card title="Task collaboration hub" subtitle="Updates, watchers, owner response and request conversion are shown on the task execution lane."><div className="grid gap-3 xl:grid-cols-3">{payload.tasks.map((task) => <article key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{task.code}</div><h3 className="mt-1 font-black text-slate-950">{task.title}</h3></div><Badge value={task.status === "Review" ? "queued" : "ready"}>{task.status}</Badge></div><p className="mt-3 text-sm text-slate-600">{task.project} · {task.department}</p><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-white p-2 ring-1 ring-slate-200"><b>{task.checklistDone}/{task.checklist}</b><br/>checks</div><div className="rounded-xl bg-white p-2 ring-1 ring-slate-200"><b>{task.files}</b><br/>files</div><div className="rounded-xl bg-white p-2 ring-1 ring-slate-200"><b>{task.comments}</b><br/>updates</div></div><div className="mt-4 flex flex-wrap gap-2">{task.watchers.map((watcher) => <span key={watcher} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">{watcher}</span>)}</div></article>)}</div></Card>;
}

function Checklists({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <Card title="Checklist quality gates" subtitle="Checklist progress is tied to task evidence and manager approval, closer to an operational task lifecycle."><div className="grid gap-3 xl:grid-cols-3">{payload.checklists.map((item) => <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-black text-slate-950">{item.name}</h3><p className="mt-1 text-xs text-slate-500">Owner: {item.owner}</p></div><Badge value={item.blocked ? "needs_approval" : "ready"}>{item.complete}%</Badge></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white ring-1 ring-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.complete}%` }} /></div><p className="mt-3 text-sm leading-6 text-slate-600">{item.evidence}</p><p className="mt-3 text-xs font-bold text-slate-500">{item.required} required · {item.blocked} blocked</p></div>)}</div></Card>;
}

function Files({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <Card title="Files and evidence ledger" subtitle="Task files are represented as execution evidence with owner, status and audit-ready context."><div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.14em] text-slate-400"><tr><th className="p-3">File</th><th className="p-3">Task</th><th className="p-3">Kind</th><th className="p-3">Owner</th><th className="p-3">Status</th></tr></thead><tbody>{payload.files.map((file) => <tr key={file.name} className="border-t border-slate-100"><td className="p-3 font-black text-slate-950">{file.name}<div className="text-xs font-normal text-slate-500">{file.size}</div></td><td className="p-3">{file.task}</td><td className="p-3">{file.kind}</td><td className="p-3">{file.owner}</td><td className="p-3"><Badge value={file.status}>{file.status}</Badge></td></tr>)}</tbody></table></div></Card>;
}

function Sla({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <Card title="SLA escalation inbox" subtitle="SLA lanes connect Action Required, workload and provider evidence to manager gates."><div className="grid gap-3 md:grid-cols-3">{payload.sla.map((lane) => <div key={lane.lane} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><h3 className="font-black text-slate-950">{lane.lane}</h3><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-white p-2"><b>{lane.count}</b><br/>open</div><div className="rounded-xl bg-white p-2"><b>{lane.atRisk}</b><br/>risk</div><div className="rounded-xl bg-white p-2"><b>{lane.breached}</b><br/>breach</div></div><p className="mt-4 text-sm leading-6 text-slate-600">{lane.action}</p></div>)}</div></Card>;
}

function Workload({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <Card title="Team workload forecast" subtitle="Capacity is tied to tasks, SLA risk and decision gates."><div className="space-y-3">{payload.workload.map((row) => <div key={row.person} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black text-slate-950">{row.person}</h3><p className="text-sm text-slate-500">{row.role} · {row.allocated}/{row.capacity}h</p></div><Badge value={row.risk}>{row.risk}</Badge></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white ring-1 ring-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.round((row.allocated / row.capacity) * 100))}%` }} /></div><p className="mt-3 text-sm text-slate-600">{row.next}</p></div>)}</div></Card>;
}

function Decisions({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <Card title="Decision register" subtitle="Manager decisions become auditable task objects, not hidden notes."><div className="grid gap-3 xl:grid-cols-3">{payload.decisions.map((decision) => <article key={decision.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-black text-slate-950">{decision.title}</h3><Badge value={decision.status}>{decision.status}</Badge></div><p className="mt-2 text-sm text-slate-600">{decision.evidence}</p><p className="mt-3 text-xs font-bold text-slate-500">{decision.owner} · {decision.due}</p></article>)}</div></Card>;
}

function Activity({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <Card title="Unified activity stream" subtitle="Task updates, provider callbacks, evidence and decisions appear in one feed."><div className="space-y-3">{payload.activity.map((event) => <div key={`${event.at}-${event.target}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><span className="font-black text-slate-950">{event.actor}</span><span className="text-slate-500"> · {event.action}</span></div><Badge value="queued">{event.type}</Badge></div><p className="mt-2 text-sm text-slate-600">{event.target} — {event.detail}</p><p className="mt-2 text-xs font-bold text-slate-400">{event.at}</p></div>)}</div></Card>;
}

function Readiness({ payload }: { payload: ReturnType<typeof getV95Payload> }) {
  return <Card title="Release readiness" subtitle="No global production writes; all risky operations remain behind pilot gates."><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{payload.readiness.map((item) => <div key={item.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-black text-slate-950">{item.category}</h3><Badge value={item.status}>{item.value}%</Badge></div><p className="mt-3 text-sm leading-6 text-slate-600">{item.evidence}</p></div>)}</div></Card>;
}

export default function V95GoodDayCollaborationSla({ surface = "collaboration" }: Props) {
  const payload = getV95Payload(surface);
  return <main className="space-y-5"><Hero payload={payload} surface={surface} /><MetricGrid payload={payload} />{surface === "collaboration" ? <><Collaboration payload={payload} /><Activity payload={payload} /></> : null}{surface === "checklists" ? <><Checklists payload={payload} /><Activity payload={payload} /></> : null}{surface === "files" ? <><Files payload={payload} /><Checklists payload={payload} /></> : null}{surface === "sla" ? <><Sla payload={payload} /><Collaboration payload={payload} /></> : null}{surface === "workload" ? <><Workload payload={payload} /><Sla payload={payload} /></> : null}{surface === "decisions" ? <><Decisions payload={payload} /><Activity payload={payload} /></> : null}{surface === "requests" ? <><Collaboration payload={payload} /><Decisions payload={payload} /></> : null}{surface === "admin" ? <><Readiness payload={payload} /><Files payload={payload} /><Decisions payload={payload} /></> : null}</main>;
}
