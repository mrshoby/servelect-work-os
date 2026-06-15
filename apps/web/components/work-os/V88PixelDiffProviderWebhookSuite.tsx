import React from "react";

export type V88SurfaceMode =
  | "taskuri"
  | "work-os"
  | "admin"
  | "provider-secret"
  | "webhook-drill"
  | "dead-letter"
  | "visual-evidence";

const lanes = [
  {
    title: "Pixel-diff CI gates",
    score: "94% ready",
    tone: "emerald",
    description: "Baseline vizual pentru rutele Taskuri/Work OS/Admin, praguri de regresie și status per captură.",
    items: ["baseline PNG", "threshold 0.18%", "route groups", "manual approve gate"],
  },
  {
    title: "Provider secret adapter",
    score: "dry-run secure",
    tone: "blue",
    description: "Model de credential readiness fără secrete în repo: ENV binding, rotation date, owner, last check.",
    items: ["no secret in Git", "masked values", "owner", "expiry/rotation"],
  },
  {
    title: "Inbound webhook drill",
    score: "signed payload",
    tone: "violet",
    description: "Verificare HMAC, replay window, idempotency key, source IP hints și queue handoff.",
    items: ["HMAC SHA-256", "timestamp drift", "idempotency", "payload hash"],
  },
  {
    title: "Dead-letter recovery",
    score: "recoverable",
    tone: "amber",
    description: "Retry/backoff, reason code, replay queue, rollback checkpoint și manager approval înainte de reluare.",
    items: ["retry policy", "DLQ reason", "approval gate", "rollback proof"],
  },
];

const uiRoutes = [
  "/taskuri", "/taskuri/overview", "/taskuri/my-work", "/taskuri/board", "/taskuri/tabel",
  "/taskuri/provider-mutation-replay", "/taskuri/live-provider-command-center", "/taskuri/visual-evidence-center",
  "/admin/provider-credential-vault", "/admin/pixel-diff-ci-gates", "/work-os/pixel-diff-provider-webhook",
];

const providerChecks = [
  { name: "in_app", status: "ready", latency: "p95 44ms", note: "local dispatch adapter active" },
  { name: "email", status: "dry_run", latency: "p95 130ms", note: "requires provider secret binding" },
  { name: "push", status: "blocked", latency: "n/a", note: "mobile token registry not production-bound" },
  { name: "webhook", status: "signed_ready", latency: "p95 81ms", note: "HMAC drill enabled" },
  { name: "websocket", status: "shadow", latency: "p95 38ms", note: "presence channel not global" },
];

const mutationReplay = [
  { id: "MUT-870-041", entity: "ticket_escalation", scope: "Audit energetic", state: "queued_signed", risk: "low" },
  { id: "MUT-870-054", entity: "bulk_status_change", scope: "Producție", state: "approval_required", risk: "medium" },
  { id: "MUT-880-012", entity: "webhook_to_task", scope: "Comercial", state: "canary_replay", risk: "low" },
  { id: "MUT-880-019", entity: "dead_letter_recovery", scope: "Administrativ", state: "rollback_attached", risk: "medium" },
];

const css = `
.v88-shell{min-height:100vh;background:#f5f7fb;color:#172033;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:24px}.v88-frame{display:grid;grid-template-columns:280px minmax(0,1fr) 320px;gap:18px}.v88-side,.v88-card,.v88-right{background:#fff;border:1px solid #dde4ef;border-radius:18px;box-shadow:0 12px 38px rgba(15,23,42,.07)}.v88-side{padding:16px;position:sticky;top:18px;height:max-content}.v88-logo{display:flex;gap:10px;align-items:center;margin-bottom:18px}.v88-mark{width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#0f766e,#84cc16);box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}.v88-title{font-size:14px;font-weight:800}.v88-muted{color:#667085;font-size:12px}.v88-nav{display:grid;gap:6px}.v88-nav a,.v88-pill{display:flex;align-items:center;justify-content:space-between;text-decoration:none;color:#334155;border-radius:12px;padding:9px 10px;font-size:12px;border:1px solid transparent}.v88-nav a:hover,.v88-nav a.active{background:#edf6f4;border-color:#b7dfd8;color:#0f766e}.v88-main{display:grid;gap:18px}.v88-hero{background:linear-gradient(135deg,#0f172a,#123b45 58%,#136f63);color:#fff;border-radius:24px;padding:24px;box-shadow:0 18px 60px rgba(15,23,42,.22)}.v88-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#a7f3d0}.v88-hero h1{font-size:28px;line-height:1.08;margin:8px 0 10px}.v88-hero p{max-width:900px;color:#dbeafe;font-size:14px}.v88-hero-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:18px}.v88-metric{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:12px}.v88-metric strong{display:block;font-size:22px}.v88-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.v88-card{padding:16px}.v88-card h3{font-size:15px;margin:0 0 8px;color:#172033}.v88-card p{font-size:12px;color:#5f6b7a;margin:0 0 12px}.v88-tags{display:flex;flex-wrap:wrap;gap:6px}.v88-tag{font-size:11px;border:1px solid #dbe4ef;background:#f8fafc;border-radius:999px;padding:5px 8px}.v88-status{font-size:11px;font-weight:800;border-radius:999px;padding:5px 8px;background:#ecfdf5;color:#047857}.v88-status.amber{background:#fffbeb;color:#b45309}.v88-status.blue{background:#eff6ff;color:#1d4ed8}.v88-status.violet{background:#f5f3ff;color:#6d28d9}.v88-table{width:100%;border-collapse:separate;border-spacing:0 8px}.v88-table th{font-size:11px;text-align:left;color:#64748b;font-weight:700}.v88-table td{background:#f8fafc;border-top:1px solid #e5edf6;border-bottom:1px solid #e5edf6;font-size:12px;padding:9px}.v88-table td:first-child{border-left:1px solid #e5edf6;border-radius:10px 0 0 10px;font-weight:700}.v88-table td:last-child{border-right:1px solid #e5edf6;border-radius:0 10px 10px 0}.v88-right{padding:16px;height:max-content;position:sticky;top:18px}.v88-section-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.v88-section-title h2{font-size:16px;margin:0}.v88-check{display:grid;gap:8px}.v88-check div{border:1px solid #e5edf6;background:#fbfdff;border-radius:12px;padding:10px}.v88-check strong{font-size:12px}.v88-check span{display:block;font-size:11px;color:#667085;margin-top:2px}.v88-panel{border:1px dashed #b6c5d8;background:#f8fafc;border-radius:16px;padding:12px}.v88-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.v88-btn{border:1px solid #cbd5e1;background:#fff;color:#172033;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:700}.v88-btn.primary{background:#0f766e;color:#fff;border-color:#0f766e}@media(max-width:1180px){.v88-frame{grid-template-columns:1fr}.v88-side,.v88-right{position:relative;top:0}.v88-hero-grid,.v88-grid{grid-template-columns:1fr}}`;

