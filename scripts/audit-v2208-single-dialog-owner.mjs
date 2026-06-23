import fs from "node:fs";
import path from "node:path";

const repo = process.cwd();
const component = path.join(repo, "apps/web/components/tasks/V220SingleDialogOwnerGuard.tsx");
const template = path.join(repo, "apps/web/app/taskuri/template.tsx");
const rows = [];
function check(name, ok) { rows.push({ name, ok }); }
const comp = fs.existsSync(component) ? fs.readFileSync(component, "utf8") : "";
const tpl = fs.existsSync(template) ? fs.readFileSync(template, "utf8") : "";
check("Single dialog owner component exists", !!comp);
check("Mounted in /taskuri template", tpl.includes("V220SingleDialogOwnerGuard"));
check("Capture-phase document click owner", comp.includes("document.addEventListener(\"click\", onClickCapture, { capture: true })"));
check("Stops propagation before legacy layers", comp.includes("stopImmediatePropagation"));
check("New Task detection", comp.includes("new-task") && comp.includes("new task"));
check("New Ticket detection", comp.includes("new-ticket") && comp.includes("new ticket"));
check("No duplicate dialogs policy", comp.includes("NO_DUPLICATE_DIALOGS"));
check("Owned dialog marker", comp.includes("data-v2208-owned-dialog"));
check("Suppresses duplicate legacy dialogs", comp.includes("data-v2208-suppressed-duplicate-dialog"));
check("Persists single dialog records", comp.includes("servelect-work-os:v2208:single-dialog-records"));

const passed = rows.filter(r => r.ok).length;
const out = [`# v22.0.8 Single Dialog Owner Audit`, ``, `Passed: ${passed} / ${rows.length}`, ``, `| Check | PASS/FAIL |`, `|---|---:|`, ...rows.map(r => `| ${r.name} | ${r.ok ? "PASS" : "FAIL"} |`)].join("\n");
fs.mkdirSync(path.join(repo, "audit-results"), { recursive: true });
fs.writeFileSync(path.join(repo, "audit-results/v2208-single-dialog-owner-audit.md"), `${out}\n`);
console.log(out);
if (passed !== rows.length) process.exit(1);
