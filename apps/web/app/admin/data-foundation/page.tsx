import { Database, Layers3, Route, ShieldCheck, Sparkles, Workflow } from "lucide-react";

import { dataFoundationLayers, dataFoundationMetrics, getDataFoundationRelease, v12ReadinessChecklist } from "@/lib/enterprise/data-foundation";

const toneClass = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  orange: "bg-amber-50 text-amber-700 border-amber-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
  red: "bg-red-50 text-red-700 border-red-200"
} as const;

const statusClass = {
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  partial: "bg-amber-50 text-amber-700 border-amber-200",
  planned: "bg-slate-50 text-slate-600 border-slate-200"
} as const;

export default function DataFoundationPage() {
  const release = getDataFoundationRelease();

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-card">
        <div className="grid gap-0 xl:grid-cols-[1fr_390px]">
          <div className="p-6 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              SERVELECT WORK OS · v{release.version}
            </div>

            <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight lg:text-5xl">
              Enterprise Data Foundation Release
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 lg:text-base">
              v1.2 consolidează fundația de date, readiness-ul operațional și continuitatea pentru următorul build major. Scopul este să păstrăm aceeași interfață, dar să avem un traseu clar către DB real, audit persistent, workflow-uri persistente și mobile/offline.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {dataFoundationMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                  <div className="text-3xl font-black">{metric.value}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-300">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/5 p-6 xl:border-l xl:border-t-0">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-white">Readiness global</div>
                <div className="text-xs text-slate-300">Build foundation score</div>
              </div>
              <div className="text-4xl font-black text-emerald-200">{release.score}%</div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${release.score}%` }} />
            </div>

            <div className="mt-5 space-y-2">
              {v12ReadinessChecklist.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-2 rounded-2xl bg-white/10 p-3 text-sm ring-1 ring-white/10">
                  <ShieldCheck className={item.done ? "mt-0.5 h-4 w-4 shrink-0 text-emerald-300" : "mt-0.5 h-4 w-4 shrink-0 text-amber-300"} />
                  <span className="text-slate-200">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950">Straturi enterprise</h2>
              <p className="text-sm font-semibold text-slate-500">Ce este pregătit, ce este parțial și ce rămâne pentru build-urile următoare.</p>
            </div>
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-500 lg:block">
              {dataFoundationLayers.length} layers
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {dataFoundationLayers.map((layer) => (
              <article key={layer.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-950">{layer.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{layer.description}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass[layer.status]}`}>{layer.status}</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${layer.score}%` }} />
                  </div>
                  <span className="text-sm font-black text-slate-700">{layer.score}%</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {layer.entities.map((entity) => (
                    <span key={entity} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">{entity}</span>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-white p-3">
                  <div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Next steps</div>
                  <ul className="space-y-1 text-sm font-semibold text-slate-600">
                    {layer.nextSteps.map((step) => (
                      <li key={step}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-950">API-uri v1.2</h2>
            </div>
            <div className="space-y-2 text-sm font-semibold text-slate-600">
              <ApiPill href="/api/v1/enterprise/data-foundation" />
              <ApiPill href="/api/v1/enterprise/data-readiness" />
              <ApiPill href="/api/v1/performance/audit" />
              <ApiPill href="/api/v1/system/readiness" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Workflow className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-black text-slate-950">Următorul build major</h2>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <div className="text-sm font-black text-violet-800">{release.nextMajorBuild.version}</div>
              <div className="text-xl font-black text-slate-950">{release.nextMajorBuild.name}</div>
              <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
                {release.nextMajorBuild.focus.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Route className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-950">Validare</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">După deploy, rulează auditul complet și păstrează raportul în folderul <b>audit-results</b>.</p>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-3 text-xs font-semibold text-slate-100">{`.\\scripts\\site-deep-audit.ps1 -BaseUrl "https://servelect-work-os-web.vercel.app"`}</pre>
          </div>
        </aside>
      </section>
    </main>
  );
}

function ApiPill({ href }: { href: string }) {
  return (
    <a href={href} className="block rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
      {href}
    </a>
  );
}
