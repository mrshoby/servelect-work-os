import { WorkOsBadge, WorkOsCard, WorkOsProgress, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { projects } from "@/lib/enterprise/work-os-core-modules";

export default function ProjectsPage() {
  return (
    <WorkOsShell eyebrow="Project Management" title="Proiecte Servelect" subtitle="Proiecte PV/BESS/mentenanță/digitalizare cu taskuri, materiale, buget, riscuri și deadline.">
      <section className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => (
          <WorkOsCard key={project.id} title={`${project.code} — ${project.name}`} subtitle={`${project.beneficiary} · ${project.location} · manager: ${project.manager}`}>
            <div className="flex flex-wrap gap-2"><WorkOsBadge value={project.status} /><WorkOsBadge value={project.priority} /><WorkOsBadge value={project.type} /></div>
            <div className="mt-4"><WorkOsProgress value={project.progress} /></div>
            <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-600">
              <div><b>Buget:</b><br />€{project.budgetEur.toLocaleString("ro-RO")}</div>
              <div><b>Deadline:</b><br />{project.deadline}</div>
              <div><b>Taskuri:</b><br />{project.linkedTasks.length}</div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {project.risks.map((risk) => <li key={risk} className="rounded-xl bg-amber-50 px-3 py-2 text-amber-800">{risk}</li>)}
            </ul>
          </WorkOsCard>
        ))}
      </section>
    </WorkOsShell>
  );
}
