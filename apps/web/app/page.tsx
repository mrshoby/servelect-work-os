"use client";

import { BarChart3, BriefcaseBusiness, ClipboardList, FolderKanban, Gauge, Plus, Zap } from "lucide-react";
import { calendarEvents, projects, users } from "@servelect/shared";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TaskTable } from "@/components/tasks/TaskTable";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { EnergyChart } from "@/components/charts/EnergyChart";

export default function HomePage() {
  return (
    <>
      <PageHeader title="Home / Command Center" subtitle="Platformă unificată pentru proiecte, taskuri, echipe și operațiuni energetice.">
        <button className="btn-secondary">Filtre</button>
        <button className="btn-primary"><Plus className="h-4 w-4" /> Task rapid</button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={FolderKanban} label="Proiecte active" value="28" sub="din 42 totale" trend="↑ 12% față de luna trecută" />
        <KpiCard icon={ClipboardList} label="Taskuri urgente" value="18" sub="din 142 totale" trend="↑ 29% față de ieri" tone="red" />
        <KpiCard icon={Gauge} label="Instalații monitorizate" value="152" sub="online (84%)" trend="↑ 6% față de ieri" tone="blue" />
        <KpiCard icon={BriefcaseBusiness} label="Pipeline vânzări" value="12,45 mil. RON" sub="în 18 oportunități" trend="↑ 24% față de luna trecută" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.95fr_.9fr]">
        <Card className="xl:col-span-1">
          <CardHeader title="My Tasks / Inbox" subtitle="Taskuri filtrabile: Toate, Urgente, Azi, Săptămâna aceasta" action={<button className="btn-secondary">Filtre</button>} />
          <div className="px-5 pt-4"><div className="flex flex-wrap gap-2"><Badge tone="green">Toate 18</Badge><Badge tone="red">Urgente 5</Badge><Badge tone="blue">Azi 6</Badge><Badge tone="gray">Săptămâna aceasta 9</Badge></div></div>
          <TaskTable limit={5} />
        </Card>

        <Card>
          <CardHeader title="Proiecte în desfășurare" action={<a className="text-xs font-bold text-servelect-600">Vezi toate</a>} />
          <div className="divide-y divide-slate-100 p-5 pt-0">
            {projects.map((project) => (
              <div key={project.id} className="py-3">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm"><div><b>{project.code}</b><div className="text-xs text-slate-500">{project.name}</div></div><Badge tone={project.health === "Bun" ? "green" : project.health === "Atenție" ? "orange" : "red"}>{project.phase}</Badge></div>
                <div className="flex items-center gap-3"><ProgressBar value={project.progress} /><span className="w-10 text-right text-xs font-bold text-slate-500">{project.progress}%</span></div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Snapshot taskuri" subtitle="după status" />
          <div className="grid grid-cols-2 gap-3 p-5 pt-0">
            {[
              ["De făcut", "42", "Verificare doc. tehnice", "gray"],
              ["În lucru", "18", "Montaj structură", "blue"],
              ["Review", "6", "Testare sistem", "orange"],
              ["Finalizate", "76", "PIF sistem", "green"]
            ].map(([title, count, sample, tone]) => <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><b>{title}</b><Badge tone={tone as never}>{count}</Badge></div><p className="mt-4 text-sm text-slate-600">{sample}</p><p className="mt-3 text-xs text-slate-400">+{Number(count) - 4} mai multe</p></div>)}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_.75fr_.75fr_1fr]">
        <Card>
          <CardHeader title="Activitate echipă" />
          <div className="space-y-4 p-5 pt-0">
            {users.slice(0, 4).map((user, index) => (
              <div key={user.id} className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{user.avatar}</div>
                <div className="text-sm"><b>{user.name}</b> {index % 2 ? "a încărcat documentul" : "a actualizat statusul proiectului"}<div className="text-xs text-slate-500">acum {15 + index * 17} min</div></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Agenda mea" action={<a className="text-xs font-bold text-servelect-600">Vezi calendar</a>} />
          <div className="space-y-3 p-5 pt-0">
            {calendarEvents.map((event) => <div key={event.id} className="border-l-2 border-servelect-600 pl-3"><div className="text-sm font-bold">{event.startsAt.slice(11,16)} · {event.title}</div><div className="text-xs text-slate-500">{event.type}</div></div>)}
          </div>
        </Card>
        <Card>
          <CardHeader title="Încărcare echipă" />
          <div className="space-y-4 p-5 pt-0">
            {users.slice(0,5).map((user) => <div key={user.id}><div className="mb-1 flex justify-between text-sm"><span>{user.name}</span><b>{user.workload}%</b></div><ProgressBar value={user.workload} tone={user.workload > 100 ? "red" : "green"}/></div>)}
          </div>
        </Card>
        <Card>
          <CardHeader title="Operațiuni energie (Live)" action={<a className="text-xs font-bold text-servelect-600">Vezi detalii</a>} />
          <div className="p-5 pt-0"><div className="mb-4 grid grid-cols-3 gap-3 text-center text-sm"><Metric label="Putere totală" value="8.42 MW"/><Metric label="Producție azi" value="42.85 MWh"/><Metric label="Randament" value="98.7%"/></div><EnergyChart compact /></div>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader title="Board taskuri rapid" subtitle="Drag & drop demo între statusuri" />
          <div className="overflow-x-auto p-5 pt-0"><KanbanBoard compact /></div>
        </Card>
      </div>
      <TaskDrawer />
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs text-slate-500">{label}</div><div className="font-extrabold text-slate-950">{value}</div></div>;
}
