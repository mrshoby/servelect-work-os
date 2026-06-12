import { NextResponse } from "next/server";
import { approveV79SharedViewAcl, createV79RuntimeState, createV79SharedView } from "@/lib/enterprise/work-os-v79-primary-write-pilot";

export async function GET() {
  const state = createV79RuntimeState();
  return NextResponse.json({ ok: true, version: state.version, sharedViews: state.sharedViews, aclScopes: ["private", "team", "department", "global"] });
}

export async function POST() {
  const created = createV79SharedView(createV79RuntimeState(), "/taskuri/my-work", "team");
  const approved = approveV79SharedViewAcl(created, created.sharedViews[0]?.id ?? "sv-missing");
  return NextResponse.json({ ok: true, state: approved, warning: "ACL is canary/safe-mode; server authenticated enforcement remains next step." });
}
