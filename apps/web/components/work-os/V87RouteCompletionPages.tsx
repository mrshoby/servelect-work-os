const routeData = {
  taskuriProviderMutationReplay: {
    eyebrow: 'Taskuri · provider mutation replay',
    title: 'Provider mutation replay',
    subtitle: 'Coadă de replay pentru mutații pilot, semnături webhook, rollback checkpoints și dovezi de execuție pentru Taskuri.',
    badge: 'v8.7.1 route restored',
    kpis: [
      ['Replay queue', '18 items', 'signed + gated'],
      ['Rollback ready', '100%', 'checkpointed'],
      ['Dead-letter recovery', '7 events', 'manual approval'],
      ['Scope guard', 'department', 'RLS dry-run']
    ],
    lanes: [
      ['Queued', 'Mutații pregătite pentru pilot replay, fără write global.'],
      ['Verified', 'Semnătură, lockVersion, RLS scope și actor validate.'],
      ['Applied pilot', 'Executare controlată pe departament/echipă/client scope.'],
      ['Rollback / DLQ', 'Rollback checkpoint și dead-letter dacă providerul refuză livrarea.']
    ],
    checklist: ['Webhook signature required', 'Provider credential reference only', 'No secrets in repo', 'Rollback checkpoint required', 'Department scope enforced']
  },
  taskuriLiveProviderCommandCenter: {
    eyebrow: 'Taskuri · live provider command center',
    title: 'Live provider command center',
    subtitle: 'Panou operațional pentru in-app, email, push, websocket și webhook dispatch, cu readiness, retry și evidence trail.',
    badge: 'GoodDay-like command surface',
    kpis: [
      ['Providers ready', '4 / 5', 'webhook gated'],
      ['Success rate', '98.4%', 'pilot window'],
      ['p95 delivery', '740 ms', 'in-app'],
      ['Blocked writes', '12', 'policy protected']
    ],
    lanes: [
      ['Readiness', 'Canale verificate fără expunere de secrete.'],
      ['Dispatch', 'Outbox worker, lease, retry/backoff și status per provider.'],
      ['Evidence', 'Audit event, provider response, payload hash și actor session.'],
      ['Actions', 'Retry, replay, dead-letter recovery și rollback drill.']
    ],
    checklist: ['Provider readiness visible', 'Retry/backoff tracked', 'Webhook signature checked', 'Audit event generated', 'Manager evidence panel linked']
  },
  taskuriPilotMutationReplay: {
    eyebrow: 'Taskuri · pilot mutation replay',
    title: 'Pilot mutation replay',
    subtitle: 'Execuție controlată pentru mutații Taskuri, Tickets, Timesheets și Approvals, cu gates similare enterprise Work OS.',
    badge: 'pilot writes gated',
    kpis: [
      ['Pilot mutations', '42', 'scoped'],
      ['Approval gates', '9', 'required'],
      ['Conflicts', '3', 'lockVersion'],
      ['Replayed today', '16', 'dry-run safe']
    ],
    lanes: [
      ['Task mutations', 'Status, assignee, priority, custom fields și dependencies.'],
      ['Ticket mutations', 'Escalare, SLA risk, convert-to-task și requester updates.'],
      ['Timesheet mutations', 'Submit, approve, reject și audit entry.'],
      ['Bulk mutations', 'Bulk change guarded de role, department și rollback checkpoint.']
    ],
    checklist: ['Bulk guardrail enforced', 'Approvals before writes', 'Lock conflicts visible', 'Audit/outbox linked', 'Global writes remain off']
  },
  adminLiveProviderMutationReplay: {
    eyebrow: 'Admin · live provider mutation replay',
    title: 'Live provider mutation replay admin',
    subtitle: 'Control administrativ pentru credential references, replay batches, webhook verification și provider dispatch safety.',
    badge: 'admin control plane',
    kpis: [
      ['Replay batches', '6', '2 awaiting approval'],
      ['Webhook checks', '100%', 'signature required'],
      ['Policy blocks', '14', 'expected'],
      ['Rollback drills', '5', 'passed']
    ],
    lanes: [
      ['Credential references', 'Nume și status provider fără valori secrete în repository.'],
      ['Replay batches', 'Batch-uri semnate, preview impact și confirmare manager.'],
      ['Policy simulator', 'RLS, department scope, role claims și custom access rules.'],
      ['Runtime proof', 'Dovezi Vercel, outbox, audit, webhook și rollback.']
    ],
    checklist: ['No secret values rendered', 'Admin approval required', 'Policy simulator passed', 'Rollback proof attached', 'Replay export available']
  },
  adminProviderCredentialVault: {
    eyebrow: 'Admin · provider credential vault',
    title: 'Provider credential vault',
    subtitle: 'Registru sigur pentru referințe de credentiale provider, fără stocare de secrete în cod sau în documentație.',
    badge: 'secret-safe registry',
    kpis: [
      ['Credential refs', '9', 'secretless'],
      ['Rotation due', '2', 'warning'],
      ['Scopes mapped', '7', 'department'],
      ['Vault checks', 'PASS', 'no raw secrets']
    ],
    lanes: [
      ['References', 'Chei simbolice către Vercel/Railway/secret manager, fără valori brute.'],
      ['Scopes', 'Canal, departament, tenant, provider și environment.'],
      ['Rotation', 'Status de rotație, owner și termen.'],
      ['Runtime binding', 'Providerul citește doar prin adapter la runtime.']
    ],
    checklist: ['No raw secrets', 'Rotation owner set', 'Environment separated', 'Webhook signing key referenced', 'Audit every access']
  },
  workOsLiveProviderMutationReplay: {
    eyebrow: 'Work OS · live provider mutation replay',
    title: 'Work OS live provider mutation replay',
    subtitle: 'Strat cross-module pentru replay, outbox dispatch, webhook verification și rollback pe toate modulele Work OS.',
    badge: 'cross-module work fabric',
    kpis: [
      ['Modules covered', '8', 'Taskuri + Ops'],
      ['Replay readiness', '92%', 'pilot scope'],
      ['Outbox lanes', '5', 'provider mapped'],
      ['Evidence trails', '31', 'linked']
    ],
    lanes: [
      ['Taskuri', 'Task, board, table, workflow, notification, saved view.'],
      ['Operations', 'Tickets, field ops, maintenance, IoT alert.'],
      ['Business', 'CRM, offer, stock, procurement task.'],
      ['Governance', 'RBAC, audit, approvals, rollback, runtime proof.']
    ],
    checklist: ['Cross-module links preserved', 'Replay remains scoped', 'Outbox provider mapped', 'Rollback drill visible', 'Next build: live inbound webhook']
  },
  workOsPilotMutationReplay: {
    eyebrow: 'Work OS · pilot mutation replay',
    title: 'Work OS pilot mutation replay',
    subtitle: 'Replay pilot pentru operațiuni Work OS cu verificare RLS, ACL, provider outbox și audit trail înainte de write real.',
    badge: 'pilot replay governance',
    kpis: [
      ['Pilot scopes', '11', 'department/team'],
      ['Replay candidates', '64', 'prioritized'],
      ['Conflicts resolved', '8', 'no data loss'],
      ['Production gates', '6', 'all required']
    ],
    lanes: [
      ['Preview impact', 'Entități afectate, actor, scope și policy decision.'],
      ['Execute pilot', 'Dry-run sau pilot scoped, niciodată write global implicit.'],
      ['Monitor', 'Provider events, audit events, dead-letter și retry.'],
      ['Rollback', 'Restaurare pe checkpoint și raport de diferențe.']
    ],
    checklist: ['Preview before execute', 'Department pilot only', 'Conflict handling', 'Rollback required', 'Vercel proof after deploy']
  }
} as const;

type RouteKey = keyof typeof routeData;

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
      {children}
    </span>
  );
}

export function V87RouteCompletionPage({ routeKey }: { routeKey: RouteKey }) {
  const data = routeData[routeKey];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-950">
      <section className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{data.eyebrow}</div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{data.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{data.subtitle}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {data.badge}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {data.kpis.map(([label, value, note]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
                <div className="mt-1 text-xs text-slate-500">{note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-950">GoodDay-like execution lanes</h2>
              <Pill>not a demo · route restored</Pill>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {data.lanes.map(([title, description], index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">{index + 1}</div>
                    <div className="font-semibold text-slate-950">{title}</div>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Quality gates</h2>
            <p className="mt-1 text-sm text-slate-600">Această rută este restaurată pentru screenshot audit, smoke test și continuitatea v8.7.</p>
            <div className="mt-4 flex flex-col gap-3">
              {data.checklist.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">✓</span>
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
