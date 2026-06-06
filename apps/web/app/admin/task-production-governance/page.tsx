import { getTaskProductionGovernanceRelease, type GovernanceTone } from "@/lib/enterprise/task-production-governance";

function toneClass(tone: GovernanceTone) {
  switch (tone) {
    case "ready":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "beta":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "partial":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function TaskProductionGovernancePage() {
  const release = getTaskProductionGovernanceRelease();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS {release.version}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{release.name}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Readiness</div>
            <div className="mt-2 text-3xl font-black text-slate-950">{release.readiness}%</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Write-gate</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{release.writeGateMode}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Production writes</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{release.productionWritesEnabled ? "ON" : "OFF"}</div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Status / procente vizibile pe site</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {release.productStatus.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">{item.label}: {item.completion}%</div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneClass(item.tone)}`}>{item.tone}</span>
              </div>
              <div className="mt-3"><Bar value={item.completion} /></div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Production controls</h2>
          <div className="mt-4 space-y-3">
            {release.controls.map((control) => (
              <div key={control.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{control.title}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneClass(control.status)}`}>{control.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Owner: {control.owner}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {control.evidence.map((item) => <li key={item} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">{item}</li>)}
                </ul>
                <p className="mt-3 text-sm font-semibold text-amber-700">Next: {control.nextAction}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">RBAC matrix</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr><th className="p-3">Role</th><th>Create</th><th>Update</th><th>Assign</th><th>Close</th><th>Delete</th></tr>
              </thead>
              <tbody>
                {release.rbac.map((rule) => (
                  <tr key={rule.role} className="border-t border-slate-200">
                    <td className="p-3 font-black text-slate-950">{rule.role}</td>
                    <td>{rule.canCreate ? "DA" : "NU"}</td>
                    <td>{rule.canUpdate ? "DA" : "NU"}</td>
                    <td>{rule.canAssign ? "DA" : "NU"}</td>
                    <td>{rule.canClose ? "DA" : "NU"}</td>
                    <td>{rule.canDelete ? "DA" : "NU"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Audit trail contract</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {release.auditTrailContract.map((event) => (
            <article key={event.event} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="font-black text-slate-950">{event.event}</div>
              <p className="mt-1 text-sm text-slate-600">Source: {event.source} · Mode: {event.persistenceMode}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Required: {event.requiredFields.join(", ")}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
