"use client";

import { AlertTriangle, ArrowRight, CalendarCheck, CheckCircle2, CloudSun, FileText, MapPin, QrCode, ShieldAlert, UserRound, Zap } from "lucide-react";
import { approvals, auditCases, energyInstallations, equipments, fundingCases, inventory, iotAlerts, maintenanceTickets, projects, users } from "@servelect/shared";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EnergyChart } from "@/components/charts/EnergyChart";

export function SimpleMap({ mode = "projects" }: { mode?: "projects" | "dispatch" | "iot" }) {
  const pins = mode === "dispatch" ? [
    [22, 34, "3", "red"], [45, 52, "4", "green"], [62, 26, "2", "orange"], [78, 60, "1", "blue"]
  ] : [
    [20, 40, "12", "green"], [42, 58, "5", "green"], [58, 28, "3", "orange"], [76, 45, "2", "red"], [70, 68, "18", "green"]
  ];
  return (
    <div className="map-grid relative h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-50">
      <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 30% 40%, rgba(11,143,67,.22), transparent 12rem), radial-gradient(circle at 70% 30%, rgba(37,99,235,.14), transparent 10rem)" }} />
      <div className="absolute left-[12%] top-[52%] h-1 w-[66%] rotate-[-18deg] rounded-full border-t-2 border-dashed border-servelect-600/70" />
      {pins.map(([x, y, label, color]) => (
        <div key={`${x}-${y}`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
          <div className={`${color === "red" ? "bg-red-500" : color === "orange" ? "bg-amber-500" : color === "blue" ? "bg-blue-600" : "bg-servelect-600"} flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-sm font-extrabold text-white shadow-xl`}>{label}</div>
        </div>
      ))}
      <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 p-3 shadow-card backdrop-blur"><div className="flex items-center gap-2 text-sm font-bold"><MapPin className="h-4 w-4 text-servelect-600" /> Centru de Operare</div><div className="text-xs text-red-500">2 alerte</div></div>
    </div>
  );
}

