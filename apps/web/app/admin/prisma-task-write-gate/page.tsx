import { getPrismaTaskWriteGateControlledActivation } from "@/lib/enterprise/prisma-task-write-gate-controlled-activation";

function toneClass(status: string) {
  switch (status) {
    case "stable":
    case "ready":
    case "controlled":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "beta":
    case "shadow":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "partial":
    case "locked":
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

export default function PrismaTaskWriteGatePage() {
  const release = getPrismaTaskWriteGateControlledActivation();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-950">v3.3.0 — Prisma Task Write-Gate Controlled Activation</h1>
            <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
          </div>
          <span className={`rounded-full px-4 py-2 text-xs font-black ring-1 ${toneClass(release.isProductionWriteEnabled ? "controlled" : "blocked")}`}>
            {release.writeGateState}
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
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Requested mode</div>
            <div className="mt-2 text-2xl font-black text-slate-950">{release.requestedWriteMode}</div>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Production writes</div>
            <div className={`mt-2 text-2xl font-black ${release.isProductionWriteEnabled ? "text-emerald-600" : "text-red-600"}`}>
              {release.isProductionWriteEnabled ? "CONTROLLED" : "OFF"}
            </div>
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
        {release.stages.map((stage) => (
          <article key={stage.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950">{stage.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{stage.result}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneClass(stage.status)}`}>{stage.status}</span>
            </div>
            <div className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">risk: {stage.risk}</div>
          </article>
        ))}
      </section>
    </main>
  );
}
