"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CalendarClock, CheckCircle2, Clock, FileUp, MessageSquare, Paperclip, Play, Send, X } from "lucide-react";
import { priorityTone, statusTone } from "@servelect/shared";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useWorkOsStore } from "@/lib/store";

export function TaskDrawer() {
  const { tasks, selectedTaskId, setSelectedTask, updateTaskStatus, startTimer, stopTimer, timerTaskId } = useWorkOsStore();
  const task = tasks.find((t) => t.id === selectedTaskId);
  const open = Boolean(task);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && setSelectedTask(undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-screen w-full max-w-[760px] overflow-y-auto bg-white shadow-2xl outline-none">
          {task && (
            <div className="flex min-h-full flex-col">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                    <Badge tone={priorityTone(task.priority)}>{task.priority}</Badge>
                    <span className="text-xs font-semibold text-slate-500">{task.projectCode}</span>
                  </div>
                  <Dialog.Title className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">{task.title}</Dialog.Title>
                </div>
                <Dialog.Close className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><X className="h-5 w-5" /></Dialog.Close>
              </div>

              <div className="grid flex-1 gap-0 lg:grid-cols-[1fr_260px]">
                <div className="space-y-6 px-6 py-5">
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-slate-950">Descriere</h3>
                    <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">{task.description}</p>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-950">Subtaskuri</h3>
                      <span className="text-xs font-semibold text-slate-500">{task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {task.subtasks.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">Nu există subtaskuri încă.</div>}
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                          <CheckCircle2 className={subtask.done ? "h-5 w-5 text-servelect-600" : "h-5 w-5 text-slate-300"} />
                          <span className={subtask.done ? "text-sm text-slate-500 line-through" : "text-sm font-medium text-slate-800"}>{subtask.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-950">Comentarii</h3>
                    <div className="space-y-3">
                      {task.comments.map((comment) => (
                        <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between text-xs text-slate-500"><strong className="text-slate-800">{comment.authorName}</strong><span>{new Date(comment.createdAt).toLocaleString("ro-RO")}</span></div>
                          <p className="mt-2 text-sm text-slate-700">{comment.body}</p>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                        <input placeholder="Scrie un comentariu..." className="flex-1 bg-transparent px-2 text-sm outline-none" />
                        <button className="btn-primary px-3 py-2"><Send className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-950">Atașamente</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {task.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                          <Paperclip className="h-5 w-5 text-slate-400" />
                          <div><div className="text-sm font-semibold">{attachment.name}</div><div className="text-xs text-slate-500">{attachment.type} · {attachment.size}</div></div>
                        </div>
                      ))}
                      <button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"><FileUp className="h-4 w-4" /> Atașează fișier</button>
                    </div>
                  </div>
                </div>

                <aside className="border-l border-slate-100 bg-slate-50/80 px-5 py-5">
                  <div className="space-y-4">
                    <button onClick={() => timerTaskId === task.id ? stopTimer() : startTimer(task.id)} className="btn-primary w-full">
                      <Play className="h-4 w-4" /> {timerTaskId === task.id ? "Oprește timer" : "Start timer"}
                    </button>
                    <button onClick={() => updateTaskStatus(task.id, "Finalizat")} className="btn-secondary w-full"><CheckCircle2 className="h-4 w-4" /> Completează</button>
                    <button className="btn-secondary w-full"><MessageSquare className="h-4 w-4" /> Comentează</button>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h4 className="mb-3 text-sm font-bold">Proprietăți</h4>
                      <dl className="space-y-3 text-sm">
                        <Row label="Proiect" value={task.projectName} />
                        <Row label="Responsabil" value={task.assigneeName} />
                        <Row label="Start" value={task.startDate} />
                        <Row label="Scadență" value={task.dueDate} />
                        <Row label="Estimare" value={`${task.estimateHours} h`} />
                        <Row label="Pontat" value={`${task.trackedHours} h`} />
                      </dl>
                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500"><span>Utilizare timp</span><span>{Math.round((task.trackedHours / Math.max(task.estimateHours, 1)) * 100)}%</span></div>
                        <ProgressBar value={(task.trackedHours / Math.max(task.estimateHours, 1)) * 100} tone="green" />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold"><Clock className="h-4 w-4" /> Activity log</h4>
                      <div className="space-y-3">
                        {task.activityLog.map((log) => (
                          <div key={log.id} className="border-l-2 border-servelect-200 pl-3 text-xs text-slate-500"><b className="text-slate-800">{log.userName}</b> {log.action}<br /><span>{log.target}</span></div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold"><CalendarClock className="h-4 w-4" /> Dependențe</h4>
                      {task.dependencies.length ? task.dependencies.map((dep) => <Badge key={dep}>{dep}</Badge>) : <p className="text-xs text-slate-500">Fără dependențe.</p>}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-semibold text-slate-800">{value}</dd></div>;
}
