"use client";

import { ArrowRight, FileSignature, Handshake, Plus } from "lucide-react";
import { crmLeads } from "@servelect/shared";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

const stages = ["Lead nou", "Calificat", "Ofertă emisă", "Negociere", "Câștigat", "Pierdut"] as const;

export default function CRMPage() {
  return (
    <>
      <PageHeader title="CRM, pipeline și oferte" subtitle="Gestionează pipeline-ul de vânzări, oportunități, oferte comerciale și taskuri de follow-up."><button className="btn-primary"><Plus className="h-4 w-4"/> Oportunitate nouă</button></PageHeader>
      <div className="grid gap-4 xl:grid-cols-[1fr_.32fr]">
        <Card>
          <CardHeader title="Pipeline" subtitle="Kanban comercial task-first" action={<button className="btn-secondary">Filtre avansate</button>} />
          <div className="grid min-w-[1100px] grid-cols-6 gap-3 overflow-x-auto p-5 pt-0">
            {stages.map((stage, index) => {
              const items = crmLeads.filter((lead) => lead.stage === stage);
              return <div key={stage} className="rounded-2xl border-t-4 border-t-servelect-600 bg-slate-50 p-3"><div className="mb-3"><b>{index+1}. {stage}</b><div className="text-xs text-slate-500">{items.length} oportunități</div></div>{items.map((lead)=><div key={lead.id} className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><b className="text-sm">{lead.company}</b><div className="text-xs text-slate-500">{lead.contact}</div><div className="mt-2 text-sm font-extrabold">{lead.valueRon.toLocaleString("ro-RO")} RON</div><Badge tone={stage === "Pierdut" ? "red" : stage === "Câștigat" ? "green" : "blue"}>{stage}</Badge></div>)}</div>;
            })}
          </div>
        </Card>
        <Card><CardHeader title="Taskuri de urmat" action={<a className="text-xs font-bold text-servelect-600">Vezi toate</a>} /><div className="space-y-3 p-5 pt-0">{["Sună la TechConstruct SRL", "Trimite ofertă actualizată", "Pregătește prezentare tehnică", "Follow-up ofertă"].map((x,i)=><div key={x} className="flex items-center justify-between text-sm"><span>{x}</span><b>{["09:30","11:00","13:00","16:00"][i]}</b></div>)}</div></Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[.65fr_.8fr_.55fr_.65fr_.75fr_.55fr]">
        <Card><CardHeader title="Client 360°" action={<Badge tone="green">Client activ</Badge>} /><div className="p-5 pt-0"><h3 className="text-xl font-extrabold">TechConstruct SRL</h3><p className="text-sm text-slate-500">Industrie · B2B · Client din 2023</p><div className="mt-5 space-y-2 text-sm"><p>Persoană contact: <b>Marius Ionescu</b></p><p>marius.ionescu@techconstruct.ro</p><p>+40 742 123 456</p><p>Cluj-Napoca, România</p></div><div className="mt-4 flex gap-2"><Badge tone="blue">Segment B2B</Badge><Badge tone="green">Client activ</Badge></div></div></Card>
        <Card><CardHeader title="Workflow ofertă" subtitle="#OF-2024-0321" /><div className="space-y-3 p-5 pt-0">{["Creată", "Revizuită", "Aprobare internă", "Trimisă clientului", "Negociere", "Finalizare"].map((x,i)=><div key={x} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${i<2?"bg-servelect-600 text-white":i===2?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-500"}`}>{i+1}</span><div><b className="text-sm">{x}</b><div className="text-xs text-slate-500">{i<2?"finalizat":i===2?"în așteptare":"urmează"}</div></div></div>)}</div></Card>
        <Card><CardHeader title="Aprobare ofertă" /><div className="p-5 pt-0"><Badge tone="red">Aprobare necesară</Badge><p className="mt-4 text-sm">OF-2024-0321 · TechConstruct SRL · 450.000 RON</p><div className="mt-4 flex gap-2"><button className="btn-primary">Aprobă</button><button className="btn-secondary">Respinge</button></div></div></Card>
        <Card><CardHeader title="Semnătură electronică" /><div className="space-y-3 p-5 pt-0">{["Contract #CT-2024-0157", "Contract #CT-2024-0158"].map(x=><div key={x} className="rounded-xl border border-slate-200 p-3 text-sm"><FileSignature className="mb-2 h-4 w-4 text-slate-400"/><b>{x}</b><div className="text-xs text-amber-600">În așteptare</div></div>)}</div></Card>
        <Card><CardHeader title="Calculator ROI" /><div className="grid grid-cols-2 gap-4 p-5 pt-0 text-sm"><Metric label="Investiție totală" value="1.245.000 RON"/><Metric label="Producție anuală" value="612.450 kWh"/><Metric label="Perioadă recuperare" value="3,5 ani"/><Metric label="IRR" value="21,4%"/></div><div className="px-5 pb-5"><button className="btn-secondary w-full justify-between">Vezi detalii ROI <ArrowRight className="h-4 w-4" /></button></div></Card>
        <Card><CardHeader title="Activitate recentă" /><div className="space-y-4 p-5 pt-0">{["Ofertă emisă", "Task completat", "Contact nou adăugat", "Document semnat"].map(x=><div key={x} className="border-l-2 border-servelect-600 pl-3 text-sm"><b>{x}</b><div className="text-xs text-slate-500">acum 45 min</div></div>)}</div></Card>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div><div className="text-xs text-slate-500">{label}</div><div className="mt-1 font-extrabold">{value}</div></div>; }
