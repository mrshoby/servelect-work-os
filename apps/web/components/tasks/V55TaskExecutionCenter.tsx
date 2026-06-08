"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CopyCheck,
  FileStack,
  Filter,
  GitBranch,
  Layers3,
  ListChecks,
  MessageSquareText,
  PanelRightOpen,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users2,
  Workflow
} from "lucide-react";
import {
  priorityTone,
  statusTone,
  users,
  type Priority,
  type Task,
  type TaskStatus
} from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { useWorkOsStore } from "@/lib/store";

const statuses: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
const priorities: Priority[] = ["Scăzut", "Mediu", "Ridicat", "Urgent", "Critic"];

type SavedViewId =
  | "all"
  | "my"
  | "today"
  | "overdue"
  | "blocked"
  | "high"
  | "field"
  | "approvals"
  | "dependencies";

type BoardMode = "list" | "board" | "dependencies" | "activity" | "admin";

const savedViews: Array<{ id: SavedViewId; label: string; description: string; icon: typeof ListChecks }> = [
  { id: "all", label: "Toate taskurile", description: "Work graph complet", icon: ListChecks },
  { id: "my", label: "My Work", description: "Andrei + echipa proiect", icon: Users2 },
  { id: "today", label: "Azi", description: "Scadențe și acțiuni curente", icon: CalendarClock },
  { id: "overdue", label: "Întârziate", description: "SLA / deadline depășit", icon: AlertTriangle },
  { id: "blocked", label: "Blocate", description: "Dependențe și blocaje", icon: GitBranch },
  { id: "high", label: "Prioritate mare", description: "Urgent + critic", icon: Sparkles },
  { id: "field", label: "Teren", description: "Montaj, QR, intervenții", icon: Workflow },
  { id: "approvals", label: "Aprobări", description: "Review, ofertă, buget", icon: ShieldCheck },
  { id: "dependencies", label: "Dependențe", description: "Blocked by / blocking", icon: Layers3 }
];

