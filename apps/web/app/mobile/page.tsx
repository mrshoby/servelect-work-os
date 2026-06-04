import { Bell, CalendarDays, Camera, CheckCircle2, Home, MapPin, Plus, QrCode, Signature, UserRound } from "lucide-react";
import { PageHeader, Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function MobilePreviewPage() {
  return (
    <>
      <PageHeader title="Mobile app preview" subtitle="Ecrane mobile responsive pentru Home, My Work, Field Technician, Dispatch și Client Portal." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Phone title="Instalare sistem FV" subtitle="Field Technician">
          <div className="rounded-2xl bg-slate-950 p-4 text-white"><div className="flex justify-between"><b>Check-in & locație</b><Badge tone="green">GPS OK</Badge></div><p className="mt-2 text-sm text-slate-300">Geofencing: în perimetru · acuratețe 3.8 m</p></div>
          <Tabs labels={["Checklist", "Echipamente", "Activități", "Documente"]} />
          <Steps items={["Verificare structură de prindere", "Montaj panouri fotovoltaice", "Scanare QR & înregistrare serie", "Verificare cabluri DC", "Conectare invertor", "Semnătură client"]} />
          <button className="btn-primary w-full">PAS URMĂTOR</button>
        </Phone>
        <Phone title="Hartă & dispatch" subtitle="Management operațional">
          <div className="flex gap-2 overflow-x-auto">{["Toate", "Critice", "Urgente", "Programate"].map((x,i)=><Badge key={x} tone={i===0?"green":i===1?"red":"orange"}>{x}</Badge>)}</div>
          <div className="map-grid relative h-72 rounded-3xl bg-emerald-50"><div className="absolute left-[42%] top-[38%] rounded-2xl bg-white p-4 shadow-card"><b>P-2024-0187</b><p className="text-xs text-slate-500">ETA: 18 min</p></div></div>
          <button className="btn-primary w-full">ASIGNEAZĂ INTERVENȚIA</button>
        </Phone>
        <Phone title="My Work" subtitle="Task inbox mobil">
          <div className="grid grid-cols-3 gap-2">{["Azi 6", "Urgente 5", "Overdue 2"].map((x,i)=><div key={x} className="rounded-2xl border border-slate-200 p-3 text-center"><b>{x}</b></div>)}</div>
          <Steps items={["Verificare amplasament", "Montaj structură", "Racordare AC", "Configurare invertor", "Testare & PIF"]} />
          <div className="grid grid-cols-5 gap-3 border-t border-slate-100 pt-3 text-center text-xs"><Home/><CheckCircle2/><Plus/><Bell/><UserRound/></div>
        </Phone>
      </div>
    </>
  );
}

function Phone({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <Card className="mx-auto max-w-[430px] rounded-[2.5rem] border-8 border-slate-900 bg-white p-3"><div className="flex items-center justify-between px-3 py-2"><span className="font-bold">09:41</span><span className="h-6 w-24 rounded-full bg-slate-950"/></div><div className="space-y-4 p-3"><div><h2 className="text-2xl font-extrabold">{title}</h2><p className="text-sm text-slate-500">{subtitle}</p></div>{children}</div></Card>;
}
function Tabs({ labels }: { labels: string[] }) { return <div className="flex gap-2 overflow-x-auto border-b border-slate-100 pb-2">{labels.map((x,i)=><span key={x} className={`whitespace-nowrap px-2 py-1 text-xs font-bold ${i===0?"border-b-2 border-servelect-600 text-servelect-700":"text-slate-500"}`}>{x}</span>)}</div>; }
function Steps({ items }: { items: string[] }) { return <div className="space-y-2">{items.map((x,i)=><div key={x} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${i<3?"bg-servelect-600 text-white":"bg-slate-100 text-slate-600"}`}>{i+1}</span><b className="text-sm">{x}</b>{i<3&&<CheckCircle2 className="ml-auto h-5 w-5 text-servelect-600"/>}</div>)}</div>; }
