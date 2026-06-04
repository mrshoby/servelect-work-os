"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Copy,
  FileUp,
  MessageSquare,
  Paperclip,
  Play,
  Plus,
  Save,
  Send,
  Trash2,
  X
} from "lucide-react";
import { priorityTone, statusTone, users, type Priority, type TaskStatus } from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkOsStore } from "@/lib/store";
import { useEffect, useState } from "react";

const statuses: TaskStatus[] = ["Backlog", "De făcut", "În lucru", "Review / QA", "Blocat", "Finalizat", "Anulat"];
const priorities: Priority[] = ["Scăzut", "Mediu", "Ridicat", "Urgent", "Critic"];

export function TaskDrawer() {
  const {
    tasks,
    selectedTaskId,
    setSelectedTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    duplicateTask,
    toggleSubtask,
    addSubtask,
    addComment,
    startTimer,
    stopTimer,
    timerTaskId
  } = useWorkOsStore();
  const task = tasks.find((item) => item.id === selectedTaskId);
  const open = Boolean(task);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("De făcut");
  const [priority, setPriority] = useState<Priority>("Mediu");
  const [assigneeId, setAssigneeId] = useState("u1");
  const [dueDate, setDueDate] = useState("");
  const [estimateHours, setEstimateHours] = useState(0);
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setAssigneeId(task.assigneeId);
    setDueDate(task.dueDate);
    setEstimateHours(task.estimateHours);
    setNewSubtask("");
    setNewComment("");
  }, [task]);

  if (!task) {
    return (
      <Dialog.Root open={open} onOpenChange={(next) => !next && setSelectedTask(undefined)}>
        <Dialog.Portal />
      </Dialog.Root>
    );
  }

  const completion = task.subtasks.length ? Math.round((task.subtasks.filter((subtask) => subtask.done).length / task.subtasks.length) * 100) : Math.round((task.trackedHours / Math.max(task.estimateHours, 1)) * 100);

  const saveChanges = () => {
    const assigneeName = users.find((user) => user.id === assigneeId)?.name ?? task.assigneeName;
    updateTask(task.id, { title, description, status, priority, assigneeId, assigneeName, dueDate, estimateHours: Number(estimateHours) || 1 });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && setSelectedTask(undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-screen w-full max-w-[860px] overflow-y-auto bg-white shadow-2xl outline-none">
          <div className="flex min-h-full flex-col">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
              <div className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                    <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
                    <span className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{task.projectCode}</span>
                  </div>
                  <Dialog.Title className="mt-2 text-2xl font-black tracking-tight text-slate-950">{task.title}</Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-slate-500">Task detail drawer cu editare, checklist, comentarii, timer și audit log.</Dialog.Description>
                </div>
                <Dialog.Close className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><X className="h-5 w-5" /></Dialog.Close>
              </div>
              <div className="grid grid-cols-4 border-t border-slate-100 bg-slate-50 text-center text-xs font-black uppercase tracking-[.12em] text-slate-500">
                <Metric label="Status" value={task.status} />
                <Metric label="Progres" value={`${completion}%`} />
                <Metric label="Pontat" value={`${task.trackedHours}h`} />
                <Metric label="Deadline" value={task.dueDate} />
              </div>
            </div>

            <div className="grid flex-1 gap-0 lg:grid-cols-[1fr_290px]">
              <main className="space-y-6 px-6 py-5">
                <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-4 text-sm font-black text-slate-950">Editare rapidă</h3>
                  <div className="space-y-4">
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[.14em] text-slate-400">Titlu</span>
                      <input value={title} onChange={(event) => setTitle(event.target.value)} className="field-input bg-white" />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[.14em] text-slate-400">Descriere</span>
                      <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="field-input min-h-28 resize-none bg-white" />
                    </label>
                    <button onClick={saveChanges} className="btn-primary"><Save className="h-4 w-4" /> Salvează modificările</button>
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-950">Subtaskuri / checklist</h3>
                    <span className="text-xs font-semibold text-slate-500">{task.subtasks.filter((subtask) => subtask.done).length}/{task.subtasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {task.subtasks.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">Nu există subtaskuri încă.</div>}
                    {task.subtasks.map((subtask) => (
                      <button key={subtask.id} onClick={() => toggleSubtask(task.id, subtask.id)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50">
                        <CheckCircle2 className={subtask.done ? "h-5 w-5 text-servelect-600" : "h-5 w-5 text-slate-300"} />
                        <span className={subtask.done ? "text-sm text-slate-500 line-through" : "text-sm font-semibold text-slate-800"}>{subtask.title}</span>
                      </button>
                    ))}
                    <div className="flex gap-2">
                      <input value={newSubtask} onChange={(event) => setNewSubtask(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { addSubtask(task.id, newSubtask); setNewSubtask(""); } }} placeholder="Adaugă subtask..." className="field-input" />
                      <button onClick={() => { addSubtask(task.id, newSubtask); setNewSubtask(""); }} className="btn-secondary"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-black text-slate-950">Comentarii</h3>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <textarea value={newComment} onChange={(event) => setNewComment(event.target.value)} placeholder="Scrie un update pentru echipă..." className="field-input min-h-24 resize-none bg-white" />
                    <div className="mt-3 flex justify-end"><button onClick={() => { addComment(task.id, newComment); setNewComment(""); }} className="btn-primary"><Send className="h-4 w-4" /> Comentează</button></div>
                  </div>
                  <div className="mt-3 space-y-3">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between text-xs text-slate-500"><strong className="text-slate-800">{comment.authorName}</strong><span>{new Date(comment.createdAt).toLocaleString("ro-RO")}</span></div>
                        <p className="mt-2 text-sm text-slate-700">{comment.body}</p>
                      </div>
                    ))}
                    {task.comments.length === 0 && <p className="text-sm text-slate-400">Fără comentarii încă.</p>}
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-black text-slate-950">Atașamente</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {task.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                        <Paperclip className="h-4 w-4 text-slate-400" />
                        <div><p className="text-sm font-bold text-slate-800">{attachment.name}</p><p className="text-xs text-slate-500">{attachment.type} · {attachment.size}</p></div>
                      </div>
                    ))}
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm font-bold text-slate-500 hover:border-emerald-300 hover:text-emerald-700"><FileUp className="h-4 w-4" /> Atașează fișier</button>
                  </div>
                </section>
              </main>

              <aside className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
                <div className="sticky top-28 space-y-4">
                  <button onClick={() => timerTaskId === task.id ? stopTimer() : startTimer(task.id)} className="btn-primary w-full">
                    <Play className="h-4 w-4" /> {timerTaskId === task.id ? "Oprește timer" : "Start timer"}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateTaskStatus(task.id, "Finalizat")} className="btn-secondary"><CheckCircle2 className="h-4 w-4" /> Done</button>
                    <button onClick={() => duplicateTask(task.id)} className="btn-secondary"><Copy className="h-4 w-4" /> Copie</button>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Șterge task</button>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h4 className="mb-3 text-sm font-black">Proprietăți</h4>
                    <div className="space-y-3">
                      <LabelSelect label="Status" value={status} onChange={(value) => setStatus(value as TaskStatus)} options={statuses} />
                      <LabelSelect label="Prioritate" value={priority} onChange={(value) => setPriority(value as Priority)} options={priorities} />
                      <LabelSelect label="Responsabil" value={assigneeId} onChange={setAssigneeId} options={users.map((user) => ({ value: user.id, label: user.name }))} />
                      <LabelInput label="Scadență" type="date" value={dueDate} onChange={setDueDate} />
                      <LabelInput label="Estimare" type="number" value={String(estimateHours)} onChange={(value) => setEstimateHours(Number(value))} />
                    </div>
                    <div className="mt-4">
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500"><span>Utilizare timp</span><span>{Math.round((task.trackedHours / Math.max(task.estimateHours, 1)) * 100)}%</span></div>
                      <ProgressBar value={(task.trackedHours / Math.max(task.estimateHours, 1)) * 100} tone="green" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-black"><Clock className="h-4 w-4" /> Activity log</h4>
                    <div className="max-h-60 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
                      {task.activityLog.map((log) => (
                        <div key={log.id} className="border-l-2 border-servelect-200 pl-3 text-xs text-slate-500"><b className="text-slate-800">{log.userName}</b> {log.action}<br /><span>{log.target}</span></div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-black"><CalendarClock className="h-4 w-4" /> Dependențe</h4>
                    <div className="flex flex-wrap gap-2">{task.dependencies.length ? task.dependencies.map((dep) => <Badge key={dep}>{dep}</Badge>) : <p className="text-xs text-slate-500">Fără dependențe.</p>}</div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="border-r border-slate-200 px-3 py-2 last:border-r-0"><div className="text-[10px] text-slate-400">{label}</div><div className="truncate text-slate-800">{value}</div></div>;
}

function LabelSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<string | { value: string; label: string }> }) {
  return <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-[.12em] text-slate-400">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="field-input">{options.map((option) => { const item = typeof option === "string" ? { value: option, label: option } : option; return <option key={item.value} value={item.value}>{item.label}</option>; })}</select></label>;
}

function LabelInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-[.12em] text-slate-400">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="field-input" /></label>;
}
