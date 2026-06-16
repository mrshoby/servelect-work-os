import { NextResponse } from "next/server";

const responsePayload = {
  ok: true,
  version: "12.0.3",
  build: "Single Canonical Sidebar Taskuri Route Binding Fix",
  canonicalNavigation: "GLOBAL_LEFT_SIDEBAR_ONLY",
  internalTaskuriMenuRemoved: true,
  noInternalSidebar: true,
  marker: "data-v120-single-canonical-sidebar",
  message: "Taskuri uses only the global left sidebar. Internal workspace menu has been removed from Taskuri pages.",
};

export async function GET() {
  return NextResponse.json(responsePayload);
}
