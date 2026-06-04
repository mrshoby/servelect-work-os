"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { CalendarDays, ClipboardList, Clock, Filter, LayoutDashboard, Plus } from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/ui/Card";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { useWorkOsStore } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";

export default function TasksPage() {
  const { tasks, timerTaskId, stopTimer } = useWorkOsStore();
  return (
    <>
      <PageHeader title="Taskuri / My Work" subtitle="GoodDay-style task management: listă, board, calendar, workload, approvals și time tracker.">
        {timerTaskId && <button onClick={stopTimer} className="btn-secondary"><Clock className="h-4 w-4" /> Oprește timer activ</button>}
        <button className="btn-secondary"><Filter className="h-4 w-4" /> Filtre</button>
        <button className="btn-primary"><Plus className="h-4 w-4" /> Task nou</button>
      </PageHeader>

      <Tabs.Root defaultValue="table" className="space-y-4">
        <Tabs.List className="card-tight flex flex-wrap gap-2 p-2">
          {[
            ["table", "Task Table", ClipboardList], ["board", "Kanban Board", LayoutDashboard], ["mywork", "My Work", Clock], ["calendar", "Calendar", CalendarDays], ["approvals", "Approvals", ClipboardList]
          ].map(([value, label, Icon]) => <Tabs.Trigger key={String(value)} value={String(value)} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 data-[state=active]:bg-servelect-600 data-[state=active]:text-white">{typeof Icon !== "string" && <Icon className="h-4 w-4"/>}{String(label)}</Tabs.Trigger>)}
        </Tabs.List>

        <Tabs.Content value="table"><Card><CardHeader title="Task Table" subtitle="TanStack Table + drawer detalii task" /><TaskTable /></Card></Tabs.Content>
        <Tabs.Content value="board"><Card><CardHeader title="Kanban Board" subtitle="Drag & drop demo între statusuri" /><div className="overflow-x-auto p-5 pt-0"><KanbanBoard /></div></Card></Tabs.Content>
        <Tabs.Content value="mywork"><div className="grid gap-4 xl:grid-cols-3">{["Overdue", "Today", "Săptămâna aceasta"].map((group, index)=><Card key={group}><CardHeader title={group} action={<Badge tone={index===0?"red":"green"}>{tasks.slice(index,index+3).length}</Badge>} /><div className="space-y-3 p-5 pt-0">{tasks.slice(index,index+4).map(task=><div key={task.id} className="rounded-xl border border-slate-200 p-3"><b className="text-sm">{task.title}</b><div className="mt-1 text-xs text-slate-500">{task.projectCode} · {task.assigneeName}</div></div>)}</div></Card>)}</div></Tabs.Content>
        <Tabs.Content value="calendar"><Card><CardHeader title="Calendar taskuri" /><div className="grid grid-cols-7 gap-2 p-5 pt-0">{Array.from({length:35}).map((_,i)=><div key={i} className="min-h-24 rounded-xl border border-slate-200 bg-white p-2 text-xs"><b>{i+1}</b>{i%5===0 && <div className="mt-2 rounded-lg bg-emerald-50 p-1 text-emerald-700">Task</div>}</div>)}</div></Card></Tabs.Content>
        <Tabs.Content value="approvals"><Card><CardHeader title="Approvals" /><TaskTable limit={4}/></Card></Tabs.Content>
      </Tabs.Root>
      <TaskDrawer />
    </>
  );
}
