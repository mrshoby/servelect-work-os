"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Database, GitBranch, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type SystemStatus = {
  app: { name: string; version: string; channel: string; environment: string; nodeEnv: string };
  runtime: { dataProvider: string; requestedDataProvider: string; hasDatabaseUrl: boolean; prismaReady: boolean; authRequired: boolean; deployUrl: string | null; commitSha: string | null };
  capabilities: { byStatus: Record<string, number>; items: Array<{ id: string; module: string; title: string; status: string; description: string; routes: string[] }> };
  roles: Array<{ role: string; permissions: string[]; count: number }>;
  dashboard?: { projects?: { total: number; active: number }; tasks?: { total: number; urgent: number }; operations?: { openAlerts: number; openTickets: number; pendingApprovals: number } };
};

type Readiness = {
  ready: boolean;
  productionReady: boolean;
  summary: { pass: number; warn: number; fail: number };
  checks: Array<{ id: string; label: string; status: "pass" | "warn" | "fail"; detail: string }>;
};

const toneFor = (status: string) => status === "pass" || status === "ready" ? "green" : status === "warn" || status === "foundation" || status === "mock" ? "orange" : status === "planned" ? "blue" : "red";

export function SystemStatusPanel() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);

  useEffect(() => {
    void Promise.all([
      fetch("/api/v1/system/status").then((res) => res.json()),
      fetch("/api/v1/system/readiness").then((res) => res.json())
    ]).then(([statusResponse, readinessResponse]) => {
      setStatus(statusResponse.data);
      setReadiness(readinessResponse.data);
    }).catch(() => {
      setStatus(null);
      setReadiness(null);
    });
  }, []);

  if (!status || !readiness) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-card">Se încarcă statusul v0.8...</div>;
  }

  const totalCapabilities = Object.values(status.capabilities.byStatus).reduce((sum, value) => sum + Number(value), 0);
  const foundationPercent = totalCapabilities ? Math.round(((status.capabilities.byStatus.ready ?? 0) + (status.capabilities.byStatus.foundation ?? 0)) / totalCapabilities * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><GitBranch className="h-5 w-5" /></div>
            <div>
              <div className="text-xs font-black uppercase text-slate-500">Versiune</div>
              <div className="text-xl font-black text-slate-950">v{status.app.version}</div>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">{status.app.channel}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Database className="h-5 w-5" /></div>
            <div>
              <div className="text-xs font-black uppercase text-slate-500">Data provider</div>
              <div className="text-xl font-black text-slate-950">{status.runtime.dataProvider}</div>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">requested: {status.runtime.requestedDataProvider}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-700"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <div className="text-xs font-black uppercase text-slate-500">Protected app</div>
              <div className="text-xl font-black text-slate-950">{status.runtime.authRequired ? "ON" : "DEMO"}</div>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">SERVELECT_REQUIRE_AUTH</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700"><AlertTriangle className="h-5 w-5" /></div>
            <div>
              <div className="text-xs font-black uppercase text-slate-500">Readiness</div>
              <div className="text-xl font-black text-slate-950">{readiness.ready ? "OK" : "FAIL"}</div>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">{readiness.summary.warn} warnings · {readiness.summary.fail} errors</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <Card>
          <CardHeader title="Readiness checks" subtitle="Build/runtime checks pentru deploy, auth, provider și DB." />
          <div className="space-y-3 p-5 pt-0">
            {readiness.checks.map((check) => (
              <div key={check.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-xl bg-white text-slate-700 shadow-sm">
                  {check.status === "pass" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-black text-slate-950">{check.label}</div>
                    <Badge tone={toneFor(check.status)}>{check.status}</Badge>
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">{check.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Capability map" subtitle="Ce este gata, foundation, mock sau planned." />
          <div className="p-5 pt-0">
            <div className="mb-5">
              <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
                <span>Foundation coverage</span><span>{foundationPercent}%</span>
              </div>
              <ProgressBar value={foundationPercent} />
            </div>

            <div className="space-y-3">
              {status.capabilities.items.map((capability) => (
                <div key={capability.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-black text-slate-950">{capability.title}</div>
                      <div className="text-xs font-semibold text-slate-500">{capability.module}</div>
                    </div>
                    <Badge tone={toneFor(capability.status)}>{capability.status}</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="RBAC matrix" subtitle="Permisiuni pe roluri Servelect, folosite de auth/authorize și protected API." />
        <div className="grid gap-3 p-5 pt-0 md:grid-cols-2 xl:grid-cols-4">
          {status.roles.map((role) => (
            <div key={role.role} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-sm font-black text-slate-950">{role.role}</div>
                <Badge tone="blue">{role.count}</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 8).map((permission) => <span key={permission} className="rounded-full bg-white px-2 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">{permission}</span>)}
                {role.permissions.length > 8 && <span className="rounded-full bg-slate-900 px-2 py-1 text-[11px] font-bold text-white">+{role.permissions.length - 8}</span>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
