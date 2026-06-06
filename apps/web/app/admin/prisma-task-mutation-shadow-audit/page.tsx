import { getPrismaTaskMutationShadowAudit } from "@/lib/enterprise/prisma-task-mutation-shadow-audit";

function toneClass(status: string) {
  switch (status) {
    case "stable":
    case "ready":
    case "pass":
    case "controlled":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "beta":
    case "shadow":
    case "audit":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "partial":
    case "planned":
    case "warning":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function PercentCard({ label, value, status, summary }: { label: string; value: number; status: string; summary: string }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950">{label}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{summary}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneClass(status)}`}>{status}</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="min-w-14 text-sm font-black text-slate-800">{value}%</div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
        </div>
      </div>
    </article>
  );
}

export default function PrismaTaskMutationShadowAuditPage() {
  const release = getPrismaTaskMutationShadowAudit();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-950">v3.4.0 — Prisma Task Mutation Shadow Audit</h1>
            <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-xs font-black ring-1 ${toneClass("shadow")}`}>
            {release.writeState}
          </span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Readiness</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{release.readiness}%</div>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Overall product</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{release.overallCompletion}%</div>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Prisma write mode</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{release.prismaWriteMode}</div>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Production writes</div>
            <div className="mt-2 text-2xl font-black text-red-600">OFF</div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Status / procente vizibile pe site</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {release.statusPercentages.map((area) => (
            <PercentCard key={area.id} label={area.label} value={area.completion} status={area.status} summary={area.summary} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {release.checks.map((check) => (
          <article key={check.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950">{check.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{check.result}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneClass(check.status)}`}>{check.status}</span>
            </div>
            <div className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">risk: {check.risk}</div>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Mutation payload shadow samples</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {release.payloadSamples.map((sample) => (
            <article key={`${sample.action}-${sample.source}`} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">{sample.action} / {sample.source}</div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-200">
                  {sample.auditMode}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Prisma write: {sample.prismaWrite}</p>
              <p className="mt-1 text-sm text-slate-600">Result: {sample.result}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
