"use client";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { Task } from "@servelect/shared";
import { priorityTone, statusTone } from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkOsStore } from "@/lib/store";

const columnHelper = createColumnHelper<Task>();

const columns = [
  columnHelper.accessor("title", { header: "Task", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> }),
  columnHelper.accessor("projectCode", { header: "Proiect" }),
  columnHelper.accessor("assigneeName", { header: "Responsabil" }),
  columnHelper.accessor("priority", { header: "Prioritate", cell: (info) => <Badge tone={priorityTone(info.getValue())}>{info.getValue()}</Badge> }),
  columnHelper.accessor("status", { header: "Status", cell: (info) => <Badge tone={statusTone(info.getValue())}>{info.getValue()}</Badge> }),
  columnHelper.accessor("dueDate", { header: "Deadline" }),
  columnHelper.display({ id: "progress", header: "Progres", cell: ({ row }) => <div className="min-w-28"><ProgressBar value={(row.original.trackedHours / Math.max(row.original.estimateHours, 1)) * 100} /></div> })
];

export function TaskTable({ limit }: { limit?: number }) {
  const { tasks, setSelectedTask } = useWorkOsStore();
  const data = limit ? tasks.slice(0, limit) : tasks;
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => <th key={header.id} className="whitespace-nowrap px-4 py-3 font-bold">{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>)}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} onClick={() => setSelectedTask(row.original.id)} className="cursor-pointer hover:bg-slate-50">
              {row.getVisibleCells().map((cell) => <td key={cell.id} className="whitespace-nowrap px-4 py-3 text-slate-700">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
