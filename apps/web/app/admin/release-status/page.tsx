import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getReleaseStatus } from "@/lib/enterprise/release-dashboard";

const toneByStatus = {
  stable: "green",
  progress: "blue",
  risk: "orange",
  early: "gray"
} as const;

export default function ReleaseStatusPage() {
  const release = getReleaseStatus();

  return (
    <>
      <PageHeader title="Release status & product completion" subtitle="Status vizibil pentru website, aplicație mobilă, task core, backend, DB, Auth/RBAC și următoarele update-uri.">
        <Badge tone="green">v{release.version}</Badge>
      </PageHeader>

      <section className="grid gap-4 xl:grid-cols-4">
        <Card className="xl:col-span-2">
          <CardHeader title={release.name} subtitle={release.productStatus} />
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric label="Beta readiness" value={release.betaReadiness} tone="green" />
              <Metric label="Production readiness" value={release.productionReadiness} tone="orange" />
              <Metric label="Mobile readiness" value={release.mobileReadiness} tone="blue" />
            </div>
            <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">Următorul build major: {release.nextMajor}</p>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Ce s-a făcut în ultima versiune" subtitle="Changelog scurt pentru build-ul curent." />
          <div className="space-y-3 p-5">
            {release.changelog[0]?.shipped.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700">{item}</div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-3">
        {release.areas.map((area) => (
          <Card key={area.id}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-950">{area.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{area.summary}</p>
                </div>
                <Badge tone={toneByStatus[area.status]}>{area.status}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 text-sm font-black text-slate-700">{area.percent}%</div>
                <ProgressBar value={area.percent} tone={area.status === "risk" ? "orange" : area.status === "early" ? "blue" : "green"} />
              </div>
              <div className="mt-4 space-y-2">
                {area.next.slice(0, 3).map((item) => <div key={item} className="text-xs font-semibold text-slate-500">• {item}</div>)}
              </div>
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "green" | "blue" | "orange" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-3xl font-black text-slate-950">{value}%</div>
      <div className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">{label}</div>
      <ProgressBar value={value} tone={tone} className="mt-4" />
    </div>
  );
}
