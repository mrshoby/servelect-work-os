#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';

const routes = [
  ['01_taskuri_overview', '/taskuri/overview'],
  ['02_taskuri_my_work', '/taskuri/my-work'],
  ['03_taskuri_tickets_notificari', '/taskuri/tickets-notificari'],
  ['04_taskuri_proiecte_active', '/taskuri/proiecte-active'],
  ['05_taskuri_proiecte_viitoare', '/taskuri/proiecte-viitoare'],
  ['06_taskuri_proiecte_finalizate', '/taskuri/proiecte-finalizate'],
  ['07_taskuri_board', '/taskuri/board'],
  ['08_taskuri_tabel', '/taskuri/tabel'],
  ['09_taskuri_calendar_gantt', '/taskuri/calendar-gantt'],
  ['10_taskuri_workload_aprobari', '/taskuri/workload-aprobari'],
];

function argValue(name, fallback = '') {
  const ix = process.argv.indexOf(name);
  if (ix >= 0 && process.argv[ix + 1]) return process.argv[ix + 1];
  return fallback;
}

const browserPath = argValue('--browser');
const baseUrl = argValue('--base', 'http://127.0.0.1:3100').replace(/\/$/, '');
const outDir = argValue('--out', path.join(os.homedir(), 'Downloads', 'SERVELECT_WORK_OS_v6.4.22_REAL_SCREENSHOTS'));
const width = Number(argValue('--width', '1440'));
const height = Number(argValue('--height', '1100'));
const waitMs = Number(argValue('--waitMs', '4500'));
const port = Number(argValue('--port', String(9222 + Math.floor(Math.random() * 1000))));

if (!browserPath || !fs.existsSync(browserPath)) {
  console.error(`Browser path invalid: ${browserPath}`);
  process.exit(2);
}
if (typeof WebSocket === 'undefined') {
  console.error('Node global WebSocket is unavailable. Use Node 20+ or install a browser automation package.');
  process.exit(3);
}
fs.mkdirSync(outDir, { recursive: true });

function writeText(file, text) {
  fs.writeFileSync(path.join(outDir, file), text, 'utf8');
}

function httpJson(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: opts.method || 'GET' }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 0, body, json: body ? JSON.parse(body) : null });
        } catch (err) {
          reject(new Error(`Invalid JSON from ${url}: ${err.message}\n${body.slice(0, 500)}`));
        }
      });
    });
    req.on('error', reject);
    req.end(opts.body || undefined);
  });
}

async function waitForDevtools() {
  const versionUrl = `http://127.0.0.1:${port}/json/version`;
  const deadline = Date.now() + 25000;
  let last;
  while (Date.now() < deadline) {
    try {
      const res = await httpJson(versionUrl);
      if (res.status === 200 && res.json) return res.json;
    } catch (err) {
      last = err;
    }
    await delay(400);
  }
  throw new Error(`DevTools did not start on port ${port}. Last error: ${last?.message || 'unknown'}`);
}

function cdpConnect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const events = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result || {});
    } else if (msg.method) {
      events.push(msg);
    }
  };
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`WebSocket open timeout ${wsUrl}`)), 10000);
    ws.onerror = (err) => {
      clearTimeout(timer);
      reject(new Error(`WebSocket error ${wsUrl}: ${err.message || err.type || 'unknown'}`));
    };
    ws.onopen = () => {
      clearTimeout(timer);
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          const payload = JSON.stringify({ id, method, params });
          return new Promise((resolve, reject) => {
            pending.set(id, { resolve, reject });
            ws.send(payload);
            setTimeout(() => {
              if (pending.has(id)) {
                pending.delete(id);
                reject(new Error(`CDP timeout: ${method}`));
              }
            }, 20000);
          });
        },
        close() { try { ws.close(); } catch {} },
        events,
      });
    };
  });
}

async function newPage(url) {
  // Chromium/Edge now expects PUT for /json/new.
  const targetUrl = `http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`;
  let res = await httpJson(targetUrl, { method: 'PUT' }).catch(async () => null);
  if (!res || res.status >= 400) res = await httpJson(targetUrl, { method: 'GET' });
  if (!res.json?.webSocketDebuggerUrl) {
    throw new Error(`Could not create target for ${url}. Status=${res.status}, body=${String(res.body).slice(0, 500)}`);
  }
  return res.json;
}

async function closePage(id) {
  if (!id) return;
  try { await httpJson(`http://127.0.0.1:${port}/json/close/${id}`); } catch {}
}

async function fetchHttpStatus(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    return res.status;
  } catch {
    return 0;
  }
}

