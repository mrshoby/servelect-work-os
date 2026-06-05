import { getPrismaShadowActivationPlan, getPrismaShadowHealth, getPrismaShadowRelease } from "@/lib/enterprise/prisma-shadow-mode";
import { getTaskFunctionalityStatus } from "@/lib/enterprise/task-functionality-status";

const toneClass = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  partial: "border-blue-200 bg-blue-50 text-blue-800",
  mock: "border-amber-200 bg-amber-50 text-amber-800",
  blocked: "border-red-200 bg-red-50 text-red-800"
} as const;

export default function PrismaShadowAdminPage() {
  const release = getPrismaShadowRelease();
  const health = getPrismaShadowHealth();
  const plan = getPrismaShadowActivationPlan();
  const taskStatus = getTaskFunctionalityStatus();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-7 text-white shadow-card">
        <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
          SERVELECT WORK OS · v{release.version}
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight lg:text-4xl">Prisma Runtime Shadow Mode</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
          Build major pentru trecerea controlată de la mock-memory la Prisma/PostgreSQL, fără să riscăm blocarea UI-ului sau scrieri reale nevalidate.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Metric label="Readiness shadow" value={`${release.readiness}%`} />
          <Metric label="Provider curent" value={release.runtime.providerMode} />
          <Metric label="DATABASE_URL" value={release.runtime.databaseUrlConfigured ? "configurat" : "lipsă"} />
          <Metric label="DB writes" value={release.runtime.writesEnabled ? "active" : "oprite"} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-black text-slate-950">Capabilități shadow mode</h2>
            <p className="text-sm text-slate-500">Ce este pregătit pentru runtime Prisma și ce mai trebuie înainte de DB activ.</p>
          </div>

          <div className="space-y-3">
            {release.capabilities.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-black text-slate-950">{item.label}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{item.area}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    <p className="mt-2 text-xs font-bold text-emerald-700">{item.nextAction}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${toneClass[item.status]}`}>{item.status}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.readiness}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Taskuri: sunt full funcționale?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{taskStatus.verdict}</p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-black text-slate-700">Completare estimată task core</div>
              <div className="mt-2 text-3xl font-black text-slate-950">{taskStatus.completion}%</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${taskStatus.completion}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Guardrails</h2>
            <div className="mt-3 space-y-3">
              {release.guardrails.map((guardrail) => (
                <div key={guardrail.id} className="rounded-2xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <b className="text-sm text-slate-900">{guardrail.label}</b>
                    <span className={guardrail.enforced ? "text-xs font-black text-emerald-700" : "text-xs font-black text-red-700"}>
                      {guardrail.enforced ? "OK" : "RISC"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{guardrail.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Health</h2>
            <div className="mt-3 space-y-2">
              {health.checks.map((check) => (
                <div key={check.id} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <b className="text-sm text-slate-900">{check.label}</b>
                    <span className={check.ok ? "text-xs font-black text-emerald-700" : "text-xs font-black text-amber-700"}>
                      {check.ok ? "OK" : check.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{check.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Plan activare Prisma</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          {plan.phases.map((phase) => (
            <div key={phase.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-emerald-700">{phase.targetVersion} · {phase.status}</div>
              <h3 className="mt-2 font-black text-slate-950">{phase.title}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-5 text-slate-600">
                {phase.tasks.map((task) => (
                  <li key={task}>• {task}</li>
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
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-bold text-slate-300">{label}</div>
    </div>
  );
}
