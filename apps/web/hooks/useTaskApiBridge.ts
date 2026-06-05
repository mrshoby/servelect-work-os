"use client";

import { useCallback, useMemo, useState } from "react";
import type { Task, TaskStatus } from "@servelect/shared";

import { taskApiClient, type TaskCreatePayload } from "@/lib/task-api/client";

export type TaskApiBridgeState = {
  mode: "local-only" | "api-read" | "api-mutations-shadow" | "api-mutations-active";
  loading: boolean;
  error?: string;
  lastSyncAt?: string;
  apiTasks: Task[];
};

export function useTaskApiBridge(initialMode: TaskApiBridgeState["mode"] = "api-read") {
  const [state, setState] = useState<TaskApiBridgeState>({
    mode: initialMode,
    loading: false,
    apiTasks: []
  });

  const refreshTasks = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: undefined }));

    try {
      const apiTasks = await taskApiClient.listTasks({ limit: 100 });
      setState((current) => ({
        ...current,
        loading: false,
        apiTasks,
        lastSyncAt: new Date().toISOString()
      }));
      return apiTasks;
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : "Task API refresh failed"
      }));
      return [];
    }
  }, []);

  const createTaskViaApi = useCallback(async (input: TaskCreatePayload) => {
    setState((current) => ({ ...current, loading: true, error: undefined }));

    try {
      const created = await taskApiClient.createTask(input);
      setState((current) => ({
        ...current,
        loading: false,
        apiTasks: [created, ...current.apiTasks].slice(0, 100),
        lastSyncAt: new Date().toISOString()
      }));
      return created;
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : "Task API create failed"
      }));
      throw error;
    }
  }, []);

  const updateStatusViaApi = useCallback(async (id: string, status: TaskStatus) => {
    const previous = state.apiTasks;
    setState((current) => ({
      ...current,
      apiTasks: current.apiTasks.map((task) => (task.id === id ? { ...task, status } : task)),
      error: undefined
    }));

    try {
      const updated = await taskApiClient.updateTaskStatus(id, status);
      setState((current) => ({
        ...current,
        apiTasks: current.apiTasks.map((task) => (task.id === id ? updated : task)),
        lastSyncAt: new Date().toISOString()
      }));
      return updated;
    } catch (error) {
      setState((current) => ({
        ...current,
        apiTasks: previous,
        error: error instanceof Error ? error.message : "Task API status update failed"
      }));
      throw error;
    }
  }, [state.apiTasks]);

  return useMemo(
    () => ({
      ...state,
      refreshTasks,
      createTaskViaApi,
      updateStatusViaApi
    }),
    [state, refreshTasks, createTaskViaApi, updateStatusViaApi]
  );
}
