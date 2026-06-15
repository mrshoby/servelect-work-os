"use client";

import {
  getV84DatabaseAdapterDispatchWorker,
  type V84DatabaseAdapter,
  type V84DispatchWorker,
  type V84QueueItem,
} from "../../lib/enterprise/work-os-v84-database-adapter-dispatch-worker";

const data = getV84DatabaseAdapterDispatchWorker();

function badgeClass(value: string) {
  if (["pilot_enabled", "ready", "delivered", "processing"].includes(value)) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (["shadow", "dry_run", "retry_wait", "leased", "degraded"].includes(value)) return "border-amber-200 bg-amber-50 text-amber-700";
  if (["blocked", "dead_letter", "not_configured"].includes(value)) return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function MetricCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{helper}</div>
    </div>
  );
}

function AdapterCard({ adapter }: { adapter: V84DatabaseAdapter }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-950">{adapter.name}</div>
          <div className="mt-1 text-xs text-slate-500">{adapter.transactionScope}</div>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(adapter.mode)}`}>{adapter.mode}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div><span className="font-medium text-slate-700">Connection:</span> {adapter.connection}</div>
        <div><span className="font-medium text-slate-700">Writes:</span> {adapter.writesEnabled ? "enabled" : "blocked"}</div>
        <div><span className="font-medium text-slate-700">RLS:</span> {adapter.rlsRequired ? "required" : "not required"}</div>
        <div><span className="font-medium text-slate-700">Proof:</span> {adapter.lastProofAt}</div>
      </div>
      {adapter.blockers.length > 0 ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <div className="font-semibold">Blockers before full production</div>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {adapter.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function WorkerRow({ worker }: { worker: V84DispatchWorker }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3 font-medium text-slate-900">{worker.id}</td>
      <td className="px-4 py-3 text-slate-600">{worker.provider}</td>
      <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(worker.status)}`}>{worker.status}</span></td>
      <td className="px-4 py-3 text-slate-600">{worker.leaseTtlSec}s</td>
      <td className="px-4 py-3 text-slate-600">{worker.maxAttempts}</td>
      <td className="px-4 py-3 text-slate-600">{worker.processed24h}</td>
      <td className="px-4 py-3 text-slate-600">{worker.failed24h}</td>
    </tr>
  );
}

function QueueRow({ item }: { item: V84QueueItem }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{item.id}</td>
      <td className="px-4 py-3 text-slate-600">{item.lane}</td>
      <td className="px-4 py-3 text-slate-600">{item.entityType} · {item.entityId}</td>
      <td className="px-4 py-3 text-slate-600">{item.department}</td>
      <td className="px-4 py-3 text-slate-600">v{item.lockVersion}</td>
      <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(item.adapterMode)}`}>{item.adapterMode}</span></td>
      <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(item.status)}`}>{item.status}</span></td>
      <td className="px-4 py-3 text-slate-500">{item.provider}</td>
      <td className="px-4 py-3 text-slate-500">{item.attempts}</td>
    </tr>
  );
}

export default function V84DatabaseAdapterDispatchWorker({ surface = "work-os" }: { surface?: "work-os" | "admin" }) {
  const adminMode = surface === "admin";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">SERVELECT WORK OS · v8.4.0</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Database Adapter Transaction Execution & Provider Dispatch Worker
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {adminMode
                ? "Admin control plane for DB adapter pilot execution, provider leases, retry/backoff and dead-letter recovery without global production writes."
                : "Work OS runtime view for transactional adapter execution, outbox dispatch workers and rollback-ready queue evidence."}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Global production writes: <span className="font-semibold">OFF</span> · Pilot: <span className="font-semibold">gated</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Queue items" value={data.metrics.queued} helper="transactional lanes tracked" />
          <MetricCard label="Delivered" value={data.metrics.delivered} helper="provider events confirmed" />
          <MetricCard label="Dead letters" value={data.metrics.deadLetter} helper="recoverable with explicit action" />
          <MetricCard label="P95 dispatch" value={`${data.metrics.p95DispatchMs}ms`} helper="runtime evidence target" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {data.adapters.map((adapter) => <AdapterCard key={adapter.id} adapter={adapter} />)}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-950">Provider dispatch workers</h2>
            <p className="mt-1 text-xs text-slate-500">Lease TTL, retry/backoff and dead-letter state for each channel.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Worker</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Lease</th>
                  <th className="px-4 py-3">Attempts</th>
                  <th className="px-4 py-3">24h OK</th>
                  <th className="px-4 py-3">24h Fail</th>
                </tr>
              </thead>
              <tbody>{data.workers.map((worker) => <WorkerRow key={worker.id} worker={worker} />)}</tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-950">Transactional queue execution</h2>
            <p className="mt-1 text-xs text-slate-500">Queue items keep actor, department, lockVersion, adapter mode, rollback checkpoint and provider attempts.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Lane</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Lock</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Attempts</th>
                </tr>
              </thead>
              <tbody>{data.queue.map((item) => <QueueRow key={item.id} item={item} />)}</tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-950">Dead-letter recovery</h2>
            <div className="mt-4 space-y-3">
              {data.deadLetters.map((item) => (
                <div key={item.id} className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-900">
                  <div className="font-semibold">{item.id} · {item.provider}</div>
                  <div className="mt-1 text-xs leading-5">{item.reason}</div>
                  <div className="mt-2 text-xs text-rose-700">Recovery: {item.recoveryAction}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-950">Runtime proof</h2>
            <dl className="mt-4 grid gap-3 text-sm text-slate-600">
              <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-400">API route</dt><dd className="mt-1 font-medium text-slate-900">{data.runtimeProof.apiRoute}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-400">Expected smoke</dt><dd className="mt-1 font-medium text-slate-900">{data.runtimeProof.expectedSmoke}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-400">Screenshots</dt><dd className="mt-1 font-medium text-slate-900">{data.runtimeProof.expectedScreenshots}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-400">Next build</dt><dd className="mt-1 font-medium text-slate-900">{data.nextBuild}</dd></div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
