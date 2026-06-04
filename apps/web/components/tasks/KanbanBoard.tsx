"use client";

import { TaskStatus, priorityTone, statusTone } from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkOsStore } from "@/lib/store";
import { Plus } from "lucide-react";

const columns: TaskStatus[] = ["De făcut", "În lucru", "Review / QA", "Finalizat"];

export function KanbanBoard({ compact = false }: { compact?: boolean }) {
  const { tasks, updateTaskStatus, setSelectedTask } = useWorkOsStore();

  return (
    <div className={compact ? "grid gap-3 md:grid-cols-4" : "grid min-w-[980px] gap-4 md:grid-cols-4"}>
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column).slice(0, compact ? 3 : 10);
        return (
          <div key={column} onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
            const id = event.dataTransfer.getData("text/task-id");
            if (id) updateTaskStatus(id, column);
          }} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-sm font-extrabold text-slate-900">{column}</span><Badge tone={statusTone(column)}>{columnTasks.length}</Badge></div>
              <button className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-700"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("text/task-id", task.id)}
                  onClick={() => setSelectedTask(task.id)}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="mb-2 flex items-center justify-between gap-2"><span className="text-[11px] font-bold text-slate-500">{task.projectCode}</span><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></div>
                  <h3 className="text-sm font-extrabold leading-5 text-slate-950">{task.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{task.assigneeName}</span><span>{task.dueDate}</span></div>
                  <div className="mt-3"><ProgressBar value={(task.trackedHours / Math.max(task.estimateHours, 1)) * 100} tone={task.priority === "Urgent" || task.priority === "Critic" ? "red" : "green"} /></div>
                </article>
              ))}
              {columnTasks.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">Trage taskuri aici</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