const boardModes: Array<{ id: BoardMode; label: string; icon: typeof ListChecks }> = [
  { id: "list", label: "Listă execuție", icon: ListChecks },
  { id: "board", label: "Kanban compact", icon: Layers3 },
  { id: "dependencies", label: "Dependențe", icon: GitBranch },
  { id: "activity", label: "Timeline activitate", icon: MessageSquareText },
  { id: "admin", label: "Admin controls", icon: ShieldCheck }
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isDone(task: Task) {
  return task.status === "Finalizat" || task.status === "Anulat";
}

function taskProgress(task: Task) {
  if (task.subtasks.length) {
    return Math.round((task.subtasks.filter((item) => item.done).length / task.subtasks.length) * 100);
  }
  return Math.min(100, Math.round((task.trackedHours / Math.max(task.estimateHours, 1)) * 100));
}

function taskIsFieldRelated(task: Task) {
  const text = [task.title, task.description, task.projectName, ...task.tags].join(" ").toLowerCase();
  return ["teren", "montaj", "qr", "pif", "interven", "panouri", "invertor", "verificare", "mentenan"].some((token) => text.includes(token));
}

function sortExecution(tasks: Task[]) {
  const priorityWeight: Record<Priority, number> = { Critic: 5, Urgent: 4, Ridicat: 3, Mediu: 2, Scăzut: 1 };
  const statusWeight: Record<TaskStatus, number> = {
    Blocat: 5,
    "În lucru": 4,
    "Review / QA": 3,
    "De făcut": 2,
    Backlog: 1,
    Finalizat: 0,
    Anulat: -1
  };
  return [...tasks].sort((a, b) => {
    const byStatus = statusWeight[b.status] - statusWeight[a.status];
    if (byStatus) return byStatus;
    const byPriority = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (byPriority) return byPriority;
    return a.dueDate.localeCompare(b.dueDate);
  });
}

export function V55TaskExecutionCenter() {
  const {
    tasks,
    projects,
    getFilteredTasks,
    setSelectedTask,
    setTaskCreateOpen,
    updateTask,
    updateTaskStatus,
    duplicateTask,
    resetDemoData,
    timerTaskId,
    stopTimer
  } = useWorkOsStore();

  const [savedView, setSavedView] = useState<SavedViewId>("all");
  const [mode, setMode] = useState<BoardMode>("list");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<TaskStatus>("În lucru");
  const [bulkPriority, setBulkPriority] = useState<Priority>("Ridicat");
  const [bulkAssignee, setBulkAssignee] = useState("u1");

  const baseTasks = getFilteredTasks();
  const today = todayIso();

  const executionTasks = useMemo(() => {
    const searched = baseTasks.filter((task) => {
      const text = [task.title, task.description, task.projectCode, task.projectName, task.assigneeName, ...task.tags]
        .join(" ")
        .toLowerCase();
      return !query.trim() || text.includes(query.trim().toLowerCase());
    });

    const viewTasks = searched.filter((task) => {
      switch (savedView) {
        case "my":
          return task.assigneeId === "u1" || task.ownerId === "u1";
        case "today":
          return task.dueDate <= today && !isDone(task);
        case "overdue":
          return task.dueDate < today && !isDone(task);
        case "blocked":
          return task.status === "Blocat" || Boolean(task.customFields?.Blocaj);
        case "high":
          return task.priority === "Urgent" || task.priority === "Critic";
        case "field":
          return taskIsFieldRelated(task);
        case "approvals":
          return task.status === "Review / QA" || task.tags.some((tag) => tag.toLowerCase().includes("ofert"));
        case "dependencies":
          return task.dependencies.length > 0 || tasks.some((candidate) => candidate.dependencies.includes(task.id));
        default:
          return true;
      }
    });

    return sortExecution(viewTasks);
  }, [baseTasks, query, savedView, tasks, today]);

  const stats = useMemo(() => {
    const active = tasks.filter((task) => !isDone(task)).length;
    const blocked = tasks.filter((task) => task.status === "Blocat").length;
    const critical = tasks.filter((task) => task.priority === "Critic" || task.priority === "Urgent").length;
    const dependencies = tasks.reduce((sum, task) => sum + task.dependencies.length, 0);
    const comments = tasks.reduce((sum, task) => sum + task.comments.length, 0);
    const attachments = tasks.reduce((sum, task) => sum + task.attachments.length, 0);
    const tracked = tasks.reduce((sum, task) => sum + task.trackedHours, 0);
    const estimated = tasks.reduce((sum, task) => sum + task.estimateHours, 0);
    return { active, blocked, critical, dependencies, comments, attachments, tracked, estimated };
  }, [tasks]);

  const selectedTasks = executionTasks.filter((task) => selectedIds.includes(task.id));

  const toggleSelected = (taskId: string) => {
    setSelectedIds((current) => (current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId]));
  };

  const clearSelection = () => setSelectedIds([]);

  const runBulkStatus = () => {
    selectedIds.forEach((id) => updateTaskStatus(id, bulkStatus));
    clearSelection();
  };

  const runBulkPriority = () => {
    selectedIds.forEach((id) => updateTask(id, { priority: bulkPriority }));
    clearSelection();
  };

  const runBulkAssignee = () => {
    const user = users.find((item) => item.id === bulkAssignee);
    if (!user) return;
    selectedIds.forEach((id) => updateTask(id, { assigneeId: user.id, assigneeName: user.name }));
    clearSelection();
  };

  const runBulkComplete = () => {
    selectedIds.forEach((id) => updateTaskStatus(id, "Finalizat"));
    clearSelection();
  };

  const activeView = savedViews.find((view) => view.id === savedView) ?? savedViews[0];

  return (
    <>
      <div className="space-y-6">
        {timerTaskId && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 shadow-sm">
            <span className="inline-flex items-center gap-2"><TimerReset className="h-4 w-4" /> Timer activ pe taskul {timerTaskId}</span>
            <button onClick={stopTimer} className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white hover:bg-emerald-800">Oprește timer</button>
          </div>
        )}

        <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-200">
          <div className="grid gap-0 lg:grid-cols-[1.3fr_.7fr]">
            <div className="p-6 lg:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-[.18em] text-emerald-300 ring-1 ring-emerald-400/20">
                v5.5.0 · Task Execution Interaction
              </div>
              <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">
                Work OS task execution cockpit: drawer, quick edit, bulk actions, saved views și dependențe.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Build major peste v5.4: taskurile devin centrul operațional pentru proiecte, pontaj, materiale, aprobări și audit. Datele rămân safe în localStorage/mock până la v5.6 persistent records.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <HeroMetric label="Taskuri active" value={String(stats.active)} icon={ListChecks} tone="emerald" />
                <HeroMetric label="Blocate" value={String(stats.blocked)} icon={AlertTriangle} tone="red" />
                <HeroMetric label="Urgent/Critic" value={String(stats.critical)} icon={Sparkles} tone="amber" />
                <HeroMetric label="Dependențe" value={String(stats.dependencies)} icon={GitBranch} tone="violet" />
              </div>
            </div>
            <div className="border-t border-white/10 bg-white/5 p-6 lg:border-l lg:border-t-0 lg:p-8">
              <div className="rounded-[1.5rem] bg-white/10 p-4 ring-1 ring-white/10">
                <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[.14em] text-slate-300">
                  <span>Capacitate execuție</span><span>{Math.round((stats.tracked / Math.max(stats.estimated, 1)) * 100)}%</span>
                </div>
                <ProgressBar value={(stats.tracked / Math.max(stats.estimated, 1)) * 100} tone="green" />
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <MiniMetric label="Comentarii" value={stats.comments} />
                  <MiniMetric label="Atașamente" value={stats.attachments} />
                  <MiniMetric label="Proiecte" value={projects.length} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setTaskCreateOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Task nou</button>
                <button onClick={resetDemoData} className="btn-secondary bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15"><RefreshCcw className="h-4 w-4" /> Reset demo</button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[280px_1fr]">
          <aside className="space-y-3 rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Saved views</p>
                <h2 className="text-lg font-black text-slate-950">Filtre operaționale</h2>
              </div>
              <Filter className="h-5 w-5 text-slate-400" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Caută task/proiect/tag..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm font-semibold outline-none transition focus:border-emerald-300 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              {savedViews.map((view) => {
                const Icon = view.icon;
                const active = savedView === view.id;
                return (
                  <button
                    key={view.id}
                    onClick={() => setSavedView(view.id)}
                    className={active ? "w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-left shadow-sm" : "w-full rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40"}
                  >
                    <div className="flex items-center gap-3">
                      <span className={active ? "rounded-xl bg-emerald-600 p-2 text-white" : "rounded-xl bg-slate-100 p-2 text-slate-500"}><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black text-slate-900">{view.label}</span>
                        <span className="block truncate text-xs font-semibold text-slate-500">{view.description}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-4">
            <div className="rounded-[1.7rem] border border-slate-200 bg-white p-4 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-600">{activeView.label}</p>
                  <h2 className="text-2xl font-black text-slate-950">{activeView.description}</h2>
                  <p className="text-sm font-semibold text-slate-500">{executionTasks.length} taskuri în view-ul curent · {selectedIds.length} selectate</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {boardModes.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setMode(item.id)}
                        className={mode === item.id ? "inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white" : "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"}
                      >
                        <Icon className="h-4 w-4" /> {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {selectedIds.length > 0 && (
              <BulkOperationsBar
                selectedCount={selectedIds.length}
                bulkStatus={bulkStatus}
                bulkPriority={bulkPriority}
                bulkAssignee={bulkAssignee}
                onBulkStatus={setBulkStatus}
                onBulkPriority={setBulkPriority}
                onBulkAssignee={setBulkAssignee}
                onApplyStatus={runBulkStatus}
                onApplyPriority={runBulkPriority}
                onApplyAssignee={runBulkAssignee}
                onComplete={runBulkComplete}
                onClear={clearSelection}
              />
            )}

            {mode === "list" && (
              <TaskExecutionList
                tasks={executionTasks}
                allTasks={tasks}
                selectedIds={selectedIds}
                onToggle={toggleSelected}
                onOpen={setSelectedTask}
                onStatus={updateTaskStatus}
                onQuickUpdate={updateTask}
                onDuplicate={duplicateTask}
              />
            )}
            {mode === "board" && <TaskExecutionBoard tasks={executionTasks} selectedIds={selectedIds} onToggle={toggleSelected} onOpen={setSelectedTask} onStatus={updateTaskStatus} />}
            {mode === "dependencies" && <DependencyMap tasks={executionTasks} allTasks={tasks} onOpen={setSelectedTask} />}
            {mode === "activity" && <ActivityTimeline tasks={executionTasks} onOpen={setSelectedTask} />}
            {mode === "admin" && <AdminInteractionControls selectedTasks={selectedTasks} />}
          </main>
        </section>
      </div>

      <TaskCreateModal />
      <TaskDrawer />
    </>
  );
}

function HeroMetric({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof ListChecks; tone: "emerald" | "red" | "amber" | "violet" }) {
  const toneClass = {
    emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
    red: "bg-red-400/10 text-red-300 ring-red-400/20",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/20"
  }[tone];
  return (
    <div className="rounded-[1.3rem] bg-white/10 p-4 ring-1 ring-white/10">
      <div className={`mb-3 inline-flex rounded-xl p-2 ring-1 ${toneClass}`}><Icon className="h-4 w-4" /></div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">{label}</div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
      <div className="text-xl font-black text-white">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">{label}</div>
    </div>
  );
}

function BulkOperationsBar({
  selectedCount,
  bulkStatus,
  bulkPriority,
  bulkAssignee,
  onBulkStatus,
  onBulkPriority,
  onBulkAssignee,
  onApplyStatus,
  onApplyPriority,
  onApplyAssignee,
  onComplete,
  onClear
}: {
  selectedCount: number;
  bulkStatus: TaskStatus;
  bulkPriority: Priority;
  bulkAssignee: string;
  onBulkStatus: (value: TaskStatus) => void;
  onBulkPriority: (value: Priority) => void;
  onBulkAssignee: (value: string) => void;
  onApplyStatus: () => void;
  onApplyPriority: () => void;
  onApplyAssignee: () => void;
  onComplete: () => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <div className="text-sm font-black text-emerald-900">{selectedCount} taskuri selectate</div>
          <div className="text-xs font-semibold text-emerald-700">Operațiuni bulk safe: modificări locale / shadow-safe până la write-mode real.</div>
        </div>
        <BulkSelect label="Status" value={bulkStatus} options={statuses} onChange={(value) => onBulkStatus(value as TaskStatus)} />
        <button onClick={onApplyStatus} className="btn-secondary bg-white">Aplică status</button>
        <BulkSelect label="Prioritate" value={bulkPriority} options={priorities} onChange={(value) => onBulkPriority(value as Priority)} />
        <button onClick={onApplyPriority} className="btn-secondary bg-white">Aplică prioritate</button>
        <BulkSelect label="Responsabil" value={bulkAssignee} options={users.map((user) => ({ value: user.id, label: user.name }))} onChange={onBulkAssignee} />
        <button onClick={onApplyAssignee} className="btn-secondary bg-white">Asignare</button>
        <button onClick={onComplete} className="btn-primary"><CheckCircle2 className="h-4 w-4" /> Finalizează</button>
        <button onClick={onClear} className="rounded-xl px-3 py-2 text-sm font-black text-emerald-800 hover:bg-white/60">Curăță</button>
      </div>
    </div>
  );
}

function BulkSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<string | { value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="min-w-[140px] rounded-xl border border-emerald-200 bg-white px-3 py-2">
      <span className="block text-[10px] font-black uppercase tracking-[.12em] text-emerald-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full bg-transparent text-xs font-black text-slate-800 outline-none">
        {options.map((option) => {
          const item = typeof option === "string" ? { value: option, label: option } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
    </label>
  );
}

function TaskExecutionList({
  tasks,
  allTasks,
  selectedIds,
  onToggle,
  onOpen,
  onStatus,
  onQuickUpdate,
  onDuplicate
}: {
  tasks: Task[];
  allTasks: Task[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onOpen: (id?: string) => void;
  onStatus: (id: string, status: TaskStatus) => void;
  onQuickUpdate: (id: string, patch: Partial<Task>) => void;
  onDuplicate: (id: string) => void;
}) {
  if (!tasks.length) return <EmptyState />;
  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-card">
      <div className="grid grid-cols-[44px_1.6fr_.8fr_.75fr_.75fr_.85fr_.75fr_160px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-slate-400">
        <span />
        <span>Task</span>
        <span>Responsabil</span>
        <span>Prioritate</span>
        <span>Status</span>
        <span>Deadline</span>
        <span>Progres</span>
        <span>Acțiuni</span>
      </div>
      <div className="divide-y divide-slate-100">
        {tasks.map((task) => {
          const blockerNames = task.dependencies
            .map((id) => allTasks.find((candidate) => candidate.id === id)?.title ?? id)
            .slice(0, 2);
          const overdue = task.dueDate < todayIso() && !isDone(task);
          return (
            <div key={task.id} className="grid grid-cols-[44px_1.6fr_.8fr_.75fr_.75fr_.85fr_.75fr_160px] items-center gap-3 px-4 py-3 transition hover:bg-emerald-50/30">
              <button onClick={() => onToggle(task.id)} className={selectedIds.includes(task.id) ? "h-5 w-5 rounded-md border border-emerald-600 bg-emerald-600 text-white" : "h-5 w-5 rounded-md border border-slate-300 bg-white"}>{selectedIds.includes(task.id) ? "✓" : ""}</button>
              <button onClick={() => onOpen(task.id)} className="min-w-0 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-black text-slate-950">{task.title}</span>
                  {overdue && <Badge tone="red">overdue</Badge>}
                  {task.dependencies.length > 0 && <Badge tone="purple">blocked by {task.dependencies.length}</Badge>}
                </div>
                <div className="mt-1 truncate text-xs font-semibold text-slate-500">{task.projectCode} · {task.projectName}</div>
                {blockerNames.length > 0 && <div className="mt-1 truncate text-[11px] font-semibold text-violet-600">Depinde de: {blockerNames.join(", ")}</div>}
              </button>
              <QuickAssignee task={task} onQuickUpdate={onQuickUpdate} />
              <QuickPriority task={task} onQuickUpdate={onQuickUpdate} />
              <QuickStatus task={task} onStatus={onStatus} />
              <input type="date" value={task.dueDate} onChange={(event) => onQuickUpdate(task.id, { dueDate: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-700 outline-none hover:border-emerald-200" />
              <div>
                <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-slate-500"><span>{taskProgress(task)}%</span><span>{task.trackedHours}h</span></div>
                <ProgressBar value={taskProgress(task)} tone={task.status === "Blocat" ? "red" : "green"} />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => onOpen(task.id)} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:border-emerald-200 hover:text-emerald-700" title="Deschide drawer"><PanelRightOpen className="h-4 w-4" /></button>
                <button onClick={() => onDuplicate(task.id)} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:border-blue-200 hover:text-blue-700" title="Duplică task"><CopyCheck className="h-4 w-4" /></button>
                <button onClick={() => onStatus(task.id, "Finalizat")} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:border-emerald-200 hover:text-emerald-700" title="Finalizează"><CheckCircle2 className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickStatus({ task, onStatus }: { task: Task; onStatus: (id: string, status: TaskStatus) => void }) {
  return (
    <select value={task.status} onChange={(event) => onStatus(task.id, event.target.value as TaskStatus)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-700 outline-none hover:border-emerald-200">
      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
    </select>
  );
}

function QuickPriority({ task, onQuickUpdate }: { task: Task; onQuickUpdate: (id: string, patch: Partial<Task>) => void }) {
  return (
    <select value={task.priority} onChange={(event) => onQuickUpdate(task.id, { priority: event.target.value as Priority })} className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-700 outline-none hover:border-emerald-200">
      {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
    </select>
  );
}

function QuickAssignee({ task, onQuickUpdate }: { task: Task; onQuickUpdate: (id: string, patch: Partial<Task>) => void }) {
  return (
    <select
      value={task.assigneeId}
      onChange={(event) => {
        const user = users.find((item) => item.id === event.target.value);
        if (user) onQuickUpdate(task.id, { assigneeId: user.id, assigneeName: user.name });
      }}
      className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-700 outline-none hover:border-emerald-200"
    >
      {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
    </select>
  );
}

function TaskExecutionBoard({ tasks, selectedIds, onToggle, onOpen, onStatus }: { tasks: Task[]; selectedIds: string[]; onToggle: (id: string) => void; onOpen: (id?: string) => void; onStatus: (id: string, status: TaskStatus) => void }) {
  const grouped = useMemo(() => {
    const map = new Map<TaskStatus, Task[]>();
    statuses.forEach((status) => map.set(status, []));
    tasks.forEach((task) => map.get(task.status)?.push(task));
    return map;
  }, [tasks]);

  return (
    <div className="grid gap-3 xl:grid-cols-3 2xl:grid-cols-6">
      {statuses.filter((status) => status !== "Anulat").map((status) => {
        const columnTasks = grouped.get(status) ?? [];
        return (
          <div key={status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const id = event.dataTransfer.getData("text/task-id"); if (id) onStatus(id, status); }} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-3 shadow-inner shadow-white">
            <div className="mb-3 flex items-center justify-between">
              <Badge tone={statusTone(status)}>{status}</Badge>
              <span className="text-xs font-black text-slate-400">{columnTasks.length}</span>
            </div>
            <div className="space-y-3">
              {columnTasks.slice(0, 10).map((task) => (
                <button key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/task-id", task.id)} onClick={() => onOpen(task.id)} className="w-full rounded-[1.2rem] border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-card">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
                    <span onClick={(event) => { event.stopPropagation(); onToggle(task.id); }} className={selectedIds.includes(task.id) ? "rounded-md bg-emerald-600 px-2 py-1 text-xs font-black text-white" : "rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-400"}>✓</span>
                  </div>
                  <div className="text-sm font-black text-slate-950">{task.title}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{task.projectCode} · {task.assigneeName}</div>
                  {task.dependencies.length > 0 && <div className="mt-2 text-[11px] font-bold text-violet-600">{task.dependencies.length} dependențe</div>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DependencyMap({ tasks, allTasks, onOpen }: { tasks: Task[]; allTasks: Task[]; onOpen: (id?: string) => void }) {
  const rows = tasks.filter((task) => task.dependencies.length > 0 || allTasks.some((candidate) => candidate.dependencies.includes(task.id)));
  if (!rows.length) return <EmptyState title="Nu există dependențe în view-ul curent." />;
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {rows.map((task) => {
        const blockers = task.dependencies.map((id) => allTasks.find((candidate) => candidate.id === id)).filter(Boolean) as Task[];
        const blocking = allTasks.filter((candidate) => candidate.dependencies.includes(task.id));
        return (
          <div key={task.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-card">
            <button onClick={() => onOpen(task.id)} className="text-left text-lg font-black text-slate-950 hover:text-emerald-700">{task.title}</button>
            <p className="text-sm font-semibold text-slate-500">{task.projectCode} · {task.assigneeName}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DependencyColumn title="Blocked by" items={blockers} empty="Nu este blocat." onOpen={onOpen} tone="red" />
              <DependencyColumn title="Blocking" items={blocking} empty="Nu blochează alte taskuri." onOpen={onOpen} tone="purple" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DependencyColumn({ title, items, empty, onOpen, tone }: { title: string; items: Task[]; empty: string; onOpen: (id?: string) => void; tone: "red" | "purple" }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="mb-2 text-xs font-black uppercase tracking-[.12em] text-slate-400">{title}</div>
      <div className="space-y-2">
        {items.map((item) => <button key={item.id} onClick={() => onOpen(item.id)} className="block w-full rounded-xl border border-slate-200 bg-white p-2 text-left text-xs font-bold text-slate-700 hover:border-emerald-200"><Badge tone={tone}>{item.status}</Badge><span className="mt-1 block">{item.title}</span></button>)}
        {items.length === 0 && <p className="text-xs font-semibold text-slate-400">{empty}</p>}
      </div>
    </div>
  );
}

function ActivityTimeline({ tasks, onOpen }: { tasks: Task[]; onOpen: (id?: string) => void }) {
  const events = tasks.flatMap((task) => task.activityLog.map((event) => ({ ...event, taskId: task.id, taskTitle: task.title, projectCode: task.projectCode }))).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 40);
  return (
    <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2"><Clock3 className="h-5 w-5 text-emerald-600" /><h3 className="text-lg font-black text-slate-950">Timeline comentarii / activitate</h3></div>
      <div className="space-y-3">
        {events.map((event) => (
          <button key={`${event.taskId}-${event.id}`} onClick={() => onOpen(event.taskId)} className="flex w-full gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-emerald-200 hover:bg-emerald-50/40">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-slate-900">{event.userName} {event.action}</span>
              <span className="block text-xs font-semibold text-slate-500">{event.projectCode} · {event.taskTitle} · {new Date(event.createdAt).toLocaleString("ro-RO")}</span>
            </span>
          </button>
        ))}
        {events.length === 0 && <EmptyState title="Nu există activitate pentru view-ul curent." />}
      </div>
    </div>
  );
}

function AdminInteractionControls({ selectedTasks }: { selectedTasks: Task[] }) {
  const roles = [
    { role: "Administrator", rights: ["Editare completă", "Bulk actions", "Ștergere safe", "RBAC", "Audit"] },
    { role: "Manager", rights: ["Asignare", "Aprobări", "Priorități", "Deadline", "Review"] },
    { role: "Tehnician", rights: ["Taskuri proprii", "Timer", "Comentarii", "Poze/atașamente", "Checklist"] },
    { role: "Employee", rights: ["My work", "Pontaj", "Comentarii", "Status propriu"] },
    { role: "Client", rights: ["Vizualizare", "Cerere suport", "Comentarii controlate"] }
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
      <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="mb-1 text-xl font-black text-slate-950">Admin interaction controls</h3>
        <p className="mb-4 text-sm font-semibold text-slate-500">Matrice de acțiuni vizibilă pentru task execution. Scrierile destructive rămân safe / dezactivate implicit.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {roles.map((item) => (
            <div key={item.role} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /><span className="font-black text-slate-950">{item.role}</span></div>
              <div className="flex flex-wrap gap-2">{item.rights.map((right) => <Badge key={right} tone="green">{right}</Badge>)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="mb-1 text-xl font-black text-slate-950">Selecție curentă</h3>
        <p className="mb-4 text-sm font-semibold text-slate-500">{selectedTasks.length} taskuri pregătite pentru acțiuni manageriale.</p>
        <div className="space-y-2">
          {selectedTasks.slice(0, 8).map((task) => <div key={task.id} className="rounded-xl border border-slate-200 p-3"><div className="font-bold text-slate-900">{task.title}</div><div className="text-xs text-slate-500">{task.projectCode} · {task.assigneeName}</div></div>)}
          {selectedTasks.length === 0 && <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm font-semibold text-slate-400">Selectează taskuri din listă pentru bulk/admin controls.</p>}
        </div>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800"><Archive className="mb-2 h-4 w-4" /> Arhivarea/ștergerea permanentă nu este activată în v5.5.0. v5.6 va muta aceste acțiuni în persistent records + audit trail.</div>
      </div>
    </div>
  );
}

function EmptyState({ title = "Nu există taskuri pentru view-ul curent." }: { title?: string }) {
  return (
    <div className="rounded-[1.7rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <FileStack className="mx-auto h-8 w-8 text-slate-300" />
      <h3 className="mt-3 text-lg font-black text-slate-950">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-slate-500">Schimbă saved view-ul, caută alt proiect sau creează un task nou pentru execuție.</p>
    </div>
  );
}
