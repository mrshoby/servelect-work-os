import { getTaskFunctionalityStatus } from "@/lib/enterprise/task-functionality-status";

const tone = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-800",
  partial: "border-blue-200 bg-blue-50 text-blue-800",
  planned: "border-amber-200 bg-amber-50 text-amber-800",
  blocked: "border-red-200 bg-red-50 text-red-800"
} as const;

export default function TaskCompletenessPage() {
  const status = getTaskFunctionalityStatus();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
        <div className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">
          Task core · v{status.version}
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Task Functionality Status</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">{status.verdict}</p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Metric label="Completare task core" value={`${status.completion}%`} />
          <Metric label="Full functional" value={status.fullFunctional ? "Da" : "Nu"} />
          <Metric label="Următorul build" value={status.nextBuild.version} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {status.areas.map((area) => (
          <div key={area.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-black text-slate-950">{area.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.current}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${tone[area.status]}`}>{area.status}</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="min-w-14 text-sm font-black text-slate-700">{area.completion}%</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${area.completion}%` }} />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-black uppercase tracking-wide text-slate-400">Lipsește</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {area.missing.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
              {area.nextAction}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <h2 className="text-lg font-black">Ce trebuie făcut ca taskurile să fie full funcționale</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {status.requiredForFullFunctional.map((item) => (
            <div key={item} className="rounded-2xl bg-white/10 p-3 text-sm font-semibold text-slate-200 ring-1 ring-white/10">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-2xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-xs font-bold text-slate-500">{label}</div>
    </div>
  );
}
