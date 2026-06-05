import { getReleaseStatus } from "@/lib/enterprise/release-dashboard";

function toneFor(status: string) {
  switch (status) {
    case "stable":
    case "ready":
    case "shipped":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "beta":
    case "partial":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "mock":
    case "planned":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "blocked":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function averageCompletion(items: Array<{ completion: number }>) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.completion, 0) / items.length);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}

export default function ReleaseStatusPage() {
  const status = getReleaseStatus();

  const areas = status.areas;
  const overallCompletion = averageCompletion(areas);

  const websiteAreas = areas.filter((area) => {
    const haystack = `${area.id} ${area.label}`.toLowerCase();
    return haystack.includes("website") || haystack.includes("web");
  });

  const mobileAreas = areas.filter((area) => {
    const haystack = `${area.id} ${area.label}`.toLowerCase();
    return haystack.includes("mobile") || haystack.includes("app");
  });

  const websiteCompletion = websiteAreas.length ? averageCompletion(websiteAreas) : overallCompletion;
  const appCompletion = mobileAreas.length ? averageCompletion(mobileAreas) : overallCompletion;

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Release status live</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">SERVELECT WORK OS {status.version}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{status.summary}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Metric label="Overall" value={`${overallCompletion}%`} />
          <Metric label="Website/Web" value={`${websiteCompletion}%`} />
          <Metric label="Mobile App" value={`${appCompletion}%`} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {areas.map((area) => (
          <article key={area.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-950">{area.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.summary}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(area.status)}`}>
                {area.status}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="min-w-14 text-sm font-black text-slate-800">{area.completion}%</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${area.completion}%` }} />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">Done</div>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {area.done.map((item) => (
                    <li key={item} className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.16em] text-amber-600">Missing / next</div>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {area.missing.map((item) => (
                    <li key={item} className="rounded-xl bg-amber-50 px-3 py-2 text-amber-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Changelog</h2>
          <div className="mt-4 space-y-3">
            {status.changelog.map((item) => (
              <div key={`${item.version}-${item.title}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{item.version} — {item.title}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${toneFor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{item.date}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Next updates</h2>
          <div className="mt-4 space-y-3">
            {status.nextUpdates.map((item) => (
              <div key={`${item.version}-${item.title}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-black text-slate-950">{item.version} — {item.title}</div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-200">
                    {item.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.outcome}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {item.required.map((required) => (
                    <li key={required} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      {required}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}