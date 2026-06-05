import { getReleaseChangelog, getNextUpdates } from "@/lib/enterprise/release-dashboard";

export default function ChangelogPage() {
  const changelog = getReleaseChangelog();
  const next = getNextUpdates();
  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Changelog</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">SERVELECT WORK OS updates</h1>
        <p className="mt-3 text-sm text-slate-600">Istoric versiuni, ce s-a fÄƒcut È™i ce urmeazÄƒ. Versiunea curentÄƒ: {changelog.version}</p>
      </section>
      <section className="space-y-4">
        {changelog.changelog.map((item) => (
          <article key={item.version} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div><h2 className="text-xl font-black text-slate-950">{item.version} â€” {item.title}</h2><p className="text-sm font-bold text-slate-400">{item.date} Â· {item.type} Â· {item.status}</p></div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div><div className="text-xs font-black uppercase text-slate-400">Ce s-a fÄƒcut</div><ul className="mt-2 space-y-1 text-sm text-slate-600">{item.highlights.map((i) => <li key={i}>â€¢ {i}</li>)}</ul></div>
              <div><div className="text-xs font-black uppercase text-slate-400">UrmÄƒtorii paÈ™i</div><ul className="mt-2 space-y-1 text-sm text-slate-600">{item.next.map((i) => <li key={i}>â€¢ {i}</li>)}</ul></div>
            </div>
          </article>
        ))}
      </section>
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Next updates</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">{next.nextUpdates.map((u) => <div key={u.version} className="rounded-2xl bg-slate-50 p-4"><div className="text-sm font-black text-emerald-700">{u.version}</div><div className="mt-1 font-black text-slate-950">{u.title}</div><p className="mt-2 text-sm text-slate-600">{u.outcome}</p></div>)}</div>
      </section>
    </main>
  );
}
