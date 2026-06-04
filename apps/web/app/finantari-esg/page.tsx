"use client";

import { AlertTriangle, BadgeEuro, ClipboardCheck, FileText, Leaf, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { FinancePanel } from "@/components/modules/ModulePanels";

export default function FinanceESGPage() {
  return (
    <>
      <PageHeader title="Finanțări, Audituri & ESG" subtitle="Dosare, audituri, ESG și conformitate, toate cu owners, scadențe, documente și aprobări.">
        <button className="btn-primary"><Plus className="h-4 w-4"/> Dosar nou</button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard icon={FileText} label="Dosare active" value="24" sub="din 37 total" trend="↑ 14%" />
        <KpiCard icon={BadgeEuro} label="Valoare eligibilă" value="12,45 mil. RON" sub="din 28,80 mil." trend="↑ 9%" />
        <KpiCard icon={ClipboardCheck} label="Rată succes" value="68%" sub="media dosare" trend="↑ 12pp" />
        <KpiCard icon={ClipboardCheck} label="Audituri" value="18" sub="în derulare" trend="Vezi audituri" tone="blue" />
        <KpiCard icon={Leaf} label="CO₂ evitat" value="2.654 t" sub="aport estimat" trend="↑ 18%" />
        <KpiCard icon={AlertTriangle} label="Neconformități" value="7" sub="deschise" trend="acțiuni în lucru" tone="red" />
      </div>
      <div className="mt-4"><FinancePanel /></div>
    </>
  );
}
