import Link from "next/link";
import { WorkOsBadge, WorkOsCard, WorkOsMetric, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { getV57DataSwitchboard } from "@/lib/enterprise/work-os-data-switchboard";

export default function AdminWorkOsDataSwitchboardPage() {
  const payload = getV57DataSwitchboard();
  const blocked = payload.mutationQueue.filter((item) => item.status === "blocked");

  return (
    <WorkOsShell
      eyebrow="Admin · v5.7.0"
      title="Data switchboard governance"
      subtitle="Control administrativ pentru surse de date, write gates, API facade, Prisma/PostgreSQL readiness, queue de mutații și status Vercel-safe."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WorkOsMetric label="Switchboard readiness" value={`${payload.readiness}%`} hint="Readiness combinat pentru adapters, source maps și mutation contracts." />
        <WorkOsMetric label="Blocked queue" value={blocked.length} hint="Mutații care nu pot fi executate real până nu există conector/source real." />
        <WorkOsMetric label="Mutation contracts" value={payload.summary.mutationContracts} hint="Contracte cu rollback/audit/permission gate." />
        <WorkOsMetric label="Source maps" value={payload.summary.sourceMaps} hint="Domenii mapate către surse reale/fallback." />
      </section>

      <WorkOsCard title="Production write mode" subtitle="Scrierile reale rămân protejate. v5.7 pregătește switchboard-ul, dar nu activează destructive writes automat.">
        <div className="flex flex-wrap gap-2">
          <WorkOsBadge value={`SERVELECT_WORK_OS_WRITE_MODE=${payload.writeMode}`} />
          <WorkOsBadge value={payload.prismaEnabled ? "Prisma poate rula shadow/controlled" : "Prisma blocat fără DATABASE_URL"} />
          <WorkOsBadge value="rollback required" />
          <WorkOsBadge value="audit required" />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Pentru producție, activarea completă trebuie făcută gradual: seed/parity, adapter contracts, audit persistent, rollback testat, apoi enablement pe domenii. Următorul build recomandat este {payload.nextRecommendedVersion.version} — {payload.nextRecommendedVersion.title}.
        </p>
      </WorkOsCard>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkOsCard title="Admin actions" subtitle="Scurtături utile pentru verificare după deploy.">
          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/work-os/data-switchboard" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Deschide switchboard UI</Link>
            <Link href="/api/v1/work-os/data-switchboard" className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white">Verifică API JSON</Link>
            <Link href="/work-os/status" className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800">Status/procente Work OS</Link>
            <Link href="/work-os/persistent-records" className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-800">Persistent records v5.6</Link>
          </div>
        </WorkOsCard>

        <WorkOsCard title="Blocked / planned items" subtitle="Elemente care nu trebuie mascate; rămân vizibile până la activarea conectorilor reali.">
          <div className="space-y-3">
            {blocked.length ? blocked.map((item) => (
              <div key={item.id} className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
                <div className="font-black">{item.title}</div>
                <p className="mt-2 leading-6">{item.safety}</p>
              </div>
            )) : <p className="text-sm text-slate-600">Nu există blocaje în queue.</p>}
          </div>
        </WorkOsCard>
      </section>
    </WorkOsShell>
  );
}
