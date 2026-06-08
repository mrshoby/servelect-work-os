import {
  getV61WorkflowAutomationSnapshot,
  simulateV61WorkflowRun,
  type V61WorkflowRule,
  type V61SlaPolicy,
  type V61GeneratedTask,
  type V61GoodDayParityScore
} from "../../lib/enterprise/work-os-v61-workflow-automation";

function toneClass(tone: string) {
  if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "blue") return "border-blue-200 bg-blue-50 text-blue-800";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-800";
  if (tone === "red") return "border-red-200 bg-red-50 text-red-800";
  if (tone === "purple") return "border-violet-200 bg-violet-50 text-violet-800";
  return "border-slate-200 bg-slate-50 text-slate-800";
}

function statusClass(status: string) {
  if (status === "active" || status === "ready" || status === "healthy") return "bg-emerald-100 text-emerald-700";
  if (status === "warning" || status === "queued" || status === "shadow" || status === "shadowed") return "bg-amber-100 text-amber-700";
  if (status === "breached" || status === "blocked" || status === "critical") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

function MetricCard({ label, value, trend, tone }: { label: string; value: string; trend: string; tone: string }) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClass(tone)}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-3xl font-black">{value}</strong>
        <span className="text-xs font-semibold opacity-80">{trend}</span>
      </div>
    </div>
  );
}

function WorkflowRuleCard({ rule }: { rule: V61WorkflowRule }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(rule.status)}`}>{rule.status}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{rule.domain}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(rule.risk)}`}>risk {rule.risk}</span>
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-950">{rule.name}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{rule.description}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Automation score</p>
          <p className="text-2xl font-black text-emerald-800">{rule.automationScore}%</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Trigger</p>
          <p className="mt-2 font-bold text-slate-900">{rule.trigger.label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">{rule.trigger.condition}</p>
          <p className="mt-2 rounded-xl bg-white p-2 text-xs text-slate-500">{rule.trigger.sampleEvent}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Actions</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {rule.actions.map((action) => (
              <div key={action.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="font-bold text-slate-900">{action.label}</p>
                <p className="mt-1 text-xs text-slate-500">{action.targetRole} · {action.targetModule}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">{action.writeMode}</span>
                  {action.auditRequired ? <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700">audit</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function SlaPolicyCard({ policy }: { policy: V61SlaPolicy }) {
  const total = Math.max(policy.activeItems, 1);
  const warningPercent = Math.round((policy.warningItems / total) * 100);
  const breachedPercent = Math.round((policy.breachedItems / total) * 100);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(policy.state)}`}>{policy.state}</span>
          <h3 className="mt-3 font-black text-slate-950">{policy.name}</h3>
          <p className="mt-1 text-sm text-slate-500">Owner: {policy.ownerRole}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>Response: <strong>{policy.responseMinutes}m</strong></p>
          <p>Resolution: <strong>{policy.resolutionMinutes}m</strong></p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between"><span>Warning</span><strong>{policy.warningItems} / {warningPercent}%</strong></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${warningPercent}%` }} /></div>
        <div className="flex justify-between"><span>Breached</span><strong>{policy.breachedItems} / {breachedPercent}%</strong></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-red-500" style={{ width: `${breachedPercent}%` }} /></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {policy.appliesTo.map((item) => <span key={item} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{item}</span>)}
      </div>
      <p className="mt-3 text-xs text-slate-500">Escalare: {policy.escalationPath.join(" → ")}</p>
    </div>
  );
}

function GeneratedTaskCard({ task }: { task: V61GeneratedTask }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(task.status)}`}>{task.status}</span>
          <h3 className="mt-3 font-black text-slate-950">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{task.projectId} · {task.linkedEntity}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(task.priority)}`}>{task.priority}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Rol asignat</p><strong>{task.assigneeRole}</strong></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Deadline</p><strong>{task.dueInHours}h</strong></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {task.auditTrail.map((event) => <span key={event} className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700">{event}</span>)}
      </div>
    </div>
  );
}

function ParityRow({ score }: { score: V61GoodDayParityScore }) {
  const gain = Math.round((score.after - score.before) * 10) / 10;
  return (
    <div className="grid gap-3 border-b border-slate-100 py-3 text-sm md:grid-cols-[1fr_80px_80px_80px_1.6fr]">
      <strong className="text-slate-900">{score.feature}</strong>
      <span>{score.before}/5</span>
      <span className="font-black text-emerald-700">{score.after}/5</span>
      <span className="font-bold text-blue-700">+{gain}</span>
      <span className="text-slate-600">{score.implemented}</span>
    </div>
  );
}

export function V61WorkflowAutomationSlaEngine() {
  const snapshot = getV61WorkflowAutomationSnapshot();
  const simulation = simulateV61WorkflowRun("wf-iot-maintenance-task");

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 lg:px-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">SERVELECT WORK OS · v6.1.0</span>
            <h1 className="mt-4 max-w-5xl text-3xl font-black tracking-tight text-slate-950 lg:text-5xl">Workflow Automation, SLA Engine & Cross-Module Task Factory</h1>
            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">Build major care transformă platforma din task manager enterprise în Work OS operațional: alerte IoT, stocuri, facturi, documente, approvals și workload generează taskuri, SLA-uri, notificări și audit în același sistem.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-black text-slate-900">GoodDay parity target</p>
            <p className="mt-1 text-slate-600">Custom workflows · SLA · recurring operations · rule engine · task factory</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {snapshot.metrics.map((metric) => <MetricCard key={metric.id} {...metric} />)}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Rule engine activ</h2>
              <p className="text-sm text-slate-500">Workflow-uri care leagă Servelect modules de taskuri, aprobări și SLA.</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">{snapshot.activeRules} active · {snapshot.shadowRules} shadow</span>
          </div>
          {snapshot.rules.map((rule) => <WorkflowRuleCard key={rule.id} rule={rule} />)}
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Simulare workflow</h2>
            <p className="mt-2 text-sm text-slate-600">Rule: {simulation.ruleName}</p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
              <p><strong>Mode:</strong> {simulation.mode}</p>
              <p><strong>Next step:</strong> {simulation.nextStep}</p>
              <p className="mt-2 text-xs text-slate-500">{simulation.auditEvent}</p>
            </div>
            <div className="mt-4 space-y-2">
              {simulation.actions.map((action) => (
                <div key={action.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                  <strong>{action.label}</strong>
                  <p className="text-xs text-slate-500">{action.writeMode} · audit {String(action.auditRequired)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">GoodDay compliance lift</h2>
            <div className="mt-4">
              {snapshot.parity.map((score) => <ParityRow key={score.feature} score={score} />)}
            </div>
          </section>
        </aside>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950">SLA command center</h2>
            <p className="text-sm text-slate-500">Politici de răspuns/rezolvare, escalări și breach-uri pe module.</p>
          </div>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">{snapshot.breachedSla} breach-uri active</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.slaPolicies.map((policy) => <SlaPolicyCard key={policy.id} policy={policy} />)}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Cross-module task factory</h2>
            <p className="text-sm text-slate-500">Taskuri generate din IoT, stocuri, facturi, documente și workload, cu audit trail.</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{snapshot.queuedTasks} ready/queued</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.generatedTasks.map((task) => <GeneratedTaskCard key={task.id} task={task} />)}
        </div>
      </section>
    </main>
  );
}
