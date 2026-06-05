import { getTaskBoardDrawerPack, getTaskBoardDrawerHealth } from "@/lib/enterprise/task-board-drawer";

const toneClass = {
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  partial: "bg-blue-50 text-blue-700 ring-blue-200",
  planned: "bg-amber-50 text-amber-700 ring-amber-200",
  blocked: "bg-red-50 text-red-700 ring-red-200"
} as const;

export default function TaskBoardDrawerPage() {
  const pack = getTaskBoardDrawerPack();
  const health = getTaskBoardDrawerHealth();

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">SERVELECT WORK OS · v2.7</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">API-backed Task Board & Drawer</h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">{pack.summary}</p>
          </div>
          <div className="rounded-3xl bg-slate-950 px-6 py-5 text-white">
            <div className="text-sm font-bold text-slate-300">Readiness</div>
            <div className="mt-1 text-4xl font-black">{pack.readiness}%</div>
            <div className="mt-1 text-xs font-bold text-emerald-200">{pack.providerMode}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <StatusCard label="Production DB writes" value={pack.isProductionDbActive ? "ACTIVE" : "OFF"} tone={pack.isProductionDbActive ? "ready" : "planned"} />
        <StatusCard label="Health OK" value={health.ok ? "YES" : "NEEDS WORK"} tone={health.ok ? "ready" : "blocked"} />
        <StatusCard label="Next build" value={pack.nextBuild} tone="partial" />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {pack.capabilities.map((capability) => (
          <article key={capability.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-950">{capability.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{capability.description}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneClass[capability.status]}`}>{capability.status}</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${capability.readiness}%` }} />
            </div>
            <div className="mt-3 text-sm font-black text-slate-800">{capability.readiness}% · {capability.apiContract}</div>
            <ul className="mt-3 space-y-1 text-sm text-slate-500">
              {capability.next.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Demo board state</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {pack.boardColumns.map((column) => (
            <div key={column.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-black text-slate-900">{column.label}</div>
              <div className="mt-2 text-3xl font-black text-slate-950">{column.count}</div>
              <div className="mt-1 text-xs font-bold text-slate-500">API status: {column.apiStatus}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatusCard({ label, value, tone }: { label: string; value: string; tone: keyof typeof toneClass }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-black text-slate-950">{value}</div>
      <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${toneClass[tone]}`}>{tone}</span>
    </div>
  );
}
