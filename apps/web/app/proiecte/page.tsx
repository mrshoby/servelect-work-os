"use client";

import { CheckCircle2, Clock3, Filter, FolderKanban, Plus, Target, WalletCards } from "lucide-react";
import { approvals, projects } from "@servelect/shared";
import { PageHeader, Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { GanttTimeline } from "@/components/projects/GanttTimeline";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Management proiecte fotovoltaice" subtitle="Planificare, execuție și control proiecte — taskuri, Gantt, risc, documente și chat.">
        <button className="btn-secondary"><Filter className="h-4 w-4" /> Filtre</button>
        <button className="btn-primary"><Plus className="h-4 w-4" /> Proiect nou</button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard icon={FolderKanban} label="Proiecte active" value="28" sub="din 42 în total" trend="↑ 12% față de luna trecută" />
        <KpiCard icon={Clock3} label="În desfășurare" value="18" sub="proiecte" trend="↑ 8% față de luna trecută" tone="blue" />
        <KpiCard icon={CheckCircle2} label="Finalizate luna aceasta" value="6" sub="proiecte" trend="↑ 20% față de luna trecută" />
        <KpiCard icon={WalletCards} label="Buget total" value="32,4 mil. RON" sub="aprobat" trend="↑ 14% față de luna trecută" tone="purple" />
        <KpiCard icon={Target} label="Progres mediu" value="48%" sub="toate proiectele" trend="↑ 9% față de luna trecută" tone="orange" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_.45fr]">
        <Card><CardHeader title="Timeline proiecte (Gantt)" subtitle="Mai — Iulie 2024" action={<button className="btn-secondary">Lună</button>} /><GanttTimeline /></Card>
        <div className="space-y-4"><SideCard title="Taskuri urgente" items={["Verificare amplasament", "Obținere aviz de racordare", "Testare protecții DC", "Recepție lucrări"]} tone="red"/><SideCard title="Aprobări în așteptare" items={approvals.map((a)=>a.title)} tone="orange"/></div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[.95fr_1.4fr]">
        <Card><CardHeader title="Board taskuri" action={<button className="btn-secondary">+ Adaugă task</button>} /><div className="overflow-x-auto p-5 pt-0"><KanbanBoard compact /></div></Card>
        <Card><CardHeader title="Listă taskuri" action={<button className="btn-primary"><Plus className="h-4 w-4"/> Task nou</button>} /><TaskTable limit={8}/></Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        <Card><CardHeader title="Registru riscuri" action={<a className="text-xs font-bold text-servelect-600">Vezi toate</a>} /><div className="space-y-3 p-5 pt-0">{["Întârzieri furnizori", "Condiții meteo nefavorabile", "Disponibilitate rețea", "Creștere preț echipamente"].map((x,i)=><div key={x} className="flex justify-between text-sm"><span>{x}</span><Badge tone={i===1?"red":"orange"}>{i===3?"Închis":"Deschis"}</Badge></div>)}</div></Card>
        <Card><CardHeader title="Calendar & Milestone" /><div className="p-5 pt-0"><div className="grid grid-cols-7 gap-1 text-center text-xs">{"LMMJVSD".split("").map(d=><b key={d} className="py-2 text-slate-400">{d}</b>)}{Array.from({length:35}).map((_,i)=><div key={i} className={`rounded-lg py-2 ${i===14?"bg-servelect-600 text-white":"bg-slate-50"}`}>{i+1}</div>)}</div></div></Card>
        <Card><CardHeader title="Activitate echipă" /><div className="space-y-3 p-5 pt-0">{["Ioana a finalizat taskul", "Mihai a actualizat progresul", "Alex a încărcat documentul", "Cristian a creat task nou"].map(x=><div key={x} className="text-sm text-slate-700">• {x}</div>)}</div></Card>
        <Card><CardHeader title="Chat proiect" action={<select className="rounded-lg border border-slate-200 px-2 py-1 text-xs"><option>P-2024-0187</option></select>} /><div className="space-y-3 p-5 pt-0"><p className="rounded-xl bg-slate-50 p-3 text-sm"><b>Andrei:</b> Vă rog status pentru taskurile critice.</p><p className="rounded-xl bg-emerald-50 p-3 text-sm"><b>Mihai:</b> Montaj structură 60% finalizat.</p><input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Scrie un mesaj..." /></div></Card>
      </div>
      <TaskDrawer />
    </>
  );
}

function SideCard({ title, items, tone }: { title: string; items: string[]; tone: "red" | "orange" }) {
  return <Card><CardHeader title={title} action={<a className="text-xs font-bold text-servelect-600">Vezi toate</a>} /><div className="divide-y divide-slate-100 p-5 pt-0">{items.map((item, index)=><div key={item} className="flex items-center justify-between py-3 text-sm"><span>{item}</span><Badge tone={tone}>{index===0?"Azi":`${index+1} zile`}</Badge></div>)}</div></Card>;
}
