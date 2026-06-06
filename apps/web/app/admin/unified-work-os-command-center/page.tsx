import { getUnifiedWorkOsCommandCenter, type WorkOsStatus } from "@/lib/enterprise/unified-work-os-command-center";

function toneFor(status: WorkOsStatus) {
  switch (status) {
    case "green":
    case "ready":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "blue":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "amber":
    case "shadow":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "red":
      return "bg-red-50 text-red-700 ring-red-200";
    case "locked":
      return "bg-slate-100 text-slate-700 ring-slate-300";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
    </div>
  );
}

function PercentBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-black text-slate-700">{label}</div>
        <div className="text-sm font-black text-emerald-700">{value}%</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function UnifiedWorkOsCommandCenterPage() {
  const release = getUnifiedWorkOsCommandCenter();
  const readiness = release.readiness;

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">SERVELECT WORK OS v{release.version}</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-black tracking-tight">Unified Work OS Command Center</h1>
          <p className="mt-4 max-w-6xl text-sm leading-7 text-slate-200">{release.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black ring-1 ring-white/20">Production writes: {release.productionWrites}</span>
            <span className="rounded-full bg-emerald-400/20 px-4 py-2 text-xs font-black text-emerald-100 ring-1 ring-emerald-300/30">Cross-module operations</span>
            <span className="rounded-full bg-blue-400/20 px-4 py-2 text-xs font-black text-blue-100 ring-1 ring-blue-300/30">Task + Project + Stock + Pontaj</span>
          </div>
        </div>

        <div className="grid gap-3 bg-slate-50 p-5 md:grid-cols-2 xl:grid-cols-4">
          {release.metrics.map((metric) => (
            <Metric key={metric.id} label={metric.label} value={metric.value} hint={`${metric.trend} · ${metric.evidence}`} />
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Status / procente vizibile pe site</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Platform readiness</h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">v4.8 platform-scale release</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <PercentBar label="Website/Web App" value={readiness.websiteWebApp} />
          <PercentBar label="Task & Project Core" value={readiness.taskProjectCore} />
          <PercentBar label="Backend/API" value={readiness.backendApi} />
          <PercentBar label="Database/Prisma/Seed" value={readiness.databasePrismaSeed} />
          <PercentBar label="Auth/RBAC" value={readiness.authRbac} />
          <PercentBar label="IoT/Ops" value={readiness.iotOps} />
          <PercentBar label="Mobile App" value={readiness.mobileApp} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Module operations</h2>
          <div className="mt-4 space-y-3">
            {release.modules.map((module) => (
              <div key={module.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-black text-slate-950">{module.name}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{module.summary}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(module.status)}`}>{module.status}</span>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Owner</div><div className="mt-1 text-sm font-bold text-slate-700">{module.owner}</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Mode</div><div className="mt-1 text-sm font-bold text-slate-700">{module.mode}</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Readiness</div><div className="mt-1 text-sm font-bold text-emerald-700">{module.readiness}%</div></div>
                </div>
                <div className="mt-3 text-xs font-semibold text-slate-500">Endpoint: {module.primaryEndpoint}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Cross-module flows</h2>
          <div className="mt-4 space-y-3">
            {release.flows.map((flow) => (
              <div key={flow.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{flow.name}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{flow.summary}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(flow.status)}`}>{flow.status}</span>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Flow</div><div className="mt-1 text-sm font-bold text-slate-700">{flow.source}{" → "}{flow.target}</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Queue</div><div className="mt-1 text-sm font-bold text-slate-700">{flow.queue}</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Readiness</div><div className="mt-1 text-sm font-bold text-emerald-700">{flow.readiness}%</div></div>
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-500">Audit rule: {flow.auditRule}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Incident command</h2>
          <div className="mt-4 space-y-3">
            {release.incidents.map((incident) => (
              <div key={incident.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-3"><div className="font-black text-slate-950">{incident.label}</div><span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-200">{incident.severity}</span></div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{incident.description}</p>
                <code className="mt-3 block rounded-xl bg-slate-950 p-3 text-xs text-emerald-300">{incident.command}</code>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Automation lanes</h2>
          <div className="mt-4 space-y-3">
            {release.automations.map((lane) => (
              <div key={lane.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="font-black text-slate-950">{lane.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{lane.trigger} · {lane.action}</p>
                <div className="mt-2 text-xs font-black text-emerald-700">{lane.readiness}% ready</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Handoff owners</h2>
          <div className="mt-4 space-y-3">
            {release.handoff.map((owner) => (
              <div key={owner.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="font-black text-slate-950">{owner.role}</div>
                <p className="mt-2 text-sm text-slate-600">{owner.escalation}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">Evidence: {owner.evidence}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
