"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tasks as initialTasks, type Task, type TaskStatus } from "@servelect/shared";

interface WorkOsStore {
  tasks: Task[];
  selectedTaskId?: string;
  timerTaskId?: string;
  timerStartedAt?: number;
  setSelectedTask: (id?: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  createTask: (task: Task) => void;
  startTimer: (id: string) => void;
  stopTimer: () => void;
}

export const useWorkOsStore = create<WorkOsStore>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      selectedTaskId: undefined,
      timerTaskId: undefined,
      timerStartedAt: undefined,
      setSelectedTask: (id) => set({ selectedTaskId: id }),
      updateTaskStatus: (id, status) => set({ tasks: get().tasks.map((task) => task.id === id ? { ...task, status } : task) }),
      createTask: (task) => set({ tasks: [task, ...get().tasks], selectedTaskId: task.id }),
      startTimer: (id) => set({ timerTaskId: id, timerStartedAt: Date.now() }),
      stopTimer: () => {
        const { timerTaskId, timerStartedAt, tasks } = get();
        if (!timerTaskId || !timerStartedAt) return set({ timerTaskId: undefined, timerStartedAt: undefined });
        const hours = Math.max(0.05, (Date.now() - timerStartedAt) / 1000 / 60 / 60);
        set({
          tasks: tasks.map((task) => task.id === timerTaskId ? { ...task, trackedHours: Number((task.trackedHours + hours).toFixed(2)) } : task),
          timerTaskId: undefined,
          timerStartedAt: undefined
        });
      }
    }),
    { name: "servelect-work-os-store-v1" }
  )
);
