import { NextResponse } from "next/server";
import { getSourceOfTruthAdapterRegistry } from "@/lib/enterprise/source-of-truth-adapter-activation";
export const dynamic = "force-dynamic";
export async function GET() { const registry = getSourceOfTruthAdapterRegistry(); return NextResponse.json({ ok: true, adapter: registry.adapters.find((adapter) => adapter.id === "audit-audit-tap") ?? null }); }
