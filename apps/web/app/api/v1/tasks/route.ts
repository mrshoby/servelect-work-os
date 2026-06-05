import { NextResponse } from "next/server";

import { createApiTask, deleteApiTask, getApiTask, listApiTasks, resetApiTaskStore, updateApiTask, type TaskCreateInput, type TaskUpdateInput } from "@/lib/api-backed/task-project-api-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const task = getApiTask(id);
    if (!task) return NextResponse.json({ ok: false, error: "Task not found" }, { status: 404 });
    return NextResponse.json({ ok: true, task });
  }

  const tasks = listApiTasks({
    status: url.searchParams.get("status"),
    projectId: url.searchParams.get("projectId"),
    priority: url.searchParams.get("priority"),
    search: url.searchParams.get("search")
  });

  return NextResponse.json({ ok: true, count: tasks.length, tasks });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TaskCreateInput & { action?: string };

  if (body.action === "reset") {
    return NextResponse.json({ ok: true, release: resetApiTaskStore() });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
  }

  const task = createApiTask(body);
  return NextResponse.json({ ok: true, task }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { id?: string; patch?: TaskUpdateInput } & TaskUpdateInput;
  const id = body.id ?? body.patch?.id;

  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });

  const task = updateApiTask(id, body.patch ?? body);
  if (!task) return NextResponse.json({ ok: false, error: "Task not found" }, { status: 404 });

  return NextResponse.json({ ok: true, task });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => ({}))) as { id?: string };
  const id = body.id ?? url.searchParams.get("id");

  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });

  const deleted = deleteApiTask(id);
  if (!deleted) return NextResponse.json({ ok: false, error: "Task not found" }, { status: 404 });

  return NextResponse.json({ ok: true, deleted: true, id });
}
