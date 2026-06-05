import type { ReactNode } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  GitBranch,
  Layers3,
  ServerCog,
  ShieldCheck
} from "lucide-react";

import {
  getApiUiStoreHealth,
  getApiUiStoreIntegrationPlan,
  getApiUiStoreRelease,
  type ApiUiStoreStatus
} from "@/lib/enterprise/api-ui-store";

const toneClass: Record<ApiUiStoreStatus, string> = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  partial: "border-blue-200 bg-blue-50 text-blue-700",
  mock: "border-amber-200 bg-amber-50 text-amber-700",
  blocked: "border-red-200 bg-red-50 text-red-700"
};

const statusLabel: Record<ApiUiStoreStatus, string> = {
  ready: "Ready",
  partial: "Parțial",
  mock: "Mock",
  blocked: "Blocat"
};

export default function ApiUiStorePage() {
  const release = getApiUiStoreRelease();
  const health = getApiUiStoreHealth();
  const plan = getApiUiStoreIntegrationPlan();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-sm">
        <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
          <div className="p-6 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
              <ServerCog className="h-4 w-4" />
              SERVELECT WORK OS · v{release.version}
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight lg:text-4xl">API-backed UI Store Integration</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{release.summary}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Readiness" value={`${release.readiness}%`} />
              <Metric label="Critical open" value={String(release.criticalOpen)} />
              <Metric label="Route contracts" value={String(release.routeContracts.length)} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/5 p-6 xl:border-l xl:border-t-0">
            <div className="flex items-center gap-3">
              {health.ok ? <CheckCircle2 className="h-9 w-9 text-emerald-300" /> : <AlertTriangle className="h-9 w-9 text-amber-300" />}
              <div>
                <div className="text-sm font-black">Health status</div>
                <div className="text-xs text-slate-300">{health.provider}</div>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-200 ring-1 ring-white/10">{health.note}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <InfoCard icon={<Layers3 className="h-5 w-5" />} title="UI store layers" value={String(release.layers.length)} subtitle="Taskuri, proiecte, drawer, offline cache și realtime updates." />
        <InfoCard icon={<GitBranch className="h-5 w-5" />} title="Integration steps" value={String(plan.steps.length)} subtitle="Feature flag, query layer, project layer, audit events, DB provider switch." />
        <InfoCard icon={<Database className="h-5 w-5" />} title="Production mode" value={health.productionSafe ? "Safe" : "Review"} subtitle="Interfața existentă rămâne neschimbată; integrarea se face progresiv." />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Integration layers</h2>
            <p className="mt-1 text-sm text-slate-500">Starea fiecărui strat UI care trebuie conectat la API-backed store.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-500">generated {new Date(release.generatedAt).toLocaleString("ro-RO")}</div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {release.layers.map((layer) => (
            <div key={layer.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-slate-950">{layer.label}</div>
                  <div className="mt-1 text-xs font-bold text-slate-500">{layer.module} · {layer.owner}</div>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${toneClass[layer.status]}`}>{statusLabel[layer.status]}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{layer.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="min-w-14 text-sm font-black text-slate-700">{layer.readiness}%</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${layer.readiness}%` }} />
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-500">
                <b className="text-slate-700">Next:</b> {layer.nextAction}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Route contracts</h2>
          <p className="mt-1 text-sm text-slate-500">Contracte API care trebuie consumate progresiv de interfață.</p>
          <div className="mt-4 divide-y divide-slate-100">
            {release.routeContracts.map((contract) => (
              <div key={contract.id} className="py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-slate-950 px-2 py-1 text-xs font-black text-white">{contract.method}</span>
                  <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">{contract.route}</code>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${toneClass[contract.status]}`}>{statusLabel[contract.status]}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{contract.purpose}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {contract.uiConsumers.map((consumer) => (
                    <span key={consumer} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-500">{consumer}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Integration plan</h2>
          <p className="mt-1 text-sm text-slate-500">{plan.principle}</p>
          <div className="mt-4 space-y-3">
            {plan.steps.map((step) => (
              <div key={step.id} className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-slate-950">{step.title}</div>
                    <div className="mt-1 text-xs font-bold text-slate-500">{step.phase} · {step.priority}</div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${toneClass[step.status]}`}>{statusLabel[step.status]}</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {step.checklist.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6" />
          <h2 className="text-lg font-black">Regulă v1.8</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-emerald-800">Nu schimbăm interfața vizuală. Activăm API-backed store doar progresiv, prin feature flag, cu fallback pe localStorage/mock data ca să nu stricăm demo-ul live.</p>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-semibold text-slate-300">{label}</div>
    </div>
  );
}

function InfoCard({ icon, title, value, subtitle }: { icon: ReactNode; title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">{icon}</div>
        <Activity className="h-5 w-5 text-slate-300" />
      </div>
      <div className="mt-4 text-2xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-sm font-black text-slate-700">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
    </div>
  );
}
