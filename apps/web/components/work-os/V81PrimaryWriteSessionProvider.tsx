import {
  V81_RELEASE_NAME,
  V81_RELEASE_VERSION,
  v81EvaluateSessionAcl,
  v81GlobalScores,
  v81PrimaryWriteQueue,
  v81ProgressScores,
  v81ProviderRuntimeEvidence,
  v81ReadinessSummary,
  v81ReconciliationLanes,
  v81SessionActors
} from "@/lib/enterprise/work-os-v81-primary-write-session-provider";

type Props = { mode?: "work-os" | "admin" };

function badgeClass(status: string) {
  if (["passed", "ready", "ALLOW"].includes(status)) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (["warning", "dry_run", "queued", "DRY_RUN_ONLY", "server_synced"].includes(status)) return "border-amber-200 bg-amber-50 text-amber-700";
  if (["blocked", "BLOCK"].includes(status)) return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function Badge({ status, children }: { status: string; children: React.ReactNode }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass(status)}`}>{children}</span>;
}

function Metric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{note}</div>
    </div>
  );
}

export function V81PrimaryWriteSessionProvider({ mode = "work-os" }: Props) {
  const global = v81GlobalScores();
  const summary = v81ReadinessSummary();
  const queue = v81PrimaryWriteQueue();
  const superAdminDecision = v81EvaluateSessionAcl("wi-view-share-003", "usr-super-admin");
  const blockedDecision = v81EvaluateSessionAcl("wi-timesheet-004", "usr-comercial");

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-900">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">SERVELECT WORK OS · v{V81_RELEASE_VERSION}</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{V81_RELEASE_NAME}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Build v8.1.0 continuă după production pilot v8.0.0: leagă ACL-ul de sesiuni verificate, introduce queue de primary-write cu lockVersion/rollback, provider runtime evidence și reconciliation lanes. Primary writes rămân controlate, nu globale.
              </p>
            </div>
            <div className="flex gap-2">
              <Badge status="ready">{mode === "admin" ? "Admin control" : "Work OS view"}</Badge>
              <Badge status="DRY_RUN_ONLY">primary writes gated</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Production" value={`${global.productionReadiness}%`} note="pilot readiness" />
          <Metric label="Backend/API" value={`${global.backendApiParity}%`} note="API + queue evidence" />
          <Metric label="Writes allowed" value={summary.allowedWrites} note="session-bound pilot" />
          <Metric label="Screens" value={`${global.screenshotAuditCoverage}%`} note="v8 baseline + v8.1 script" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Session-bound primary write queue</h2>
                <p className="text-sm text-slate-500">Fiecare write are actor, departament, provider, ACL decision, rollback checkpoint și reconciliation state.</p>
              </div>
              <Badge status="warning">canary controlled</Badge>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="p-3">Intent</th><th className="p-3">Entity</th><th className="p-3">Mode</th><th className="p-3">ACL</th><th className="p-3">Provider</th><th className="p-3">Reconcile</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queue.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="p-3"><div className="font-medium text-slate-900">{item.label}</div><div className="text-xs text-slate-500">{item.rollbackCheckpoint} · lock v{item.lockVersion}</div></td>
                      <td className="p-3 capitalize text-slate-600">{item.entity}</td>
                      <td className="p-3"><Badge status={item.mode === "primary_pilot" ? "ready" : item.mode}>{item.mode}</Badge></td>
                      <td className="p-3"><Badge status={item.sessionDecision.decision}>{item.sessionDecision.decision}</Badge><div className="mt-1 text-xs text-slate-500">{item.sessionDecision.reason}</div></td>
                      <td className="p-3 text-slate-600">{item.provider}</td>
                      <td className="p-3"><Badge status={item.reconciliationState}>{item.reconciliationState}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">ACL proof checks</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="font-medium">Super Admin saved view share</div>
                  <Badge status={superAdminDecision.decision}>{superAdminDecision.decision}</Badge>
                  <p className="mt-1 text-xs text-slate-500">{superAdminDecision.reason}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="font-medium">Comercial timesheet write without verified 2FA</div>
                  <Badge status={blockedDecision.decision}>{blockedDecision.decision}</Badge>
                  <p className="mt-1 text-xs text-slate-500">{blockedDecision.reason}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Actors in pilot</h2>
              <div className="mt-3 space-y-2">
                {v81SessionActors.map((actor) => (
                  <div key={actor.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 text-sm">
                    <div><div className="font-medium">{actor.name}</div><div className="text-xs text-slate-500">{actor.role} · {actor.department}</div></div>
                    <Badge status={actor.sessionState === "verified" ? "ready" : "blocked"}>{actor.sessionState}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Provider runtime evidence</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {v81ProviderRuntimeEvidence.map((provider) => (
                <div key={provider.provider} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between"><div className="font-semibold">{provider.provider}</div><Badge status={provider.status}>{provider.status}</Badge></div>
                  <p className="mt-2 text-sm text-slate-600">{provider.evidence}</p>
                  <p className="mt-2 text-xs text-slate-500">success {provider.successRate}% · p95 {provider.p95Ms}ms · missing: {provider.missing}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Reconciliation lanes</h2>
            <div className="mt-4 space-y-3">
              {v81ReconciliationLanes.map((lane) => (
                <div key={lane.lane} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between"><div className="font-medium">{lane.lane}</div><Badge status={lane.status}>{lane.status}</Badge></div>
                  <div className="mt-1 text-sm text-slate-600">records: {lane.records} · drift: {lane.drift}</div>
                  <div className="mt-1 text-xs text-slate-500">Next: {lane.next}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">v8.1.0 progress scores</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Category</th><th className="p-3">Before</th><th className="p-3">After</th><th className="p-3">Improvement</th><th className="p-3">Missing</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {v81ProgressScores.map((score) => <tr key={score.category}><td className="p-3 font-medium">{score.category}</td><td className="p-3">{score.before}%</td><td className="p-3">{score.after}%</td><td className="p-3 text-slate-600">{score.improvement}</td><td className="p-3 text-slate-500">{score.missing}</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
