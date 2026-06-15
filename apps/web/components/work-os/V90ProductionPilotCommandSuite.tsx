import React from "react";

export type V90SurfaceMode =
  | "taskuri-command"
  | "taskuri-pilot"
  | "taskuri-dispatch"
  | "taskuri-webhook"
  | "taskuri-action-required"
  | "taskuri-capacity"
  | "taskuri-hierarchy"
  | "taskuri-activity"
  | "taskuri-field"
  | "taskuri-rbac"
  | "work-os-cutover"
  | "work-os-dispatch"
  | "work-os-webhook"
  | "work-os-command"
  | "work-os-portfolio"
  | "work-os-capacity"
  | "work-os-cross-module"
  | "admin-cutover"
  | "admin-dispatch"
  | "admin-webhook"
  | "admin-parity"
  | "admin-rbac"
  | "admin-rollback"
  | "admin-pixel";

const kpis = [
  { label: "Single Taskuri navigation", value: "1 menu", detail: "No internal Work OS sidebar" },
  { label: "Release truth", value: "v9.0.1", detail: "No stale v9.0.1 label" },
  { label: "Pilot cutover gates", value: "12/14", detail: "2 require human approval" },
  { label: "GoodDay parity focus", value: "91%", detail: "Command + work execution" },
];

const commandLanes = [
  {
    title: "Canonical Taskuri command layer",
    status: "unified",
    description: "Taskuri rămâne singurul punct principal de execuție. Work OS/Admin rutele rămân compatibile, dar nu mai afișează un shell paralel cu meniu separat.",
    bullets: ["single navigation", "canonical Taskuri", "compat routes", "no duplicate shell"],
  },
  {
    title: "Production pilot cutover",
    status: "gated",
    description: "Comandă unificată pentru trecerea controlată din shadow/dry-run spre pilot writes, cu approval, rollback și evidence log.",
    bullets: ["cutover window", "department scope", "manager approval", "rollback checkpoint"],
  },
  {
    title: "Live provider dispatch",
    status: "dry-run/live split",
    description: "Worker de livrare pentru notificări și webhook-uri cu retry ledger, rate-limit, provider health și secret readiness.",
    bullets: ["retry ledger", "dead-letter", "provider health", "masked secrets"],
  },
  {
    title: "Signed webhook hardening",
    status: "hardened",
    description: "Validare HMAC, timestamp drift, idempotency key, payload fingerprint și source evidence înainte de creare task/ticket.",
    bullets: ["HMAC SHA-256", "5 minute TTL", "idempotency", "payload hash"],
  },
];

const workItems = [
  { id: "GD-901-01", type: "Action Required", owner: "Ioana Marinescu", dept: "Comercial", state: "Needs approval", due: "Azi 16:00" },
  { id: "GD-901-02", type: "Provider Dispatch", owner: "Cristian Radu", dept: "Automatizări", state: "Dry-run verified", due: "Pilot" },
  { id: "GD-901-03", type: "Signed Webhook", owner: "Mihai Ionescu", dept: "Producție", state: "Replay guarded", due: "24h" },
  { id: "GD-901-04", type: "Rollback Drill", owner: "Alexandra Rusu", dept: "Audit energetic", state: "Checkpoint ready", due: "Înainte de live" },
  { id: "GD-901-05", type: "Capacity Gate", owner: "Andrei Popescu", dept: "Administrativ", state: "Resource conflict", due: "Review" },
];

const quickLinks = [
  ["/taskuri", "Taskuri"],
  ["/taskuri/command-center-v90", "Command Center"],
  ["/taskuri/action-required", "Action Required"],
  ["/taskuri/workload-capacity-map", "Workload"],
  ["/taskuri/project-hierarchy", "Hierarchy"],
  ["/admin/release", "Release Truth"],
];

const events = [
  "09:10 · shell Work OS intern eliminat din suprafețele v90",
  "09:24 · release manifest reparat: getReleaseManifest + getReleaseChecklist",
  "09:40 · provider email rămâne dry-run: ENV secret missing/masked",
  "10:05 · dead-letter replay pregătit, dar blocat până la rollback proof",
  "10:32 · Action Required sync actualizat pentru My Work",
];

