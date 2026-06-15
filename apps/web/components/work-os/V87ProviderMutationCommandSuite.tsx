import { getV87Release, V87_BUILD_NAME, V87_VERSION } from "@/lib/enterprise/work-os-v87-live-provider-mutation-replay";

type Surface = "taskuri" | "admin" | "work-os";

type Props = {
  surface?: Surface;
  title?: string;
};

const toneClass: Record<string, string> = {
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  dry_run: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
  allow: "bg-emerald-50 text-emerald-700 border-emerald-200",
  block: "bg-red-50 text-red-700 border-red-200",
  queued: "bg-slate-50 text-slate-700 border-slate-200",
};

function Badge({ value }: { value: string }) {
  return <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${toneClass[value] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>{value}</span>;
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</div>
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <p className="max-w-4xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export function V87ProviderMutationCommandSuite({ surface = "work-os", title }: Props) {
  const data = getV87Release();
  const isAdmin = surface === "admin";
  const isTaskuri = surface === "taskuri";

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-950">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-300">SERVELECT WORK OS · v{V87_VERSION}</div>
                <h1 className="text-3xl font-semibold tracking-tight">{title ?? V87_BUILD_NAME}</h1>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200">
                  Major GoodDay-like hardening pentru provider credentials, webhook signature verification, pilot mutation replay,
                  manager evidence panel, pixel-diff baseline și rollback drill. Nu activează global production writes.
                </p>
              </div>
              <div className="grid min-w-[280px] grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm backdrop-blur">
                <div><div className="text-xs text-slate-300">Global writes</div><div className="font-semibold text-red-200">disabled</div></div>
                <div><div className="text-xs text-slate-300">Pilot writes</div><div className="font-semibold text-emerald-200">department scoped</div></div>
                <div><div className="text-xs text-slate-300">Providers ready</div><div className="font-semibold">{data.runtimeProof.configuredProviders}</div></div>
                <div><div className="text-xs text-slate-300">Replay queue</div><div className="font-semibold">{data.runtimeProof.replayQueue}</div></div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-[270px_1fr]">
            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Work OS Navigation</div>
              {[
                "My Work / Action Required",
                "Provider Credential Vault",
                "Webhook Signature Proof",
                "Pilot Mutation Replay",
                "Rollback / Dead-letter",
                "Pixel Diff Quality Gate",
                "GoodDay Parity Delta",
              ].map((item, index) => (
                <div key={item} className="mb-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </aside>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["GoodDay functional", "98%", "Not 100%: providers + DB writes gated"],
                  ["Visual maturity", "88%", "more compact control room"],
                  ["Provider readiness", "pilot", "ready/dry-run/blocked split"],
                  ["Security status", "gated", "HMAC + lockVersion + rollback"],
                ].map(([label, value, detail]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{value}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">{detail}</div>
                  </div>
                ))}
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionTitle eyebrow="Provider credentials" title="Credential readiness without secrets in repository" description="Fiecare canal are status separat, sursă de secret, scop operațional și dovadă de runtime. Providerii externi rămân dry-run/blocați dacă lipsesc secretele reale." />
                <div className="grid gap-3 lg:grid-cols-5">
                  {data.providerCredentials.map((provider) => (
                    <div key={provider.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-2"><div className="text-sm font-semibold capitalize">{provider.provider}</div><Badge value={provider.status} /></div>
                      <div className="mt-3 text-xs text-slate-500">Secret source</div>
                      <div className="text-sm font-medium text-slate-800">{provider.secretSource}</div>
                      <div className="mt-3 text-xs text-slate-500">Scope</div>
                      <div className="text-xs leading-5 text-slate-700">{provider.scope}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <SectionTitle eyebrow="Mutation replay" title="Signed pilot replay queue" description="Replay-ul nu merge direct în producție: verifică semnătură, RLS, lockVersion, policy decision și rollback checkpoint." />
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr><th className="px-4 py-3">Mutation</th><th className="px-4 py-3">Entity</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Decision</th><th className="px-4 py-3">Rollback</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {data.mutationReplays.map((m) => (
                          <tr key={m.id} className="bg-white">
                            <td className="px-4 py-3 font-medium text-slate-900">{m.id}<div className="text-xs text-slate-500">{m.state}</div></td>
                            <td className="px-4 py-3">{m.entity}</td>
                            <td className="px-4 py-3">{m.actor}<div className="text-xs text-slate-500">{m.department}</div></td>
                            <td className="px-4 py-3"><Badge value={m.decision} /></td>
                            <td className="px-4 py-3 text-xs text-slate-600">{m.rollbackCheckpoint}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <SectionTitle eyebrow="Manager evidence" title={isTaskuri ? "Taskuri evidence panel" : isAdmin ? "Admin runtime proof" : "Work OS runtime proof"} description="Panoul arată exact ce este allow/dry-run/block, fără marketing și fără a ascunde providerii blocați." />
                  <div className="space-y-3">
                    {data.gooddayEvidence.map((lane) => (
                      <div key={lane.lane} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2"><div className="text-sm font-semibold">{lane.lane}</div><div className="text-sm font-bold text-emerald-700">{lane.after}%</div></div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${lane.after}%` }} /></div>
                        <div className="mt-2 text-xs leading-5 text-slate-600">{lane.proof}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
