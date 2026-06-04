"use client";

import { useMemo } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { Task } from "@servelect/shared";
import { priorityTone, statusTone, type TaskStatus } from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkOsStore } from "@/lib/store";
import { CheckCircle2, Copy, MoreHorizontal, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper<Task>();
const nextStatuses: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
const DEFAULT_RENDER_LIMIT = 80;

export function TaskTable({ limit, tasksOverride }: { limit?: number; tasksOverride?: Task[] }) {
  const { getFilteredTasks, setSelectedTask, updateTaskStatus, deleteTask, duplicateTask } = useWorkOsStore();
  const baseData = tasksOverride ?? getFilteredTasks();
  const renderLimit = limit ?? DEFAULT_RENDER_LIMIT;
  const data = useMemo(() => baseData.slice(0, renderLimit), [baseData, renderLimit]);
  const hiddenCount = Math.max(0, baseData.length - data.length);

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Task",
        cell: (info) => (
          <div className="min-w-[260px]">
            <span className="font-extrabold text-slate-950">{info.getValue()}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {info.row.original.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">#{tag}</span>
              ))}
            </div>
          </div>
        )
      }),
      columnHelper.accessor("projectCode", {
        header: "Proiect",
        cell: (info) => <span className="font-bold text-slate-700">{info.getValue()}</span>
      }),
      columnHelper.accessor("assigneeName", { header: "Responsabil" }),
      columnHelper.accessor("priority", {
        header: "Prioritate",
        cell: (info) => <Badge tone={priorityTone(info.getValue())}>{info.getValue()}</Badge>
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <select
            value={info.getValue()}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => updateTaskStatus(info.row.original.id, event.target.value as TaskStatus)}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 outline-none hover:border-emerald-200"
          >
            {nextStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        )
      }),
      columnHelper.accessor("dueDate", { header: "Deadline" }),
      columnHelper.display({
        id: "progress",
        header: "Progres",
        cell: ({ row }) => (
          <div className="min-w-32">
            <ProgressBar value={(row.original.trackedHours / Math.max(row.original.estimateHours, 1)) * 100} tone={row.original.priority === "Critic" ? "red" : "green"} />
          </div>
        )
      }),
      columnHelper.display({
        id: "actions",
        header: "Acțiuni",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1" onClick={(event) => event.stopPropagation()}>
            <button title="Finalizează" onClick={() => updateTaskStatus(row.original.id, "Finalizat")} className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700"><CheckCircle2 className="h-4 w-4" /></button>
            <button title="Duplică" onClick={() => duplicateTask(row.original.id)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700"><Copy className="h-4 w-4" /></button>
            <button title="Șterge" onClick={() => deleteTask(row.original.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            <button title="Detalii" onClick={() => setSelectedTask(row.original.id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        )
      })
    ],
    [deleteTask, duplicateTask, setSelectedTask, updateTaskStatus]
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto">
      {hiddenCount > 0 && (
        <div className="border-b border-slate-100 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
          Se afișează primele {data.length} taskuri din {baseData.length}. Folosește filtrele pentru rezultate mai precise.
        </div>
      )}
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="whitespace-nowrap px-4 py-3 font-black">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} onClick={() => setSelectedTask(row.original.id)} className="group cursor-pointer transition hover:bg-emerald-50/40">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="whitespace-nowrap px-4 py-3.5 text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-sm font-semibold text-slate-400">Nu există taskuri pentru filtrele curente.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
