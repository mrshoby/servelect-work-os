import { WorkOsBadge, WorkOsCard, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { beneficiaries } from "@/lib/enterprise/work-os-core-modules";

export default function CrmPage() {
  return (
    <WorkOsShell eyebrow="CRM / Beneficiari" title="Beneficiari și relații comerciale" subtitle="Beneficiari, contacte, proiecte active și valoare deschisă.">
      <section className="grid gap-4 xl:grid-cols-3">
        {beneficiaries.map((beneficiary) => (
          <WorkOsCard key={beneficiary.id} title={beneficiary.name} subtitle={beneficiary.contact}>
            <div className="flex flex-wrap gap-2"><WorkOsBadge value={beneficiary.type} /><WorkOsBadge value={beneficiary.health} /></div>
            <p className="mt-4 text-sm text-slate-600">Valoare deschisă: <b>€{beneficiary.openValueEur.toLocaleString("ro-RO")}</b></p>
            <p className="mt-2 text-sm text-slate-600">Proiecte: {beneficiary.projects.join(", ")}</p>
          </WorkOsCard>
        ))}
      </section>
    </WorkOsShell>
  );
}
