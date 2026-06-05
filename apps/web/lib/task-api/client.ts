import type { Project, Task, TaskStatus } from "@servelect/shared";

export type ApiListResponse<T> = {
  ok?: boolean;
  data?: T[];
  items?: T[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type ApiItemResponse<T> = {
  ok?: boolean;
  data?: T;
  item?: T;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T;

  if (!response.ok) {
    throw new Error(`API request failed ${response.status}: ${JSON.stringify(payload).slice(0, 240)}`);
  }

  return payload;
}

function listFromPayload<T>(payload: ApiListResponse<T> | T[]): T[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

function itemFromPayload<T>(payload: ApiItemResponse<T> | T): T {
  const wrapped = payload as ApiItemResponse<T>;
  return wrapped.data ?? wrapped.item ?? (payload as T);
}

export type TaskCreatePayload = {
  title: string;
  description?: string;
  projectId: string;
  status?: TaskStatus;
  priority?: string;
  assigneeId?: string;
  startDate?: string;
  dueDate?: string;
  estimateHours?: number;
  tags?: string[];
};

export const taskApiClient = {
  async listTasks(params?: { q?: string; status?: TaskStatus | "Toate"; projectId?: string; limit?: number; offset?: number }): Promise<Task[]> {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.status && params.status !== "Toate") search.set("status", params.status);
    if (params?.projectId && params.projectId !== "Toate") search.set("projectId", params.projectId);
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.offset) search.set("offset", String(params.offset));

    const suffix = search.toString() ? `?${search.toString()}` : "";
    const payload = await readJson<ApiListResponse<Task> | Task[]>(await fetch(`/api/v1/tasks${suffix}`, { cache: "no-store" }));
    return listFromPayload(payload);
  },

  async listProjects(): Promise<Project[]> {
    const payload = await readJson<ApiListResponse<Project> | Project[]>(await fetch("/api/v1/projects", { cache: "no-store" }));
    return listFromPayload(payload);
  },

  async createTask(input: TaskCreatePayload): Promise<Task> {
    const payload = await readJson<ApiItemResponse<Task> | Task>(
      await fetch("/api/v1/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })
    );
    return itemFromPayload(payload);
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const payload = await readJson<ApiItemResponse<Task> | Task>(
      await fetch(`/api/v1/tasks/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
    );
    return itemFromPayload(payload);
  },

  async deleteTask(id: string): Promise<{ ok: boolean }> {
    return readJson<{ ok: boolean }>(
      await fetch(`/api/v1/tasks/${encodeURIComponent(id)}`, {
        method: "DELETE"
      })
    );
  }
};
