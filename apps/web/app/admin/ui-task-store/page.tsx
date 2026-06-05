import { getUiTaskStoreFeatureFlagRelease } from "@/lib/enterprise/ui-task-store-flags";

const statusClass = {
  enabled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  controlled: "bg-blue-50 text-blue-700 ring-blue-200",
  planned: "bg-amber-50 text-amber-700 ring-amber-200",
  disabled: "bg-red-50 text-red-700 ring-red-200"
} as const;

const riskClass = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700"
} as const;

export default function UiTaskStoreAdminPage() {
  const release = getUiTaskStoreFeatureFlagRelease();

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white lg:p-8">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/15">
            SERVELECT WORK OS · v{release.version}
          </div>
          <h1 className="mt-4 max-w-5xl text-3xl font-black tracking-tight lg:text-4xl">
            UI Task Store Feature Flags
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">{release.summary}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Readiness" value={`${release.readiness.score}%`} />
            <Metric label="Provider" value={release.defaults.provider} />
            <Metric label="Rollout" value={`${release.defaults.rolloutPercent}%`} />
            <Metric label="Store key" value={release.storeKey} />
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-3">
          <InfoCard title="Production gate" lines={[release.readiness.productionGate]} />
          <InfoCard title="Blockers" lines={release.readiness.blockers} />
          <InfoCard title="Warnings" lines={release.readiness.warnings} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {release.flags.map((flag) => (
          <article key={flag.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{flag.id}</div>
                <h2 className="mt-1 text-lg font-black text-slate-950">{flag.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{flag.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass[flag.status]}`}>
                  {flag.status}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${riskClass[flag.risk]}`}>
                  risk: {flag.risk}
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Mini label="Scope" value={flag.scope} />
              <Mini label="Rollout" value={`${flag.rolloutPercent}%`} />
              <Mini label="Owner" value={flag.owner} />
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">API contract</div>
              <div className="mt-1 font-mono text-sm font-bold text-slate-800">{flag.apiContract}</div>
              <div className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Fallback</div>
              <div className="mt-1 text-sm font-semibold text-slate-600">{flag.fallback}</div>
            </div>

            <div className="mt-4">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Required before production
              </div>
              <div className="flex flex-wrap gap-2">
                {flag.requiredBeforeProduction.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Rollout plan</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {release.rollout.map((phase) => (
            <div key={phase.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{phase.id}</div>
              <h3 className="mt-1 font-black text-slate-900">{phase.label}</h3>
              <p className="mt-2 text-sm leading-5 text-slate-500">{phase.target}</p>
              <div className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                {phase.status}
              </div>
              <ul className="mt-3 list-inside list-disc space-y-1 text-xs font-semibold text-slate-500">
                {phase.exitCriteria.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="text-xl font-black">{value}</div>
      <div className="mt-1 text-xs font-semibold text-slate-300">{label}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-black text-slate-800">{value}</div>
    </div>
  );
}

function InfoCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-600">
        {lines.map((line) => (
          <li key={line}>• {line}</li>
        ))}
      </ul>
    </div>
  );
}
