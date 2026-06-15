import {
  v850EnterpriseDepartmentSuite,
  type V850EnterpriseDepartmentSuite,
} from "@/lib/enterprise/work-os-v850-enterprise-department-suite";

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{note}</div>
    </div>
  );
}

function DecisionBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    allow: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dry_run: "bg-amber-50 text-amber-700 ring-amber-200",
    partial: "bg-amber-50 text-amber-700 ring-amber-200",
    requires_approval: "bg-blue-50 text-blue-700 ring-blue-200",
    blocked: "bg-rose-50 text-rose-700 ring-rose-200",
    degraded: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        styles[value] ?? "bg-slate-50 text-slate-600 ring-slate-200"
      }`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</div>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
      {children ? <p className="max-w-4xl text-sm leading-6 text-slate-500">{children}</p> : null}
    </div>
  );
}

export default function V850EnterpriseDepartmentSuite({
  data = v850EnterpriseDepartmentSuite,
  surface = "work-os",
}: {
  data?: V850EnterpriseDepartmentSuite;
  surface?: "work-os" | "admin";
}) {
  const latestScore = data.scorecard[data.scorecard.length - 1];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-[1440px] gap-5 px-5 py-5">
        <aside className="hidden w-72 shrink-0 rounded-3xl bg-[#071826] p-4 text-white shadow-xl lg:block">
          <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
            <div className="text-xs uppercase tracking-[0.24em] text-emerald-300">SERVELECT WORK OS</div>
            <div className="mt-2 text-lg font-semibold">Enterprise Suite v8.5</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">GoodDay-like operating discipline, Servelect identity, shadow-safe production pilot.</p>
          </div>
          <nav className="mt-4 space-y-1 text-sm">
            {[
              "Command Center",
              "Session Claims",
              "Department Scopes",
              "RLS Proof",
              "Bulk Guardrails",
              "Provider Runtime",
              "GoodDay Parity",
              "Next Build Plan",
            ].map((item) => (
              <div key={item} className="rounded-xl px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white">
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {surface === "admin" ? "Admin control plane" : "Work OS execution plane"}
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{data.releaseName}</h1>
                <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-500">{data.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <DecisionBadge value={data.status} />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">v{data.version}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">No global writes</span>
              </div>
            </div>
          </header>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Session claims" value={`${data.sessionClaims.length}`} note="Super admin, department admin, team lead, client." />
            <MetricCard label="Write scopes" value={`${data.departmentWriteScopes.length}`} note="Global, department, team boundaries." />
            <MetricCard label="RLS proofs" value={`${data.rlsPolicyProofs.length}`} note="Allowed/blocked policy proof cases." />
            <MetricCard label={latestScore.category} value={`${latestScore.after}%`} note={latestScore.note} />
          </div>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle eyebrow="01 · Real session adapter model" title="Role-aware claims before any primary write">
              Every write path now has a visible claim bundle: actor, role, department, team, client scope, project scope, permission set and write mode.
            </SectionTitle>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Write mode</th>
                    <th className="px-4 py-3">RLS profile</th>
                    <th className="px-4 py-3">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.sessionClaims.map((claim) => (
                    <tr key={claim.actorId} className="align-top">
                      <td className="px-4 py-3 font-medium text-slate-900">{claim.actorName}</td>
                      <td className="px-4 py-3 text-slate-600">{claim.role.replaceAll("_", " ")}</td>
                      <td className="px-4 py-3 text-slate-600">{claim.departmentName}</td>
                      <td className="px-4 py-3"><DecisionBadge value={claim.writeMode} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{claim.rlsProfile}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{claim.permissions.slice(0, 4).join(", ")}{claim.permissions.length > 4 ? "…" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle eyebrow="02 · Department write scopes" title="Explicit safe write boundaries" />
              <div className="space-y-3">
                {data.departmentWriteScopes.map((scope) => (
                  <div key={scope.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-950">{scope.departmentName}</div>
                        <div className="mt-1 text-sm text-slate-500">{scope.scopeType} · owner {scope.ownerRole.replaceAll("_", " ")} · max bulk {scope.maxBulkItems}</div>
                      </div>
                      <div className="flex flex-wrap justify-end gap-1">
                        {scope.writeModes.map((mode) => <DecisionBadge key={mode} value={mode} />)}
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-slate-500 md:grid-cols-2">
                      <div><span className="font-semibold text-slate-700">Allowed:</span> {scope.allowedEntities.join(", ")}</div>
                      <div><span className="font-semibold text-slate-700">Blocked:</span> {scope.blockedEntities.join(", ") || "none"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle eyebrow="03 · RLS proof matrix" title="Allowed/blocked cases are visible" />
              <div className="space-y-3">
                {data.rlsPolicyProofs.map((proof) => (
                  <div key={proof.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-950">{proof.policyName}</div>
                        <div className="mt-1 font-mono text-xs text-slate-500">{proof.tableName}</div>
                      </div>
                      <DecisionBadge value={proof.result} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">allowed {proof.sampleAllowed}</span>
                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">blocked {proof.sampleBlocked}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">risk {proof.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle eyebrow="04 · Bulk operations" title="GoodDay-like bulk actions, but guarded for production">
              Bulk actions are no longer just UI. They include caps, policy decision, dry-run state, rollback checkpoint and provider dispatch notes.
            </SectionTitle>
            <div className="grid gap-4 xl:grid-cols-3">
              {data.bulkActions.map((action) => (
                <article key={action.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-6 text-slate-950">{action.label}</h3>
                    <DecisionBadge value={action.policyDecision} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>Entity: <span className="font-semibold text-slate-700">{action.entityType}</span></div>
                    <div>Items: <span className="font-semibold text-slate-700">{action.affectedCount}</span></div>
                    <div>Requester: <span className="font-semibold text-slate-700">{action.requester}</span></div>
                    <div>Status: <span className="font-semibold text-slate-700">{action.status}</span></div>
                  </div>
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-500">{action.rollbackCheckpoint}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle eyebrow="05 · GoodDay parity lanes" title="Larger improvement wave, not a tiny patch" />
              <div className="space-y-3">
                {data.goodDayParityLanes.map((lane) => (
                  <div key={lane.area} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-950">{lane.label}</div>
                        <div className="mt-1 text-xs text-slate-500">{lane.routes.join(" · ")}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-950">{lane.currentScore}% → {lane.targetScore}%</div>
                        <div className="text-xs text-slate-400">target lane</div>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${lane.currentScore}%` }} />
                    </div>
                    <ul className="mt-3 grid gap-1 text-sm text-slate-500 md:grid-cols-3">
                      {lane.progressThisBuild.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle eyebrow="06 · Provider runtime" title="Dispatch status and dead-letter visibility" />
              <div className="space-y-3">
                {data.providerRuntime.map((provider) => (
                  <div key={provider.provider} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-950">{provider.provider}</div>
                      <DecisionBadge value={provider.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>Queued: {provider.queued}</div>
                      <div>Delivered: {provider.delivered}</div>
                      <div>Failed: {provider.failed}</div>
                      <div>Dead-letter: {provider.deadLetter}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle eyebrow="07 · Next build lock" title={`${data.nextBuild.version} — ${data.nextBuild.name}`} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <div className="font-semibold text-emerald-900">Scope obligatoriu</div>
                <ul className="mt-2 space-y-1 text-sm text-emerald-800">
                  {data.nextBuild.scope.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4">
                <div className="font-semibold text-rose-900">Ce NU facem</div>
                <ul className="mt-2 space-y-1 text-sm text-rose-800">
                  {data.nextBuild.doNotDo.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
