import { ArrowRight, GitBranch, Rocket } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { enterpriseRoadmap } from "@/lib/enterprise/v11";

export default function RoadmapPage() {
  return (
    <>
      <PageHeader title="Roadmap v1.x" subtitle="Build-uri majore pentru SERVELECT WORK OS, nu micro-update-uri fără context.">
        <a href="/enterprise" className="btn-secondary">Enterprise board</a>
        <a href="/api/v1/enterprise/release" className="btn-primary">Release manifest</a>
      </PageHeader>

      <Card>
        <CardHeader title="Plan de livrare" subtitle="Ordinea recomandată pentru transformarea MVP-ului în aplicație production." />
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {enterpriseRoadmap.map((item) => (
            <div key={item.version} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Rocket className="h-5 w-5" /></div><div><div className="text-xs font-black uppercase text-slate-400">Versiunea {item.version}</div><h3 className="text-lg font-black text-slate-950">{item.title}</h3></div></div>
                <Badge tone={item.status === "current" ? "green" : item.status === "next" ? "blue" : "gray"}>{item.status}</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {item.goals.map((goal) => <div key={goal} className="flex gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {goal}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white">
        <div className="flex items-center gap-2 text-sm font-black"><GitBranch className="h-5 w-5 text-emerald-300" /> Regulă nouă de versiuni</div>
        <p className="mt-2 text-sm leading-6 text-slate-300">De acum, versiunile principale vor fi v1.1, v1.2, v1.3 etc. Patch-urile v1.1.1 vor fi folosite doar pentru build fixes urgente, nu ca direcție principală de dezvoltare.</p>
      </div>
    </>
  );
}
