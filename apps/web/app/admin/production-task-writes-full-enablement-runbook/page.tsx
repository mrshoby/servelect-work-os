import { getProductionTaskWritesFullEnablementRunbook } from "@/lib/enterprise/production-task-writes-full-enablement-runbook";

function toneFor(status: string) {
  switch (status) {
    case "stable":
    case "ready":
    case "locked":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "beta":
    case "partial":
    case "monitoring":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "mock":
    case "planned":
    case "warning":
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

export default function ProductionTaskWritesFullEnablementRunbookPage() {
  const release = getProductionTaskWritesFullEnablementRunbook();
  const areaById = Object.fromEntries(release.areas.map((area) => [area.id, area]));

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS {release.version}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{release.name}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-200">Mode: {release.mode}</span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-200">Production writes: {release.productionWritesEnabled ? "ON" : "OFF"}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">Full enablement: {release.fullEnablementReady ? "READY" : "NOT READY"}</span>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700 ring-1 ring-violet-200">Env gate: {release.requiresExplicitEnvGate ? "REQUIRED" : "NOT REQUIRED"}</span>
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

      <section className="grid gap-4 xl:grid-cols-3">
        {release.runbookSteps.map((step) => (
          <article key={step.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">{step.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Owner: {step.owner}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(step.status)}`}>{step.status}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="min-w-14 text-sm font-black text-slate-800">{step.readiness}%</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${step.readiness}%` }} /></div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{step.objective}</p>
            <div className="mt-3 flex flex-wrap gap-2">{step.commands.map((command) => <span key={command} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">{command}</span>)}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Enablement gates</h2>
          <div className="mt-4 space-y-3">
            {release.enablementGates.map((gate) => (
              <div key={gate.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{gate.label}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(gate.status)}`}>{gate.status}</span>
                </div>
                <p className="mt-2 text-sm text-emerald-700">Go: {gate.goDecision}</p>
                <p className="mt-2 text-sm text-red-700">No-go: {gate.noGoDecision}</p>
                <div className="mt-3 flex flex-wrap gap-2">{gate.requiredEvidence.map((item) => <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">{item}</span>)}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Rollback commands</h2>
          <div className="mt-4 space-y-3">
            {release.rollbackCommands.map((command) => (
              <div key={command.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{command.label}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(command.status)}`}>{command.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Trigger: {command.trigger}</p>
                <p className="mt-2 text-sm font-semibold text-blue-700">Action: {command.action}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">Validation: {command.validation}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Monitoring SLOs</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {release.monitoringSlos.map((slo) => (
              <div key={slo.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="font-black text-slate-950">{slo.label}</div>
                <p className="mt-2 text-sm text-slate-600">Target: {slo.target}</p>
                <p className="mt-2 text-sm text-amber-700">Threshold: {slo.threshold}</p>
                <p className="mt-2 text-sm font-semibold text-blue-700">Escalation: {slo.escalation}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Rollout waves</h2>
          <div className="mt-4 space-y-3">
            {release.rolloutWaves.map((wave) => (
              <div key={wave.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{wave.label}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(wave.status)}`}>{wave.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Scope: {wave.scope}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">Writes: {wave.writesAllowed.join(", ")}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
