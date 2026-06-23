import fs from "node:fs";
import path from "node:path";

const repo = process.cwd();
const taskuriRoot = path.join(repo, "apps", "web", "app", "taskuri");
const componentPath = path.join(repo, "apps", "web", "components", "tasks", "V210GoodDayRealMutationBridge.tsx");

if (!fs.existsSync(componentPath)) {
  throw new Error(`Missing V210 component: ${componentPath}`);
}

const importLine = 'import V210GoodDayRealMutationBridge from "@/components/tasks/V210GoodDayRealMutationBridge";';

function routeKeyFromPage(file) {
  const rel = path.relative(taskuriRoot, path.dirname(file)).replaceAll(path.sep, "/");
  return rel === "" ? "overview" : rel;
}

const pageFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name === "page.tsx") pageFiles.push(full);
  }
}
walk(taskuriRoot);

let patched = 0;
for (const file of pageFiles) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("V150GoodDayStructuralTaskuriWorkspace") && !content.includes("V200GoodDayCompleteInteractionLayer")) continue;

  const routeKeyMatch = content.match(/routeKey=\"([^\"]+)\"/);
  const routeKey = routeKeyMatch?.[1] ?? routeKeyFromPage(file);
  const v210Line = `<V210GoodDayRealMutationBridge routeKey=\"${routeKey}\" />`;

  if (!content.includes(importLine)) {
    content = `${importLine}\n${content}`;
  }

  if (content.includes(v210Line) || content.includes("V210GoodDayRealMutationBridge" ) && content.includes(`routeKey=\"${routeKey}\"`)) {
    fs.writeFileSync(file, content, "utf8");
    patched += 1;
    continue;
  }

  const v200Regex = new RegExp(`(<V200GoodDayCompleteInteractionLayer\\s+routeKey=\\\"${routeKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\\"\\s*/>)`);
  if (v200Regex.test(content)) {
    content = content.replace(v200Regex, `$1\n      ${v210Line}`);
  } else {
    const v150SelfClosing = /return\s+<V150GoodDayStructuralTaskuriWorkspace([^>]*)\/>;/;
    if (v150SelfClosing.test(content)) {
      content = content.replace(v150SelfClosing, `return (\n    <>\n      <V150GoodDayStructuralTaskuriWorkspace$1/>\n      ${v210Line}\n    </>\n  );`);
    } else {
      throw new Error(`Could not patch Taskuri page: ${file}`);
    }
  }

  fs.writeFileSync(file, content, "utf8");
  patched += 1;
}

const rootComponent = path.join(repo, "apps", "web", "components", "tasks", "V150GoodDayStructuralTaskuriWorkspace.tsx");
if (fs.existsSync(rootComponent)) {
  let v150 = fs.readFileSync(rootComponent, "utf8");
  if (!v150.includes("data-v210-goodday-real-mutation-bridge-root")) {
    v150 = v150.replace("data-v150-goodday-structural-parity", "data-v210-goodday-real-mutation-bridge-root data-v150-goodday-structural-parity");
    fs.writeFileSync(rootComponent, v150, "utf8");
  }
}

console.log(`v21 Taskuri binding patched: ${patched}/${pageFiles.length}`);
if (patched < 17) {
  throw new Error(`Expected at least 17 Taskuri pages patched, got ${patched}`);
}

for (const pkgRel of ["package.json", path.join("apps", "web", "package.json")]) {
  const pkgPath = path.join(repo, pkgRel);
  if (!fs.existsSync(pkgPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.version = "21.0.0";
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
}
