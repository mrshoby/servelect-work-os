"use client";

import { TaskApiMutationPanel } from "@/components/tasks/TaskApiMutationPanel";
import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ClipboardList, Clock, LayoutDashboard, ListChecks, Plus, RefreshCcw, TimerReset } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { TaskFiltersBar } from "@/components/tasks/TaskFiltersBar";

import { TaskApiBridgeBanner } from "@/components/tasks/TaskApiBridgeBanner";
import { useWorkOsStore } from "@/lib/store";
import { priorityTone, statusTone, type Task, type TaskStatus } from "@servelect/shared";

type ViewId = "table" | "board" | "mywork" | "calendar" | "approvals";

const statusColumns: TaskStatus[] = ["Backlog", "De fÄƒcut", "ÃŽn lucru", "Review / QA", "Blocat", "Finalizat"];
const statusOptions: TaskStatus[] = ["Backlog", "De fÄƒcut", "ÃŽn lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];

const views: Array<{ id: ViewId; label: string; icon: typeof ClipboardList }> = [
  { id: "table", label: "Task Table", icon: ClipboardList },
  { id: "board", label: "Kanban Board", icon: LayoutDashboard },
  { id: "mywork", label: "My Work", icon: Clock },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "approvals", label: "Approvals", icon: ListChecks }
];

