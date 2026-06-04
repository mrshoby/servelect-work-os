"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Banknote, Building2, CalendarDays, FolderPlus, MapPin, RadioTower, ShieldAlert, UserRound, X } from "lucide-react";
import { users, type ProjectHealth, type ProjectPhase } from "@servelect/shared";
import { useState, type ElementType, type ReactNode } from "react";
import { useWorkOsStore, type ProjectDraft } from "@/lib/store";

const phases: ProjectPhase[] = ["Planificat", "Proiectare", "Avizare", "Montaj", "Testare", "PIF", "În desfășurare", "Finalizat", "Blocat"];
const healths: ProjectHealth[] = ["Bun", "Atenție", "Risc", "Critic"];

function getTodayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function ProjectCreateModal() {
  const { projectCreateOpen, setProjectCreateOpen, createProject } = useWorkOsStore();
  const [draft, setDraft] = useState<ProjectDraft>({
    name: "",
    clientName: "",
    location: "",
    powerKwp: 9.6,
    phase: "Planificat",
    health: "Bun",
    ownerId: users[0]?.id ?? "u1",
    deadline: getTodayPlus(30),
    budgetRon: 50000
  });

  const update = <K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const isValid = draft.name.trim().length >= 3 && draft.clientName.trim().length >= 3 && draft.location.trim().length >= 2;

  const submit = () => {
    if (!isValid) return;
    createProject(draft);
    setDraft((current) => ({ ...current, name: "", clientName: "", location: "", phase: "Planificat", health: "Bun" }));
  };

  return (
    <Dialog.Root open={projectCreateOpen} onOpenChange={setProjectCreateOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl outline-none">
          <div className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/15"><FolderPlus className="h-3.5 w-3.5" /> PROJECT CORE v0.2</div>
                <Dialog.Title className="mt-3 text-2xl font-black tracking-tight">Creează proiect nou</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-300">Proiectul devine hub pentru taskuri, timeline, documente, risc și buget.</Dialog.Description>
              </div>
              <Dialog.Close className="rounded-2xl bg-white/10 p-2 text-white hover:bg-white/15"><X className="h-5 w-5" /></Dialog.Close>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            <Field icon={FolderPlus} label="Nume proiect">
              <input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="ex: Sistem FV 40 kWp" className="field-input" />
            </Field>
            <Field icon={Building2} label="Client">
              <input value={draft.clientName} onChange={(event) => update("clientName", event.target.value)} placeholder="ex: RetailMax SRL" className="field-input" />
            </Field>
            <Field icon={MapPin} label="Locație">
              <input value={draft.location} onChange={(event) => update("location", event.target.value)} placeholder="ex: Cluj-Napoca" className="field-input" />
            </Field>
            <Field icon={RadioTower} label="Putere kWp">
              <input type="number" min={0} step={0.1} value={draft.powerKwp} onChange={(event) => update("powerKwp", Number(event.target.value))} className="field-input" />
            </Field>
            <Field icon={ShieldAlert} label="Fază">
              <select value={draft.phase} onChange={(event) => update("phase", event.target.value as ProjectPhase)} className="field-input">{phases.map((phase) => <option key={phase}>{phase}</option>)}</select>
            </Field>
            <Field icon={ShieldAlert} label="Sănătate">
              <select value={draft.health} onChange={(event) => update("health", event.target.value as ProjectHealth)} className="field-input">{healths.map((health) => <option key={health}>{health}</option>)}</select>
            </Field>
            <Field icon={UserRound} label="Owner">
              <select value={draft.ownerId} onChange={(event) => update("ownerId", event.target.value)} className="field-input">{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
            </Field>
            <Field icon={CalendarDays} label="Deadline">
              <input type="date" value={draft.deadline} onChange={(event) => update("deadline", event.target.value)} className="field-input" />
            </Field>
            <Field icon={Banknote} label="Buget RON" className="md:col-span-2">
              <input type="number" min={0} step={1000} value={draft.budgetRon} onChange={(event) => update("budgetRon", Number(event.target.value))} className="field-input" />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            <Dialog.Close className="btn-secondary">Anulează</Dialog.Close>
            <button onClick={submit} disabled={!isValid} className="btn-primary disabled:cursor-not-allowed disabled:bg-slate-300">Creează proiect</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({ icon: Icon, label, children, className }: { icon: ElementType; label: string; children: ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-slate-400"><Icon className="h-3.5 w-3.5" /> {label}</span>
      {children}
    </label>
  );
}
