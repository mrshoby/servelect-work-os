import { getV86Release } from "@/lib/enterprise/work-os-v86-auth-rls-department-pilot";

type Props = { surface: "taskuri" | "work-os" | "admin" };

const titles = {
  taskuri: "Taskuri Enterprise Control Room",
  "work-os": "Work OS Auth/RLS Department Pilot",
  admin: "Admin Auth/RLS Department Pilot",
};

const subtitles = {
  taskuri: "GoodDay-like control room pentru My Work, tickets, workflows, bulk actions, timesheets și runtime proof.",
  "work-os": "Execuție Work OS cu session claims, Prisma RLS proof, pilot writes și rollback checkpoints.",
  admin: "Control administrativ pentru roluri, departamente, RLS, provider dispatch și release gates.",
};

function statusClass(status: string) {
  if (status === "ready" || status === "allow") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "dry_run" || status === "requires_approval") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "blocked" || status === "dead_letter" || status === "block") return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function V86MajorExecutionSuite({ surface }: Props) {
  const data = getV86Release();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-950">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                SERVELECT WORK OS · v{data.release.version} · major build
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">{titles[surface]}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{subtitles[surface]}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="font-semibold">Runtime posture</div>
              <div className="mt-1 text-slate-600">{data.release.posture}</div>
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                Global writes rămân blocate; pilot doar pe departament + rollback.
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-4">
          {data.sessionClaims.map((claim) => (
            <article key={claim.actorId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{claim.actorName}</h2>
                  <p className="mt-1 text-xs text-slate-500">{claim.department} · {claim.team}</p>
                </div>
                <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusClass(claim.decision)}`}>{claim.decision}</span>
              </div>
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div><span className="font-semibold text-slate-800">Rol:</span> {claim.role}</div>
                <div><span className="font-semibold text-slate-800">Scope:</span> {claim.clientScope}</div>
                <div><span className="font-semibold text-slate-800">RLS:</span> {claim.rlsPolicy}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {claim.writeScopes.map((scope) => (
                  <span key={scope} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">{scope}</span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {data.lanes.map((lane) => (
            <article key={lane.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">{lane.title}</h2>
                <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusClass(lane.status)}`}>{lane.status}</span>
              </div>
              <Progress value={lane.progress} />
              <div className="mt-2 text-xs font-semibold text-slate-500">{lane.progress}% proof</div>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                {lane.evidence.map((item) => <li key={item} className="flex gap-2"><span className="text-emerald-600">●</span>{item}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Department pilot writes</h2>
              <p className="text-sm text-slate-500">Write-uri pilot cu lockVersion, policy decision, rollback checkpoint și audit trail.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Entity</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Decision</th>
                    <th className="px-4 py-3">Rollback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.pilotWrites.map((write) => (
                    <tr key={write.id}>
                      <td className="px-4 py-3 font-medium">{write.entity}</td>
                      <td className="px-4 py-3 text-slate-600">{write.action}</td>
                      <td className="px-4 py-3 text-slate-600">{write.department}</td>
                      <td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusClass(write.decision)}`}>{write.decision}</span></td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{write.rollbackCheckpoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Provider dispatch runtime</h2>
            <p className="mt-1 text-sm text-slate-500">Outbox, retry, dead-letter și provider readiness.</p>
            <div className="mt-4 space-y-3">
              {data.providers.map((provider) => (
                <div key={provider.provider} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">{provider.provider}</div>
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusClass(provider.state)}`}>{provider.state}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
                    <div><span className="font-semibold text-slate-800">Retry</span><br />{provider.retries}</div>
                    <div><span className="font-semibold text-slate-800">p95</span><br />{provider.p95Ms} ms</div>
                    <div><span className="font-semibold text-slate-800">DLQ</span><br />{provider.deadLetter}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
