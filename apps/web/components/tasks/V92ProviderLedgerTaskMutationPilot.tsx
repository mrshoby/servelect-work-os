"use client";

import { useMemo, useState } from "react";
import type { V92Surface } from "@/lib/enterprise/work-os-v92-provider-ledger-task-mutation-pilot";
import { getV92SurfacePayload } from "@/lib/enterprise/work-os-v92-provider-ledger-task-mutation-pilot";

type Props = {
  surface: V92Surface;
};

function tone(status: string) {
  if (status === "ready") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "gated" || status === "review") return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "blocked") return "border-rose-200 bg-rose-50 text-rose-800";
  return "border-blue-200 bg-blue-50 text-blue-800";
}

function Badge({ children, status = "ready" }: { children: React.ReactNode; status?: string }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-black ${tone(status)}`}>{children}</span>;
}

function Panel({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
    </div>
  );
}

export function V92ProviderLedgerTaskMutationPilot({ surface }: Props) {
  const data = useMemo(() => getV92SurfacePayload(surface), [surface]);
  const [selectedTask, setSelectedTask] = useState(data.taskObjects[0]?.id ?? "SWO-790");
  const currentTask = data.taskObjects.find((task) => task.id === selectedTask) ?? data.taskObjects[0];

  return (
    <main className="space-y-5 p-4 md:p-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
                Taskuri · v{data.release.version} · {data.release.canonicalMenu}
              </p>
              <h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight">{data.surfaceTitle}</h1>
              <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-200">{data.release.summary}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">Production writes</div>
              <div className="mt-2 text-lg font-black">{data.release.productionWrites}</div>
              <p className="mt-1 text-xs text-slate-300">global off · pilot gated · rollback required</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-5">
          <Metric label="Readiness" value={`${data.summary.readiness}%`} hint="Average across execution, ledger, webhook and pilot gates." />
          <Metric label="Ledger rows" value={String(data.summary.totalLedger)} hint="Provider dispatch + webhook intake rows." />
          <Metric label="Task objects" value={String(data.summary.taskObjects)} hint="Types, dependencies, recurrence, watchers, custom fields." />
          <Metric label="Gated/review" value={String(data.summary.gated)} hint="Require manager or operator decision before write." />
          <Metric label="Blocked" value={String(data.summary.blocked)} hint="Intentionally blocked when signature/secret/approval is missing." />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Provider dispatch ledger"
          subtitle="GoodDay-like execution means operational actions are visible, attributable and recoverable, not hidden behind a button."
        >
          <div className="space-y-3">
            {data.dispatchLedger.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">{entry.id} · {entry.module}</div>
                    <h3 className="mt-1 font-black text-slate-950">{entry.label}</h3>
                    <p className="mt-1 text-sm text-slate-600">{entry.actor} → {entry.target}</p>
                  </div>
                  <Badge status={entry.status}>{entry.status}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-600 md:grid-cols-4">
                  <span className="rounded-xl bg-white p-3 ring-1 ring-slate-200">Provider: {entry.provider}</span>
                  <span className="rounded-xl bg-white p-3 ring-1 ring-slate-200">Attempts: {entry.attempts}</span>
                  <span className="rounded-xl bg-white p-3 ring-1 ring-slate-200">Last: {entry.lastEvent}</span>
                  <span className="rounded-xl bg-white p-3 ring-1 ring-slate-200">Next: {entry.nextAction}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{entry.evidence}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Webhook intake ledger" subtitle="Signed intake is mapped to idempotency keys before any task/request mutation is allowed.">
          <div className="space-y-3">
            {data.webhookLedger.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{entry.source}</div>
                    <p className="mt-1 text-xs text-slate-500">{entry.idempotencyKey}</p>
                  </div>
                  <Badge status={entry.status}>{entry.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge status={entry.signature === "verified" ? "ready" : "blocked"}>signature: {entry.signature}</Badge>
                  <Badge status="queued">{entry.duplicatePolicy}</Badge>
                  <Badge status="ready">{entry.mappedTask}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{entry.evidence}</p>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Task mutation pilot" subtitle="Each write candidate shows write mode, approval gate, rollback checkpoint and activity before execution.">
          <div className="space-y-3">
            {data.mutationPilots.map((pilot) => (
              <article key={pilot.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{pilot.department} · {pilot.mutation}</div>
                    <h3 className="mt-1 font-black text-slate-950">{pilot.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{pilot.assignee} · {pilot.approvalGate}</p>
                  </div>
                  <Badge status={pilot.status}>{pilot.writeMode}</Badge>
                </div>
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-600">Rollback: {pilot.rollbackCheckpoint}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {pilot.activity.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="GoodDay-like task object model" subtitle="Taskuri now has a clearer object foundation: type, fields, dependencies, recurrence, watchers and activity.">
          <div className="mb-3 flex flex-wrap gap-2">
            {data.taskObjects.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTask(task.id)}
                className={`rounded-full px-4 py-2 text-xs font-black ring-1 ${selectedTask === task.id ? "bg-slate-950 text-white ring-slate-950" : "bg-white text-slate-700 ring-slate-200"}`}
              >
                {task.id}
              </button>
            ))}
          </div>
          {currentTask ? (
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Badge status="ready">{currentTask.type}</Badge>
                  <h3 className="mt-3 text-2xl font-black text-slate-950">{currentTask.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{currentTask.folder} · {currentTask.owner}</p>
                </div>
                <Badge status={currentTask.priority === "Critical" ? "blocked" : "review"}>{currentTask.priority}</Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Custom fields</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">{currentTask.customFields.map((item) => <li key={item}>• {item}</li>)}</ul>
                </div>
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Dependencies / recurrence</div>
                  <p className="mt-2 text-sm text-slate-600">Dependencies: {currentTask.dependencies.length ? currentTask.dependencies.join(", ") : "none"}</p>
                  <p className="mt-1 text-sm text-slate-600">Recurrence: {currentTask.recurrence}</p>
                  <p className="mt-1 text-sm text-slate-600">Watchers: {currentTask.watchers.join(", ")}</p>
                </div>
              </div>
            </article>
          ) : null}
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="Readiness delta" subtitle="Incremental movement toward a practical Work OS, without enabling global writes.">
          <div className="space-y-3">
            {data.readiness.map((item) => (
              <div key={item.category} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-black text-slate-950">{item.category}</div>
                  <Badge status={item.status}>{item.previous}% → {item.current}%</Badge>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.current}%` }} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.evidence}</p>
                <p className="mt-1 text-xs font-bold text-slate-400">Next: {item.next}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Activity stream & guardrails" subtitle="The page shows why each action is safe, gated, blocked or ready.">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="font-black text-slate-950">Activity stream</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {data.activityStream.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="font-black text-slate-950">Guardrails</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {data.guardrails.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </Panel>
      </section>
    </main>
  );
}
