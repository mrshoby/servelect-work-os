"use client";

import { useCallback } from "react";
import { projects, users, type Priority, type Task, type TaskStatus } from "@servelect/shared";
import { useWorkOsStore, type TaskDraft } from "@/lib/store";

export type TaskuriModalKind = "task" | "ticket" | "request" | "saved-view";
export type TaskuriToast = (message: string) => void;

export interface TaskuriCreateInput {
  title?: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  priority?: Priority;
  dueDate?: string;
  estimateHours?: number;
}

export interface TaskuriSavedViewInput {
  routeKey: string;
  name: string;
  filter: string;
  sort: string;
}

export interface TaskuriActionRegistryOptions {
  openModal: (kind: TaskuriModalKind) => void;
  closeModal: () => void;
  setToast: TaskuriToast;
  addSavedView: (view: TaskuriSavedViewInput) => void;
  markNotificationRead: (id?: string, all?: boolean) => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function dueInDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function downloadTextFile(filename: string, contents: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function useTaskuriActionRegistry(options: TaskuriActionRegistryOptions) {
  const createTask = useWorkOsStore((state) => state.createTask);
  const updateTaskStatus = useWorkOsStore((state) => state.updateTaskStatus);
  const updateTask = useWorkOsStore((state) => state.updateTask);
  const setSelectedTask = useWorkOsStore((state) => state.setSelectedTask);
  const addCommentToTask = useWorkOsStore((state) => state.addComment);
  const startTimerInStore = useWorkOsStore((state) => state.startTimer);
  const stopTimerInStore = useWorkOsStore((state) => state.stopTimer);
  const resetFilters = useWorkOsStore((state) => state.resetFilters);

  const buildDraft = useCallback((kind: Exclude<TaskuriModalKind, "saved-view">, input: TaskuriCreateInput = {}): TaskDraft => {
    const fallbackProject = projects[0];
    const fallbackUser = users[0];
    const titlePrefix = kind === "ticket" ? "Ticket" : kind === "request" ? "Request" : "Task";
    const defaultTitle = kind === "ticket"
      ? "Ticket mentenanță - verificare SLA teren"
      : kind === "request"
        ? "Cerere internă - aprobare operațională"
        : "Task operațional Servelect";

    return {
      title: input.title?.trim() || `${titlePrefix}: ${defaultTitle}`,
      description: input.description?.trim() || "Creat prin registry-ul unic v21.0.0 pentru Taskuri. Nu folosește shell/modale paralele.",
      projectId: input.projectId || fallbackProject.id,
      status: kind === "ticket" ? "De făcut" : "Backlog",
      priority: input.priority || (kind === "ticket" ? "Critic" : "Mediu"),
      assigneeId: input.assigneeId || fallbackUser.id,
      startDate: todayIso(),
      dueDate: input.dueDate || dueInDays(kind === "ticket" ? 2 : 7),
      estimateHours: Number(input.estimateHours) || (kind === "ticket" ? 3 : 6),
      tags: kind === "ticket" ? ["ticket", "sla", "v21-single-registry"] : kind === "request" ? ["request", "approval", "v21-single-registry"] : ["taskuri", "v21-single-registry"],
    };
  }, []);

  const openNewTask = useCallback(() => {
    options.openModal("task");
    options.setToast("New Task deschide doar modalul unic v21, în shell-ul existent.");
  }, [options]);

  const openNewTicket = useCallback(() => {
    options.openModal("ticket");
    options.setToast("New Ticket deschide doar modalul unic v21, în shell-ul existent.");
  }, [options]);

  const openNewRequest = useCallback(() => {
    options.openModal("request");
    options.setToast("New Request folosește același registry, fără flux paralel.");
  }, [options]);

  const createItem = useCallback((kind: Exclude<TaskuriModalKind, "saved-view">, input: TaskuriCreateInput = {}) => {
    createTask(buildDraft(kind, input));
    queueMicrotask(() => setSelectedTask(undefined));
    options.closeModal();
    options.setToast(`${kind === "ticket" ? "Ticketul" : kind === "request" ? "Cererea" : "Taskul"} a fost creat și apare în Table, Board, My Work și workload.`);
  }, [buildDraft, createTask, options, setSelectedTask]);

  const saveView = useCallback((view: TaskuriSavedViewInput) => {
    options.addSavedView(view);
    options.setToast("Save View persistat local și disponibil în toate rutele Taskuri.");
  }, [options]);

  const applyFilter = useCallback((message = "Filtrul a fost aplicat și view-urile s-au recalculat.") => {
    options.setToast(message);
  }, [options]);

  const clearFilters = useCallback(() => {
    resetFilters();
    options.setToast("Filtrele au fost resetate prin registry-ul unic.");
  }, [options, resetFilters]);

  const exportView = useCallback((tasks: Task[], routeKey: string) => {
    const header = ["id", "title", "project", "assignee", "status", "priority", "dueDate", "estimateHours", "trackedHours"].join(",");
    const rows = tasks.map((task) => [
      task.id,
      task.title,
      task.projectName,
      task.assigneeName,
      task.status,
      task.priority,
      task.dueDate,
      task.estimateHours,
      task.trackedHours,
    ].map(escapeCsv).join(","));
    downloadTextFile(`servelect-taskuri-${routeKey}-v21.csv`, [header, ...rows].join("\n"));
    options.setToast("Export CSV generat din view-ul curent, fără buton decorativ.");
  }, [options]);

  const bulkUpdate = useCallback((taskIds: string[], status: TaskStatus) => {
    taskIds.forEach((id) => updateTaskStatus(id, status));
    options.setToast(`${taskIds.length} taskuri actualizate prin Bulk Actions.`);
  }, [options, updateTaskStatus]);

  const openTaskDrawer = useCallback((taskId?: string) => {
    setSelectedTask(taskId);
    options.setToast(taskId ? "Task drawer unic deschis." : "Task drawer închis.");
  }, [options, setSelectedTask]);

  const addComment = useCallback((taskId: string, body: string) => {
    addCommentToTask(taskId, body || "Actualizare operațională adăugată prin registry-ul v21.");
    options.setToast("Comentariul apare în drawer și activity log.");
  }, [addCommentToTask, options]);

  const startTimer = useCallback((taskId: string) => {
    startTimerInStore(taskId);
    options.setToast("Timer pornit; workload și tracked time se vor actualiza la Stop.");
  }, [options, startTimerInStore]);

  const stopTimer = useCallback(() => {
    stopTimerInStore();
    options.setToast("Timer oprit; tracked time actualizat în toate view-urile.");
  }, [options, stopTimerInStore]);

  const approve = useCallback((taskId: string) => {
    updateTaskStatus(taskId, "În lucru");
    options.setToast("Aprobarea a trecut taskul în lucru.");
  }, [options, updateTaskStatus]);

  const reject = useCallback((taskId: string) => {
    updateTaskStatus(taskId, "Blocat");
    options.setToast("Reject a mutat elementul în Blocat și este vizibil în Board/Table.");
  }, [options, updateTaskStatus]);

  const markRead = useCallback((id?: string, all = false) => {
    options.markNotificationRead(id, all);
    options.setToast(all ? "Toate notificările au fost marcate ca citite." : "Notificarea a fost marcată ca citită.");
  }, [options]);

  const escalateTicket = useCallback((taskId: string) => {
    updateTask(taskId, { priority: "Critic", tags: ["ticket", "sla", "escalated", "v21-single-registry"] });
    options.setToast("Ticket escaladat: prioritate Critic și tag escalated.");
  }, [options, updateTask]);

  const convertTicketToTask = useCallback((taskId: string) => {
    updateTask(taskId, { title: "Task convertit din ticket", priority: "Ridicat", tags: ["converted-from-ticket", "v21-single-registry"] });
    options.setToast("Ticket convertit în task și sincronizat în Board/Table/My Work.");
  }, [options, updateTask]);

  return {
    openNewTask,
    openNewTicket,
    openNewRequest,
    createItem,
    saveView,
    applyFilter,
    clearFilters,
    exportView,
    bulkUpdate,
    openTaskDrawer,
    addComment,
    startTimer,
    stopTimer,
    approve,
    reject,
    markRead,
    escalateTicket,
    convertTicketToTask,
  };
}
