import { getProductionSourceCutoverRehearsals } from "@/lib/enterprise/production-source-cutover-rehearsals";

export default function Page() {
  const release = getProductionSourceCutoverRehearsals();
  const items = release.incidents;
  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">v{release.version} · Source cutover</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Incident Playbooks</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">{release.summary}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article key={index} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <pre className="whitespace-pre-wrap break-words text-xs leading-5 text-slate-700">{JSON.stringify(item, null, 2)}</pre>
          </article>
        ))}
      </section>
    </main>
  );
}
