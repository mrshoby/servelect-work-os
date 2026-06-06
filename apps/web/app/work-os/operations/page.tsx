import { WorkOsBadge, WorkOsCard, WorkOsJson, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { getWorkOsCommandCenter, listWorkOsOperations } from "@/lib/enterprise/work-os-core-modules";

export default function OperationsPage() {
  const ops = listWorkOsOperations();
  const command = getWorkOsCommandCenter();
  return (
    <WorkOsShell eyebrow="Operations & Admin Controls" title="Command Center operațional" subtitle="Comenzi admin, alerte, automatizări, audit și emergency controls.">
      <section className="grid gap-4 xl:grid-cols-2">
        <WorkOsCard title="Admin commands">
          <div className="space-y-3">
            {command.commands.map((cmd) => (
              <div key={cmd.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2"><div className="font-black text-slate-950">{cmd.label}</div><WorkOsBadge value={cmd.mode} /></div>
                <p className="mt-2 text-sm text-slate-600">{cmd.description}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">Role: {cmd.requiredRole} · Enabled: {String(cmd.enabled)}</p>
              </div>
            ))}
          </div>
        </WorkOsCard>
        <WorkOsCard title="Automation lanes">
          <div className="space-y-3">
            {ops.automations.map((lane) => (
              <div key={lane.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2"><div className="font-black text-slate-950">{lane.label}</div><WorkOsBadge value={lane.status} /></div>
                <p className="mt-2 text-sm text-slate-600">{lane.trigger}{" → "}{lane.action}</p>
                <p className="mt-2 text-xs font-semibold text-emerald-700">Safety: {lane.safety}</p>
              </div>
            ))}
          </div>
        </WorkOsCard>
      </section>
      <WorkOsCard title="Command center JSON contract"><WorkOsJson value={command} /></WorkOsCard>
    </WorkOsShell>
  );
}
