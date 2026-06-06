import { NextResponse } from "next/server";


import { getWorkOsWorkflowByEntity, previewWorkOsSubmission, submitWorkOsWorkflow } from "@/lib/enterprise/work-os-form-workflows";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ ok: true, workflow: getWorkOsWorkflowByEntity("project"), preview: previewWorkOsSubmission("project", { sample: true }) }); }
export async function POST(request: Request) { const payload = await request.json().catch(() => ({})); return NextResponse.json(submitWorkOsWorkflow("project", payload)); }
