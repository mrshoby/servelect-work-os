import { CheckCircle2, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { enterpriseQualityGates } from "@/lib/enterprise/v11";

export default function QualityPage() {
  return (
    <>
      <PageHeader title="Quality Gates" subtitle="Condițiile minime înainte de fiecare build major SERVELECT WORK OS.">
        <a href="/admin/performance" className="btn-secondary">Performance</a>
        <a href="/api/v1/enterprise/release" className="btn-primary">Release API</a>
      </PageHeader>

      <Card>
        <CardHeader title="Release quality checklist" subtitle="Build, rute, performanță, documentație și pregătire DB/Auth." />
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {enterpriseQualityGates.map((gate) => (
            <div key={gate.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><ShieldCheck className="h-5 w-5" /></div><div><h3 className="font-black text-slate-950">{gate.name}</h3><p className="mt-1 text-sm text-slate-500">{gate.target}</p></div></div>
                <Badge tone={gate.status === "required" ? "green" : gate.status === "partial" ? "orange" : "blue"}>{gate.status}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Owner: {gate.owner}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
