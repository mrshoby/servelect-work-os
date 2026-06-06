import { getPersistentTaskAuditRbacEnforcement } from "@/lib/enterprise/persistent-task-audit-rbac-enforcement";

function toneFor(status: string) {
  switch (status) {
    case "stable":
    case "ready":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "beta":
    case "partial":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "mock":
    case "planned":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function permissionTone(permission: string) {
  switch (permission) {
    case "allow":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "limited":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    default:
      return "bg-red-50 text-red-700 ring-red-200";
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}

export default function PersistentTaskAuditRbacPage() {
  const release = getPersistentTaskAuditRbacEnforcement();
  const areaById = Object.fromEntries(release.areas.map((area) => [area.id, area]));

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS {release.version}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{release.name}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4 xl:grid-cols-7">
          <Metric label="Website/Web App" value={`${areaById.website?.completion ?? 0}%`} />
          <Metric label="Task & Project Core" value={`${areaById.taskProjectCore?.completion ?? 0}%`} />
          <Metric label="Backend/API" value={`${areaById.backendApi?.completion ?? 0}%`} />
          <Metric label="Database/Prisma/Seed" value={`${areaById.databasePrismaSeed?.completion ?? 0}%`} />
          <Metric label="Auth/RBAC" value={`${areaById.authRbac?.completion ?? 0}%`} />
          <Metric label="IoT/Ops" value={`${areaById.iotOps?.completion ?? 0}%`} />
          <Metric label="Mobile App" value={`${areaById.mobileApp?.completion ?? 0}%`} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {release.areas.map((area) => (
          <article key={area.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">{area.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.summary}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(area.status)}`}>{area.status}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="min-w-14 text-sm font-black text-slate-800">{area.completion}%</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${area.completion}%` }} />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">RBAC mutation matrix</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="p-3">Role</th>
                <th className="p-3">Create</th>
                <th className="p-3">Update</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assign</th>
                <th className="p-3">Delete</th>
                <th className="p-3">Audit</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {release.rbac.map((rule) => (
                <tr key={rule.role} className="border-t border-slate-100">
                  <td className="p-3 font-black text-slate-950">{rule.role}</td>
                  {[rule.createTask, rule.updateTask, rule.changeStatus, rule.assignTask, rule.deleteTask, rule.auditAccess].map((permission, index) => (
                    <td key={`${rule.role}-${index}`} className="p-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${permissionTone(permission)}`}>{permission}</span>
                    </td>
                  ))}
                  <td className="p-3 text-slate-600">{rule.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Persistent audit event contract</h2>
          <div className="mt-4 space-y-3">
            {release.auditEvents.map((event) => (
              <div key={event.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{event.event}</div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-200">{event.mode}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Actor: {event.actor} · Decision: {event.decision} · Target: {event.target}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">Fields: {event.auditFields.join(", ")}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Enforcement gates</h2>
          <div className="mt-4 space-y-3">
            {release.enforcementGates.map((gate) => (
              <div key={gate.key} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{gate.label}</div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">{gate.mode}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="min-w-14 text-sm font-black text-slate-800">{gate.readiness}%</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${gate.readiness}%` }} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600">{gate.reason}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
