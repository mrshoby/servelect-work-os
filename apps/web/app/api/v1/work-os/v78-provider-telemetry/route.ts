import { createV78RuntimeState, runV78MutationCanary, runV78ProviderProbe, saveV78ServerView, syncV78SavedViews, v78CurrentReadiness, v78GlobalScores, v78ProgressScores, v78RouteList } from "@/lib/enterprise/work-os-v78-provider-telemetry-saved-views";

export async function GET() {
  const state = createV78RuntimeState();
  return Response.json({ ok: true, version: state.version, module: "v78-provider-telemetry-mutation-canary-saved-views", routes: v78RouteList(), scores: v78GlobalScores(), progress: v78ProgressScores(), readiness: v78CurrentReadiness(), summary: { providers: state.providerTelemetry.length, savedViews: state.savedViews.length, canaries: state.canaries.length, deliveryEvents: state.deliveryEvents.length } });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({} as Record<string, unknown>));
  const action = typeof payload.action === "string" ? payload.action : "mutation_canary";
  const base = createV78RuntimeState();
  const state = action === "provider_probe" ? runV78ProviderProbe(base) : action === "save_view" ? saveV78ServerView(base, "/taskuri/overview") : runV78MutationCanary(base, "task");
  return Response.json({ ok: true, version: state.version, action, writeMode: "mutation_canary_shadow_only", primaryWrite: "gated", evidence: "v7.8 accepts POST only in canary/shadow mode.", payload, summary: { providers: state.providerTelemetry.length, savedViews: state.savedViews.length, canaries: state.canaries.length } });
}
