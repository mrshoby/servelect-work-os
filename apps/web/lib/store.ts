"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  projects as initialProjects,
  tasks as initialTasks,
  users,
  type Comment,
  type Project,
  type ProjectHealth,
  type ProjectPhase,
  type Subtask,
  type Task,
  type TaskStatus,
  type Priority
} from "@servelect/shared";

type FilterValue<T extends string> = "Toate" | T;

export interface TaskDraft {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  startDate: string;
  dueDate: string;
  estimateHours: number;
  tags: string[];
}

export interface ProjectDraft {
  name: string;
  clientName: string;
  location: string;
  powerKwp: number;
  phase: ProjectPhase;
  health: ProjectHealth;
  ownerId: string;
  deadline: string;
  budgetRon: number;
}

interface WorkOsStore {
  tasks: Task[];
  projects: Project[];
  selectedTaskId?: string;
  selectedProjectId?: string;
  timerTaskId?: string;
  timerStartedAt?: number;
  taskCreateOpen: boolean;
  projectCreateOpen: boolean;
  taskSearch: string;
  statusFilter: FilterValue<TaskStatus>;
  priorityFilter: FilterValue<Priority>;
  projectFilter: "Toate" | string;
  assigneeFilter: "Toate" | string;

  setSelectedTask: (id?: string) => void;
  setSelectedProject: (id?: string) => void;
  setTaskCreateOpen: (open: boolean) => void;
  setProjectCreateOpen: (open: boolean) => void;
  setTaskSearch: (value: string) => void;
  setStatusFilter: (value: FilterValue<TaskStatus>) => void;
  setPriorityFilter: (value: FilterValue<Priority>) => void;
  setProjectFilter: (value: "Toate" | string) => void;
  setAssigneeFilter: (value: "Toate" | string) => void;
  resetFilters: () => void;

  getFilteredTasks: () => Task[];
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  createTask: (draft: TaskDraft) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  addComment: (taskId: string, body: string) => void;
  createProject: (draft: ProjectDraft) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  startTimer: (id: string) => void;
  stopTimer: () => void;
  resetDemoData: () => void;
}

function newId(prefix: string): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function capArray<T>(items: T[], max: number): T[] {
  return items.length > max ? items.slice(0, max) : items;
}

function capTaskRuntime(task: Task): Task {
  return {
    ...task,
    comments: capArray(task.comments, 25),
    attachments: capArray(task.attachments, 20),
    activityLog: capArray(task.activityLog, 30),
    subtasks: capArray(task.subtasks, 60)
  };
}

function findUserName(userId: string): string {
  return users.find((user) => user.id === userId)?.name ?? "Nealocat";
}

function addLog(task: Task, action: string, target = task.title): Task {
  return {
    ...task,
    activityLog: [
      {
        id: newId("log"),
        userId: "u1",
        userName: "Andrei Popescu",
        action,
        target,
        createdAt: new Date().toISOString()
      },
      ...task.activityLog
    ].slice(0, 30)
  };
}

