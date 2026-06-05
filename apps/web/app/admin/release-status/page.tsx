import { AlertTriangle, CheckCircle2, ListChecks, Rocket, Smartphone, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { completionAreas, getOverallProductStatus, nextUpdates, releaseChangelog } from "@/lib/enterprise/release-status";

const statusTone = {
  done: "green",
  partial: "blue",
  blocked: "red",
  planned: "orange",
  shipped: "green",
  "in-progress": "blue",
  low: "green",
  medium: "orange",
  high: "red"
} as const;

export default function ReleaseStatusPage() {
  const status = getOverallProductStatus();

  return (
    <>
      <PageHeader
        title="Release status, changelog & roadmap"
        subtitle="Stadiul real al website-ului și aplicației mobile, ce s-a făcut pe fiecare versiune și ce urmează."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <StatusCard icon={Rocket} label="Website / Web App" value={`${status.websitePercent}%`} tone={status.websitePercent >= 70 ? "green" : "orange"} />
        <StatusCard icon={Smartphone} label="Mobile app" value={`${status.mobilePercent}%`} tone="orange" />
        <StatusCard icon={ListChecks} label="Task module" value={`${status.taskModulePercent}%`} tone="blue" />
        <StatusCard icon={Workflow} label="Total produs" value={`${status.totalPercent}%`} tone="purple" />
      </section>

      <Card className="mt-5">
        <CardHeader title="Verdict sincer" subtitle={status.honestSummary} />
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {completionAreas.map((area) => (
            <div key={area.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-950">{area.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{area.summary}</p>
                </div>
                <Badge tone={statusTone[area.status]}>{area.status}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="min-w-14 text-sm font-black text-slate-700">{area.percent}%</div>
                <ProgressBar value={area.percent} tone={area.percent >= 70 ? "green" : area.percent >= 40 ? "blue" : "orange"} />
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                <div className="text-xs font-black uppercase tracking-wide text-slate-400">Lipsește</div>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {area.missing.map((item) => (
                    <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Changelog versiuni" subtitle="Istoric vizibil pe site: ce s-a făcut și ce a rămas pentru fiecare build." />
        <div className="divide-y divide-slate-100">
          {releaseChangelog.slice().reverse().map((release) => (
            <div key={release.version} className="grid gap-4 p-5 xl:grid-cols-[220px_1fr_1fr]">
              <div>
                <div className="text-xl font-black text-slate-950">v{release.version}</div>
                <div className="mt-1 text-sm font-semibold text-slate-500">{release.title}</div>
                <div className="mt-3 flex gap-2">
                  <Badge tone={statusTone[release.status]}>{release.status}</Badge>
                  <Badge tone={statusTone[release.risk]}>risk {release.risk}</Badge>
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-black uppercase tracking-wide text-emerald-700">Făcut</div>
                <ul className="space-y-1 text-sm text-slate-600">
                  {release.done.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />{item}</li>)}
                </ul>
              </div>
              <div>
                <div className="mb-2 text-xs font-black uppercase tracking-wide text-amber-700">Rămas / limitări</div>
                <ul className="space-y-1 text-sm text-slate-600">
                  {release.missing.map((item) => <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />{item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Următoarele update-uri obligatorii" subtitle="Ce trebuie livrat ca aplicația să devină 100% website + app mobilă." />
        <div className="grid gap-4 p-5 xl:grid-cols-2">
          {nextUpdates.map((update) => (
            <div key={update.version} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="text-lg font-black text-slate-950">v{update.version} — {update.title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{update.goal}</p>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">Must deliver</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">{update.mustDeliver.map((item) => <li key={item}>• {item}</li>)}</ul>
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">Acceptance criteria</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">{update.acceptanceCriteria.map((item) => <li key={item}>• {item}</li>)}</ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function StatusCard({ icon: Icon, label, value, tone }: { icon: typeof Rocket; label: string; value: string; tone: "green" | "blue" | "orange" | "purple" }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <ProgressBar value={Number(value.replace("%", ""))} tone={tone} className="mt-4" />
    </Card>
  );
}
