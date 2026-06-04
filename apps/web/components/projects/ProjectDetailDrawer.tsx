"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CalendarDays, CheckCircle2, FileText, FolderKanban, MessageSquare, Plus, ShieldAlert, TimerReset, Trash2, X } from "lucide-react";
import { formatRon, healthTone } from "@servelect/shared";
import type { ElementType } from "react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TaskTable } from "@/components/tasks/TaskTable";
import { useWorkOsStore } from "@/lib/store";

export function ProjectDetailDrawer() {
  const { projects, tasks, selectedProjectId, setSelectedProject, deleteProject, setTaskCreateOpen, setProjectFilter } = useWorkOsStore();
  const project = projects.find((item) => item.id === selectedProjectId);
  const projectTasks = project ? tasks.filter((task) => task.projectId === project.id) : [];
  const open = Boolean(project);

  if (!project) {
    return <Dialog.Root open={open} onOpenChange={(next) => !next && setSelectedProject(undefined)}><Dialog.Portal /></Dialog.Root>;
  }

  const completed = projectTasks.filter((task) => task.status === "Finalizat").length;
  const critical = projectTasks.filter((task) => task.priority === "Critic" || task.priority === "Urgent" || task.status === "Blocat").length;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && setSelectedProject(undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-screen w-full max-w-[920px] overflow-y-auto bg-white shadow-2xl outline-none">
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex items-start justify-between gap-4 px-6 py-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={healthTone(project.health)}>{project.health}</Badge>
                  <Badge tone="blue">{project.phase}</Badge>
                  <span className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{project.code}</span>
                </div>
                <Dialog.Title className="mt-2 text-3xl font-black tracking-tight text-slate-950">{project.name}</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-500">{project.clientName} · {project.location} · {project.powerKwp} kWp</Dialog.Description>
              </div>
              <Dialog.Close className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><X className="h-5 w-5" /></Dialog.Close>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid gap-3 md:grid-cols-4">
              <MiniStat icon={FolderKanban} label="Taskuri" value={String(projectTasks.length)} />
              <MiniStat icon={CheckCircle2} label="Finalizate" value={String(completed)} />
              <MiniStat icon={ShieldAlert} label="Critice/blocate" value={String(critical)} tone="red" />
              <MiniStat icon={TimerReset} label="Ore lucrate" value={`${project.workedHours}h`} />
            </div>

            <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm font-black text-slate-900"><span>Progres proiect</span><span>{project.progress}%</span></div>
              <ProgressBar value={project.progress} tone={project.health === "Critic" || project.health === "Risc" ? "red" : "green"} />
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <Property label="Owner" value={project.ownerName} />
                <Property label="Deadline" value={project.deadline} />
                <Property label="Buget" value={formatRon(project.budgetRon)} />
                <Property label="Documente" value={`${project.documents} fișiere`} />
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="section-title">Taskuri legate de proiect</h3>
                  <p className="mt-1 text-xs text-slate-500">Acesta este centrul de lucru al proiectului: taskuri, statusuri, owneri și progres.</p>
                </div>
                <button onClick={() => { setProjectFilter(project.id); setTaskCreateOpen(true); }} className="btn-primary"><Plus className="h-4 w-4" /> Task proiect</button>
              </div>
              <TaskTable tasksOverride={projectTasks} />
            </section>

            <div className="grid gap-4 xl:grid-cols-3">
              <Panel icon={CalendarDays} title="Milestones" items={["Validare proiect tehnic", "Montaj structură", "PIF & recepție"]} />
              <Panel icon={FileText} title="Documente recente" items={["Oferta tehnico-financiară.pdf", "Schema monofilară.dwg", "Raport amplasament.zip"]} />
              <Panel icon={MessageSquare} title="Chat proiect" items={["Andrei: avem update la aviz?", "Ioana: am încărcat schema revizuită.", "Mihai: echipa ajunge mâine 09:00."]} />
            </div>

            <button onClick={() => deleteProject(project.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Șterge proiect demo</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MiniStat({ icon: Icon, label, value, tone = "green" }: { icon: ElementType; label: string; value: string; tone?: "green" | "red" }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><Icon className={tone === "red" ? "h-5 w-5 text-red-500" : "h-5 w-5 text-servelect-600"} /><div className="mt-3 text-2xl font-black text-slate-950">{value}</div><div className="text-xs font-semibold text-slate-500">{label}</div></div>;
}

function Property({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-white p-3"><div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{label}</div><div className="mt-1 text-sm font-black text-slate-900">{value}</div></div>;
}

function Panel({ icon: Icon, title, items }: { icon: ElementType; title: string; items: string[] }) {
  return <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4"><h3 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900"><Icon className="h-4 w-4 text-servelect-600" /> {title}</h3><div className="space-y-2">{items.map((item) => <div key={item} className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{item}</div>)}</div></section>;
}
