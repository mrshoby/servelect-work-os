import { WorkOsBadge, WorkOsCard, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { tasks } from "@/lib/enterprise/work-os-core-modules";

export default function TasksPage() {
  const columns = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat"];
  return (
    <WorkOsShell eyebrow="Task Management" title="Taskuri operaționale" subtitle="Taskuri legate de proiecte, stocuri, pontaj, workload și audit.">
      <section className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <WorkOsCard key={column} title={column}>
            <div className="space-y-3">
              {tasks.filter((task) => task.status === column).map((task) => (
                <div key={task.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="font-black text-slate-950">{task.title}</div>
                  <div className="mt-2 flex flex-wrap gap-2"><WorkOsBadge value={task.priority} /><WorkOsBadge value={task.projectCode} /></div>
                  <p className="mt-2 text-sm text-slate-600">{task.owner} · {task.department} · {task.workloadHours}h</p>
                  {task.blocker ? <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{task.blocker}</p> : null}
                </div>
              ))}
            </div>
          </WorkOsCard>
        ))}
      </section>
    </WorkOsShell>
  );
}
