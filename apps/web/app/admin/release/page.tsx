import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Database, GitBranch, Rocket, ShieldAlert, ShieldCheck, Smartphone, Zap } from "lucide-react";

import { getReleaseChecklist, getReleaseManifest, type ReleaseGateStatus } from "@/lib/release/manifest";

const toneMap: Record<ReleaseGateStatus, string> = {
  passed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  blocked: "border-red-200 bg-red-50 text-red-800",
  planned: "border-blue-200 bg-blue-50 text-blue-800"
};

const labelMap: Record<ReleaseGateStatus, string> = {
  passed: "Trecut",
  warning: "Atenție",
  blocked: "Blocat",
  planned: "Planificat"
};

export default function ReleaseConsolePage() {
  const manifest = getReleaseManifest();
  const checklist = getReleaseChecklist();

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-7 text-white shadow-card">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-200 ring-1 ring-emerald-300/20">
              <Rocket className="h-4 w-4" /> {manifest.app.channel}
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight lg:text-4xl">SERVELECT WORK OS v1 Release Console</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Baseline enterprise pentru Work OS task-first: verificare build, guvernanță, RBAC foundation, workflow automation,
              Action Center și roadmap clar către DB, mobile offline și IoT real.
            </p>
          </div>

          <div className="grid min-w-[320px] grid-cols-2 gap-3">
            <Metric title="Production score" value={`${checklist.productionScore}%`} icon={ShieldCheck} tone="green" />
            <Metric title="Release gates" value={String(checklist.gates.length)} icon={GitBranch} tone="blue" />
            <Metric title="Atenționări" value={String(checklist.warnings.length)} icon={ShieldAlert} tone="orange" />
            <Metric title="Blockers" value={String(checklist.blockers.length)} icon={CheckCircle2} tone="green" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <SummaryCard label="Capabilities" value={String(manifest.summary.capabilities)} description="module în system status" />
        <SummaryCard label="Action items" value={String(manifest.summary.actionItems)} description="în Action Center" />
        <SummaryCard label="Critical actions" value={String(manifest.summary.criticalActions)} description="necesită atenție" />
        <SummaryCard label="Workflow executions" value={String(manifest.summary.workflowExecutions)} description="jurnal demo" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">Release gates</h2>
              <p className="text-sm text-slate-500">Checklist de producție pentru v1.0.</p>
            </div>
            <Link href="/api/v1/release/checklist" className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">
              API checklist
            </Link>
          </div>

          <div className="space-y-3">
            {checklist.gates.map((gate) => (
              <div key={gate.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-950">{gate.title}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Owner · {gate.owner}</div>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-black ${toneMap[gate.status]}`}>{labelMap[gate.status]}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{gate.evidence}</p>
                <div className="mt-3 rounded-xl bg-white p-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">{gate.action}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Release timeline</h2>
                <p className="text-sm text-slate-500">De la protected app la baseline v1.</p>
              </div>
              <Clock3 className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="space-y-3">
              {manifest.milestones.map((milestone) => (
                <div key={milestone.id} className="border-l-2 border-emerald-500 pl-4">
                  <div className="flex items-center justify-between gap-3">
                    <b className="text-sm text-slate-950">{milestone.version} · {milestone.title}</b>
                    <span className="text-xs font-bold text-slate-400">{milestone.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{milestone.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {milestone.routes.map((route) => (
                      <span key={route} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">{route}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-lg font-black text-slate-950">Roadmap recomandat v1.x</h2>
            <div className="mt-4 space-y-3">
              {manifest.nextRecommendedVersions.map((item, index) => (
                <div key={item.version} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">{index + 1}</div>
                    <div>
                      <div className="font-black text-slate-950">{item.version} · {item.title}</div>
                      <p className="mt-1 text-sm text-slate-600">{item.focus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <QuickLink href="/admin/system" title="System" icon={Database} />
            <QuickLink href="/mobile" title="Mobile" icon={Smartphone} />
            <QuickLink href="/iot" title="IoT" icon={Zap} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ title, value, icon: Icon, tone }: { title: string; value: string; icon: typeof ShieldCheck; tone: "green" | "blue" | "orange" }) {
  const tones = {
    green: "bg-emerald-400/10 text-emerald-200 ring-emerald-300/20",
    blue: "bg-blue-400/10 text-blue-200 ring-blue-300/20",
    orange: "bg-amber-400/10 text-amber-200 ring-amber-300/20"
  };
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-300">{title}</span>
        <span className={`grid h-8 w-8 place-items-center rounded-xl ring-1 ${tones[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 text-2xl font-black">{value}</div>
    </div>
  );
}

function SummaryCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-card">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{description}</div>
    </div>
  );
}

function QuickLink({ href, title, icon: Icon }: { href: string; title: string; icon: typeof Database }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-slate-900 shadow-card hover:bg-slate-50">
      <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-emerald-600" /> {title}</span>
      <ArrowRight className="h-4 w-4 text-slate-400" />
    </Link>
  );
}
