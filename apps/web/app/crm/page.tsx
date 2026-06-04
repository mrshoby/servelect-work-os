"use client";

import { ArrowRight, BriefcaseBusiness, FileSignature, Handshake, Plus, TimerReset, TrendingUp } from "lucide-react";
import { crmLeads, formatRon } from "@servelect/shared";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { KpiCard } from "@/components/ui/KpiCard";

const stages = ["Lead nou", "Calificat", "Ofertă emisă", "Negociere", "Câștigat", "Pierdut"] as const;
const stageTone: Record<(typeof stages)[number], "blue" | "green" | "orange" | "red" | "purple"> = {
  "Lead nou": "blue",
  "Calificat": "purple",
  "Ofertă emisă": "orange",
  "Negociere": "orange",
  "Câștigat": "green",
  "Pierdut": "red"
};

export default function CRMPage() {
  const total = crmLeads.reduce((sum, lead) => sum + lead.valueRon, 0);
  const weighted = crmLeads.reduce((sum, lead) => sum + (lead.valueRon * lead.probability) / 100, 0);
  const won = crmLeads.filter((lead) => lead.stage === "Câștigat").length;
  const followUps = crmLeads.filter((lead) => !["Câștigat", "Pierdut"].includes(lead.stage));

  return (
    <>
      <PageHeader title="CRM & Vânzări" subtitle="Pipeline comercial task-first: lead, ofertă, aprobare, semnare și următorul pas." >
        <button className="btn-secondary">Filtre pipeline</button>
        <button className="btn-primary"><Plus className="h-4 w-4"/> Oportunitate nouă</button>
      </PageHeader>

      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={BriefcaseBusiness} label="Pipeline total" value={formatRon(total)} sub="toate oportunitățile" trend="taskuri comerciale legate" tone="blue" />
        <KpiCard icon={TrendingUp} label="Weighted pipeline" value={formatRon(Math.round(weighted))} sub="probabilitate ponderată" trend="forecast vânzări" />
        <KpiCard icon={Handshake} label="Deal-uri câștigate" value={String(won)} sub="în luna curentă" trend="contractare rapidă" tone="green" />
        <KpiCard icon={TimerReset} label="Follow-up-uri" value={String(followUps.length)} sub="necesită acțiune" trend="create task" tone="orange" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_.32fr]">
        <Card>
          <CardHeader title="Pipeline Kanban" subtitle="Fiecare card poate genera task, ofertă PDF sau aprobare internă." action={<button className="btn-secondary">Vezi activitate</button>} />
          <div className="overflow-x-auto p-5 pt-0 scrollbar-thin">
            <div className="grid min-w-[1120px] grid-cols-6 gap-3">
              {stages.map((stage, index) => {
                const items = crmLeads.filter((lead) => lead.stage === stage);
                const stageValue = items.reduce((sum, lead) => sum + lead.valueRon, 0);
                return (
                  <section key={stage} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <b className="text-sm text-slate-950">{index + 1}. {stage}</b>
                        <div className="text-xs font-semibold text-slate-500">{items.length} · {formatRon(stageValue)}</div>
                      </div>
                      <Badge tone={stageTone[stage]}>{items.length}</Badge>
                    </div>

                    <div className="space-y-3">
                      {items.map((lead) => (
                        <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-card">
                          <b className="line-clamp-1 text-sm text-slate-950">{lead.company}</b>
                          <div className="mt-1 text-xs text-slate-500">{lead.contact}</div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-sm font-black">{formatRon(lead.valueRon)}</span>
                            <Badge tone={stageTone[stage]}>{lead.probability}%</Badge>
                          </div>
                          <div className="mt-3"><ProgressBar value={lead.probability} tone={lead.probability >= 70 ? "green" : lead.probability >= 40 ? "orange" : "red"} /></div>
                          <div className="mt-3 rounded-xl bg-slate-50 p-2 text-xs font-semibold text-slate-500">Următor: {lead.nextStep}</div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Taskuri de urmat" action={<a className="text-xs font-bold text-servelect-600">Vezi toate</a>} />
          <div className="space-y-3 p-5 pt-0">
            {followUps.slice(0, 6).map((lead, index) => (
              <div key={lead.id} className="rounded-2xl border border-slate-200 p-3 text-sm">
                <div className="flex items-center justify-between gap-2"><b>{lead.nextStep}</b><span className="text-xs font-black text-slate-400">{["09:30", "11:00", "13:00", "15:30", "16:00", "17:00"][index]}</span></div>
                <div className="mt-1 text-xs text-slate-500">{lead.company}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[.65fr_.8fr_.55fr_.65fr_.75fr_.55fr]">
        <Card><CardHeader title="Client 360°" action={<Badge tone="green">Client activ</Badge>} /><div className="p-5 pt-0"><h3 className="text-xl font-extrabold">TechConstruct SRL</h3><p className="text-sm text-slate-500">Industrie · B2B · Client din 2023</p><div className="mt-5 space-y-2 text-sm"><p>Persoană contact: <b>Marius Ionescu</b></p><p>marius.ionescu@techconstruct.ro</p><p>+40 742 123 456</p><p>Cluj-Napoca, România</p></div><div className="mt-4 flex gap-2"><Badge tone="blue">Segment B2B</Badge><Badge tone="green">Activ</Badge></div></div></Card>
        <Card><CardHeader title="Workflow ofertă" subtitle="#OF-2024-0321" /><div className="space-y-3 p-5 pt-0">{["Creată", "Revizuită", "Aprobare internă", "Trimisă clientului", "Negociere", "Finalizare"].map((x,i)=><div key={x} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${i<2?"bg-servelect-600 text-white":i===2?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-500"}`}>{i+1}</span><div><b className="text-sm">{x}</b><div className="text-xs text-slate-500">{i<2?"finalizat":i===2?"în așteptare":"urmează"}</div></div></div>)}</div></Card>
        <Card><CardHeader title="Aprobare ofertă" /><div className="p-5 pt-0"><Badge tone="red">Aprobare necesară</Badge><p className="mt-4 text-sm">OF-2024-0321 · TechConstruct SRL · 450.000 RON</p><div className="mt-4 flex gap-2"><button className="btn-primary">Aprobă</button><button className="btn-secondary">Respinge</button></div></div></Card>
        <Card><CardHeader title="Semnătură electronică" /><div className="space-y-3 p-5 pt-0">{["Contract #CT-2024-0157", "Contract #CT-2024-0158"].map(x=><div key={x} className="rounded-xl border border-slate-200 p-3 text-sm"><FileSignature className="mb-2 h-4 w-4 text-slate-400"/><b>{x}</b><div className="text-xs text-amber-600">În așteptare</div></div>)}</div></Card>
        <Card><CardHeader title="Calculator ROI" /><div className="grid grid-cols-2 gap-4 p-5 pt-0 text-sm"><Metric label="Investiție totală" value="1.245.000 RON"/><Metric label="Producție anuală" value="612.450 kWh"/><Metric label="Recuperare" value="3,5 ani"/><Metric label="IRR" value="21,4%"/></div><div className="px-5 pb-5"><button className="btn-secondary w-full justify-between">Vezi detalii ROI <ArrowRight className="h-4 w-4" /></button></div></Card>
        <Card><CardHeader title="Activitate recentă" /><div className="space-y-4 p-5 pt-0">{["Ofertă emisă", "Task completat", "Contact nou adăugat", "Document semnat"].map(x=><div key={x} className="border-l-2 border-servelect-600 pl-3 text-sm"><b>{x}</b><div className="text-xs text-slate-500">acum 45 min</div></div>)}</div></Card>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs text-slate-500">{label}</div><div className="mt-1 font-extrabold">{value}</div></div>;
}
