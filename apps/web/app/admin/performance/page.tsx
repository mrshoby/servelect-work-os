import { Activity, AlertTriangle, CheckCircle2, Clock, Gauge, Route } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { siteAuditRoutes } from "@/lib/performance/audit-routes";

export default function PerformancePage() {
  const critical = siteAuditRoutes.filter((route) => route.critical).length;
  const avgBudget = Math.round(siteAuditRoutes.reduce((sum, route) => sum + route.maxMs, 0) / siteAuditRoutes.length);

  return (
    <>
      <PageHeader
        title="Performance & Site Audit"
        subtitle="Verificare completă site-wide pentru rute lente, blocaje de browser și pagini critice."
      >
        <a className="btn-secondary" href="/api/v1/performance/audit">Audit manifest</a>
        <a className="btn-primary" href="/api/v1/performance/deep-audit">Deep audit API</a>
      </PageHeader>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Route} label="Rute în audit" value={String(siteAuditRoutes.length)} tone="blue" />
        <Kpi icon={AlertTriangle} label="Rute critice" value={String(critical)} tone="red" />
        <Kpi icon={Clock} label="Buget mediu" value={`${avgBudget}ms`} tone="orange" />
        <Kpi icon={CheckCircle2} label="Smoke script" value="Ready" tone="green" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card>
          <CardHeader title="Route performance manifest" subtitle="Rutele care trebuie verificate după fiecare build major." />
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Rută</th>
                  <th className="px-5 py-3">Categorie</th>
                  <th className="px-5 py-3">Buget</th>
                  <th className="px-5 py-3">Critică</th>
                  <th className="px-5 py-3">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteAuditRoutes.map((route) => (
                  <tr key={route.path} className="hover:bg-slate-50">
                    <td className="px-5 py-4"><div className="font-black text-slate-950">{route.label}</div><div className="text-xs text-slate-500">{route.path}</div></td>
                    <td className="px-5 py-4"><Badge tone="gray">{route.category}</Badge></td>
                    <td className="px-5 py-4 font-bold text-slate-700">{route.maxMs}ms</td>
                    <td className="px-5 py-4"><Badge tone={route.critical ? "red" : "gray"}>{route.critical ? "Da" : "Nu"}</Badge></td>
                    <td className="px-5 py-4"><ProgressBar value={route.critical ? 82 : 72} tone={route.critical ? "green" : "blue"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Cum verifici TOT site-ul" subtitle="Comenzi pentru audit local după deploy." />
          <div className="space-y-4 p-5 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-emerald-100">
              cd D:\\01_digitalizare_automatizare\\02_productie\\05_aplicatie_goodday\\02_beta\\03_v003\\servelect-work-os-v003-live<br />
              .\\scripts\\site-deep-audit.ps1 -BaseUrl https://servelect-work-os-web.vercel.app
            </div>
            <p>Scriptul creează rapoarte în <b>audit-results/</b> cu status code, durată și observații pentru fiecare rută.</p>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <b>Regulă v1.1:</b> nu mai continuăm cu features noi dacă build-ul, smoke test-ul sau pagina /taskuri pică.
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof Gauge; label: string; value: string; tone: "green" | "blue" | "orange" | "red" }) {
  const bg = tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "blue" ? "bg-blue-50 text-blue-700" : tone === "orange" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700";
  return <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"><div className={`grid h-11 w-11 place-items-center rounded-2xl ${bg}`}><Icon className="h-5 w-5" /></div><div className="mt-4 text-2xl font-black text-slate-950">{value}</div><div className="text-sm font-bold text-slate-500">{label}</div></div>;
}
