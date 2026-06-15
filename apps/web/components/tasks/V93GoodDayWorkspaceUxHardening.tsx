"use client";

import { useMemo, useState } from "react";
import { getV93GoodDayWorkspaceUxHardening, type V93Mode, type V93TaskRecord } from "@/lib/enterprise/work-os-v93-goodday-workspace-ux-hardening";

const payload = getV93GoodDayWorkspaceUxHardening();

const modeLabels: Record<V93Mode, string> = {
  overview: "Workspace command",
  "my-work": "My Work focus",
  keyboard: "Keyboard commands",
  "saved-views": "Saved view policies",
  bulk: "Bulk operations",
  drawer: "Task drawer",
  notifications: "Updates & notifications",
  admin: "Governance",
};

function tone(priority: string) {
  if (priority === "urgent") return "border-rose-200 bg-rose-50 text-rose-700";
  if (priority === "high") return "border-amber-200 bg-amber-50 text-amber-700";
  if (priority === "medium") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function statusTone(status: string) {
  if (status === "Finalizat") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Blocat") return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "Review") return "border-purple-200 bg-purple-50 text-purple-700";
  if (status === "În lucru") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${className}`}>{children}</span>;
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

function TaskRow({ task, active, onSelect }: { task: V93TaskRecord; active: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-emerald-300 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black text-slate-400">{task.code} · {task.folder}</div>
          <h3 className="mt-1 text-base font-black text-slate-950">{task.title}</h3>
          <p className="mt-1 text-xs text-slate-500">{task.project} · {task.department} · {task.owner}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={tone(task.priority)}>{task.priority}</Badge>
          <Badge className={statusTone(task.status)}>{task.status}</Badge>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${task.progress}%` }} /></div>
      <div className="mt-3 grid gap-2 text-xs text-slate-500 md:grid-cols-4">
        <span>Due: <b className="text-slate-700">{task.due}</b></span>
        <span>Ore: <b className="text-slate-700">{task.loggedHours}/{task.estimateHours}</b></span>
        <span>Comentarii: <b className="text-slate-700">{task.comments}</b></span>
        <span>Blockers: <b className="text-slate-700">{task.blockers}</b></span>
      </div>
    </button>
  );
}

function Drawer({ task }: { task: V93TaskRecord }) {
  return (
    <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Task drawer</div>
          <h2 className="mt-2 text-xl font-black text-slate-950">{task.code}</h2>
        </div>
        <Badge className={statusTone(task.status)}>{task.status}</Badge>
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950">{task.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{task.nextAction}</p>
      <div className="mt-4 grid gap-2">
        {task.customFields.map((field) => <div key={field.label} className="flex justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm"><span className="font-bold text-slate-500">{field.label}</span><span className="font-black text-slate-950">{field.value}</span></div>)}
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Activity composer</div>
        <textarea className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-300" defaultValue="Scrie update intern, atașează evidence sau cere aprobare..." />
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white">Stage update</button>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700">Request approval</button>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {payload.drawerSections.map((section) => <div key={section.id} className="rounded-2xl border border-slate-200 p-3"><div className="font-black text-slate-950">{section.title}</div><p className="mt-1 text-xs text-slate-500">{section.items.join(" · ")}</p></div>)}
      </div>
    </aside>
  );
}

export function V93GoodDayWorkspaceUxHardening({ mode = "overview" }: { mode?: V93Mode }) {
  const [selectedId, setSelectedId] = useState(payload.tasks[0]?.id ?? "");
  const selected = useMemo(() => payload.tasks.find((task) => task.id === selectedId) ?? payload.tasks[0], [selectedId]);
  const focusTasks = mode === "my-work" ? payload.tasks.filter((task) => task.owner.includes("Andrei") || task.owner.includes("Ioana")) : payload.tasks;

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Taskuri · v{payload.version} · {modeLabels[mode]}</p>
              <h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight">GoodDay-like Workspace UX Hardening</h1>
              <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-200">{payload.summary}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur">
              <div className="font-black text-emerald-200">Production writes</div>
              <div className="mt-1 text-2xl font-black">OFF</div>
              <p className="mt-1 text-xs text-slate-300">pilot gated / rollback preview</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {payload.metrics.map((metric) => <Metric key={metric.label} {...metric} />)}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_410px]">
        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Canonical Taskuri workspace</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Action list, table, drawer și policies în același loc</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">single menu</Badge>
                <Badge className="border-blue-200 bg-blue-50 text-blue-700">no separate app</Badge>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {focusTasks.map((task) => <TaskRow key={task.id} task={task} active={selected?.id === task.id} onSelect={() => setSelectedId(task.id)} />)}
            </div>
          </div>

          {(mode === "saved-views" || mode === "overview") && <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black text-slate-950">Saved view policies</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{payload.savedViewPolicies.map((view) => <div key={view.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-black text-slate-950">{view.name}</div><p className="mt-1 text-xs text-slate-500">{view.scope} · {view.owner}</p><p className="mt-3 text-xs leading-5 text-slate-600">{view.filters.join(" · ")}</p><div className="mt-3"><Badge className={view.approvalRequired ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>{view.approvalRequired ? "approval" : "private"}</Badge></div></div>)}</div></section>}

          {(mode === "bulk" || mode === "overview") && <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black text-slate-950">Bulk operations preview</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{payload.bulkOperations.map((op) => <div key={op.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-black text-slate-950">{op.label}</div><p className="mt-1 text-xs text-slate-500">{op.records} records · {op.rollback}</p><p className="mt-3 text-xs leading-5 text-slate-600">{op.audit}</p><div className="mt-3"><Badge className={op.mode === "blocked" ? "border-rose-200 bg-rose-50 text-rose-700" : op.mode === "manager_approved" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-blue-200 bg-blue-50 text-blue-700"}>{op.mode}</Badge></div></div>)}</div></section>}

          {(mode === "keyboard" || mode === "overview") && <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black text-slate-950">Keyboard command layer</h2><div className="mt-4 grid gap-3 md:grid-cols-5">{payload.shortcuts.map((shortcut) => <div key={shortcut.keys} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><kbd className="rounded-xl bg-slate-950 px-3 py-1 text-sm font-black text-white">{shortcut.keys}</kbd><div className="mt-3 font-black text-slate-950">{shortcut.action}</div><p className="mt-1 text-xs text-slate-500">{shortcut.safeMode}</p></div>)}</div></section>}

          {(mode === "notifications" || mode === "admin") && <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-black text-slate-950">Updates & notification queue</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{payload.notificationQueue.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-black text-slate-950">{item.type}</div><p className="mt-1 text-xs text-slate-500">{item.target} · {item.status}</p><p className="mt-3 text-xs leading-5 text-slate-600">{item.evidence}</p></div>)}</div></section>}
        </div>
        {selected && <Drawer task={selected} />}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Progress față de buildul anterior</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {payload.readiness.map((row) => <div key={row.category} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{row.category}</div><div className="mt-2 text-2xl font-black text-slate-950">{row.current}%</div><p className="mt-1 text-xs text-emerald-700">+{row.current - row.previous} pts</p><p className="mt-2 text-xs leading-5 text-slate-500">{row.next}</p></div>)}
        </div>
      </section>
    </main>
  );
}
