"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CalendarDays, CheckCircle2, ClipboardPlus, Flag, FolderKanban, Tag, UserRound, X } from "lucide-react";
import { projects, users, type Priority, type TaskStatus } from "@servelect/shared";
import { useMemo, useState, type ElementType, type ReactNode } from "react";
import { useWorkOsStore, type TaskDraft } from "@/lib/store";

const statuses: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
const priorities: Priority[] = ["Scăzut", "Mediu", "Ridicat", "Urgent", "Critic"];

function getTodayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function TaskCreateModal() {
  const { taskCreateOpen, setTaskCreateOpen, createTask, projects: liveProjects } = useWorkOsStore();
  const projectOptions = liveProjects.length ? liveProjects : projects;
  const [tagText, setTagText] = useState("teren, proiect");
  const [draft, setDraft] = useState<TaskDraft>({
    title: "",
    description: "",
    projectId: projectOptions[0]?.id ?? "p1",
    status: "De făcut",
    priority: "Mediu",
    assigneeId: users[0]?.id ?? "u1",
    startDate: getTodayPlus(0),
    dueDate: getTodayPlus(3),
    estimateHours: 4,
    tags: ["teren", "proiect"]
  });

  const isValid = useMemo(() => draft.title.trim().length >= 3 && draft.description.trim().length >= 8, [draft.description, draft.title]);

  const update = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const submit = () => {
    if (!isValid) return;
    createTask({ ...draft, tags: tagText.split(",").map((tag) => tag.trim()).filter(Boolean) });
    setDraft((current) => ({ ...current, title: "", description: "", status: "De făcut", priority: "Mediu", estimateHours: 4 }));
  };

  return (
    <Dialog.Root open={taskCreateOpen} onOpenChange={setTaskCreateOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl outline-none">
          <div className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/15"><ClipboardPlus className="h-3.5 w-3.5" /> TASK CORE v0.2</div>
                <Dialog.Title className="mt-3 text-2xl font-black tracking-tight">Creează task nou</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-300">Task legat de proiect, responsabil, deadline, estimare și taguri. Se salvează local în browser.</Dialog.Description>
              </div>
              <Dialog.Close className="rounded-2xl bg-white/10 p-2 text-white hover:bg-white/15"><X className="h-5 w-5" /></Dialog.Close>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            <Field icon={ClipboardPlus} label="Titlu task" className="md:col-span-2">
              <input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="ex: Verificare string MPPT 2" className="field-input" />
            </Field>
            <Field icon={FolderKanban} label="Proiect">
              <select value={draft.projectId} onChange={(event) => update("projectId", event.target.value)} className="field-input">
                {projectOptions.map((project) => <option key={project.id} value={project.id}>{project.code} · {project.name}</option>)}
              </select>
            </Field>
            <Field icon={UserRound} label="Responsabil">
              <select value={draft.assigneeId} onChange={(event) => update("assigneeId", event.target.value)} className="field-input">
                {users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.title}</option>)}
              </select>
            </Field>
            <Field icon={CheckCircle2} label="Status">
              <select value={draft.status} onChange={(event) => update("status", event.target.value as TaskStatus)} className="field-input">
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </Field>
            <Field icon={Flag} label="Prioritate">
              <select value={draft.priority} onChange={(event) => update("priority", event.target.value as Priority)} className="field-input">
                {priorities.map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </Field>
            <Field icon={CalendarDays} label="Start">
              <input type="date" value={draft.startDate} onChange={(event) => update("startDate", event.target.value)} className="field-input" />
            </Field>
            <Field icon={CalendarDays} label="Scadență">
              <input type="date" value={draft.dueDate} onChange={(event) => update("dueDate", event.target.value)} className="field-input" />
            </Field>
            <Field icon={Tag} label="Estimare ore">
              <input type="number" min={0.5} step={0.5} value={draft.estimateHours} onChange={(event) => update("estimateHours", Number(event.target.value))} className="field-input" />
            </Field>
            <Field icon={Tag} label="Taguri">
              <input value={tagText} onChange={(event) => setTagText(event.target.value)} placeholder="IoT, teren, QA" className="field-input" />
            </Field>
            <Field icon={ClipboardPlus} label="Descriere" className="md:col-span-2">
              <textarea value={draft.description} onChange={(event) => update("description", event.target.value)} placeholder="Descrie clar ce trebuie făcut, criteriul de finalizare și contextul proiectului..." className="field-input min-h-28 resize-none" />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            <Dialog.Close className="btn-secondary">Anulează</Dialog.Close>
            <button onClick={submit} disabled={!isValid} className="btn-primary disabled:cursor-not-allowed disabled:bg-slate-300">Creează task</button>
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
