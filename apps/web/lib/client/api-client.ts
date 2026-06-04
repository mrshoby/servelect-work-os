import type { ApiResponse, DashboardAggregate, ProjectCreateInput, TaskCreateInput } from "../backend/api-types";
import type { Project, Task } from "@servelect/shared";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!payload.ok) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}

export const servelectApi = {
  health: () => apiFetch<{ status: string; mode: string; timestamp: string }>("/api/v1/health"),
  dashboard: () => apiFetch<DashboardAggregate>("/api/v1/dashboard"),
  projects: () => apiFetch<Project[]>("/api/v1/projects"),
  createProject: (input: ProjectCreateInput) =>
    apiFetch<Project>("/api/v1/projects", { method: "POST", body: JSON.stringify(input) }),
  tasks: () => apiFetch<Task[]>("/api/v1/tasks"),
  createTask: (input: TaskCreateInput) =>
    apiFetch<Task>("/api/v1/tasks", { method: "POST", body: JSON.stringify(input) })
};
