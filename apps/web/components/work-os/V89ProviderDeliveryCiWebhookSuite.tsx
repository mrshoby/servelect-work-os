import {
  v89ProviderChannels,
  v89SignedWebhookDrills,
  v89PixelDiffGates,
  v89ReplayRecoveryLanes,
  v89ManagerEvidence,
  v89GoodDayParityLanes,
  v89RuntimeProof,
} from "@/lib/enterprise/work-os-v89-provider-delivery-ci-webhook";

type V89Mode =
  | "taskuri-provider-delivery"
  | "taskuri-pixel-diff"
  | "taskuri-webhook-intake"
  | "taskuri-manager-evidence"
  | "taskuri-replay-recovery"
  | "work-os-provider-delivery"
  | "work-os-webhook-intake"
  | "work-os-replay-recovery"
  | "admin-provider-delivery"
  | "admin-pixel-diff"
  | "admin-webhook-intake"
  | "admin-manager-evidence"
  | "admin-replay-recovery";

export function V89ProviderDeliveryCiWebhookSuite({
  title,
  mode,
  badge,
}: {
  title: string;
  mode: V89Mode;
  badge: string;
}) {
  const isAdmin = mode.startsWith("admin");
  const isTaskuri = mode.startsWith("taskuri");
  const focus = isAdmin
    ? "Admin governance, secrets readiness, CI gates, webhook verification and release controls"
    : isTaskuri
      ? "Taskuri evidence, manager approval, inbox/action required and provider delivery feedback loops"
      : "Work OS runtime proof, provider delivery, replay recovery and signed webhook intake";

  return (
    <main className="v89-shell">
      <section className="v89-hero">
        <div>
          <div className="v89-kicker">SERVELECT WORK OS · v8.9.0 major release</div>
          <h1>{title}</h1>
          <p>{focus}. Buildul păstrează identitatea Servelect, dar întărește logica GoodDay-like: My Work, action required, workflow gates, views, provider evidence, audit și enterprise controls.</p>
        </div>
        <aside className="v89-hero-card">
          <span>{badge}</span>
          <strong>Global writes remain gated</strong>
          <small>delivery worker: dry-run/live split · webhook HMAC · pixel-diff CI · rollback checkpoint</small>
        </aside>
      </section>

      <section className="v89-grid v89-grid-4">
        {v89RuntimeProof.map((item) => (
          <article className="v89-card" key={item.label}>
            <span className={`v89-dot ${item.tone}`} />
            <div className="v89-card-label">{item.label}</div>
            <div className="v89-card-value">{item.value}</div>
            <p>{item.note}</p>
          </article>
        ))}
      </section>

      <section className="v89-layout">
        <div className="v89-panel v89-panel-large">
          <div className="v89-panel-head">
            <div>
              <div className="v89-kicker">Provider delivery worker</div>
              <h2>Dry-run/live split, retry/backoff și outbox evidence</h2>
            </div>
            <button className="v89-button">Run delivery proof</button>
          </div>
          <div className="v89-table">
            <div className="v89-tr v89-th"><span>Provider</span><span>Status</span><span>Queue</span><span>Retry</span><span>Evidence</span></div>
            {v89ProviderChannels.map((row) => (
              <div className="v89-tr" key={row.provider}>
                <span>{row.provider}</span>
                <span><mark className={`v89-pill ${row.tone}`}>{row.status}</mark></span>
                <span>{row.queue}</span>
                <span>{row.retry}</span>
                <span>{row.evidence}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="v89-panel">
          <div className="v89-kicker">GoodDay parity delta</div>
          <h2>Work OS gates</h2>
          {v89GoodDayParityLanes.map((lane) => (
            <div className="v89-lane" key={lane.name}>
              <div><strong>{lane.name}</strong><small>{lane.note}</small></div>
              <span>{lane.score}</span>
            </div>
          ))}
        </aside>
      </section>

      <section className="v89-grid v89-grid-3">
        <div className="v89-panel">
          <div className="v89-kicker">Signed inbound webhook intake</div>
          <h2>HMAC, timestamp, nonce, idempotency</h2>
          {v89SignedWebhookDrills.map((item) => (
            <div className="v89-check" key={item.name}><span>✓</span><div><strong>{item.name}</strong><small>{item.note}</small></div></div>
          ))}
        </div>

        <div className="v89-panel">
          <div className="v89-kicker">Pixel-diff CI gates</div>
          <h2>Screenshot baseline + route matrix</h2>
          {v89PixelDiffGates.map((item) => (
            <div className="v89-check" key={item.name}><span>✓</span><div><strong>{item.name}</strong><small>{item.note}</small></div></div>
          ))}
        </div>

        <div className="v89-panel">
          <div className="v89-kicker">Dead-letter recovery</div>
          <h2>Replay queue cu rollback proof</h2>
          {v89ReplayRecoveryLanes.map((item) => (
            <div className="v89-check" key={item.name}><span>✓</span><div><strong>{item.name}</strong><small>{item.note}</small></div></div>
          ))}
        </div>
      </section>

      <section className="v89-panel">
        <div className="v89-panel-head">
          <div>
            <div className="v89-kicker">Manager approval evidence panel</div>
            <h2>Action Required + audit + provider delivery într-o singură zonă</h2>
          </div>
          <button className="v89-button v89-button-secondary">Export evidence CSV</button>
        </div>
        <div className="v89-grid v89-grid-4">
          {v89ManagerEvidence.map((item) => (
            <article className="v89-mini" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <span>{item.status}</span>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .v89-shell{min-height:100vh;background:#f6f8fb;color:#111827;padding:24px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.v89-hero{display:grid;grid-template-columns:1fr 340px;gap:18px;margin-bottom:18px}.v89-hero,.v89-panel,.v89-card{border:1px solid #dde4ee;background:#fff;border-radius:18px;box-shadow:0 14px 40px rgba(15,23,42,.06)}.v89-hero{padding:24px}.v89-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#64748b;font-weight:700}.v89-hero h1{font-size:32px;line-height:1.05;margin:10px 0;color:#0f172a}.v89-hero p{max-width:980px;color:#475569;line-height:1.65;margin:0}.v89-hero-card{background:#0f172a;color:#fff;border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:8px}.v89-hero-card span{align-self:flex-start;background:#1e293b;border:1px solid #334155;color:#bae6fd;border-radius:999px;padding:6px 10px;font-size:12px}.v89-hero-card strong{font-size:19px}.v89-hero-card small{color:#cbd5e1;line-height:1.5}.v89-grid{display:grid;gap:14px;margin-bottom:18px}.v89-grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}.v89-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}.v89-card,.v89-panel{padding:18px}.v89-card-label{color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase}.v89-card-value{font-size:25px;font-weight:800;margin:6px 0;color:#0f172a}.v89-card p,.v89-mini p{color:#64748b;font-size:13px;line-height:1.45;margin:0}.v89-dot{width:10px;height:10px;display:inline-block;border-radius:999px;margin-bottom:10px}.v89-dot.green,.v89-pill.green{background:#dcfce7;color:#166534}.v89-dot.blue,.v89-pill.blue{background:#dbeafe;color:#1d4ed8}.v89-dot.amber,.v89-pill.amber{background:#fef3c7;color:#92400e}.v89-dot.red,.v89-pill.red{background:#fee2e2;color:#991b1b}.v89-layout{display:grid;grid-template-columns:1fr 360px;gap:14px;margin-bottom:18px}.v89-panel h2{font-size:18px;margin:6px 0 14px;color:#0f172a}.v89-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:12px}.v89-button{border:0;border-radius:12px;background:#0f172a;color:#fff;padding:10px 14px;font-weight:700}.v89-button-secondary{background:#e2e8f0;color:#0f172a}.v89-table{border:1px solid #e5e7eb;border-radius:14px;overflow:hidden}.v89-tr{display:grid;grid-template-columns:1.1fr .85fr .8fr .7fr 1.2fr;gap:10px;padding:11px 12px;border-bottom:1px solid #edf2f7;font-size:13px;align-items:center}.v89-tr:last-child{border-bottom:0}.v89-th{background:#f8fafc;color:#64748b;font-size:11px;text-transform:uppercase;font-weight:800}.v89-pill{border-radius:999px;padding:5px 8px;font-size:12px;font-weight:800}.v89-lane{display:flex;justify-content:space-between;gap:10px;border-top:1px solid #edf2f7;padding:12px 0}.v89-lane small,.v89-check small{display:block;color:#64748b;margin-top:3px;line-height:1.35}.v89-lane span{font-weight:800;color:#0f172a}.v89-check{display:flex;gap:10px;border-top:1px solid #edf2f7;padding:12px 0}.v89-check span{width:24px;height:24px;border-radius:8px;background:#ecfdf5;color:#047857;display:grid;place-items:center;font-weight:900;flex:0 0 auto}.v89-mini{border:1px solid #edf2f7;border-radius:14px;padding:14px;background:#f8fafc}.v89-mini span{display:inline-flex;margin-top:10px;border-radius:999px;background:#fff;border:1px solid #dbe3ef;padding:5px 9px;font-size:12px;font-weight:800;color:#334155}@media (max-width:1100px){.v89-hero,.v89-layout,.v89-grid-3,.v89-grid-4{grid-template-columns:1fr}.v89-tr{grid-template-columns:1fr}.v89-th{display:none}}
      `}</style>
    </main>
  );
}