const toneClass = (tone: string) => tone === "amber" ? "amber" : tone === "blue" ? "blue" : tone === "violet" ? "violet" : "";

export function V88PixelDiffProviderWebhookSuite({ mode = "taskuri" }: { mode?: V88SurfaceMode }) {
  const label = mode === "admin" ? "Admin security & CI" : mode === "work-os" ? "Work OS runtime" : "Taskuri command center";
  return (
    <main className="v88-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="v88-frame">
        <aside className="v88-side">
          <div className="v88-logo"><div className="v88-mark"/><div><div className="v88-title">SERVELECT WORK OS</div><div className="v88-muted">v8.8 Provider + Pixel CI</div></div></div>
          <nav className="v88-nav" aria-label="v8.8 routes">
            {uiRoutes.map((route) => <a key={route} className={route.includes(mode) ? "active" : ""} href={route}><span>{route}</span><span>↗</span></a>)}
          </nav>
        </aside>
        <div className="v88-main">
          <header className="v88-hero">
            <div className="v88-kicker">{label} · GoodDay-like production hardening</div>
            <h1>Pixel-diff CI gates, real provider secret adapter și live inbound webhook drill.</h1>
            <p>Acest build mută v8.7 din “provider mutation replay” către o suită mai completă: baseline vizual, secret readiness fără secrete în repo, payload semnat, recovery din dead-letter și evidence panel pentru manageri.</p>
            <div className="v88-hero-grid">
              <div className="v88-metric"><strong>38+</strong><span>UI screenshot gates</span></div>
              <div className="v88-metric"><strong>HMAC</strong><span>signed inbound drill</span></div>
              <div className="v88-metric"><strong>0</strong><span>secrets committed</span></div>
              <div className="v88-metric"><strong>gated</strong><span>global writes disabled</span></div>
            </div>
          </header>
          <section className="v88-grid">
            {lanes.map((lane) => <article className="v88-card" key={lane.title}>
              <div className="v88-section-title"><h3>{lane.title}</h3><span className={`v88-status ${toneClass(lane.tone)}`}>{lane.score}</span></div>
              <p>{lane.description}</p>
              <div className="v88-tags">{lane.items.map((item)=><span key={item} className="v88-tag">{item}</span>)}</div>
            </article>)}
          </section>
          <section className="v88-card">
            <div className="v88-section-title"><h2>Provider runtime readiness</h2><span className="v88-status blue">dry-run/live split</span></div>
            <table className="v88-table"><thead><tr><th>Provider</th><th>Status</th><th>Latency</th><th>Evidence</th></tr></thead><tbody>{providerChecks.map(row=><tr key={row.name}><td>{row.name}</td><td>{row.status}</td><td>{row.latency}</td><td>{row.note}</td></tr>)}</tbody></table>
          </section>
          <section className="v88-card">
            <div className="v88-section-title"><h2>Pilot mutation replay queue</h2><span className="v88-status amber">requires approval</span></div>
            <table className="v88-table"><thead><tr><th>ID</th><th>Entity</th><th>Scope</th><th>State</th><th>Risk</th></tr></thead><tbody>{mutationReplay.map(row=><tr key={row.id}><td>{row.id}</td><td>{row.entity}</td><td>{row.scope}</td><td>{row.state}</td><td>{row.risk}</td></tr>)}</tbody></table>
          </section>
        </div>
        <aside className="v88-right">
          <div className="v88-section-title"><h2>Acceptance gates</h2><span className="v88-status">active</span></div>
          <div className="v88-check">
            <div><strong>No secrets in Git</strong><span>ENV names only, masked values, rotation owner.</span></div>
            <div><strong>Webhook signature</strong><span>HMAC payload proof + timestamp drift guard.</span></div>
            <div><strong>Pixel-diff baseline</strong><span>Taskuri/Admin/Work OS critical routes with thresholds.</span></div>
            <div><strong>Dead-letter recovery</strong><span>Replay queue with rollback checkpoint and manager approval.</span></div>
            <div><strong>Global writes off</strong><span>Only scoped pilot mutations are modeled.</span></div>
          </div>
          <div className="v88-actions"><button className="v88-btn primary">Run readiness drill</button><button className="v88-btn">Export evidence</button><button className="v88-btn">Open rollback proof</button></div>
        </aside>
      </section>
    </main>
  );
}

export default V88PixelDiffProviderWebhookSuite;
