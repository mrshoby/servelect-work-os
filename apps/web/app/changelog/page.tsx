import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { changelog, nextUpdates } from "@/lib/enterprise/release-dashboard";

const typeTone = {
  major: "green",
  minor: "blue",
  fix: "orange"
} as const;

export default function ChangelogPage() {
  return (
    <>
      <PageHeader title="Changelog Servelect Work OS" subtitle="Istoric versiuni, ce s-a făcut și ce urmează. Această pagină trebuie actualizată la fiecare build major." />

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {changelog.map((entry) => (
            <Card key={entry.version}>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={typeTone[entry.type]}>{entry.version}</Badge>
                      <span className="text-xs font-bold text-slate-400">{entry.date}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-black text-slate-950">{entry.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Status: {entry.status}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-800">Ce s-a făcut</h3>
                    <div className="mt-3 space-y-2">
                      {entry.shipped.map((item) => <div key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{item}</div>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">Ce urmează</h3>
                    <div className="mt-3 space-y-2">
                      {entry.next.map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{item}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader title="Next updates" subtitle="Plan de build-uri mari, nu incrementale mici." />
          <div className="space-y-3 p-5">
            {nextUpdates.map((update) => (
              <div key={update.version} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <b className="text-slate-950">{update.version}</b>
                  <Badge tone={update.priority === "critical" ? "red" : "orange"}>{update.priority}</Badge>
                </div>
                <div className="mt-2 text-sm font-black text-slate-800">{update.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{update.outcome}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