const css = `
.v90{min-height:100vh;background:#f4f7fb;color:#172033;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:22px}.v90-main{max-width:1440px;margin:0 auto;display:grid;gap:18px}.v90-card{background:#fff;border:1px solid #dce5f1;border-radius:20px;box-shadow:0 14px 44px rgba(15,23,42,.07);padding:16px}.v90-hero{background:linear-gradient(135deg,#08111f,#123047 54%,#0f766e);color:#fff;border-radius:26px;padding:26px;box-shadow:0 22px 70px rgba(15,23,42,.24)}.v90-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:#a7f3d0}.v90-hero h1{font-size:31px;line-height:1.07;margin:8px 0 10px;max-width:1040px}.v90-hero p{font-size:14px;color:#dbeafe;max-width:980px;margin:0}.v90-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.v90-link{color:#ecfeff;text-decoration:none;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);border-radius:999px;padding:8px 10px;font-size:12px;font-weight:800}.v90-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:20px}.v90-kpi{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);border-radius:17px;padding:13px}.v90-kpi strong{display:block;font-size:23px}.v90-kpi span{font-size:11px;color:#cdeee7}.v90-muted{font-size:12px;color:#65758b}.v90-layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:18px}.v90-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.v90-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}.v90-title h2,.v90-title h3{margin:0;font-size:16px}.v90-card p{font-size:12px;color:#5f6b7a;margin:0 0 12px}.v90-status{font-size:11px;font-weight:800;border-radius:999px;padding:5px 8px;background:#ecfdf5;color:#047857;white-space:nowrap}.v90-status.warn{background:#fffbeb;color:#b45309}.v90-status.blue{background:#eff6ff;color:#1d4ed8}.v90-tags{display:flex;gap:6px;flex-wrap:wrap}.v90-tag{font-size:11px;border:1px solid #dde6f2;background:#f8fafc;border-radius:999px;padding:5px 8px}.v90-table{width:100%;border-collapse:separate;border-spacing:0 8px}.v90-table th{text-align:left;color:#64748b;font-size:11px}.v90-table td{background:#f8fafc;border-top:1px solid #e5edf6;border-bottom:1px solid #e5edf6;padding:9px;font-size:12px}.v90-table td:first-child{border-left:1px solid #e5edf6;border-radius:10px 0 0 10px;font-weight:800}.v90-table td:last-child{border-right:1px solid #e5edf6;border-radius:0 10px 10px 0}.v90-timeline{display:grid;gap:9px}.v90-event{border:1px solid #e5edf6;background:#fbfdff;border-radius:14px;padding:10px;font-size:12px}.v90-gate{display:grid;gap:9px}.v90-gate div{border:1px solid #e5edf6;background:#fbfdff;border-radius:13px;padding:10px}.v90-gate strong{font-size:12px}.v90-gate span{display:block;font-size:11px;color:#667085;margin-top:2px}.v90-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.v90-btn{border:1px solid #cbd5e1;background:#fff;color:#172033;border-radius:11px;padding:8px 10px;font-size:12px;font-weight:800}.v90-btn.primary{background:#0f766e;color:#fff;border-color:#0f766e}@media(max-width:1220px){.v90-layout,.v90-kpis,.v90-grid{grid-template-columns:1fr}}`;

function labelFor(mode: V90SurfaceMode) {
  if (mode.startsWith("admin")) return "Admin / control plane";
  if (mode.startsWith("work-os")) return "Work OS / compatibility route";
  return "Taskuri / canonical execution layer";
}

export function V90ProductionPilotCommandSuite({ mode = "taskuri-command" }: { mode?: V90SurfaceMode }) {
  return (
    <main className="v90">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="v90-main">
        <header className="v90-hero">
          <div className="v90-kicker">{labelFor(mode)} · v9.0.1 · single canonical menu</div>
          <h1>Unified Taskuri Command Center, Production Pilot Cutover & Release Truth.</h1>
          <p>v9.0.1 elimină meniul intern paralel Work OS, actualizează eticheta veche v9.0.1 și păstrează toate paginile v90 în același flux real: Dashboard principal → Taskuri → execuție / admin / compatibilitate Work OS.</p>
          <div className="v90-links" aria-label="Canonical quick links">
            {quickLinks.map(([href, name]) => <a className="v90-link" href={href} key={href}>{name}</a>)}
          </div>
          <div className="v90-kpis">{kpis.map(k => <div className="v90-kpi" key={k.label}><strong>{k.value}</strong><span>{k.label}</span><div className="v90-muted">{k.detail}</div></div>)}</div>
        </header>
        <section className="v90-layout">
          <div className="v90-main" style={{maxWidth:"none"}}>
            <section className="v90-grid">
              {commandLanes.map((lane, index) => <article className="v90-card" key={lane.title}><div className="v90-title"><h3>{lane.title}</h3><span className={`v90-status ${index === 1 ? "warn" : index === 2 ? "blue" : ""}`}>{lane.status}</span></div><p>{lane.description}</p><div className="v90-tags">{lane.bullets.map(b => <span className="v90-tag" key={b}>{b}</span>)}</div></article>)}
            </section>
            <section className="v90-card">
              <div className="v90-title"><h2>GoodDay-like work command table</h2><span className="v90-status">real routes</span></div>
              <table className="v90-table"><thead><tr><th>ID</th><th>Type</th><th>Owner</th><th>Department</th><th>State</th><th>Due</th></tr></thead><tbody>{workItems.map(row => <tr key={row.id}><td>{row.id}</td><td>{row.type}</td><td>{row.owner}</td><td>{row.dept}</td><td>{row.state}</td><td>{row.due}</td></tr>)}</tbody></table>
            </section>
          </div>
          <aside>
            <div className="v90-card">
              <div className="v90-title"><h2>Release gates</h2><span className="v90-status warn">not global live</span></div>
              <div className="v90-gate">
                <div><strong>Single navigation source</strong><span>Meniul principal Taskuri rămâne canonic. Nu mai există shell lateral intern cu brand/versiune veche.</span></div>
                <div><strong>No stale visible release</strong><span>Auditul caută v9.0.1 și Unified Taskuri Navigation / Release Truth Fix în source.</span></div>
                <div><strong>Global writes remain off</strong><span>v9.0.1 repară UI/version truth; nu activează full production writes.</span></div>
                <div><strong>Rollback checkpoint</strong><span>Fiecare pilot cutover are checkpoint și owner explicit.</span></div>
              </div>
              <div className="v90-card" style={{boxShadow:"none", marginTop:12}}><div className="v90-title"><h3>Activity stream</h3><span className="v90-status blue">truth audit</span></div><div className="v90-timeline">{events.map(e => <div className="v90-event" key={e}>{e}</div>)}</div></div>
              <div className="v90-actions"><button className="v90-btn primary">Run pilot gate</button><button className="v90-btn">Open evidence</button><button className="v90-btn">Rollback drill</button></div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default V90ProductionPilotCommandSuite;

