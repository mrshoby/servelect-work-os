"use client";

import { AlertTriangle, Bell, Building2, CheckCircle2, Clock3, Eye, GitBranch, LockKeyhole, Network, ShieldCheck, Users2 } from "lucide-react";
import {
  completionStatusV62,
  departmentApprovalsV62,
  departmentNotificationRulesV62,
  departmentTasksV62,
  explainAuditConcepts,
  getAllDepartmentDashboards,
  getVisibilityForUser,
  servelectDepartmentUsersV62,
  servelectDepartmentsV62,
  type V62DepartmentId
} from "../../lib/enterprise/work-os-v62-department-rbac";

type V62ViewMode = "command" | "routing" | "workload" | "approvals" | "admin";

interface V62DepartmentAwareRbacProps {
  mode?: V62ViewMode;
}

const modeTitles: Record<V62ViewMode, string> = {
  command: "Department Command Center",
  routing: "Department Task Routing",
  workload: "Department Workload & Visibility",
  approvals: "Department Approvals & Notifications",
  admin: "Admin Departamente Servelect"
};

const statusLabels = {
  backlog: "Backlog",
  todo: "De făcut",
  in_progress: "În lucru",
  review: "Review",
  blocked: "Blocat",
  done: "Finalizat",
  cancelled: "Anulat"
};

const priorityLabels = {
  low: "Scăzut",
  medium: "Mediu",
  high: "Ridicat",
  urgent: "Urgent",
  critical: "Critic"
};