export function IoTPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
      <Card>
        <CardHeader title="Producție în timp real" subtitle="MW live, estimare și comparație cu ziua anterioară" />
        <div className="p-5"><EnergyChart /></div>
      </Card>
      <Card>
        <CardHeader title="Harta instalațiilor" action={<Badge tone="green">Online 72</Badge>} />
        <div className="p-5"><SimpleMap mode="iot" /></div>
      </Card>
      <Card>
        <CardHeader title="Stare invertoare" action={<a className="text-xs font-bold text-servelect-600">Vezi toate</a>} />
        <div className="divide-y divide-slate-100 p-5 pt-0">
          {["Huawei", "Fronius", "SolarEdge", "Sungrow", "Growatt"].map((brand, index) => (
            <div key={brand} className="grid grid-cols-[1fr_80px_80px_80px] items-center gap-3 py-3 text-sm">
              <b>{brand}</b><span className="text-slate-500">{92 - index * 12} online</span><span className="text-amber-600">{index + 1} atenție</span><span className="font-semibold text-slate-700">{(98.7 - index).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="Alerte & acțiuni recomandate" />
        <div className="space-y-3 p-5 pt-0">
          {iotAlerts.map((alert) => (
            <div key={alert.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start gap-3"><ShieldAlert className={alert.severity === "Critică" ? "h-5 w-5 text-red-500" : "h-5 w-5 text-amber-500"}/><div className="flex-1"><div className="font-bold">{alert.title}</div><div className="text-xs text-slate-500">{alert.recommendedAction}</div></div><Badge tone={alert.severity === "Critică" ? "red" : "orange"}>{alert.severity}</Badge></div>
              <button className="mt-3 btn-secondary w-full justify-between">Generează task / ticket <ArrowRight className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function EquipmentPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr_.7fr]">
      <Card>
        <CardHeader title="Catalog echipamente" subtitle="Panouri, invertoare, baterii, structuri, protecții" />
        <div className="divide-y divide-slate-100 p-5 pt-0">
          {equipments.map((eq) => (
            <div key={eq.id} className="flex items-center gap-4 py-4">
              <div className="h-14 w-10 rounded-lg bg-gradient-to-b from-slate-900 to-slate-600" />
              <div className="flex-1"><div className="font-bold">{eq.name}</div><div className="text-xs text-slate-500">{eq.power} · {eq.category} · {eq.manufacturer}</div></div>
              <Badge tone="green">În stoc</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="Scanare QR / Cod de bare" />
        <div className="p-5">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-servelect-600/30 to-transparent" />
            <div className="relative rounded-xl bg-white p-5 text-slate-900 shadow-xl">
              <div className="flex items-center gap-4"><QrCode className="h-16 w-16" /><div><div className="font-extrabold">Jinko Solar Tiger Neo 540W</div><div className="text-xs text-slate-500">S/N: JKS40N72HL4BDV12345678</div></div></div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="mr-2 inline h-4 w-4" /> Scanare reușită. Echipamentul este disponibil în Depozit Central Cluj.</div>
        </div>
      </Card>
      <Card>
        <CardHeader title="Cozi de activități" />
        <div className="space-y-3 p-5 pt-0">
          {[
            ["Rezervări în așteptare", "12", "orange"],
            ["Acțiuni de achiziție", "8", "blue"],
            ["Garanții expiră", "37", "red"],
            ["Recepții în așteptare", "14", "green"]
          ].map(([label, count, tone]) => <div key={label} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm"><span>{label}</span><Badge tone={tone as never}>{count}</Badge></div>)}
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <CardHeader title="Trasabilitate seriale" />
        <div className="overflow-x-auto p-5 pt-0"><table className="min-w-full text-sm"><tbody>{inventory.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="py-3 font-mono text-xs text-servelect-700">{item.serialNumber}</td><td>{item.status}</td><td>{item.warehouse}</td><td>{item.locationCode}</td></tr>)}</tbody></table></div>
      </Card>
      <Card><CardHeader title="Piese & consumabile" /><div className="space-y-3 p-5 pt-0">{["MC4 Conectori", "SPD DC 1000V", "Siguranțe 15A", "Ventilatoare invertor", "Coliere cablu"].map((x, i) => <div key={x} className="flex justify-between text-sm"><span>{x}</span><b>{[48,22,30,12,150][i]} buc.</b></div>)}</div></Card>
    </div>
  );
}

export function MaintenancePanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.25fr_.85fr_.65fr]">
      <Card className="xl:row-span-2"><CardHeader title="Hartă & dispatch live" action={<Badge tone="green">Live</Badge>} /><div className="p-5"><SimpleMap mode="dispatch" /></div></Card>
      <Card><CardHeader title="Coada tickete" action={<Badge tone="green">84 active</Badge>} /><div className="space-y-3 p-5 pt-0">{maintenanceTickets.map((ticket) => <div key={ticket.id} className="rounded-2xl border-l-4 border-red-500 bg-white p-4 shadow-sm"><div className="flex justify-between"><b>{ticket.id.toUpperCase()}</b><Badge tone={ticket.severity === "Critic" ? "red" : "orange"}>{ticket.severity}</Badge></div><div className="mt-1 text-sm text-slate-700">{ticket.title}</div><div className="mt-2 text-xs text-red-500">SLA {ticket.slaDueAt.slice(11,16)} · ETA {ticket.etaMinutes} min</div></div>)}</div></Card>
      <Card><CardHeader title="Alerte & escaladări" /><div className="space-y-3 p-5 pt-0">{["SLA depășit", "Echipament offline", "Interval revizie depășit"].map((x, i) => <div key={x} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500" />{x}</span><span className="text-red-500">De {i+1}h</span></div>)}</div></Card>
      <Card><CardHeader title="Revizii periodice & checklist" /><div className="divide-y divide-slate-100 p-5 pt-0">{projects.slice(0,4).map((project) => <div key={project.id} className="flex justify-between py-3 text-sm"><span><b>{project.code}</b><br/><span className="text-slate-500">{project.location}</span></span><Badge tone="green">La termen</Badge></div>)}</div></Card>
      <Card><CardHeader title="Intervenții la fața locului" /><div className="p-5 pt-0"><div className="grid grid-cols-3 gap-2">{[1,2,3].map((i) => <div key={i} className="h-20 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300" />)}</div><div className="mt-4 rounded-xl border border-slate-200 p-3"><div className="text-sm font-bold">Semnătură client</div><div className="mt-2 font-serif text-2xl">Marius Pop</div></div></div></Card>
    </div>
  );
}

export function FinancePanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr_.7fr]">
      <Card><CardHeader title="Pipeline finanțări" action={<a className="text-xs font-bold text-servelect-600">Vezi pipeline</a>} /><div className="divide-y divide-slate-100 p-5 pt-0">{fundingCases.map((fc) => <div key={fc.id} className="grid grid-cols-[100px_1fr_100px] items-center gap-4 py-3 text-sm"><Badge tone="blue">{fc.program}</Badge><span>{projects.find((p) => p.id === fc.projectId)?.code} · {fc.stage}</span><ProgressBar value={fc.progress}/></div>)}</div></Card>
      <Card><CardHeader title="Progres audituri energetice" /><div className="space-y-4 p-5 pt-0">{auditCases.map((audit) => <div key={audit.id}><div className="mb-1 flex justify-between text-sm"><b>{audit.code}</b><span>{audit.progress}%</span></div><ProgressBar value={audit.progress}/><div className="mt-1 text-xs text-slate-500">{audit.clientName} · scadență {audit.deadline}</div></div>)}</div></Card>
      <Card><CardHeader title="Calendar conformitate" /><div className="grid grid-cols-7 gap-1 p-5 pt-0 text-center text-xs">{"LMMJVSD".split("").map((d) => <b key={d} className="py-2 text-slate-400">{d}</b>)}{Array.from({ length: 35 }).map((_, i) => <div key={i} className={`rounded-lg py-2 ${i === 16 ? "bg-servelect-600 text-white" : i % 7 === 1 ? "bg-amber-50 text-amber-700" : "bg-slate-50"}`}>{i+1}</div>)}</div></Card>
      <Card><CardHeader title="Documente recente" /><List items={["Memoriu tehnic PV.pdf", "Audit energetic_final.pdf", "Plan măsuri eficiență.xlsx", "Certificat urbanism.pdf"]} icon={FileText}/></Card>
      <Card><CardHeader title="ESG & decarbonizare" /><div className="grid grid-cols-3 gap-3 p-5 pt-0"><Metric label="CO₂e" value="2.654"/><Metric label="Intensitate" value="0,38"/><Metric label="Net Zero" value="56%"/></div></Card>
      <Card><CardHeader title="Anexe lipsă / Obligatorii" /><List items={["Certificat urbanism", "Extras CF / CF", "Acord de mediu", "Deviz general"]} icon={AlertTriangle}/></Card>
    </div>
  );
}

export function HRPanel() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr_.8fr]">
      <Card className="xl:col-span-1"><CardHeader title="Hartă încărcare resurse" subtitle="Săptămâna curentă" /><div className="overflow-x-auto p-5 pt-0"><table className="min-w-full text-sm"><tbody>{users.map((u, row) => <tr key={u.id} className="border-b border-slate-100"><td className="py-2 font-semibold">{u.name}</td>{[80,90,100,110,70].map((v, i) => <td key={i} className={`px-3 py-2 text-center font-bold ${u.workload > 100 ? "bg-red-100 text-red-600" : u.workload > 80 ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{Math.max(50, Math.min(130, u.workload + i * 5 - row * 4))}%</td>)}</tr>)}</tbody></table></div></Card>
      <Card><CardHeader title="Matrice echipă & certificări" /><div className="divide-y divide-slate-100 p-5 pt-0">{users.map((u) => <div key={u.id} className="grid grid-cols-[1fr_60px_60px_90px] items-center gap-3 py-3 text-sm"><span className="font-semibold">{u.name}<br/><span className="text-xs font-normal text-slate-500">{u.title}</span></span><CheckCircle2 className="h-4 w-4 text-servelect-600"/><CheckCircle2 className="h-4 w-4 text-servelect-600"/><span className="text-xs text-slate-500">{u.certifications?.[0] ?? "—"}</span></div>)}</div></Card>
      <Card><CardHeader title="Pontaj & prezență" /><div className="p-5 pt-0"><div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[14px] border-servelect-600 text-center"><div><b className="text-3xl">82%</b><br/><span className="text-xs text-slate-500">Completat</span></div></div><div className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><span>Ore planificate</span><b>1.240 h</b></div><div className="flex justify-between"><span>Ore înregistrate</span><b>1.021 h</b></div><div className="flex justify-between"><span>Absențe</span><b>3%</b></div></div></div></Card>
      <Card><CardHeader title="Activitate audit" /><List items={["Andrei a modificat proiectul P-2024-0187", "Ioana a încărcat raport verificare.pdf", "Backup automat finalizat", "Vlad a actualizat status echipament"]} icon={CheckCircle2}/></Card>
      <Card><CardHeader title="Roluri & permisiuni RBAC" /><div className="space-y-3 p-5 pt-0">{["Administrator", "Manager", "Tehnician", "Client"].map((r, i) => <div key={r} className="flex justify-between rounded-xl border border-slate-200 p-3 text-sm"><span>{r}</span><b>{[5,8,22,7][i]} utilizatori</b></div>)}</div></Card>
      <Card><CardHeader title="Certificări ce expiră" /><List items={["Mihai Ionescu — ANRE Grad II", "George Stan — SSM", "Alexandra Rusu — PSI", "Cristian Dobre — NIVEL 2"]} icon={CalendarCheck}/></Card>
    </div>
  );
}

function List({ items, icon: Icon }: { items: string[]; icon: typeof Zap }) {
  return <div className="divide-y divide-slate-100 p-5 pt-0">{items.map((item) => <div key={item} className="flex items-center gap-3 py-3 text-sm"><Icon className="h-4 w-4 text-servelect-600" /><span>{item}</span></div>)}</div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 p-4 text-center"><div className="text-xs text-slate-500">{label}</div><div className="mt-2 text-2xl font-extrabold">{value}</div></div>;
}
