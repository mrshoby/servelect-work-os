"use client";

import { useMemo } from "react";
import { GripVertical, Plus } from "lucide-react";
import { priorityTone, statusTone, type TaskStatus } from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkOsStore } from "@/lib/store";

const columns: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat"];
const MAX_CARDS_PER_COLUMN = 12;
const MAX_COMPACT_CARDS_PER_COLUMN = 3;

export function KanbanBoard({ compact = false }: { compact?: boolean }) {
  const { getFilteredTasks, updateTaskStatus, setSelectedTask, setTaskCreateOpen, statusFilter } = useWorkOsStore();
  const tasks = getFilteredTasks();

  const visibleColumns = useMemo(
    () => (compact ? columns.filter((column) => column !== "Backlog" && column !== "Blocat") : columns),
    [compact]
  );

  const tasksByColumn = useMemo(() => {
    const grouped = new Map<TaskStatus, typeof tasks>();
    for (const column of visibleColumns) grouped.set(column, []);
    for (const task of tasks) {
      if (grouped.has(task.status)) grouped.get(task.status)?.push(task);
    }
    return grouped;
  }, [tasks, visibleColumns]);

  const maxCards = compact ? MAX_COMPACT_CARDS_PER_COLUMN : MAX_CARDS_PER_COLUMN;

  return (
    <div className={compact ? "grid gap-3 md:grid-cols-4" : "grid min-w-[1280px] gap-4 md:grid-cols-6"}>
      {visibleColumns.map((column) => {
        const allColumnTasks = tasksByColumn.get(column) ?? [];
        const columnTasks = allColumnTasks.slice(0, maxCards);
        const hiddenCount = Math.max(0, allColumnTasks.length - columnTasks.length);

        return (
          <section
            key={column}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const id = event.dataTransfer.getData("text/task-id");
              if (id) updateTaskStatus(id, column);
            }}
            className="rounded-[1.45rem] border border-slate-200 bg-slate-50/80 p-3 shadow-inner shadow-white"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-servelect-500 shadow-[0_0_0_4px_rgba(11,143,67,.1)]" />
                <span className="truncate text-sm font-black text-slate-900">{column}</span>
                <Badge tone={statusTone(column)}>{allColumnTasks.length}</Badge>
              </div>
              <button onClick={() => setTaskCreateOpen(true)} className="rounded-xl p-1.5 text-slate-400 hover:bg-white hover:text-servelect-700" aria-label="Creează task">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/task-id", task.id);
                  }}
                  onClick={() => setSelectedTask(task.id)}
                  className="group cursor-pointer rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-card"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] font-black uppercase tracking-[.12em] text-slate-400">{task.projectCode}</span>
                      <div className="mt-1 truncate text-[11px] font-semibold text-slate-500">{task.projectName}</div>
                    </div>
                    <GripVertical className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500" />
                  </div>
                  <h3 className="line-clamp-2 text-sm font-black leading-5 text-slate-950">{task.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
                    {task.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">#{tag}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span className="truncate font-bold text-slate-700">{task.assigneeName}</span>
                    <span className="shrink-0">{task.dueDate}</span>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      <span>{task.trackedHours}h / {task.estimateHours}h</span>
                      <span>{task.subtasks.filter((subtask) => subtask.done).length}/{task.subtasks.length} checklist</span>
                    </div>
                    <ProgressBar value={(task.trackedHours / Math.max(task.estimateHours, 1)) * 100} tone={task.priority === "Urgent" || task.priority === "Critic" ? "red" : "green"} />
                  </div>
                </article>
              ))}

              {hiddenCount > 0 && (
                <button onClick={() => setTaskCreateOpen(true)} className="w-full rounded-2xl border border-slate-200 bg-white/70 p-3 text-center text-xs font-bold text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                  +{hiddenCount} taskuri ascunse pentru performanță. Folosește tabelul/filtrele.
                </button>
              )}

              {columnTasks.length === 0 && (
                <button onClick={() => setTaskCreateOpen(true)} className="w-full rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-center text-xs font-bold text-slate-400 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                  {statusFilter === "Toate" ? "Trage taskuri aici sau creează unul nou" : "Nimic în această coloană"}
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
