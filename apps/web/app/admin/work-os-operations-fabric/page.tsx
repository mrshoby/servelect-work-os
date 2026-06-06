import { getWorkOsOperationsFabric, type FabricStatus, type FabricSeverity } from "@/lib/enterprise/work-os-operations-fabric";

function toneFor(status: FabricStatus | string) {
  switch (status) {
    case "green":
    case "ready":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "blue":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "amber":
    case "shadow":
    case "planned":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "red":
      return "bg-red-50 text-red-700 ring-red-200";
    case "locked":
    case "env-gated":
    case "guarded":
      return "bg-slate-100 text-slate-700 ring-slate-300";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function severityTone(severity: FabricSeverity | string) {
  switch (severity) {
    case "critical":
      return "bg-red-50 text-red-700 ring-red-200";
    case "high":
      return "bg-orange-50 text-orange-700 ring-orange-200";
    case "medium":
      return "bg-amber-50 text-amber-700 ring-amber-200";
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

export default function WorkOsOperationsFabricPage() {
  const release = getWorkOsOperationsFabric();
  const readiness = release.readiness;

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-blue-950 p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">SERVELECT WORK OS v{release.version}</p>
          <h1 className="mt-3 max-w-6xl text-4xl font-black tracking-tight">Unified Work OS Real Data Bridge & Operations Fabric</h1>
          <p className="mt-4 max-w-6xl text-sm leading-7 text-slate-200">{release.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black ring-1 ring-white/20">Production writes: {release.productionWrites}</span>
            <span className="rounded-full bg-emerald-400/20 px-4 py-2 text-xs font-black text-emerald-100 ring-1 ring-emerald-300/30">5-10x platform-scale package</span>
            <span className="rounded-full bg-blue-400/20 px-4 py-2 text-xs font-black text-blue-100 ring-1 ring-blue-300/30">Task + Project + Stock + Pontaj + Audit + Admin + Mobile</span>
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
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">v4.9 fabric-scale release</span>
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
          <h2 className="text-xl font-black text-slate-950">Module operations fabric</h2>
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
                <div className="mt-3 grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Owner</div><div className="mt-1 text-sm font-bold text-slate-700">{module.owner}</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Mode</div><div className="mt-1 text-sm font-bold text-slate-700">{module.mode}</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Readiness</div><div className="mt-1 text-sm font-bold text-emerald-700">{module.readiness}%</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Contracts</div><div className="mt-1 text-sm font-bold text-slate-700">{module.dataContracts.length}</div></div>
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-500">Endpoint: {module.primaryEndpoint}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Connectors and adapters</h2>
          <div className="mt-4 space-y-3">
            {release.connectors.map((connector) => (
              <div key={connector.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{connector.label}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{connector.healthCheck}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(connector.status)}`}>{connector.status}</span>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Module</div><div className="mt-1 text-sm font-bold text-slate-700">{connector.module}</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Mode</div><div className="mt-1 text-sm font-bold text-slate-700">{connector.mode}</div></div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Readiness</div><div className="mt-1 text-sm font-bold text-emerald-700">{connector.readiness}%</div></div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Cross-module flows</h2>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {release.flows.map((flow) => (
            <div key={flow.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-black text-slate-950">{flow.name}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{flow.summary}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(flow.status)}`}>{flow.status}</span>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Flow</div><div className="mt-1 text-sm font-bold text-slate-700">{flow.source}{" → "}{flow.target}</div></div>
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Queue</div><div className="mt-1 text-sm font-bold text-slate-700">{flow.queueDepth}</div></div>
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">Readiness</div><div className="mt-1 text-sm font-bold text-emerald-700">{flow.readiness}%</div></div>
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><div className="text-xs font-black text-slate-400">SLA</div><div className="mt-1 text-sm font-bold text-slate-700">{flow.sla}</div></div>
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-500">Audit: {flow.auditRule}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Data contracts</h2>
          <div className="mt-4 space-y-3">
            {release.dataContracts.map((contract) => (
              <div key={contract.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-3"><div className="font-black text-slate-950">{contract.entity}</div><span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(contract.status)}`}>{contract.status}</span></div>
                <p className="mt-2 text-xs text-slate-500">{contract.persistenceTarget} · audit {contract.requiredAudit ? "required" : "optional"} · RBAC {contract.requiredRbac ? "required" : "optional"}</p>
                <div className="mt-2 text-sm font-black text-emerald-700">{contract.readiness}% ready</div>
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
                <div className="mt-2 text-xs font-black text-emerald-700">{lane.readiness}% · {lane.status}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Incident command</h2>
          <div className="mt-4 space-y-3">
            {release.incidents.map((incident) => (
              <div key={incident.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-3"><div className="font-black text-slate-950">{incident.label}</div><span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${severityTone(incident.severity)}`}>{incident.severity}</span></div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{incident.response}</p>
                <code className="mt-3 block rounded-xl bg-slate-950 p-3 text-xs text-emerald-300">{incident.command}</code>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Risk register</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {release.risks.map((risk) => (
              <div key={risk.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-3"><div className="font-black text-slate-950">{risk.title}</div><span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${severityTone(risk.severity)}`}>{risk.severity}</span></div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{risk.mitigation}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">{risk.module} · {risk.status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">RBAC and command actions</h2>
          <div className="mt-4 space-y-3">
            {release.rbac.map((rule) => (
              <div key={rule.role} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="font-black text-slate-950">{rule.role}</div>
                <p className="mt-2 text-xs text-slate-500">Allowed: {rule.allowedActions.join(", ")}</p>
                <p className="mt-2 text-xs text-slate-500">Denied: {rule.deniedActions.join(", ")}</p>
              </div>
            ))}
            {release.commandActions.map((action) => (
              <div key={action.id} className="rounded-2xl bg-slate-950 p-4 text-white">
                <div className="font-black">{action.label}</div>
                <code className="mt-2 block text-xs text-emerald-300">{action.command}</code>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Runbooks</h2>
          <div className="mt-4 space-y-3">
            {release.runbooks.map((runbook) => (
              <div key={runbook.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="font-black text-slate-950">{runbook.title}</div>
                <p className="mt-2 text-sm text-slate-600">Owner: {runbook.owner}</p>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
                  {runbook.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Executive readiness and roadmap</h2>
          <div className="mt-4 space-y-3">
            {release.executiveReadiness.map((lane) => (
              <div key={lane.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3"><div className="font-black text-slate-950">{lane.title}</div><div className="font-black text-emerald-700">{lane.completion}%</div></div>
                <p className="mt-2 text-sm text-slate-600">{lane.evidence}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">Next: {lane.nextDecision}</p>
              </div>
            ))}
            {release.roadmap.map((item) => (
              <div key={item.version} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-sm font-black text-emerald-700">{item.version}</div>
                <div className="mt-1 font-black text-slate-950">{item.title}</div>
                <p className="mt-2 text-sm text-slate-600">{item.outcome}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
