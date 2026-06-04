"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { CalendarDays, ClipboardList, Clock, LayoutDashboard, ListChecks, Plus, RefreshCcw, TimerReset } from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
import { TaskFiltersBar } from "@/components/tasks/TaskFiltersBar";
import { useWorkOsStore } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { priorityTone, statusTone, type Task } from "@servelect/shared";

export default function TasksPage() {
  const { tasks, timerTaskId, stopTimer, setTaskCreateOpen, getFilteredTasks, resetDemoData } = useWorkOsStore();
  const filteredTasks = getFilteredTasks();
  const urgentTasks = tasks.filter((task) => task.priority === "Urgent" || task.priority === "Critic" || task.status === "Blocat");
  const dueToday = tasks.filter((task) => task.dueDate <= "2024-05-18" && task.status !== "Finalizat");
  const tracked = tasks.reduce((sum, task) => sum + task.trackedHours, 0);
  const estimate = tasks.reduce((sum, task) => sum + task.estimateHours, 0);

  return (
    <>
      <PageHeader title="Taskuri / My Work" subtitle="Core v0.2: task CRUD, filtre reale, localStorage, Kanban mutabil, drawer editabil și time tracking demo.">
        {timerTaskId && <button onClick={stopTimer} className="btn-secondary"><Clock className="h-4 w-4" /> Oprește timer activ</button>}
        <button onClick={resetDemoData} className="btn-secondary"><RefreshCcw className="h-4 w-4" /> Reset demo</button>
        <button onClick={() => setTaskCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Task nou</button>
      </PageHeader>

      <section className="mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-[#0B1F2A] to-emerald-950 text-white shadow-card">
        <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
          <div className="p-6 lg:p-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-100 ring-1 ring-white/15">GoodDay-style · task-first work graph</div>
            <h2 className="max-w-3xl text-3xl font-black tracking-tight lg:text-4xl">Planifică, urmărește și închide taskurile Servelect într-un singur workflow.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Taskurile sunt legate de proiecte, responsabili, statusuri, deadline-uri, estimări, comentarii și checklist. Toate modificările se păstrează în localStorage.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <HeroMetric label="Taskuri totale" value={String(tasks.length)} />
              <HeroMetric label="Afișate" value={String(filteredTasks.length)} />
              <HeroMetric label="Urgente/blocate" value={String(urgentTasks.length)} />
              <HeroMetric label="Ore pontate" value={`${tracked.toFixed(1)}h`} />
            </div>
          </div>
          <div className="border-t border-white/10 bg-white/5 p-6 xl:border-l xl:border-t-0">
            <div className="mb-3 flex items-center justify-between text-sm font-black"><span>Capacitate vs estimare</span><span>{Math.round((tracked / Math.max(estimate, 1)) * 100)}%</span></div>
            <ProgressBar value={(tracked / Math.max(estimate, 1)) * 100} tone="green" />
            <div className="mt-5 space-y-3">
              {urgentTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <div className="flex items-center justify-between gap-2"><b className="text-sm">{task.title}</b><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></div>
                  <p className="mt-1 text-xs text-slate-300">{task.projectCode} · {task.assigneeName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TaskFiltersBar />

      <Tabs.Root defaultValue="table" className="mt-5 space-y-4">
        <Tabs.List className="card-tight flex flex-wrap gap-2 p-2">
          {[
            ["table", "Task Table", ClipboardList],
            ["board", "Kanban Board", LayoutDashboard],
            ["mywork", "My Work", Clock],
            ["calendar", "Calendar", CalendarDays],
            ["approvals", "Approvals", ListChecks]
          ].map(([value, label, Icon]) => <Tabs.Trigger key={String(value)} value={String(value)} className="nav-pill">{typeof Icon !== "string" && <Icon className="h-4 w-4"/>}{String(label)}</Tabs.Trigger>)}
        </Tabs.List>

        <Tabs.Content value="table"><Card><CardHeader title="Task Table" subtitle="Click pe rând pentru detalii. Statusul se schimbă direct din tabel." action={<button onClick={() => setTaskCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Task nou</button>} /><TaskTable /></Card></Tabs.Content>
        <Tabs.Content value="board"><Card><CardHeader title="Kanban Board" subtitle="Drag & drop între statusuri, cu salvare automată în localStorage." action={<button onClick={() => setTaskCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Task nou</button>} /><div className="overflow-x-auto p-5 pt-0 scrollbar-thin"><KanbanBoard /></div></Card></Tabs.Content>
        <Tabs.Content value="mywork">
          <div className="grid gap-4 xl:grid-cols-3">
            <WorkBucket title="Overdue / risc" tasks={dueToday} tone="red" />
            <WorkBucket title="Urgent / critic" tasks={urgentTasks} tone="orange" />
            <WorkBucket title="În review" tasks={tasks.filter((task) => task.status === "Review / QA")} tone="purple" />
          </div>
        </Tabs.Content>
        <Tabs.Content value="calendar"><Card><CardHeader title="Calendar taskuri" subtitle="Mock calendar pentru planificare. Următorul pas: drag task pe zi/oră." /><div className="grid grid-cols-7 gap-2 p-5 pt-0">{Array.from({length:35}).map((_,i)=><div key={i} className="min-h-28 rounded-xl border border-slate-200 bg-white p-2 text-xs"><b>{i+1}</b>{filteredTasks[i % Math.max(filteredTasks.length, 1)] && i % 4 === 0 && <div className="mt-2 rounded-lg bg-emerald-50 p-1 text-emerald-700">{filteredTasks[i % filteredTasks.length]?.title}</div>}</div>)}</div></Card></Tabs.Content>
        <Tabs.Content value="approvals"><Card><CardHeader title="Approvals" subtitle="Aprobări demo: taskuri care așteaptă decizie sau QA." /><TaskTable tasksOverride={tasks.filter((task) => task.status === "Review / QA" || task.priority === "Urgent")} /></Card></Tabs.Content>
      </Tabs.Root>

      <TaskDrawer />
      <TaskCreateModal />
    </>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><div className="text-2xl font-black">{value}</div><div className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-slate-300">{label}</div></div>;
}

function WorkBucket({ title, tasks, tone }: { title: string; tasks: Task[]; tone: "red" | "orange" | "purple" }) {
  return (
    <Card>
      <CardHeader title={title} action={<Badge tone={tone}>{tasks.length}</Badge>} />
      <div className="space-y-3 p-5 pt-0">
        {tasks.slice(0, 6).map((task) => (
          <div key={task.id} className="rounded-2xl border border-slate-200 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/30">
            <div className="flex items-center justify-between gap-2"><b className="text-sm text-slate-900">{task.title}</b><Badge tone={statusTone(task.status)}>{task.status}</Badge></div>
            <div className="mt-1 text-xs font-semibold text-slate-500">{task.projectCode} · {task.assigneeName}</div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-sm text-slate-400">Nimic aici.</p>}
      </div>
    </Card>
  );
}
