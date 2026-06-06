import { getStagingTaskWritesE2EValidation } from "@/lib/enterprise/staging-task-writes-e2e-validation";

function toneFor(status: string) {
  switch (status) {
    case "stable":
    case "ready":
    case "verified":
    case "passed":
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}

export default function StagingTaskWritesE2EPage() {
  const release = getStagingTaskWritesE2EValidation();
  const areaById = Object.fromEntries(release.areas.map((area) => [area.id, area]));

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS {release.version}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{release.name}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-200">
            Write mode: {release.writeMode}
          </span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-200">
            Production writes: {release.productionWritesEnabled ? "ON" : "OFF"}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
            Staging E2E: {release.stagingE2EEnabled ? "ON" : "OFF"}
          </span>
        </div>
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
        {release.validationSteps.map((step) => (
          <article key={step.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">{step.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.expectedResult}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{step.route}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(step.status)}`}>{step.status}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="min-w-14 text-sm font-black text-slate-800">{step.readiness}%</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${step.readiness}%` }} />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Rollback drill</h2>
          <div className="mt-4 space-y-3">
            {release.rollbackDrills.map((drill) => (
              <div key={drill.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{drill.label}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(drill.status)}`}>{drill.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Trigger: {drill.trigger}</p>
                <p className="mt-2 text-sm text-slate-600">Recovery: {drill.recoveryAction}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">Evidence: {drill.auditEvidence}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Data parity checks</h2>
          <div className="mt-4 space-y-3">
            {release.dataParityChecks.map((check) => (
              <div key={check.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{check.label}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(check.status)}`}>{check.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{check.source}{" → "}{check.target}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">{check.notes}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Promotion criteria for canary writes</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {release.promotionCriteria.map((item) => (
            <li key={item} className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
