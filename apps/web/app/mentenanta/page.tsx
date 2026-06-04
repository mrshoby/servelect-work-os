import { CalendarDays, MapPinned, Plus, Ticket, Users, Wrench } from "lucide-react";
import { PageHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { MaintenancePanel } from "@/components/modules/ModulePanels";

export default function MaintenancePage() {
  return <><PageHeader title="Mentenanță, tickete & dispatch" subtitle="Operare, dispatch tehnicieni și urmărire intervenții în timp real."><button className="btn-primary"><Plus className="h-4 w-4"/> Ticket nou</button></PageHeader><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"><KpiCard icon={Ticket} label="Tickete active" value="84" sub="din 126 total" trend="↓ 8% față de ieri"/><KpiCard icon={Wrench} label="SLA mediu" value="92.4%" sub="respectat" trend="↑ 4.6%"/><KpiCard icon={Users} label="Tehnicieni pe teren" value="18 / 24" sub="75% disponibilitate" trend="6 activi acum"/><KpiCard icon={CalendarDays} label="Revizii luna aceasta" value="47" sub="din 92 planificate" trend="↑ 11%" tone="orange"/><KpiCard icon={MapPinned} label="Intervenții azi" value="32" sub="în desfășurare" trend="14 finalizate" tone="blue"/></div><div className="mt-4"><MaintenancePanel /></div></>;
}