export const useWorkOsStore = create<WorkOsStore>()(
  persist(
    (set, get) => ({
      tasks: initialTasks.map(capTaskRuntime),
      projects: initialProjects,
      selectedTaskId: undefined,
      selectedProjectId: undefined,
      timerTaskId: undefined,
      timerStartedAt: undefined,
      taskCreateOpen: false,
      projectCreateOpen: false,
      taskSearch: "",
      statusFilter: "Toate",
      priorityFilter: "Toate",
      projectFilter: "Toate",
      assigneeFilter: "Toate",

      setSelectedTask: (id) => set({ selectedTaskId: id }),
      setSelectedProject: (id) => set({ selectedProjectId: id }),
      setTaskCreateOpen: (open) => set({ taskCreateOpen: open }),
      setProjectCreateOpen: (open) => set({ projectCreateOpen: open }),
      setTaskSearch: (value) => set({ taskSearch: value }),
      setStatusFilter: (value) => set({ statusFilter: value }),
      setPriorityFilter: (value) => set({ priorityFilter: value }),
      setProjectFilter: (value) => set({ projectFilter: value }),
      setAssigneeFilter: (value) => set({ assigneeFilter: value }),
      resetFilters: () => set({ taskSearch: "", statusFilter: "Toate", priorityFilter: "Toate", projectFilter: "Toate", assigneeFilter: "Toate" }),

      getFilteredTasks: () => {
        const { tasks, taskSearch, statusFilter, priorityFilter, projectFilter, assigneeFilter } = get();
        const query = taskSearch.trim().toLowerCase();
        return tasks.filter((task) => {
          const matchesQuery = !query || [task.title, task.description, task.projectCode, task.projectName, task.assigneeName, ...task.tags].join(" ").toLowerCase().includes(query);
          const matchesStatus = statusFilter === "Toate" || task.status === statusFilter;
          const matchesPriority = priorityFilter === "Toate" || task.priority === priorityFilter;
          const matchesProject = projectFilter === "Toate" || task.projectId === projectFilter;
          const matchesAssignee = assigneeFilter === "Toate" || task.assigneeId === assigneeFilter;
          return matchesQuery && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
        });
      },

      updateTaskStatus: (id, status) => set({
        tasks: get().tasks.map((task) => task.id === id ? addLog({ ...task, status }, `a mutat taskul în ${status}`) : task)
      }),

      createTask: (draft) => {
        const project = get().projects.find((item) => item.id === draft.projectId) ?? get().projects[0];
        const task: Task = {
          id: newId("task"),
          title: draft.title,
          description: draft.description,
          projectId: project.id,
          projectCode: project.code,
          projectName: project.name,
          status: draft.status,
          priority: draft.priority,
          assigneeId: draft.assigneeId,
          assigneeName: findUserName(draft.assigneeId),
          ownerId: "u1",
          startDate: draft.startDate || todayIso(),
          dueDate: draft.dueDate || todayIso(),
          estimateHours: Number(draft.estimateHours) || 1,
          trackedHours: 0,
          tags: draft.tags,
          dependencies: [],
          customFields: { Sursă: "v0.2 localStorage" },
          subtasks: [],
          comments: [],
          attachments: [],
          activityLog: [
            { id: newId("log"), userId: "u1", userName: "Andrei Popescu", action: "a creat taskul", target: draft.title, createdAt: new Date().toISOString() }
          ]
        };
        set({ tasks: [task, ...get().tasks].slice(0, 200), selectedTaskId: task.id, taskCreateOpen: false });
      },

      updateTask: (id, patch) => set({
        tasks: get().tasks.map((task) => task.id === id ? addLog({ ...task, ...patch }, "a actualizat taskul") : task)
      }),

      deleteTask: (id) => set({ tasks: get().tasks.filter((task) => task.id !== id), selectedTaskId: undefined }),

      duplicateTask: (id) => {
        const task = get().tasks.find((item) => item.id === id);
        if (!task) return;
        const copy: Task = addLog({ ...task, id: newId("task"), title: `${task.title} — copie`, status: "Backlog", trackedHours: 0 }, "a duplicat taskul");
        set({ tasks: [copy, ...get().tasks].slice(0, 200), selectedTaskId: copy.id });
      },

      toggleSubtask: (taskId, subtaskId) => set({
        tasks: get().tasks.map((task) => {
          if (task.id !== taskId) return task;
          const subtasks = task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask);
          return addLog({ ...task, subtasks }, "a actualizat checklistul");
        })
      }),

      addSubtask: (taskId, title) => {
        const cleanTitle = title.trim();
        if (!cleanTitle) return;
        const subtask: Subtask = { id: newId("sub"), title: cleanTitle, done: false };
        set({
          tasks: get().tasks.map((task) => task.id === taskId ? addLog({ ...task, subtasks: [...task.subtasks, subtask] }, "a adăugat un subtask", cleanTitle) : task)
        });
      },

      addComment: (taskId, body) => {
        const cleanBody = body.trim();
        if (!cleanBody) return;
        const comment: Comment = { id: newId("comment"), authorId: "u1", authorName: "Andrei Popescu", body: cleanBody, createdAt: new Date().toISOString() };
        set({
          tasks: get().tasks.map((task) => task.id === taskId ? addLog({ ...task, comments: [comment, ...task.comments].slice(0, 25) }, "a comentat pe task") : task)
        });
      },

      createProject: (draft) => {
        const ownerName = findUserName(draft.ownerId);
        const nextNumber = get().projects.length + 188;
        const project: Project = {
          id: newId("project"),
          code: `P-2024-${String(nextNumber).padStart(4, "0")}`,
          name: draft.name,
          clientId: newId("client"),
          clientName: draft.clientName,
          location: draft.location,
          powerKwp: Number(draft.powerKwp) || 0,
          phase: draft.phase,
          progress: draft.phase === "Planificat" ? 5 : 18,
          health: draft.health,
          ownerId: draft.ownerId,
          ownerName,
          deadline: draft.deadline,
          budgetRon: Number(draft.budgetRon) || 0,
          workedHours: 0,
          risks: 0,
          documents: 0
        };
        set({ projects: [project, ...get().projects].slice(0, 100), selectedProjectId: project.id, projectCreateOpen: false });
      },

      updateProject: (id, patch) => set({ projects: get().projects.map((project) => project.id === id ? { ...project, ...patch } : project) }),
      deleteProject: (id) => set({ projects: get().projects.filter((project) => project.id !== id), tasks: get().tasks.filter((task) => task.projectId !== id), selectedProjectId: undefined }),

      startTimer: (id) => set({ timerTaskId: id, timerStartedAt: Date.now() }),
      stopTimer: () => {
        const { timerTaskId, timerStartedAt, tasks } = get();
        if (!timerTaskId || !timerStartedAt) return set({ timerTaskId: undefined, timerStartedAt: undefined });
        const hours = Math.max(0.05, (Date.now() - timerStartedAt) / 1000 / 60 / 60);
        set({
          tasks: tasks.map((task) => task.id === timerTaskId ? addLog({ ...task, trackedHours: Number((task.trackedHours + hours).toFixed(2)) }, `a pontat ${hours.toFixed(2)}h`) : task),
          timerTaskId: undefined,
          timerStartedAt: undefined
        });
      },

      resetDemoData: () => set({
        tasks: initialTasks.map(capTaskRuntime),
        projects: initialProjects,
        selectedTaskId: undefined,
        selectedProjectId: undefined,
        timerTaskId: undefined,
        timerStartedAt: undefined,
        taskSearch: "",
        statusFilter: "Toate",
        priorityFilter: "Toate",
        projectFilter: "Toate",
        assigneeFilter: "Toate"
      })
    }),
    {
      name: "servelect-work-os-store-v14",
      version: 14,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const tasks = Array.isArray(state.tasks) ? state.tasks.map(capTaskRuntime).slice(0, 200) : initialTasks.map(capTaskRuntime);
        const projects = Array.isArray(state.projects) ? state.projects.slice(0, 100) : initialProjects;
        state.tasks = tasks;
        state.projects = projects;
        state.selectedTaskId = undefined;
        state.selectedProjectId = undefined;
        state.taskCreateOpen = false;
        state.projectCreateOpen = false;
      }
    }
  )
);