export function V62DepartmentAwareRbac({ mode = "command" }: V62DepartmentAwareRbacProps) {
  const dashboards = getAllDepartmentDashboards();
  const auditConcepts = explainAuditConcepts();
  const superAdminVisibility = getVisibilityForUser("u1");
  const productionManagerVisibility = getVisibilityForUser("u3");
  const technicianVisibility = getVisibilityForUser("u6");
  const clientVisibility = getVisibilityForUser("u99");
  const highlightedDepartment = dashboards.find((item) => item.department.id === "productie") ?? dashboards[0];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-900 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              <Network className="h-3.5 w-3.5" /> SERVELECT WORK OS v6.2.0
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{modeTitles[mode]}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Build major pentru departamente reale Servelect: Audit, Administrativ, Automatizări, Audit energetic, Comercial, Marketing și Producție. Super Admin vede tot, iar Admin/Manager Departament vede și gestionează doar departamentul lui, taskurile lui, workload-ul și aprobările aferente.
            </p>
          </div>
          <div className="grid min-w-[280px] grid-cols-2 gap-3 text-sm">
            <MetricCard label="Departamente" value={String(servelectDepartmentsV62.length)} tone="emerald" />
            <MetricCard label="Useri demo" value={String(servelectDepartmentUsersV62.length)} tone="blue" />
            <MetricCard label="Taskuri routate" value={String(departmentTasksV62.length)} tone="amber" />
            <MetricCard label="Aprobări active" value={String(departmentApprovalsV62.length)} tone="purple" />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-4">
        {completionStatusV62.map((item) => (
          <div key={item.category} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.category}</p>
              <span className={item.trend === "up" ? "text-xs font-bold text-emerald-600" : item.trend === "needs_work" ? "text-xs font-bold text-amber-600" : "text-xs font-bold text-slate-500"}>{item.percent}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.percent}%` }} />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">{item.evidence}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <InfoPanel icon={<ShieldCheck className="h-5 w-5" />} title="Audit log ≠ Departament Audit" text={auditConcepts.auditLog} />
        <InfoPanel icon={<Building2 className="h-5 w-5" />} title="Departament Audit" text={auditConcepts.auditDepartment} />
        <InfoPanel icon={<AlertTriangle className="h-5 w-5" />} title="Audit energetic" text={auditConcepts.energyAuditDepartment} />
      </section>

      {(mode === "command" || mode === "admin") && (
        <section className="mt-6 grid gap-4 xl:grid-cols-4">
          {dashboards.map((dashboard) => (
            <article key={dashboard.department.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${dashboard.department.accent}`}>{dashboard.department.shortName}</span>
                  <h2 className="mt-3 text-lg font-bold text-slate-950">{dashboard.department.name}</h2>
                  <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{dashboard.department.description}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 text-slate-500"><Building2 className="h-5 w-5" /></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <SmallStat label="Taskuri" value={dashboard.metrics.activeTasks} />
                <SmallStat label="Aprobări" value={dashboard.metrics.pendingApprovals} />
                <SmallStat label="Blocate" value={dashboard.metrics.blockedTasks} />
                <SmallStat label="Workload" value={`${dashboard.metrics.avgWorkload}%`} />
              </div>
              <div className="mt-4 space-y-2">
                {dashboard.department.modules.slice(0, 4).map((module) => (
                  <span key={module} className="mr-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">{module}</span>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}

      {(mode === "routing" || mode === "command") && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Task routing pe departament</h2>
              <p className="mt-1 text-sm text-slate-500">Taskurile nu sunt globale implicit. Ele au departmentId, manager, owner, watcher și approval route.</p>
            </div>
            <GitBranch className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Departament</th>
                  <th className="px-4 py-3">Responsabil</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aprobare</th>
                  <th className="px-4 py-3">Motiv routing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {departmentTasksV62.map((task) => (
                  <tr key={task.id} className="align-top hover:bg-slate-50/70">
                    <td className="px-4 py-3"><div className="font-semibold text-slate-900">{task.title}</div><div className="mt-1 text-xs text-slate-500">{task.projectName}</div></td>
                    <td className="px-4 py-3"><DepartmentBadge id={task.departmentId} /></td>
                    <td className="px-4 py-3"><AvatarLine name={task.assigneeName} subtitle={task.ownerName} /></td>
                    <td className="px-4 py-3"><StatusBadge status={statusLabels[task.status]} priority={priorityLabels[task.priority]} /></td>
                    <td className="px-4 py-3">{task.approvalRequired ? <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{task.approvalStatus}</span> : <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">Nu necesită</span>}</td>
                    <td className="px-4 py-3 text-xs leading-5 text-slate-500">{task.routingReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {(mode === "workload" || mode === "command") && (
        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <VisibilityCard title="Super Admin" result={superAdminVisibility} icon={<Eye className="h-5 w-5" />} />
          <VisibilityCard title="Manager Producție" result={productionManagerVisibility} icon={<Users2 className="h-5 w-5" />} />
          <VisibilityCard title="Tehnician" result={technicianVisibility} icon={<LockKeyhole className="h-5 w-5" />} />
          <VisibilityCard title="Client" result={clientVisibility} icon={<LockKeyhole className="h-5 w-5" />} />
        </section>
      )}

      {(mode === "workload" || mode === "admin") && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Workload departament exemplu: {highlightedDepartment.department.name}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {highlightedDepartment.workload.map((item) => (
              <div key={item.userId} className="rounded-2xl border border-slate-200 p-4">
                <AvatarLine name={item.userName} subtitle={`${item.role} · ${item.presenceStatus}`} />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>Workload</span><span className="font-bold text-slate-900">{item.workloadPercent}%</span></div>
                <div className="mt-2 h-2 rounded-full bg-slate-100"><div className={item.workloadPercent > 100 ? "h-2 rounded-full bg-red-500" : "h-2 rounded-full bg-emerald-500"} style={{ width: `${Math.min(item.workloadPercent, 100)}%` }} /></div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs"><SmallStat label="Taskuri" value={item.activeTasks} /><SmallStat label="Est." value={`${item.estimateHours}h`} /><SmallStat label="Track" value={`${item.trackedHours}h`} /></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(mode === "approvals" || mode === "command") && (
        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-950">Aprobări pe departament</h2><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
            <div className="mt-4 space-y-3">
              {departmentApprovalsV62.map((approval) => (
                <div key={approval.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">{approval.title}</p><p className="mt-1 text-xs text-slate-500">{approval.reason}</p></div><DepartmentBadge id={approval.departmentId} /></div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>Aprobator: <strong className="text-slate-800">{approval.approverName}</strong></span><span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-amber-700">{approval.riskLevel}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-950">Reguli notificări șefi/admini</h2><Bell className="h-5 w-5 text-blue-600" /></div>
            <div className="mt-4 space-y-3">
              {departmentNotificationRulesV62.map((rule) => (
                <div key={rule.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3"><DepartmentBadge id={rule.departmentId} /><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{rule.trigger}</span></div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{rule.example}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500"><span>Destinatari: {rule.recipients.join(", ")}</span><span>Canal: {rule.channel}</span><span>Severitate: {rule.severity}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "emerald" | "blue" | "amber" | "purple" }) {
  const classes = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200"
  };
  return <div className={`rounded-2xl border p-3 ${classes[tone]}`}><p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>;
}

function InfoPanel({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-3 flex items-center gap-2 text-emerald-700">{icon}<h2 className="font-bold text-slate-950">{title}</h2></div><p className="text-sm leading-6 text-slate-600">{text}</p></div>;
}

function SmallStat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl bg-slate-50 p-2"><p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p></div>;
}

function DepartmentBadge({ id }: { id: V62DepartmentId }) {
  const department = servelectDepartmentsV62.find((item) => item.id === id) ?? servelectDepartmentsV62[0];
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${department.accent}`}>{department.name}</span>;
}

function AvatarLine({ name, subtitle }: { name: string; subtitle: string }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{initials}</div><div><p className="text-sm font-semibold text-slate-900">{name}</p><p className="text-xs text-slate-500">{subtitle}</p></div></div>;
}

function StatusBadge({ status, priority }: { status: string; priority: string }) {
  return <div className="flex flex-col gap-1"><span className="w-fit rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{status}</span><span className="w-fit rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">{priority}</span></div>;
}

function VisibilityCard({ title, result, icon }: { title: string; result: ReturnType<typeof getVisibilityForUser>; icon: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p><h2 className="mt-1 text-lg font-bold text-slate-950">{result.userName}</h2><p className="text-sm text-slate-500">{result.role} · {result.departmentName}</p></div><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">{icon}</div></div><div className="mt-4 grid grid-cols-3 gap-2"><SmallStat label="Taskuri" value={result.visibleTaskIds.length} /><SmallStat label="Dept." value={result.visibleDepartmentIds.length} /><SmallStat label="Assign" value={result.assignableUserIds.length} /></div><div className="mt-4 space-y-2">{result.notes.map((note) => <p key={note} className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">{note}</p>)}</div></div>;
}
