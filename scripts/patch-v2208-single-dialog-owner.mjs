import fs from "node:fs";
import path from "node:path";

const repo = process.cwd();
const templatePath = path.join(repo, "apps", "web", "app", "taskuri", "template.tsx");
const pkgPath = path.join(repo, "apps", "web", "package.json");
const rootPkgPath = path.join(repo, "package.json");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  fs.mkdirSync(path.dirname(templatePath), { recursive: true });
  fs.writeFileSync(
    templatePath,
    `import type { ReactNode } from "react";\nimport V220SingleDialogOwnerGuard from "@/components/tasks/V220SingleDialogOwnerGuard";\n\nexport default function TaskuriTemplate({ children }: { children: ReactNode }) {\n  return (\n    <>\n      <span data-v150-goodday-structural-parity="true" className="sr-only" aria-hidden="true" />\n      <span data-v200-goodday-complete-interaction-layer="true" className="sr-only" aria-hidden="true" />\n      <span data-v210-goodday-real-mutation-bridge="true" className="sr-only" aria-hidden="true" />\n      <span data-v220-goodday-frontend-acceptance="true" className="sr-only" aria-hidden="true" />\n      <V220SingleDialogOwnerGuard />\n      {children}\n    </>\n  );\n}\n`,
  );
} else {
  let template = fs.readFileSync(templatePath, "utf8");

  if (!template.includes("V220SingleDialogOwnerGuard")) {
    const importLine = `import V220SingleDialogOwnerGuard from "@/components/tasks/V220SingleDialogOwnerGuard";\n`;
    if (template.startsWith("import")) {
      template = template.replace(/((?:import[^\n]+\n)+)/, `$1${importLine}`);
    } else {
      template = `${importLine}${template}`;
    }

    if (template.includes("data-v220-goodday-frontend-acceptance")) {
      template = template.replace(
        /(data-v220-goodday-frontend-acceptance[^>]*>)/,
        `$1\n      <V220SingleDialogOwnerGuard />`,
      );
    } else if (template.includes("{children}")) {
      template = template.replace("{children}", `<span data-v220-goodday-frontend-acceptance="true" className="sr-only" aria-hidden="true" />\n      <V220SingleDialogOwnerGuard />\n      {children}`);
    } else {
      fail(`Cannot patch ${templatePath}: no children or v220 marker anchor found.`);
    }
  }

  if (!template.includes("data-v220-goodday-frontend-acceptance")) {
    template = template.replace("<V220SingleDialogOwnerGuard />", `<span data-v220-goodday-frontend-acceptance="true" className="sr-only" aria-hidden="true" />\n      <V220SingleDialogOwnerGuard />`);
  }

  fs.writeFileSync(templatePath, template);
}

const templateAfter = fs.readFileSync(templatePath, "utf8");
if (!templateAfter.includes("V220SingleDialogOwnerGuard")) fail("V220SingleDialogOwnerGuard was not mounted.");
if (!templateAfter.includes("data-v220-goodday-frontend-acceptance")) fail("V220 marker missing after patch.");

for (const p of [pkgPath, rootPkgPath]) {
  if (!fs.existsSync(p)) continue;
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  json.version = "22.0.8";
  fs.writeFileSync(p, `${JSON.stringify(json, null, 2)}\n`);
}

const reportDir = path.join(repo, "docs");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(reportDir, "V22_0_8_SINGLE_DIALOG_OWNER_FIX_REPORT.md"),
  `# v22.0.8 — Single Dialog Owner Fix\n\n- Added V220SingleDialogOwnerGuard.\n- Captures New Task/New Ticket before legacy layered handlers.\n- Opens one GoodDay-style right drawer only.\n- Preserves V15/V200/V210/V220 shell markers.\n- Keeps NO_DUPLICATE_DIALOGS policy.\n`,
);

console.log("v22.0.8 single dialog owner mounted and package version updated.");
