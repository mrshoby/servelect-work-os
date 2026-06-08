import Link from "next/link";
import { WorkOsBadge, WorkOsCard, WorkOsMetric, WorkOsProgress, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { getV56PersistentRecordsReport } from "@/lib/enterprise/work-os-persistent-records";

export default function WorkOsStatusPage() {
  const report = getV56PersistentRecordsReport();

  return (
    <WorkOsShell
      eyebrow="SERVELECT WORK OS status"
      title="Status/procente pe site și în cod"
      subtitle="Pagina de status cerută în chatul inițial: procente vizibile pentru Website/Web App, Task & Project Core, Backend/API, Database/Prisma/Seed, Auth/RBAC, IoT/Ops și Mobile App."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WorkOsMetric label="Overall readiness" value={`${report.overall}%`} hint="Medie calculată din ariile majore ale platformei." />
        <WorkOsMetric label="Write mode" value={report.writeMode} hint="Scrierile reale rămân safe by default." />
        <WorkOsMetric label="Record families" value={report.recordFamilies.length} hint="Domenii pregătite pentru persistare reală." />
        <WorkOsMetric label="Next" value={report.nextRecommendedVersion.version} hint={report.nextRecommendedVersion.title} />
      </section>

      <WorkOsCard title="Procente pe arii" subtitle="Procente orientative bazate pe capabilitățile existente în cod și ce este vizibil pe site.">
        <div className="grid gap-4 lg:grid-cols-2">
          {report.maturityAreas.map((area) => (
            <div key={area.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-3">
                <div className="font-black text-slate-950">{area.label}</div>
                <WorkOsBadge value={area.status} />
              </div>
              <div className="mt-3"><WorkOsProgress value={area.completion} /></div>
              <p className="mt-3 text-sm leading-6 text-slate-600"><b>Cod actual:</b> {area.codeEvidence}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600"><b>Vizibil pe site:</b> {area.siteEvidence}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{area.nextAction}</p>
            </div>
          ))}
        </div>
      </WorkOsCard>

      <WorkOsCard title="Următoarele builduri majore" subtitle="Continuare incrementală pe direcția promptului inițial: Work OS complet, nu aplicații separate.">
        <div className="grid gap-3 md:grid-cols-2">
          <Link href="/work-os/persistent-records" className="rounded-2xl bg-emerald-50 p-4 font-black text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100">
            v5.6 · Persistent Records, Inline Editing & Activity Comments
          </Link>
          <div className="rounded-2xl bg-blue-50 p-4 font-black text-blue-800 ring-1 ring-blue-200">
            v5.7 · Real Database Adapter Switchboard & Record Mutations
          </div>
        </div>
      </WorkOsCard>
    </WorkOsShell>
  );
}