async function captureRoute(name, route) {
  const url = `${baseUrl}${route}`;
  const pngPath = path.join(outDir, `${name}.png`);
  const htmlPath = path.join(outDir, `${name}.html`);
  const consolePath = path.join(outDir, `${name}_console.json`);
  const stdoutLog = path.join(outDir, `${name}_browser_stdout.log`);
  const stderrLog = path.join(outDir, `${name}_browser_stderr.log`);
  fs.writeFileSync(stdoutLog, 'Captured by CDP, shared browser process.\n');
  fs.writeFileSync(stderrLog, 'Captured by CDP, shared browser process.\n');
  const httpStatus = await fetchHttpStatus(url);
  let target;
  let cdp;
  let state = 'FAIL';
  let bytes = 0;
  let note = '';
  try {
    target = await newPage(url);
    cdp = await cdpConnect(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable').catch(() => {});
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: width,
      screenHeight: height,
    });
    await cdp.send('Page.navigate', { url });
    await delay(waitMs);
    await cdp.send('Runtime.evaluate', { expression: 'document.fonts && document.fonts.ready', awaitPromise: true }).catch(() => {});
    await delay(500);
    const htmlEval = await cdp.send('Runtime.evaluate', { expression: 'document.documentElement.outerHTML', returnByValue: true });
    const html = htmlEval?.result?.value || '';
    fs.writeFileSync(htmlPath, html, 'utf8');
    const textEval = await cdp.send('Runtime.evaluate', { expression: 'document.body ? document.body.innerText : ""', returnByValue: true });
    const bodyText = String(textEval?.result?.value || '');
    const metrics = await cdp.send('Runtime.evaluate', {
      expression: `JSON.stringify({
        title: document.title,
        bodyTextLength: document.body ? document.body.innerText.length : 0,
        bodyChildCount: document.body ? document.body.children.length : 0,
        appError: document.body ? document.body.innerText.includes('Application error') : false,
        cssLinks: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).length,
        scripts: Array.from(document.scripts).length,
        width: window.innerWidth,
        height: window.innerHeight,
        readyState: document.readyState
      })`,
      returnByValue: true,
    });
    const consoleEvents = cdp.events.slice(-200);
    fs.writeFileSync(consolePath, JSON.stringify({ metrics: JSON.parse(metrics.result.value), events: consoleEvents }, null, 2), 'utf8');
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
    if (shot?.data) {
      fs.writeFileSync(pngPath, Buffer.from(shot.data, 'base64'));
      bytes = fs.statSync(pngPath).size;
    }
    if (!bytes) state = 'NO_PNG';
    else if (bodyText.includes('Application error')) state = 'CAPTURED_BUT_CLIENT_ERROR';
    else if (bytes < 5000) state = 'CAPTURED_SMALL_OR_ERROR';
    else state = 'CAPTURED';
  } catch (err) {
    note = err?.stack || err?.message || String(err);
    fs.writeFileSync(path.join(outDir, `${name}_capture_error.log`), note, 'utf8');
    state = bytes ? 'CAPTURED_BUT_ERROR' : 'NO_PNG';
  } finally {
    if (cdp) cdp.close();
    if (target?.id) await closePage(target.id);
  }
  return { name, route, httpStatus, state, bytes, attempt: 'cdp', note };
}

async function main() {
  const userDataDir = path.join(outDir, '_edge_cdp_profile');
  fs.rmSync(userDataDir, { recursive: true, force: true });
  fs.mkdirSync(userDataDir, { recursive: true });
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--disable-software-rasterizer=false',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    `--window-size=${width},${height}`,
    'about:blank',
  ];
  const proc = spawn(browserPath, args, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  const browserStdout = [];
  const browserStderr = [];
  proc.stdout.on('data', (d) => browserStdout.push(d.toString()));
  proc.stderr.on('data', (d) => browserStderr.push(d.toString()));
  try {
    await waitForDevtools();
    const results = [];
    for (const [name, route] of routes) {
      const result = await captureRoute(name, route);
      results.push(result);
      console.log(`${name} -> ${result.state} | HTTP ${result.httpStatus} | ${result.bytes} bytes | ${result.attempt}`);
    }
    fs.writeFileSync(path.join(outDir, 'browser_process_stdout.log'), browserStdout.join(''), 'utf8');
    fs.writeFileSync(path.join(outDir, 'browser_process_stderr.log'), browserStderr.join(''), 'utf8');
    const csv = ['Name,Route,HTTP,State,PNG bytes,Attempt,Note', ...results.map(r => [r.name, r.route, r.httpStatus, r.state, r.bytes, r.attempt, JSON.stringify((r.note || '').slice(0,200))].join(','))].join('\n');
    writeText('SCREENSHOT_AUDIT_RESULTS.csv', csv + '\n');
    const captured = results.filter(r => r.state === 'CAPTURED').length;
    const problems = results.length - captured;
    const table = results.map(r => `| ${r.name} | ${r.route} | ${r.httpStatus} | ${r.state} | ${r.bytes} | ${r.attempt} |`).join('\n');
    writeText('SCREENSHOT_AUDIT_REPORT.md', `# SERVELECT WORK OS v6.4.22 CDP screenshot audit\n\nGenerated: ${new Date().toISOString()}\nBaseUrl: ${baseUrl}\nBrowser: ${browserPath}\nEngine: Chrome DevTools Protocol Page.captureScreenshot\n\nCaptured clean: ${captured} / ${results.length}\nProblem routes: ${problems} / ${results.length}\n\n| Name | Route | HTTP | State | PNG bytes | Attempt |\n|---|---|---:|---|---:|---|\n${table}\n\n## Evidence\nEach route has .png, .html, _console.json and capture logs where applicable.\n`);
    process.exitCode = problems ? 10 : 0;
  } finally {
    try { proc.kill(); } catch {}
  }
}

main().catch((err) => {
  console.error(err.stack || err.message || String(err));
  writeText('CDP_AUDIT_FATAL_ERROR.log', err.stack || err.message || String(err));
  process.exit(1);
});
