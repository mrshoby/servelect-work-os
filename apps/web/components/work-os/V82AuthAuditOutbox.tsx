"use client";

import type { ReactNode } from "react";

import {
  V82_RELEASE_NAME,
  V82_RELEASE_VERSION,
  v82AuditEvents,
  v82AuditSummary,
  v82EvaluatePolicy,
  v82GlobalScores,
  v82OutboxSummary,
  v82PolicyRules,
  v82ProgressScores,
  v82ProviderOutbox,
  v82ProviderRuntime,
  v82ReadinessSummary,
  v82ReplayDrill,
  v82RouteList,
  v82SessionClaims
} from "@/lib/enterprise/work-os-v82-auth-audit-outbox";

function Badge({ status, children }: { status: string; children: ReactNode }) {
  const normalized = status.toLowerCase();
  const cls = normalized.includes("allow") || normalized.includes("ready") || normalized.includes("passed") || normalized.includes("delivered") || normalized.includes("verified")
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : normalized.includes("block") || normalized.includes("failed") || normalized.includes("expired")
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : normalized.includes("warning") || normalized.includes("review") || normalized.includes("processing")
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-sky-200 bg-sky-50 text-sky-700";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-950">{value}%</div>
      <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${value}%` }} /></div>
    </div>
  );
}

export function V82AuthAuditOutbox({ mode = "workos" }: { mode?: "workos" | "admin" }) {
  const scores = v82GlobalScores();
  const readiness = v82ReadinessSummary();
  const auditSummary = v82AuditSummary();
  const outboxSummary = v82OutboxSummary();
  const escalationDecision = v82EvaluatePolicy("usr-audit-manager", "tickets:escalate", "Audit energetic");
  const blockedDecision = v82EvaluatePolicy("usr-comercial", "admin:acl", "Comercial");
  const adminDecision = v82EvaluatePolicy("usr-super-admin", "workos:rollback", "Producție");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">SERVELECT WORK OS · {mode === "admin" ? "Admin control plane" : "Work OS pilot lane"}</div>
                <h1 className="mt-2 text-2xl font-semibold">v{V82_RELEASE_VERSION} — {V82_RELEASE_NAME}</h1>
                <p className="mt-2 max-w-4xl text-sm text-slate-300">Session claims, audit event trail and provider outbox evidence for the primary write pilot. This is not a separate demo: it is the next control layer after v8.1 session-bound ACL and provider runtime evidence.</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                <div className="font-semibold">Status: {readiness.status}</div>
                <div className="text-xs text-emerald-200">Next: {readiness.nextBuild}</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-4">
            <Score label="GoodDay UX" value={scores.goodDayVisualSimilarity} />
            <Score label="Functional parity" value={scores.goodDayFunctionalParity} />
            <Score label="Backend/API parity" value={scores.backendApiParity} />
            <Score label="Production readiness" value={scores.productionReadiness} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Authenticated session claims</h2>
                <p className="text-sm text-slate-500">Role, department, team and client scope are evaluated before primary/canary writes.</p>
              </div>
              <Badge status="ready">{v82SessionClaims.length} claims</Badge>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="p-3">Actor</th><th className="p-3">Scope</th><th className="p-3">Auth</th><th className="p-3">Write mode</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {v82SessionClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="p-3"><div className="font-medium">{claim.actorName}</div><div className="text-xs text-slate-500">{claim.role}</div></td>
                      <td className="p-3 text-slate-600">{claim.department} · {claim.team}</td>
                      <td className="p-3"><Badge status={claim.sessionStatus}>{claim.authSource}</Badge></td>
                      <td className="p-3"><Badge status={claim.maxWriteMode}>{claim.maxWriteMode}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Policy proof</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="font-medium">Audit manager escalates department ticket</div><Badge status={escalationDecision.decision}>{escalationDecision.decision}</Badge><p className="mt-1 text-xs text-slate-500">{escalationDecision.reason}</p></div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="font-medium">Comercial tries admin ACL share</div><Badge status={blockedDecision.decision}>{blockedDecision.decision}</Badge><p className="mt-1 text-xs text-slate-500">{blockedDecision.reason}</p></div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="font-medium">Super Admin rollback drill</div><Badge status={adminDecision.decision}>{adminDecision.decision}</Badge><p className="mt-1 text-xs text-slate-500">{adminDecision.reason}</p></div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Audit/outbox summary</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Audit events</div><div className="text-2xl font-semibold">{auditSummary.total}</div></div>
                <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs text-slate-500">With rollback</div><div className="text-2xl font-semibold">{auditSummary.withRollback}</div></div>
                <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Outbox events</div><div className="text-2xl font-semibold">{outboxSummary.total}</div></div>
                <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Blocked</div><div className="text-2xl font-semibold">{outboxSummary.blocked}</div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Audit event trail</h2>
            <div className="mt-4 space-y-3">
              {v82AuditEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><div className="font-medium">{event.action}</div><Badge status={event.decision}>{event.decision}</Badge></div>
                  <div className="mt-2 text-sm text-slate-600">{event.entity} · {event.entityId} · {event.department}</div>
                  <div className="mt-1 text-xs text-slate-500">rollback: {event.rollbackId} · before: {event.beforeHash} · after: {event.afterHash}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Provider outbox</h2>
            <div className="mt-4 space-y-3">
              {v82ProviderOutbox.map((event) => (
                <div key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between"><div className="font-medium">{event.provider} · {event.channel}</div><Badge status={event.state}>{event.state}</Badge></div>
                  <div className="mt-2 text-sm text-slate-600">{event.entityLink}</div>
                  <div className="mt-1 text-xs text-slate-500">attempts: {event.attempts} · retry: {event.retryAfterSec}s · audit: {event.auditEventId}</div>
                  {event.lastError ? <div className="mt-1 text-xs text-rose-600">{event.lastError}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-950">Provider runtime</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {v82ProviderRuntime.map((provider) => (
                <div key={provider.provider} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between"><div className="font-semibold">{provider.provider}</div><Badge status={provider.status}>{provider.status}</Badge></div>
                  <p className="mt-2 text-sm text-slate-600">events {provider.outboxEvents} · delivered {provider.delivered} · failed {provider.failed} · p95 {provider.p95Ms}ms</p>
                  <p className="mt-1 text-xs text-slate-500">Missing: {provider.missing}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Policy rules</h2>
            <div className="mt-4 space-y-3">
              {v82PolicyRules.map((rule) => (
                <div key={rule.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm">
                  <div className="flex items-center justify-between"><div className="font-medium">{rule.name}</div><Badge status={rule.status}>{rule.status}</Badge></div>
                  <div className="mt-1 text-xs text-slate-500">{rule.requiredPermission} · {rule.maxMode}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Replay drill</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {v82ReplayDrill.map((step) => (
              <div key={step.step} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2"><div className="font-medium">{step.step}</div><Badge status={step.status}>{step.status}</Badge></div>
                <p className="mt-2 text-sm text-slate-600">{step.evidence}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Progress to 100%</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Categorie</th><th className="p-3">Înainte</th><th className="p-3">După</th><th className="p-3">Ce lipsește</th></tr></thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {v82ProgressScores.map((score) => <tr key={score.category}><td className="p-3 font-medium">{score.category}</td><td className="p-3">{score.before}%</td><td className="p-3 font-semibold text-emerald-700">{score.after}%</td><td className="p-3 text-slate-600">{score.missing}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-slate-500">Routes added: {v82RouteList().join(" · ")}</div>
        </section>
      </div>
    </main>
  );
}
