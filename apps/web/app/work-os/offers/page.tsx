import { WorkOsBadge, WorkOsCard, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { offers } from "@/lib/enterprise/work-os-core-modules";

export default function OffersPage() {
  return (
    <WorkOsShell eyebrow="Ofertare" title="Oferte și rezervări estimative" subtitle="Ofertele pot rezerva estimativ materiale fără să afecteze stocul real până la conversie proiect.">
      <section className="grid gap-4 xl:grid-cols-2">
        {offers.map((offer) => (
          <WorkOsCard key={offer.id} title={`${offer.number} — ${offer.title}`} subtitle={`Beneficiar: ${offer.beneficiaryId}`}>
            <div className="flex flex-wrap gap-2"><WorkOsBadge value={offer.status} /><WorkOsBadge value={`€${offer.valueEur.toLocaleString("ro-RO")}`} /></div>
            <p className="mt-4 text-sm text-slate-600">Materiale rezervate estimativ: {offer.reservedMaterials.join(", ")}</p>
            <p className="mt-2 text-sm font-semibold text-emerald-700">{offer.nextStep}</p>
          </WorkOsCard>
        ))}
      </section>
    </WorkOsShell>
  );
}
