"use client";

import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { users, type Priority, type TaskStatus } from "@servelect/shared";
import { useWorkOsStore } from "@/lib/store";

const statuses: Array<"Toate" | TaskStatus> = ["Toate", "Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
const priorities: Array<"Toate" | Priority> = ["Toate", "Scăzut", "Mediu", "Ridicat", "Urgent", "Critic"];

export function TaskFiltersBar() {
  const {
    taskSearch,
    statusFilter,
    priorityFilter,
    projectFilter,
    assigneeFilter,
    setTaskSearch,
    setStatusFilter,
    setPriorityFilter,
    setProjectFilter,
    setAssigneeFilter,
    resetFilters,
    getFilteredTasks,
    projects
  } = useWorkOsStore();

  const filteredCount = getFilteredTasks().length;

  return (
    <div className="card-tight overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-white p-3 xl:flex-row xl:items-center">
        <div className="input-shell min-w-0 flex-1">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={taskSearch}
            onChange={(event) => setTaskSearch(event.target.value)}
            placeholder="Caută task, proiect, tag, responsabil..."
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:w-[720px]">
          <Select label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as typeof statusFilter)} options={statuses} />
          <Select label="Prioritate" value={priorityFilter} onChange={(value) => setPriorityFilter(value as typeof priorityFilter)} options={priorities} />
          <Select label="Proiect" value={projectFilter} onChange={setProjectFilter} options={["Toate", ...projects.map((project) => ({ value: project.id, label: project.code }))]} />
          <Select label="Responsabil" value={assigneeFilter} onChange={setAssigneeFilter} options={["Toate", ...users.map((user) => ({ value: user.id, label: user.name.split(" ")[0] }))]} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{filteredCount} taskuri afișate</span>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-100">persistent localStorage</span>
          <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700 ring-1 ring-blue-100">task-first core</span>
        </div>
        <button onClick={resetFilters} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-50">
          <RotateCcw className="h-3.5 w-3.5" /> Resetează filtre
        </button>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
}) {
  return (
    <label className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[.16em] text-slate-400"><Filter className="h-3 w-3" /> {label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none">
        {options.map((option) => {
          const item = typeof option === "string" ? { value: option, label: option } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
    </label>
  );
}
