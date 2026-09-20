import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const ORIGIN = process.env.CV_ORIGIN || "http://127.0.0.1:8765";
const LANGS = ["en", "es"];
const CDP_MS = 30000;

const chrome = spawn(
  resolveChrome(),
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--font-render-hinting=none",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${join(tmpdir(), "cv-chrome")}`,
    "--remote-debugging-port=9222",
    "--remote-debugging-address=127.0.0.1"
  ],
  { stdio: ["ignore", "pipe", "pipe"] }
);

chrome.stdout.setEncoding("utf8");
chrome.stderr.setEncoding("utf8");
let ws;

try {
  ws = await openWs(await waitForDevTools(chrome));
  const page = await sessionSend(bindCdp(ws));

  await page("Page.enable");
  await page("Runtime.enable");
  await page("Emulation.setDeviceMetricsOverride", {
    width: 900,
    height: 1400,
    deviceScaleFactor: 1,
    mobile: false
  });
  await page("Emulation.setEmulatedMedia", {
    media: "print",
    features: [{ name: "prefers-color-scheme", value: "dark" }]
  });
  await page("Emulation.setDefaultBackgroundColorOverride", {
    color: { r: 45, g: 42, b: 46, a: 1 }
  });

  for (const lang of LANGS) {
    const nav = await page("Page.navigate", { url: `${ORIGIN}/cv/?lang=${lang}` });
    if (nav.errorText) throw new Error(`navigate ${lang}: ${nav.errorText}`);
    await waitForReady(page, lang);
    const pdfOptions = {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false
    };
    let data;
    try {
      ({ data } = await page("Page.printToPDF", {
        ...pdfOptions,
        generateTaggedPDF: true
      }));
    } catch (_) {
      ({ data } = await page("Page.printToPDF", pdfOptions));
    }
    if (!data) throw new Error(`printToPDF returned no data for ${lang}`);
    const out = `docs/cv/cv-${lang}.pdf`;
    await writeFile(out, Buffer.from(data, "base64"));
    console.log("wrote", out);
  }
} finally {
  try { ws?.close(); } catch (_) { /* ignore */ }
  chrome.kill("SIGTERM");
  await sleep(1000);
  if (chrome.exitCode == null && chrome.signalCode == null) chrome.kill("SIGKILL");
}

function resolveChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const names = [
    "google-chrome-stable",
    "google-chrome",
    "chromium-browser",
    "chromium"
  ];
  for (const name of names) {
    try {
      const found = execFileSync("which", [name], { encoding: "utf8" }).trim();
      if (found) return found;
    } catch (_) { /* not on PATH */ }
  }
  const paths = [
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium"
  ];
  for (const path of paths) {
    if (existsSync(path)) return path;
  }
  throw new Error("Chrome not found. Set CHROME_PATH.");
}

function waitForDevTools(proc) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let buf = "";
    const finish = (err, url) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (err) reject(err);
      else resolve(url);
    };
    const timer = setTimeout(() => finish(new Error("Chrome did not start")), 20000);
    const onData = (chunk) => {
      process.stderr.write(chunk);
      buf += chunk;
      const match = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) finish(null, match[1]);
    };
    proc.stderr.on("data", onData);
    proc.stdout.on("data", onData);
    proc.once("error", finish);
    proc.once("exit", (code) => finish(new Error(`Chrome exited ${code}`)));
  });
}

function openWs(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const timer = setTimeout(() => {
      socket.close();
      reject(new Error("CDP WebSocket timed out"));
    }, 10000);
    socket.onopen = () => {
      clearTimeout(timer);
      resolve(socket);
    };
    socket.onerror = () => {
      clearTimeout(timer);
      reject(new Error("CDP WebSocket failed"));
    };
  });
}

function bindCdp(socket) {
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject, timer } = pending.get(msg.id);
    pending.delete(msg.id);
    clearTimeout(timer);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  };
  return (method, params = {}, sessionId) => {
    const id = ++nextId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    socket.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!pending.has(id)) return;
        pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, CDP_MS);
      pending.set(id, { resolve, reject, timer });
    });
  };
}

async function sessionSend(send) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  return (method, params) => send(method, params, sessionId);
}

async function waitForReady(page, lang) {
  const deadline = Date.now() + 10000;
  const expression =
    `document.body && document.body.classList.contains("ready") && document.documentElement.lang === "${lang}"`;
  while (Date.now() < deadline) {
    try {
      const { result } = await page("Runtime.evaluate", {
        expression,
        returnByValue: true
      });
      if (result && result.value) return;
    } catch (_) { /* context destroyed during navigation */ }
    await sleep(50);
  }
  throw new Error(`Timed out waiting for lang=${lang}`);
}
