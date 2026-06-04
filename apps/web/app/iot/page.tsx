import { AlertTriangle, BatteryCharging, CloudSun, Gauge, PlugZap, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { IoTPanel } from "@/components/modules/ModulePanels";

export default function IoTPage() {
  return <><PageHeader title="Monitorizare energie IoT live" subtitle="Vizualizare în timp real a producției, stării instalațiilor și alarmelor conectate la taskuri." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6"><KpiCard icon={Zap} label="Putere live totală" value="8.42 MW" sub="acum" trend="↑ 12% față de 10 min"/><KpiCard icon={BatteryCharging} label="Energie produsă azi" value="42.85 MWh" sub="total" trend="↑ 8.7% față de ieri"/><KpiCard icon={Gauge} label="Randament mediu" value="1.38" sub="kWh/kWp" trend="↑ 6.3%"/><KpiCard icon={PlugZap} label="Instalații online" value="152" sub="din 182" trend="↑ 6"/><KpiCard icon={CloudSun} label="CO₂ evitat azi" value="28.6 t" sub="estimat" trend="↑ 11%"/><KpiCard icon={AlertTriangle} label="Alarme active" value="7" sub="2 critice" trend="5 atenționări" tone="red"/></div><div className="mt-4"><IoTPanel /></div></>;
}
