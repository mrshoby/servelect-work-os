"use client";

import {
  getV83PrismaAuditOutboxTransactionPilot,
  type V83OutboxEvent,
  type V83WriteTransaction,
} from "../../lib/enterprise/work-os-v83-prisma-audit-outbox-transaction-pilot";

const data = getV83PrismaAuditOutboxTransactionPilot();

function badgeClass(value: string) {
  if (["allow", "committed", "delivered", "primary_pilot"].includes(value)) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (["queued", "processing", "canary", "dry_run"].includes(value)) return "border-amber-200 bg-amber-50 text-amber-700";
  if (["block", "blocked", "failed", "rolled_back"].includes(value)) return "border-rose-200 bg-rose-50 text-rose-700";
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

function TransactionRow({ transaction }: { transaction: V83WriteTransaction }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{transaction.id}</td>
      <td className="px-4 py-3 text-slate-600">{transaction.lane}</td>
      <td className="px-4 py-3 text-slate-600">{transaction.entityType} · {transaction.entityId}</td>
      <td className="px-4 py-3 text-slate-600">v{transaction.lockVersion}</td>
      <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(transaction.policyDecision)}`}>{transaction.policyDecision}</span></td>
      <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(transaction.status)}`}>{transaction.status}</span></td>
      <td className="px-4 py-3 text-slate-500">{transaction.rollbackCheckpoint}</td>
    </tr>
  );
}

function OutboxCard({ event }: { event: V83OutboxEvent }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-950">{event.provider}</div>
          <div className="mt-1 text-xs text-slate-500">{event.channelTarget}</div>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(event.status)}`}>{event.status}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div><span className="font-medium text-slate-700">Attempts:</span> {event.attempts}</div>
        <div><span className="font-medium text-slate-700">Txn:</span> {event.transactionId}</div>
        <div className="col-span-2"><span className="font-medium text-slate-700">Last:</span> {event.lastAttemptAt}</div>
        {event.nextRetryAt ? <div className="col-span-2"><span className="font-medium text-slate-700">Retry:</span> {event.nextRetryAt}</div> : null}
        {event.lastError ? <div className="col-span-2 text-rose-600">{event.lastError}</div> : null}
      </div>
    </div>
  );
}

export default function V83PrismaAuditOutboxTransactionPilot({ surface = "work-os" }: { surface?: "work-os" | "admin" }) {
  const adminMode = surface === "admin";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">SERVELECT WORK OS · v8.3.0</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Prisma Audit/Outbox Tables & Transactional Write Pilot
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {adminMode
                ? "Admin runtime control for additive Prisma audit/outbox models, transactional pilot lanes, rollback replay and provider dispatch readiness."
                : "Work OS production pilot view for session-bound writes, audit evidence, provider outbox and Vercel runtime proof without enabling global production writes."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">primary pilot gated</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">Prisma additive schema</span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Vercel proof required</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Transactions" value={data.summary.allowedTransactions + data.summary.blockedTransactions} helper="pilot lanes with lockVersion + rollback" />
        <MetricCard label="Audit events" value={data.summary.auditEvents} helper="before/after hash + actor decision" />
        <MetricCard label="Outbox events" value={data.summary.outboxEvents} helper="in_app/email/webhook state" />
        <MetricCard label="Prisma models" value={data.prismaSchemaModels.length} helper="schema patch prepared" />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="text-sm font-semibold text-slate-950">Transactional write pilot lanes</div>
            <div className="mt-1 text-xs text-slate-500">Every write candidate must pass session claims, ACL policy, lockVersion, audit event creation and rollback checkpoint before primary pilot.</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">Lane</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Lock</th>
                  <th className="px-4 py-3">Policy</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rollback</th>
                </tr>
              </thead>
              <tbody>{data.transactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}</tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-950">Runtime proof checklist</div>
          <div className="mt-2 text-xs text-slate-500">{data.runtimeProof.baseUrl}</div>
          <div className="mt-4 space-y-3">
            {data.runtimeProof.evidence.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            {data.runtimeProof.nextProofRequired}
          </div>
        </aside>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-950">Provider event outbox</h2>
            <span className="text-xs text-slate-500">dispatch worker ready · not globally enabled</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.outboxEvents.map((event) => <OutboxCard key={event.id} event={event} />)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-950">Prisma schema patch</h2>
          <div className="mt-4 space-y-2">
            {data.prismaSchemaModels.map((model) => (
              <div key={model} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{model}</div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            The migration is additive and does not enable global writes. It prepares the database layer for audit event persistence, provider event dispatch and transaction rollback replay.
          </p>
        </div>
      </section>
    </main>
  );
}
