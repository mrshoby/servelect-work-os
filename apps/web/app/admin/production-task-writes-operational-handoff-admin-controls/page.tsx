import { getProductionTaskWritesOperationalHandoffAdminControls } from "@/lib/enterprise/production-task-writes-operational-handoff-admin-controls";

function toneFor(status: string) {
  switch (status) {
    case "ready":
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "watch":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "locked":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function Metric({ label, value, suffix, target, status }: { label: string; value: number; suffix: string; target: string; status: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${toneFor(status)}`}>{status}</span>
      </div>
      <div className="mt-3 text-3xl font-black text-slate-950">{value}{suffix}</div>
      <div className="mt-1 text-xs font-semibold text-slate-500">Target: {target}</div>
    </div>
  );
}

export default function OperationalHandoffAdminControlsPage() {
  const release = getProductionTaskWritesOperationalHandoffAdminControls();
  const c = release.completion;

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS {release.version}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Production Task Writes Operational Handoff & Admin Controls</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Website/Web App" value={c.websiteWebApp} suffix="%" target="99%" status="ready" />
          <Metric label="Task & Project Core" value={c.taskProjectCore} suffix="%" target="99%" status="ready" />
          <Metric label="Backend/API" value={c.backendApi} suffix="%" target="99%" status="ready" />
          <Metric label="Database/Prisma/Seed" value={c.databasePrismaSeed} suffix="%" target="99%" status="ready" />
          <Metric label="Auth/RBAC" value={c.authRbac} suffix="%" target="99%" status="ready" />
          <Metric label="IoT/Ops" value={c.iotOps} suffix="%" target="90%" status="watch" />
          <Metric label="Mobile App" value={c.mobileApp} suffix="%" target="85%" status="watch" />
          <Metric label="Production writes" value={0} suffix=" ON" target="OFF by default" status="locked" />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {release.metrics.map((metric) => (
          <Metric key={metric.label} label={metric.label} value={metric.value} suffix={metric.suffix} target={metric.target} status={metric.status} />
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Operational handoff owners</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {release.handoffOwners.map((owner) => (
            <article key={owner.role} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-slate-950">{owner.role}</div>
                  <div className="mt-1 text-sm font-semibold text-emerald-700">{owner.owner}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(owner.status)}`}>{owner.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{owner.responsibility}</p>
              <p className="mt-2 text-xs font-semibold text-slate-500">Escalation: {owner.escalation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Admin controls</h2>
          <div className="mt-4 space-y-3">
            {release.adminControls.map((control) => (
              <div key={control.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{control.label}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{control.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(control.status)}`}>{control.status}</span>
                </div>
                <code className="mt-3 block rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-emerald-200">{control.command}</code>
                <ul className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  {control.requires.map((item) => <li key={item} className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Operational runbook</h2>
          <div className="mt-4 space-y-3">
            {release.runbook.map((step) => (
              <div key={step.step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-slate-950">Step {step.step} · {step.owner}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(step.status)}`}>{step.status}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.action}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">Evidence: {step.evidence}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Rollout stages</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {release.rolloutStages.map((stage) => (
            <article key={stage.stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">{stage.stage}</div>
                  <h3 className="mt-1 font-black text-slate-950">{stage.label}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(stage.status)}`}>{stage.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{stage.scope}</p>
              <div className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Entry criteria</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">{stage.entryCriteria.map((item) => <li key={item}>• {item}</li>)}</ul>
              <div className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Exit criteria</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">{stage.exitCriteria.map((item) => <li key={item}>• {item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
