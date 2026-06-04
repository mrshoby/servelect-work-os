"use client";

import { AlertTriangle, Boxes, DollarSign, PackageCheck, Plus, Warehouse } from "lucide-react";
import { PageHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { EquipmentPanel } from "@/components/modules/ModulePanels";

export default function EquipmentPage() {
  return <><PageHeader title="Operațiuni, echipamente & logistică" subtitle="Catalog, depozite, trasabilitate, achiziții, garanții și taskuri operaționale."><button className="btn-primary"><Plus className="h-4 w-4"/> Echipament nou</button></PageHeader><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"><KpiCard icon={Boxes} label="Echipamente totale" value="2.846" sub="în catalog" trend="↑ 18%"/><KpiCard icon={Warehouse} label="În stoc" value="1.124" sub="disponibile" trend="39.5% din total"/><KpiCard icon={PackageCheck} label="Alocate proiectelor" value="1.402" sub="49.3% din total" trend="↑ 9%" tone="orange"/><KpiCard icon={AlertTriangle} label="Garanții expiră" value="37" sub="30 zile" trend="↓ 12%" tone="red"/><KpiCard icon={DollarSign} label="Valoare stoc" value="4,82 mil. RON" sub="curent" trend="↑ 9%"/></div><div className="mt-4"><EquipmentPanel /></div></>;
}

