import { v80AclRules, v80Actors, v80CurrentReadiness, v80EvaluateMutation, v80GlobalScores, v80MutationPilots, v80ProgressScores, v80ProviderRuntimeReadiness, v80RollbackDrill, V80_RELEASE_NAME, V80_RELEASE_VERSION } from "@/lib/enterprise/work-os-v80-production-pilot-readiness";

type Props = { mode?: "work-os" | "admin" };

function statusClass(status: string) {
  if (["passed", "ready", "allow", "PRIMARY_CANARY_ALLOWED", "server_synced"].includes(status)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (["warning", "dry_run", "queued_for_server", "needs_review", "DRY_RUN_ONLY", "gated", "conflict"].includes(status)) return "bg-amber-50 text-amber-700 border-amber-200";
  if (["blocked", "deny", "failed", "BLOCKED"].includes(status)) return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function Badge({ children, status }: { children: React.ReactNode; status: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClass(status)}`}>{children}</span>;
}

function Card({ title, value, note }: { title: string; value: string | number; note: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
      <p className="mt-2 text-sm leading-5 text-slate-500">{note}</p>
    </section>
  );
}

export function V80ProductionPilotReadiness({ mode = "work-os" }: Props) {
  const readiness = v80CurrentReadiness();
  const global = v80GlobalScores();
  const primaryDecision = v80EvaluateMutation("mut-ticket-escalate", "usr-audit-manager");
  const blockedDecision = v80EvaluateMutation("mut-workflow-admin", "usr-comercial-admin");
  const providers = v80ProviderRuntimeReadiness();
  const scores = v80ProgressScores();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-[#071826] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">SERVELECT WORK OS · v{V80_RELEASE_VERSION}</div>
            <h1 className="mt-2 text-2xl font-semibold">{V80_RELEASE_NAME}</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-300">Build v8.0.0 continuă exact din NEXT_BUILD_PLAN: primary writes rămân închise global, dar pilotul primește ACL autentificat, canary guard, lock version și rollback drill verificabil.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div><div className="text-xl font-semibold text-emerald-300">{global.productionReadiness}%</div><div className="text-[11px] text-slate-300">Production</div></div>
            <div><div className="text-xl font-semibold text-emerald-300">{global.backendApiParity}%</div><div className="text-[11px] text-slate-300">API</div></div>
            <div><div className="text-xl font-semibold text-emerald-300">{global.screenshotAuditCoverage}%</div><div className="text-[11px] text-slate-300">Screens</div></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-5 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card title="Release gate score" value={`${readiness.score}%`} note={`${readiness.totals.passed} passed · ${readiness.totals.warning} warning · ${readiness.totals.blocked} blocked`} />
          <Card title="Canary decision" value={primaryDecision.decision} note="Ticket SLA escalation canary este permis doar pentru actor/ACL/rollback valide." />
          <Card title="Blocked guard" value={blockedDecision.decision} note="Workflow admin write rămâne blocat când ACL real este conflictual." />
          <Card title="Mode" value={mode === "admin" ? "Admin" : "Work OS"} note="Aceeași logică se vede în rute reale Work OS și Admin, nu într-un demo separat." />
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div><h2 className="font-semibold">Primary write pilot guard</h2><p className="text-sm text-slate-500">ACL + actor + lockVersion + rollback checkpoint înainte de orice write real.</p></div>
            <Badge status={readiness.blockers.length ? "blocked" : "warning"}>{readiness.blockers.length ? "Blocked" : "Gated pilot"}</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Mutation</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">ACL</th><th className="px-4 py-3">Rollback</th><th className="px-4 py-3">Lock</th><th className="px-4 py-3">Result</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {v80MutationPilots.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="px-4 py-3"><div className="font-medium">{item.label}</div><div className="mt-1 max-w-xl truncate font-mono text-[11px] text-slate-400">{item.dryRunSql}</div></td>
                    <td className="px-4 py-3"><Badge status={item.mode}>{item.mode}</Badge></td>
                    <td className="px-4 py-3"><Badge status={item.aclDecision}>{item.aclDecision}</Badge></td>
                    <td className="px-4 py-3"><Badge status={item.rollbackTested ? "passed" : "warning"}>{item.rollbackTested ? "tested" : "not tested"}</Badge></td>
                    <td className="px-4 py-3">v{item.lockVersion}</td>
                    <td className="px-4 py-3 text-slate-600">{item.lastResult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3"><h2 className="font-semibold">Authenticated ACL matrix</h2><p className="text-sm text-slate-500">Departament, echipă, client și global access fără a deschide primary writes global.</p></div>
            <div className="divide-y divide-slate-100">
              {v80AclRules.map((acl) => (
                <div key={acl.id} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3">
                  <div><div className="font-medium">{acl.entityType} · {acl.entityId}</div><div className="text-sm text-slate-500">{acl.evidence}</div><div className="mt-2 flex flex-wrap gap-1">{acl.permissions.map((p) => <Badge key={p} status="server_synced">{p}</Badge>)}</div></div>
                  <div className="text-right"><Badge status={acl.state}>{acl.state}</Badge><div className="mt-2 text-xs text-slate-400">{acl.scope}</div></div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3"><h2 className="font-semibold">Rollback drill & provider runtime</h2><p className="text-sm text-slate-500">Ce este gata, ce este warning și ce rămâne blocat până la secrete/runtime reale.</p></div>
            <div className="px-4 py-3">
              <div className="space-y-3">
                {v80RollbackDrill.map((gate) => <div key={gate.id} className="rounded-lg border border-slate-100 p-3"><div className="flex items-center justify-between gap-3"><div className="font-medium">{gate.title}</div><Badge status={gate.status}>{gate.status}</Badge></div><div className="mt-1 text-sm text-slate-500">{gate.evidence}</div><div className="mt-1 text-xs text-slate-400">Next: {gate.nextAction}</div></div>)}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {providers.map((provider) => <div key={provider.provider} className="rounded-lg bg-slate-50 p-3"><div className="flex items-center justify-between"><div className="font-medium">{provider.provider}</div><Badge status={provider.status}>{provider.status}</Badge></div><div className="mt-1 text-xs text-slate-500">success {provider.successRate}% · p95 {provider.p95Ms}ms</div><div className="mt-1 text-xs text-slate-400">Missing: {provider.missing}</div></div>)}
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3"><h2 className="font-semibold">v8.0.0 progress scores</h2><p className="text-sm text-slate-500">Scoruri realiste: nu 100%, pentru că DB writes/providers/session binding sunt încă gated.</p></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Before</th><th className="px-4 py-3">After</th><th className="px-4 py-3">Improvement</th><th className="px-4 py-3">Missing</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {scores.map((score) => <tr key={score.category}><td className="px-4 py-3 font-medium">{score.category}</td><td className="px-4 py-3">{score.before}%</td><td className="px-4 py-3 font-semibold text-emerald-700">{score.after}%</td><td className="px-4 py-3 text-slate-600">{score.improvement}</td><td className="px-4 py-3 text-slate-500">{score.missing}</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Actors included in pilot</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-5">
            {v80Actors.map((actor) => <div key={actor.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3"><div className="font-medium">{actor.name}</div><div className="text-xs text-slate-500">{actor.role}</div><div className="mt-2 text-xs text-slate-400">{actor.departmentName}</div><div className="mt-2"><Badge status={actor.canUsePrimaryPilot ? "passed" : "warning"}>{actor.canUsePrimaryPilot ? "pilot allowed" : "shadow only"}</Badge></div></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}
