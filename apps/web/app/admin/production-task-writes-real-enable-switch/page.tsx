import { getProductionTaskWritesRealEnableSwitch } from "@/lib/enterprise/production-task-writes-real-enable-switch";

function toneFor(status: string) {
  switch (status) {
    case "ready":
    case "ready-for-controlled-enable":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "manual-approval":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "locked":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}%</div>
    </div>
  );
}

export default function ProductionTaskWritesRealEnableSwitchPage() {
  const release = getProductionTaskWritesRealEnableSwitch();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Production enable switch</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">v{release.version} - {release.name}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-200">
            Production writes default: {release.productionWritesDefault}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(release.health.status)}`}>
            {release.health.status}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {release.completion.map((metric) => (
            <Metric key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Enable gates</h2>
          <div className="mt-4 space-y-3">
            {release.gates.map((gate) => (
              <div key={gate.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{gate.label}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(gate.status)}`}>{gate.status}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {gate.requiredEvidence.map((item) => (
                    <li key={item} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Switch commands</h2>
          <div className="mt-4 space-y-3">
            {release.commands.map((command) => (
              <div key={command.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-black text-slate-950">{command.label}</div>
                <div className="mt-2 rounded-xl bg-white px-3 py-2 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
                  {command.envGate}
                </div>
                <p className="mt-2 text-sm text-slate-600">{command.safety}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Rollback controls</h2>
          <div className="mt-4 space-y-3">
            {release.rollback.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-black text-slate-950">{item.label}</div>
                <p className="mt-2 text-sm text-slate-600">Trigger: {item.trigger}</p>
                <p className="mt-2 text-sm text-slate-600">Action: {item.action}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Enablement plan</h2>
          <div className="mt-4 space-y-3">
            {release.plan.map((step) => (
              <div key={step.phase} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Phase {step.phase}</div>
                <div className="mt-1 font-black text-slate-950">{step.title}</div>
                <p className="mt-2 text-sm text-slate-600">{step.outcome}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {step.required.map((item) => (
                    <li key={item} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
