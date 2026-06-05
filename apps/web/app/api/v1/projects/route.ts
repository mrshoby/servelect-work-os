import { NextResponse } from "next/server";

import { createApiProject, deleteApiProject, getApiProject, listApiProjects, updateApiProject, type ProjectCreateInput, type ProjectUpdateInput } from "@/lib/api-backed/task-project-api-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const project = getApiProject(id);
    if (!project) return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ ok: true, project });
  }

  const projects = listApiProjects({
    phase: url.searchParams.get("phase"),
    health: url.searchParams.get("health"),
    search: url.searchParams.get("search")
  });

  return NextResponse.json({ ok: true, count: projects.length, projects });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ProjectCreateInput;

  if (!body.name?.trim()) {
    return NextResponse.json({ ok: false, error: "name is required" }, { status: 400 });
  }

  const project = createApiProject(body);
  return NextResponse.json({ ok: true, project }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { id?: string; patch?: ProjectUpdateInput } & ProjectUpdateInput;
  const id = body.id ?? body.patch?.id;

  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });

  const project = updateApiProject(id, body.patch ?? body);
  if (!project) return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });

  return NextResponse.json({ ok: true, project });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => ({}))) as { id?: string };
  const id = body.id ?? url.searchParams.get("id");

  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });

  const result = deleteApiProject(id);
  if (!result.deleted) return NextResponse.json({ ok: false, ...result }, { status: 409 });

  return NextResponse.json({ ok: true, deleted: true, id });
}
