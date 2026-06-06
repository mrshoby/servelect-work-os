import { getProductionTaskWritesPostEnableMonitoringSlaDashboard } from "@/lib/enterprise/production-task-writes-post-enable-monitoring-sla-dashboard";

function toneFor(status: string) {
  switch (status) {
    case "green":
    case "active":
    case "monitoring-ready":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "watch":
    case "manual":
      return "bg-blue-50 text-blue-700 ring-blue-200";
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

export default function ProductionTaskWritesPostEnableMonitoringSlaDashboardPage() {
  const release = getProductionTaskWritesPostEnableMonitoringSlaDashboard();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Post-enable monitoring</p>
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
          <h2 className="text-lg font-black text-slate-950">SLA metrics</h2>
          <div className="mt-4 space-y-3">
            {release.slaMetrics.map((metric) => (
              <div key={metric.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{metric.label}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(metric.status)}`}>{metric.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Target: {metric.target}</p>
                <p className="mt-1 text-sm text-slate-600">Current: {metric.current}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Owner: {metric.owner}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Monitoring signals</h2>
          <div className="mt-4 space-y-3">
            {release.monitoringSignals.map((signal) => (
              <div key={signal.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{signal.label}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(signal.status)}`}>{signal.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Source: {signal.source}</p>
                <p className="mt-1 text-sm text-slate-600">Threshold: {signal.threshold}</p>
                <p className="mt-1 text-sm text-slate-600">Action: {signal.action}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Incident command</h2>
          <div className="mt-4 space-y-3">
            {release.incidentCommands.map((command) => (
              <div key={command.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-black text-slate-950">{command.label}</div>
                <p className="mt-2 text-sm text-slate-600">Trigger: {command.trigger}</p>
                <div className="mt-2 rounded-xl bg-white px-3 py-2 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
                  {command.command}
                </div>
                <p className="mt-2 text-sm text-slate-600">Rollback: {command.rollback}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Monitoring runbook</h2>
          <div className="mt-4 space-y-3">
            {release.runbook.map((step) => (
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
