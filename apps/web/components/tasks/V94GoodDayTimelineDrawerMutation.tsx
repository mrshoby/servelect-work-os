"use client";

import { useMemo, useState, type ReactNode } from "react";
import { getV94GoodDayTimelineDrawerMutation, type V94Mode, type V94MutationState, type V94TaskNode } from "@/lib/enterprise/work-os-v94-goodday-timeline-drawer-mutation";

const payload = getV94GoodDayTimelineDrawerMutation();

const labels: Record<V94Mode, string> = {
  timeline: "Timeline dependencies",
  calendar: "Calendar capacity sync",
  "mutation-queue": "Drawer mutation queue",
  approvals: "Approval workflow builder",
  templates: "Task templates & recurrence",
  policies: "Saved view policy contracts",
  gantt: "Gantt readiness",
  admin: "Admin execution governance",
};

function badgeTone(value: string) {
  const v = value.toLowerCase();
  if (v.includes("urgent") || v.includes("blocked") || v.includes("needs")) return "border-rose-200 bg-rose-50 text-rose-700";
  if (v.includes("high") || v.includes("amber") || v.includes("pending")) return "border-amber-200 bg-amber-50 text-amber-700";
  if (v.includes("ready") || v.includes("green") || v.includes("valid") || v.includes("approved")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function Badge({ children, tone = "default" }: { children: ReactNode; tone?: string }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${badgeTone(tone)}`}>{children}</span>;
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-950">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
    </div>
  );
}

function TaskTimelineRow({ task, selected, onSelect }: { task: V94TaskNode; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className={`w-full rounded-2xl border p-4 text-left transition ${selected ? "border-emerald-300 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black text-slate-400">{task.code} · {task.folder}</div>
          <h3 className="mt-1 text-base font-black text-slate-950">{task.title}</h3>
          <p className="mt-1 text-xs text-slate-500">{task.project} · {task.department} · {task.owner}</p>
        </div>
        <div className="flex flex-wrap gap-2"><Badge tone={task.priority}>{task.priority}</Badge><Badge tone={task.status}>{task.status}</Badge></div>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-slate-500 md:grid-cols-5">
        <span>Start: <b className="text-slate-700">{task.start}</b></span>
        <span>Due: <b className="text-slate-700">{task.due}</b></span>
        <span>Ore: <b className="text-slate-700">{task.estimateHours}/{task.capacityHours}</b></span>
        <span>Deps: <b className="text-slate-700">{task.dependencyCount}</b></span>
        <span>Updates: <b className="text-slate-700">{task.updateCount}</b></span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${task.progress}%` }} /></div>
    </button>
  );
}

function DrawerPanel({ task }: { task: V94TaskNode }) {
  const taskMutations = payload.mutations.filter((mutation) => mutation.taskId === task.id);
  return (
    <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">Task drawer · mutation queue</div>
      <h2 className="mt-2 text-2xl font-black text-slate-950">{task.code}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{task.title}</p>
      <div className="mt-4 grid gap-2 text-xs text-slate-500">
        <div className="rounded-xl bg-slate-50 p-3"><b>Status:</b> {task.status}</div>
        <div className="rounded-xl bg-slate-50 p-3"><b>Owner:</b> {task.owner}</div>
        <div className="rounded-xl bg-slate-50 p-3"><b>Due:</b> {task.due}</div>
        <div className="rounded-xl bg-slate-50 p-3"><b>Custom fields:</b> site, inverter, approval, rollback</div>
      </div>
      <div className="mt-5 space-y-3">
        {taskMutations.length ? taskMutations.map((mutation) => <MutationCard key={mutation.id} mutation={mutation} />) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No staged mutation for selected task.</p>}
      </div>
    </aside>
  );
}

function MutationCard({ mutation }: { mutation: { id: string; field: string; before: string; after: string; actor: string; state: V94MutationState; approvalGate: string; rollbackCheckpoint: string; auditEnvelope: string } }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap justify-between gap-2"><b className="text-sm text-slate-950">{mutation.field}</b><Badge tone={mutation.state}>{mutation.state}</Badge></div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{mutation.before} → <b className="text-slate-700">{mutation.after}</b></p>
      <p className="mt-2 text-xs text-slate-500">Gate: {mutation.approvalGate}</p>
      <p className="mt-1 text-xs text-slate-500">Rollback: {mutation.rollbackCheckpoint}</p>
    </div>
  );
}

export function V94GoodDayTimelineDrawerMutation({ mode }: { mode: V94Mode }) {
  const [selectedId, setSelectedId] = useState(payload.tasks[0]?.id ?? "");
  const selectedTask = useMemo(() => payload.tasks.find((task) => task.id === selectedId) ?? payload.tasks[0], [selectedId]);
  const isAdmin = mode === "admin";
  const isQueue = mode === "mutation-queue" || mode === "approvals" || mode === "templates";

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 lg:p-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950 p-7 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Taskuri canonical · v9.4.0</p>
              <h1 className="mt-3 max-w-6xl text-4xl font-black tracking-tight">{labels[mode]}</h1>
              <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-200">Timeline/Gantt dependencies, calendar capacity sync and drawer mutations are now part of the real Taskuri execution workspace. Global production writes remain gated.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm">
              <div className="font-black text-emerald-200">Production writes</div>
              <div className="mt-1 text-xl font-black">OFF / PILOT GATED</div>
            </div>
          </div>
        </div>
        <div className="grid gap-3 bg-slate-50 p-5 md:grid-cols-2 xl:grid-cols-4">
          {payload.metrics.map((metric) => <Metric key={metric.label} {...metric} />)}
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card title="Taskuri timeline board" subtitle="Aceleași taskuri sunt folosite pentru timeline, calendar capacity, Gantt-ready dependencies și drawer mutations.">
            <div className="space-y-3">{payload.tasks.map((task) => <TaskTimelineRow key={task.id} task={task} selected={task.id === selectedId} onSelect={() => setSelectedId(task.id)} />)}</div>
          </Card>

          {(mode === "timeline" || mode === "gantt" || isAdmin) && (
            <Card title="Dependency editor" subtitle="Relații pregătite pentru Gantt/timeline fără a crea un modul separat.">
              <div className="grid gap-3 md:grid-cols-2">{payload.dependencies.map((dep) => <div key={dep.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex justify-between gap-2"><b>{dep.kind}</b><Badge tone={dep.status}>{dep.status}</Badge></div><p className="mt-2 text-xs text-slate-500">{dep.fromTaskId} → {dep.toTaskId} · lag {dep.lagDays} zile</p><p className="mt-2 text-xs leading-5 text-slate-500">{dep.evidence}</p></div>)}</div>
            </Card>
          )}

          {(mode === "calendar" || isAdmin) && (
            <Card title="Calendar capacity sync" subtitle="Planificarea due-date este legată de workload, echipe și dependențe.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{payload.capacity.map((row) => <div key={row.team} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-black text-slate-950">{row.team}</div><div className="mt-2 text-2xl font-black">{row.plannedHours}/{row.availableHours}h</div><Badge tone={row.risk}>{row.risk}</Badge><p className="mt-2 text-xs leading-5 text-slate-500">{row.note}</p></div>)}</div>
            </Card>
          )}

          {isQueue && (
            <Card title="Mutation queue / approval workflow builder" subtitle="Inline drawer updates sunt staged, auditate și reversibile înainte de orice pilot write.">
              <div className="grid gap-3 xl:grid-cols-2">{payload.mutations.map((mutation) => <MutationCard key={mutation.id} mutation={mutation} />)}</div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">{payload.approvalWorkflows.map((flow) => <div key={flow.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><b>{flow.name}</b><p className="mt-2 text-xs text-slate-500">{flow.department} · {flow.readiness}% ready</p><p className="mt-2 text-xs leading-5 text-slate-500">{flow.steps.join(" → ")}</p></div>)}</div>
            </Card>
          )}

          {(mode === "templates" || mode === "policies" || isAdmin) && (
            <Card title="Task templates, recurrence and policy contracts" subtitle="Șabloanele și politicile sunt contracte operaționale în Taskuri, nu pagini izolate.">
              <div className="grid gap-3 xl:grid-cols-2">
                {payload.templates.map((tpl) => <div key={tpl.id} className="rounded-2xl border border-slate-200 bg-white p-4"><b>{tpl.name}</b><p className="mt-2 text-xs text-slate-500">{tpl.recurrence} · {tpl.defaultOwner} · {tpl.policy}</p><p className="mt-2 text-xs text-slate-500">Fields: {tpl.requiredFields.join(", ")}</p></div>)}
                {payload.policyContracts.map((policy) => <div key={policy.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><b>{policy.name}</b><p className="mt-2 text-xs text-slate-500">{policy.scope} · {policy.enforcement}</p><Badge tone={policy.status}>{policy.status}</Badge></div>)}
              </div>
            </Card>
          )}
        </div>
        <DrawerPanel task={selectedTask} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card title="Readiness delta" subtitle="Build incremental major, fără schimbare de navigație.">
          <div className="space-y-3">{payload.readiness.map((row) => <div key={row.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex justify-between gap-3"><b>{row.category}</b><span className="font-black text-emerald-700">{row.previous}% → {row.current}%</span></div><p className="mt-2 text-xs text-slate-500">Next: {row.next}</p></div>)}</div>
        </Card>
        <Card title="Activity stream" subtitle="Mutations, approvals and recurrence previews land in one Taskuri activity stream.">
          <div className="space-y-3">{payload.activity.map((item) => <div key={`${item.at}-${item.actor}`} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs font-black text-slate-400">{item.at} · {item.actor}</div><p className="mt-1 text-sm text-slate-700">{item.text}</p></div>)}</div>
        </Card>
      </section>
    </main>
  );
}
