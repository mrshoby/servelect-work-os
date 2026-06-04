"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { CheckCircle2, Clock3, Filter, FolderKanban, LayoutDashboard, ListChecks, Map, Milestone, Plus, Target, WalletCards } from "lucide-react";
import { approvals, formatRon, healthTone } from "@servelect/shared";
import { PageHeader, Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { GanttTimeline } from "@/components/projects/GanttTimeline";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
import { ProjectCreateModal } from "@/components/projects/ProjectCreateModal";
import { ProjectDetailDrawer } from "@/components/projects/ProjectDetailDrawer";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkOsStore } from "@/lib/store";

export default function ProjectsPage() {
  const { projects, tasks, setProjectCreateOpen, setTaskCreateOpen, setSelectedProject, setProjectFilter } = useWorkOsStore();
  const activeProjects = projects.filter((project) => project.phase !== "Finalizat");
  const totalBudget = projects.reduce((sum, project) => sum + project.budgetRon, 0);
  const avgProgress = Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / Math.max(projects.length, 1));
  const risky = projects.filter((project) => project.health === "Risc" || project.health === "Critic" || project.health === "Atenție");
  const projectTasks = (id: string) => tasks.filter((task) => task.projectId === id);

  return (
    <>
      <PageHeader title="Management proiecte fotovoltaice" subtitle="Core v0.2: proiecte persistente, taskuri per proiect, drawer detalii și flux task-first.">
        <button className="btn-secondary"><Filter className="h-4 w-4" /> Filtre</button>
        <button onClick={() => setTaskCreateOpen(true)} className="btn-secondary"><Plus className="h-4 w-4" /> Task nou</button>
        <button onClick={() => setProjectCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Proiect nou</button>
      </PageHeader>

      <section className="mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card">
        <div className="grid gap-0 xl:grid-cols-[360px_1fr]">
          <div className="bg-gradient-to-br from-slate-950 via-[#0B1F2A] to-emerald-950 p-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/15">Project OS · Servelect EMP</div>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Proiectele sunt hub-uri de lucru, nu doar liste.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Fiecare proiect agregă taskuri, Gantt, riscuri, documente, chat, milestone-uri, ore și buget.</p>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard icon={FolderKanban} label="Proiecte active" value={String(activeProjects.length)} sub={`${projects.length} total`} trend="localStorage v0.2" />
            <KpiCard icon={Clock3} label="Taskuri legate" value={String(tasks.length)} sub="în work graph" trend="click pe proiect pentru detalii" tone="blue" />
            <KpiCard icon={WalletCards} label="Buget total" value={formatRon(totalBudget)} sub="proiecte demo" trend="actualizat cu proiecte noi" tone="purple" />
            <KpiCard icon={Target} label="Progres mediu" value={`${avgProgress}%`} sub="toate proiectele" trend={`${risky.length} proiecte atenție/risc`} tone="orange" />
          </div>
        </div>
      </section>

      <Tabs.Root defaultValue="overview" className="space-y-4">
        <Tabs.List className="card-tight flex flex-wrap gap-2 p-2">
          {[
            ["overview", "Overview", LayoutDashboard],
            ["list", "Listă proiecte", ListChecks],
            ["gantt", "Gantt", Milestone],
            ["board", "Board taskuri", FolderKanban],
            ["map", "Hartă", Map]
          ].map(([value, label, Icon]) => <Tabs.Trigger key={String(value)} value={String(value)} className="nav-pill">{typeof Icon !== "string" && <Icon className="h-4 w-4" />}{String(label)}</Tabs.Trigger>)}
        </Tabs.List>

        <Tabs.Content value="overview" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1fr_.45fr]">
            <Card><CardHeader title="Timeline proiecte (Gantt)" subtitle="Mai — Iulie 2024" action={<button className="btn-secondary">Lună</button>} /><GanttTimeline /></Card>
            <div className="space-y-4"><SideCard title="Taskuri urgente" items={tasks.filter((task) => task.priority === "Critic" || task.priority === "Urgent").map((task) => task.title)} tone="red"/><SideCard title="Aprobări în așteptare" items={approvals.map((approval)=>approval.title)} tone="orange"/></div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[.95fr_1.4fr]">
            <Card><CardHeader title="Board taskuri" action={<button onClick={() => setTaskCreateOpen(true)} className="btn-secondary">+ Adaugă task</button>} /><div className="overflow-x-auto p-5 pt-0 scrollbar-thin"><KanbanBoard compact /></div></Card>
            <Card><CardHeader title="Listă taskuri" action={<button onClick={() => setTaskCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4"/> Task nou</button>} /><TaskTable limit={8}/></Card>
          </div>
        </Tabs.Content>

        <Tabs.Content value="list">
          <Card>
            <CardHeader title="Listă proiecte" subtitle="Click pe proiect pentru drawer cu taskuri, status, buget, documente și chat." action={<button onClick={() => setProjectCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Proiect nou</button>} />
            <div className="grid gap-3 p-5 pt-0 xl:grid-cols-2">
              {projects.map((project) => {
                const related = projectTasks(project.id);
                const completed = related.filter((task) => task.status === "Finalizat").length;
                return (
                  <button key={project.id} onClick={() => setSelectedProject(project.id)} className="group rounded-[1.5rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{project.code}</div>
                        <h3 className="mt-1 text-lg font-black text-slate-950">{project.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{project.clientName} · {project.location}</p>
                      </div>
                      <Badge tone={healthTone(project.health)}>{project.health}</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                      <ProjectMini label="Fază" value={project.phase} />
                      <ProjectMini label="kWp" value={String(project.powerKwp)} />
                      <ProjectMini label="Taskuri" value={String(related.length)} />
                      <ProjectMini label="Done" value={`${completed}/${related.length}`} />
                    </div>
                    <div className="mt-4"><div className="mb-1 flex justify-between text-xs font-bold text-slate-500"><span>Progres</span><span>{project.progress}%</span></div><ProgressBar value={project.progress} tone={project.health === "Critic" || project.health === "Risc" ? "red" : "green"} /></div>
                    <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500"><span>{project.ownerName}</span><span>{project.deadline}</span></div>
                  </button>
                );
              })}
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="gantt"><Card><CardHeader title="Gantt / Timeline" subtitle="Timeline executiv cu faze proiecte; detalierea reală pe taskuri urmează în v0.3." /><GanttTimeline /></Card></Tabs.Content>
        <Tabs.Content value="board"><Card><CardHeader title="Board taskuri proiecte" action={<button onClick={() => setTaskCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Task nou</button>} /><div className="overflow-x-auto p-5 pt-0 scrollbar-thin"><KanbanBoard /></div></Card></Tabs.Content>
        <Tabs.Content value="map"><Card><CardHeader title="Hartă proiecte" subtitle="Mock hartă operațională; proiectele sunt clickabile în v0.3." /><div className="map-grid m-5 mt-0 grid min-h-[420px] place-items-center rounded-[1.5rem] border border-slate-200 bg-slate-50"><div className="rounded-2xl bg-white p-5 text-center shadow-card"><Map className="mx-auto h-8 w-8 text-servelect-600" /><h3 className="mt-2 font-black">Hartă proiecte Servelect</h3><p className="mt-1 text-sm text-slate-500">Cluj · Timișoara · București · Ploiești · Constanța</p></div></div></Card></Tabs.Content>
      </Tabs.Root>

      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        <Card><CardHeader title="Registru riscuri" action={<a className="text-xs font-bold text-servelect-600">Vezi toate</a>} /><div className="space-y-3 p-5 pt-0">{["Întârzieri furnizori", "Condiții meteo nefavorabile", "Disponibilitate rețea", "Creștere preț echipamente"].map((x,i)=><div key={x} className="flex justify-between text-sm"><span>{x}</span><Badge tone={i===1?"red":"orange"}>{i===3?"Închis":"Deschis"}</Badge></div>)}</div></Card>
        <Card><CardHeader title="Calendar & Milestone" /><div className="p-5 pt-0"><div className="grid grid-cols-7 gap-1 text-center text-xs">{"LMMJVSD".split("").map((day, index)=><b key={`${day}-${index}`} className="py-2 text-slate-400">{day}</b>)}{Array.from({length:35}).map((_,i)=><div key={i} className={`rounded-lg py-2 ${i===14?"bg-servelect-600 text-white":"bg-slate-50"}`}>{i+1}</div>)}</div></div></Card>
        <Card><CardHeader title="Activitate echipă" /><div className="space-y-3 p-5 pt-0">{["Ioana a finalizat taskul", "Mihai a actualizat progresul", "Alex a încărcat documentul", "Cristian a creat task nou"].map(item=><div key={item} className="text-sm text-slate-700">• {item}</div>)}</div></Card>
        <Card><CardHeader title="Chat proiect" action={<select className="rounded-lg border border-slate-200 px-2 py-1 text-xs"><option>P-2024-0187</option></select>} /><div className="space-y-3 p-5 pt-0"><p className="rounded-xl bg-slate-50 p-3 text-sm"><b>Andrei:</b> Vă rog status pentru taskurile critice.</p><p className="rounded-xl bg-emerald-50 p-3 text-sm"><b>Mihai:</b> Montaj structură 60% finalizat.</p><input className="field-input" placeholder="Scrie un mesaj..." /></div></Card>
      </div>

      <TaskDrawer />
      <TaskCreateModal />
      <ProjectCreateModal />
      <ProjectDetailDrawer />
    </>
  );
}

function SideCard({ title, items, tone }: { title: string; items: string[]; tone: "red" | "orange" }) {
  return <Card><CardHeader title={title} action={<a className="text-xs font-bold text-servelect-600">Vezi toate</a>} /><div className="divide-y divide-slate-100 p-5 pt-0">{items.slice(0, 5).map((item, index)=><div key={`${item}-${index}`} className="flex items-center justify-between py-3 text-sm"><span>{item}</span><Badge tone={tone}>{index===0?"Azi":`${index+1} zile`}</Badge></div>)}</div></Card>;
}

function ProjectMini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-2"><div className="text-[10px] font-black uppercase tracking-[.12em] text-slate-400">{label}</div><div className="mt-1 truncate font-black text-slate-800">{value}</div></div>;
}
