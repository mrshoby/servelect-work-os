"use client";

import { Award, Clock, Gauge, Plus, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { HRPanel } from "@/components/modules/ModulePanels";

export default function HRAdminPage() {
  return (
    <>
      <PageHeader title="HR, Resurse & Administrare" subtitle="Workload, pontaj, certificări, RBAC și administrare platformă.">
        <button className="btn-primary"><Plus className="h-4 w-4"/> Adaugă utilizator</button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard icon={Users} label="Membri echipă" value="28" sub="din 35 activi" trend="↑ 12%" />
        <KpiCard icon={Gauge} label="Încărcare medie" value="81%" sub="optimum" trend="↑ 5pp" tone="orange" />
        <KpiCard icon={Award} label="Certificări active" value="142" sub="din 160 totale" trend="↑ 10%" tone="blue" />
        <KpiCard icon={Clock} label="Ore înregistrate" value="1.021 h" sub="luna curentă" trend="↑ 8%" />
        <KpiCard icon={ShieldCheck} label="Rată utilizare" value="78%" sub="medie globală" trend="↑ 6pp" />
      </div>
      <div className="mt-4"><HRPanel /></div>
    </>
  );
}