export default function TasksPage() {
  const [activeView, setActiveView] = useState<ViewId>("table");

  const { tasks, timerTaskId, stopTimer, setTaskCreateOpen, getFilteredTasks, resetDemoData, setSelectedTask, updateTaskStatus } = useWorkOsStore();

  const filteredTasks = useMemo(() => getFilteredTasks(), [tasks, getFilteredTasks]);

  const urgentTasks = useMemo(
    () => tasks.filter((task) => task.priority === "Urgent" || task.priority === "Critic" || task.status === "Blocat"),
    [tasks]
  );

  const dueToday = useMemo(() => tasks.filter((task) => task.dueDate <= "2024-05-18" && task.status !== "Finalizat"), [tasks]);
  const tracked = useMemo(() => tasks.reduce((sum, task) => sum + task.trackedHours, 0), [tasks]);
  const estimate = useMemo(() => tasks.reduce((sum, task) => sum + task.estimateHours, 0), [tasks]);
  const capacity = Math.round((tracked / Math.max(estimate, 1)) * 100);

  return (
    <>
      <PageHeader title="Taskuri" subtitle="Task Center optimizat: tabel, board, calendar, approvals È™i workload fÄƒrÄƒ blocaje Ã®n browser.">
        {timerTaskId && (
          <button onClick={stopTimer} className="btn-secondary">
            <TimerReset className="h-4 w-4" />
            OpreÈ™te timer activ
          </button>
        )}

        <button onClick={resetDemoData} className="btn-secondary">
          <RefreshCcw className="h-4 w-4" />
          Reset demo
        </button>

        <button onClick={() => setTaskCreateOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Task nou
        </button>
      </PageHeader>

      <section className="mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-card">
        <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
          <div className="p-6 lg:p-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-white/10">
              GoodDay-style Â· task-first work graph
            </div>
            <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight lg:text-4xl">
              PlanificÄƒ, urmÄƒreÈ™te È™i Ã®nchide taskurile Servelect Ã®ntr-un singur workflow.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Taskurile sunt legate de proiecte, responsabili, statusuri, deadline-uri, estimÄƒri, comentarii È™i checklist. Randarea este limitatÄƒ pe view-ul activ pentru performanÈ›Äƒ.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <HeroMetric label="Taskuri filtrate" value={String(filteredTasks.length)} />
              <HeroMetric label="Urgente / blocate" value={String(urgentTasks.length)} />
              <HeroMetric label="Scadente azi" value={String(dueToday.length)} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/5 p-6 xl:border-l xl:border-t-0">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="font-black">Capacitate vs estimare</span>
              <span className="font-black text-emerald-200">{capacity}%</span>
            </div>
            <ProgressBar value={Math.min(capacity, 100)} tone={capacity > 100 ? "red" : "green"} />
            <div className="mt-5 space-y-3">
              {urgentTasks.slice(0, 3).map((task) => (
                <button key={task.id} onClick={() => setSelectedTask(task.id)} className="w-full rounded-2xl bg-white/10 p-3 text-left ring-1 ring-white/10 transition hover:bg-white/15">
                  <div className="flex items-start justify-between gap-3">
                    <b className="text-sm">{task.title}</b>
                    <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-300">{task.projectCode} Â· {task.assigneeName}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TaskApiBridgeBanner />

      <TaskApiMutationPanel />

      <TaskFiltersBar />

      <Card className="mt-4">
        <CardHeader title="Task workspace" subtitle="Tabel, Kanban, My Work, Calendar È™i Approvals. Randare optimizatÄƒ pe view activ." action={<button onClick={() => setTaskCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" />Task nou</button>} />

        <div className="border-b border-slate-100 px-5">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {views.map((view) => {
              const Icon = view.icon;
              const active = activeView === view.id;
              return (
                <button key={view.id} onClick={() => setActiveView(view.id)} className={active ? "inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white" : "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"}>
                  <Icon className="h-4 w-4" />
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeView === "table" && <TaskListLite tasks={filteredTasks.slice(0, 70)} total={filteredTasks.length} onSelect={setSelectedTask} onStatus={updateTaskStatus} />}
        {activeView === "board" && <BoardLite tasks={filteredTasks.slice(0, 140)} total={filteredTasks.length} onSelect={setSelectedTask} onStatus={updateTaskStatus} />}
        {activeView === "mywork" && (
          <div className="grid gap-4 p-5 xl:grid-cols-3">
            <WorkBucket title="De fÄƒcut" tasks={filteredTasks.filter((task) => task.status === "De fÄƒcut")} tone="orange" onSelect={setSelectedTask} />
            <WorkBucket title="ÃŽn lucru" tasks={filteredTasks.filter((task) => task.status === "ÃŽn lucru")} tone="purple" onSelect={setSelectedTask} />
            <WorkBucket title="Urgent / blocat" tasks={urgentTasks} tone="red" onSelect={setSelectedTask} />
          </div>
        )}
        {activeView === "calendar" && <CalendarLite tasks={filteredTasks.slice(0, 30)} onSelect={setSelectedTask} />}
        {activeView === "approvals" && <ApprovalsLite tasks={filteredTasks.filter((task) => task.status === "Review / QA" || task.priority === "Urgent" || task.priority === "Critic").slice(0, 20)} onSelect={setSelectedTask} />}
      </Card>

      <TaskDrawer />
      <TaskCreateModal />
    </>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"><div className="text-2xl font-black">{value}</div><div className="text-xs font-semibold text-slate-300">{label}</div></div>;
}

function TaskListLite({ tasks, total, onSelect, onStatus }: { tasks: Task[]; total: number; onSelect: (id?: string) => void; onStatus: (id: string, status: TaskStatus) => void }) {
  return (
    <div className="overflow-x-auto">
      {total > tasks.length && <div className="border-b border-slate-100 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800">Se afiÈ™eazÄƒ primele {tasks.length} taskuri din {total}. FoloseÈ™te filtrele pentru rezultate mai precise.</div>}
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Task</th><th className="px-5 py-3">Proiect</th><th className="px-5 py-3">Responsabil</th><th className="px-5 py-3">Prioritate</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Deadline</th><th className="px-5 py-3">Progres</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const done = task.subtasks.length ? Math.round((task.subtasks.filter((subtask) => subtask.done).length / task.subtasks.length) * 100) : 0;
            return (
              <tr key={task.id} onClick={() => onSelect(task.id)} className="cursor-pointer transition hover:bg-emerald-50/50">
                <td className="min-w-[280px] px-5 py-4"><div className="font-black text-slate-950">{task.title}</div><div className="mt-1 line-clamp-1 text-xs text-slate-500">{task.description}</div></td>
                <td className="px-5 py-4 font-semibold text-slate-700">{task.projectCode}</td>
                <td className="px-5 py-4 text-slate-600">{task.assigneeName}</td>
                <td className="px-5 py-4"><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></td>
                <td className="px-5 py-4"><select value={task.status} onClick={(event) => event.stopPropagation()} onChange={(event) => onStatus(task.id, event.target.value as TaskStatus)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 outline-none hover:border-emerald-200">{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                <td className="px-5 py-4 text-slate-500">{task.dueDate}</td>
                <td className="min-w-[150px] px-5 py-4"><ProgressBar value={done} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tasks.length === 0 && <div className="p-8 text-center text-sm font-semibold text-slate-500">Nu existÄƒ taskuri pentru filtrele curente.</div>}
    </div>
  );
}

function BoardLite({ tasks, total, onSelect, onStatus }: { tasks: Task[]; total: number; onSelect: (id?: string) => void; onStatus: (id: string, status: TaskStatus) => void }) {
  const grouped = useMemo(() => {
    const map = new Map<TaskStatus, Task[]>();
    statusColumns.forEach((status) => map.set(status, []));
    for (const task of tasks) if (map.has(task.status)) map.get(task.status)?.push(task);
    return map;
  }, [tasks]);

  return (
    <div className="p-5">
      {total > tasks.length && <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">Board optimizat: se afiÈ™eazÄƒ primele {tasks.length} taskuri din {total}.</div>}
      <div className="grid min-w-full gap-4 xl:grid-cols-6">
        {statusColumns.map((status) => {
          const columnTasks = grouped.get(status) ?? [];
          const visibleTasks = columnTasks.slice(0, 8);
          const hidden = Math.max(0, columnTasks.length - visibleTasks.length);
          return (
            <div key={status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const id = event.dataTransfer.getData("text/task-id"); if (id) onStatus(id, status); }} className="rounded-[1.45rem] border border-slate-200 bg-slate-50/80 p-3 shadow-inner shadow-white">
              <div className="mb-3 flex items-center justify-between"><span className="text-sm font-black text-slate-900">{status}</span><Badge tone={statusTone(status)}>{columnTasks.length}</Badge></div>
              <div className="space-y-3">
                {visibleTasks.map((task) => <button key={task.id} draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/task-id", task.id); }} onClick={() => onSelect(task.id)} className="block w-full rounded-[1.25rem] border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-card"><div className="flex items-start justify-between gap-2"><div className="text-xs font-black text-slate-500">{task.projectCode}</div><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></div><div className="mt-2 line-clamp-2 text-sm font-black text-slate-950">{task.title}</div><div className="mt-2 text-xs text-slate-500">{task.assigneeName} Â· {task.dueDate}</div></button>)}
                {hidden > 0 && <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 text-center text-xs font-bold text-slate-500">+{hidden} ascunse pentru performanÈ›Äƒ</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkBucket({ title, tasks, tone, onSelect }: { title: string; tasks: Task[]; tone: "red" | "orange" | "purple"; onSelect: (id?: string) => void }) {
  return <div className="rounded-[1.45rem] border border-slate-200 bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-black text-slate-950">{title}</h3><Badge tone={tone}>{tasks.length}</Badge></div><div className="space-y-3">{tasks.slice(0, 8).map((task) => <button key={task.id} onClick={() => onSelect(task.id)} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-emerald-200"><div className="font-black text-slate-950">{task.title}</div><div className="mt-1 text-xs text-slate-500">{task.projectCode} Â· {task.assigneeName}</div></button>)}{tasks.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-xs font-bold text-slate-400">Nimic aici.</div>}</div></div>;
}

function CalendarLite({ tasks, onSelect }: { tasks: Task[]; onSelect: (id?: string) => void }) {
  return <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">{Array.from({ length: 35 }).map((_, index) => { const task = tasks.length ? tasks[index % tasks.length] : undefined; return <div key={index} className="min-h-[112px] rounded-2xl border border-slate-200 bg-white p-3"><div className="mb-2 text-xs font-black text-slate-500">{index + 1}</div>{task && index % 4 === 0 && <button onClick={() => onSelect(task.id)} className="rounded-xl bg-emerald-50 p-2 text-left text-xs font-bold text-emerald-800">{task.title}</button>}</div>; })}</div>;
}

function ApprovalsLite({ tasks, onSelect }: { tasks: Task[]; onSelect: (id?: string) => void }) {
  return <div className="space-y-3 p-5">{tasks.map((task) => <button key={task.id} onClick={() => onSelect(task.id)} className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40"><div><div className="font-black text-slate-950">{task.title}</div><div className="mt-1 text-sm text-slate-500">{task.projectCode} Â· {task.assigneeName}</div></div><div className="flex items-center gap-2"><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge><Badge tone={statusTone(task.status)}>{task.status}</Badge><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div></button>)}{tasks.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-semibold text-slate-500">Nu existÄƒ aprobÄƒri Ã®n coadÄƒ.</div>}</div>;
}




