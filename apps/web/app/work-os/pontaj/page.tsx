import { WorkOsBadge, WorkOsCard, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { pontaj } from "@/lib/enterprise/work-os-core-modules";

export default function PontajPage() {
  return (
    <WorkOsShell eyebrow="Pontaj & Workload" title="Pontaj conectat la workload" subtitle="Stare angajați, ore azi/săptămână, sold normă și semnal pentru planificare taskuri.">
      <section className="grid gap-4 xl:grid-cols-2">
        {pontaj.map((entry) => (
          <WorkOsCard key={entry.id} title={entry.employee} subtitle={`${entry.department} · ${entry.lastAction}`}>
            <div className="flex flex-wrap gap-2"><WorkOsBadge value={entry.status} /><WorkOsBadge value={entry.workloadSignal} /></div>
            <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-600">
              <div><b>Azi</b><br />{entry.todayHours}h</div><div><b>Săptămână</b><br />{entry.weekHours}h</div><div><b>Sold normă</b><br />{entry.normBalanceHours}h</div>
            </div>
          </WorkOsCard>
        ))}
      </section>
    </WorkOsShell>
  );
}
