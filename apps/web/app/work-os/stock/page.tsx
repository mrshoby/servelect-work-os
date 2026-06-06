import { WorkOsBadge, WorkOsCard, WorkOsProgress, WorkOsShell } from "@/components/work-os/WorkOsBlocks";
import { stock } from "@/lib/enterprise/work-os-core-modules";

export default function StockPage() {
  return (
    <WorkOsShell eyebrow="Stocuri & Materiale" title="Stocuri, rezervări și praguri minime" subtitle="Rezervări pentru proiecte fără consum real automat, cu alerte de prag și recomandări de comandă.">
      <section className="grid gap-4 xl:grid-cols-2">
        {stock.map((item) => {
          const available = item.quantity - item.reserved;
          const coverage = Math.round((available / Math.max(item.minimum, 1)) * 100);
          return (
            <WorkOsCard key={item.id} title={`${item.sku} — ${item.name}`} subtitle={`${item.category} · ${item.warehouse}`}>
              <div className="flex flex-wrap gap-2"><WorkOsBadge value={item.status} /><WorkOsBadge value={item.unit} /></div>
              <div className="mt-4 grid gap-3 md:grid-cols-4 text-sm text-slate-600">
                <div><b>Total</b><br />{item.quantity}</div><div><b>Rezervat</b><br />{item.reserved}</div><div><b>Disponibil</b><br />{available}</div><div><b>Minim</b><br />{item.minimum}</div>
              </div>
              <div className="mt-4"><WorkOsProgress value={Math.min(100, coverage)} /></div>
              <p className="mt-3 text-sm text-slate-600">{item.reorderAdvice}</p>
            </WorkOsCard>
          );
        })}
      </section>
    </WorkOsShell>
  );
}
