"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DialogType = "task" | "ticket";

type SingleDialogDraft = {
  type: DialogType;
  title: string;
  project: string;
  owner: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  dueDate: string;
  details: string;
};

const STORAGE_KEY = "servelect-work-os:v2208:single-dialog-records";
const LEDGER_KEY = "servelect-work-os:v22:frontend-acceptance-ledger";

const initialDraft = (type: DialogType): SingleDialogDraft => ({
  type,
  title: type === "task" ? "Task nou" : "Ticket nou",
  project: "P-2024-0187 Sistem FV 9.6 kWp Cluj-Napoca",
  owner: "Andrei Popescu",
  priority: type === "ticket" ? "High" : "Normal",
  dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10),
  details: "",
});

function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readElementIntent(element: HTMLElement) {
  const dataset = element.dataset ?? {};
  const parts = [
    dataset.action,
    dataset.intent,
    dataset.v22Action,
    dataset.v220Action,
    dataset.testid,
    element.getAttribute("data-action"),
    element.getAttribute("aria-label"),
    element.getAttribute("title"),
    element.getAttribute("href"),
    element.textContent,
  ];
  return normalizeText(parts.filter(Boolean).join(" "));
}

function detectDialogTypeFromClick(target: EventTarget | null): DialogType | null {
  if (!(target instanceof HTMLElement)) return null;

  const interactive = target.closest(
    "button, a, [role='button'], [data-action], [data-v22-action], [data-v220-action], [aria-label], [title]",
  );

  if (!(interactive instanceof HTMLElement)) return null;

  const intent = readElementIntent(interactive);

  const isTask =
    intent.includes("new-task") ||
    intent.includes("create-task") ||
    intent.includes("quick-create-task") ||
    intent.includes("new task") ||
    intent.includes("task nou") ||
    intent.includes("nou task") ||
    intent.includes("sarcina noua") ||
    intent.includes("creeaza sarcina") ||
    intent.includes("adauga sarcina") ||
    intent.includes("creare sarcina");

  const isTicket =
    intent.includes("new-ticket") ||
    intent.includes("create-ticket") ||
    intent.includes("quick-create-ticket") ||
    intent.includes("new ticket") ||
    intent.includes("ticket nou") ||
    intent.includes("nou ticket") ||
    intent.includes("tichet nou") ||
    intent.includes("creeaza ticket") ||
    intent.includes("creeaza tichet") ||
    intent.includes("adauga ticket") ||
    intent.includes("adauga tichet");

  if (isTicket) return "ticket";
  if (isTask) return "task";
  return null;
}

function appendJsonRecord(storageKey: string, record: Record<string, unknown>) {
  try {
    const existing = JSON.parse(window.localStorage.getItem(storageKey) || "[]") as unknown[];
    const next = Array.isArray(existing) ? existing : [];
    next.unshift(record);
    window.localStorage.setItem(storageKey, JSON.stringify(next.slice(0, 250)));
  } catch {
    window.localStorage.setItem(storageKey, JSON.stringify([record]));
  }
}

function hideDuplicateLegacyDialogs(owner: HTMLElement | null) {
  if (typeof document === "undefined") return;

  const dialogCandidates = Array.from(
    document.querySelectorAll<HTMLElement>(
      "[role='dialog'], [aria-modal='true'], [data-dialog], [data-drawer], .modal, .dialog, .drawer, .Dialog, .Modal",
    ),
  );

  const externalVisibleDialogs = dialogCandidates.filter((dialog) => {
    if (owner && owner.contains(dialog)) return false;
    if (dialog.closest("[data-v2208-single-dialog-owner]")) return false;
    const rect = dialog.getBoundingClientRect();
    const style = window.getComputedStyle(dialog);
    return rect.width > 40 && rect.height > 40 && style.display !== "none" && style.visibility !== "hidden";
  });

  externalVisibleDialogs.forEach((dialog) => {
    dialog.setAttribute("data-v2208-suppressed-duplicate-dialog", "true");
    dialog.setAttribute("aria-hidden", "true");
    dialog.style.display = "none";
    dialog.style.pointerEvents = "none";
  });
}

export default function V220SingleDialogOwnerGuard() {
  const [draft, setDraft] = useState<SingleDialogDraft | null>(null);
  const [feedback, setFeedback] = useState("Single dialog owner ready");
  const ownerRef = useRef<HTMLDivElement | null>(null);

  const closeDialog = useCallback(() => {
    setDraft(null);
    setFeedback("Dialog închis");
  }, []);

  const openOwnedDialog = useCallback((type: DialogType, source: string) => {
    const nextDraft = initialDraft(type);
    setDraft(nextDraft);
    setFeedback(type === "task" ? "Se deschide o singură fereastră pentru New Task" : "Se deschide o singură fereastră pentru New Ticket");

    const record = {
      id: `v2208-${type}-${Date.now()}`,
      type: "single-dialog-open",
      dialogType: type,
      source,
      policy: "NO_DUPLICATE_DIALOGS",
      owner: "V220_SINGLE_DIALOG_OWNER",
      createdAt: new Date().toISOString(),
    };

    appendJsonRecord(LEDGER_KEY, record);
    appendJsonRecord(STORAGE_KEY, record);

    requestAnimationFrame(() => hideDuplicateLegacyDialogs(ownerRef.current));
    window.setTimeout(() => hideDuplicateLegacyDialogs(ownerRef.current), 50);
    window.setTimeout(() => hideDuplicateLegacyDialogs(ownerRef.current), 250);
  }, []);

  const submitDraft = useCallback(() => {
    if (!draft) return;

    const record = {
      ...draft,
      id: `v2208-${draft.type}-${Date.now()}`,
      status: draft.type === "ticket" ? "Nou / triere" : "To do",
      policy: "NO_DUPLICATE_DIALOGS",
      owner: "V220_SINGLE_DIALOG_OWNER",
      createdAt: new Date().toISOString(),
    };

    appendJsonRecord(STORAGE_KEY, record);
    appendJsonRecord(LEDGER_KEY, {
      id: record.id,
      type: draft.type === "ticket" ? "new-ticket" : "new-task",
      action: "create-owned-single-dialog-record",
      policy: "NO_DUPLICATE_DIALOGS",
      createdAt: record.createdAt,
    });

    setFeedback(draft.type === "ticket" ? "Ticket salvat fără dialog dublu" : "Task salvat fără dialog dublu");
    setDraft(null);
  }, [draft]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    window.__SERVELECT_V2208_SINGLE_DIALOG_OWNER__ = true;

    const onClickCapture = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.defaultPrevented) return;
      if (ownerRef.current?.contains(event.target as Node)) return;

      const dialogType = detectDialogTypeFromClick(event.target);
      if (!dialogType) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const source = event.target instanceof HTMLElement ? readElementIntent(event.target) : "unknown";
      openOwnedDialog(dialogType, source || "new task/ticket button");
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && draft) {
        event.preventDefault();
        closeDialog();
      }
    };

    const observer = new MutationObserver(() => {
      if (draft) hideDuplicateLegacyDialogs(ownerRef.current);
    });

    document.addEventListener("click", onClickCapture, { capture: true });
    document.addEventListener("keydown", onKeydown, { capture: true });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("click", onClickCapture, { capture: true });
      document.removeEventListener("keydown", onKeydown, { capture: true });
      observer.disconnect();
    };
  }, [closeDialog, draft, openOwnedDialog]);

  const heading = useMemo(() => {
    if (!draft) return "";
    return draft.type === "ticket" ? "New Ticket" : "New Task";
  }, [draft]);

  return (
    <div
      ref={ownerRef}
      data-v2208-single-dialog-owner="true"
      data-no-duplicate-dialogs="true"
      data-goodday-one-window-policy="V15/V200/V210 visual shell preserved; V220 owns only duplicate prevention"
    >
      <div className="sr-only" aria-live="polite" data-v2208-single-dialog-feedback="true">
        {feedback}
      </div>

      {draft ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={heading}
          data-v2208-owned-dialog="true"
          data-dialog-owner="V220_SINGLE_DIALOG_OWNER"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483000,
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(15, 23, 42, 0.26)",
            backdropFilter: "blur(2px)",
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            style={{
              width: "min(560px, 100vw)",
              height: "100%",
              background: "#ffffff",
              borderLeft: "1px solid #e2e8f0",
              boxShadow: "-24px 0 80px rgba(15, 23, 42, 0.18)",
              display: "flex",
              flexDirection: "column",
              fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            <header style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <p style={{ margin: 0, color: "#00843d", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Servelect Work OS · GoodDay single dialog
                  </p>
                  <h2 style={{ margin: "6px 0 0", color: "#0f172a", fontSize: 22, fontWeight: 800 }}>{heading}</h2>
                </div>
                <button
                  type="button"
                  onClick={closeDialog}
                  aria-label="Închide fereastra"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  ×
                </button>
              </div>
            </header>

            <div style={{ padding: 24, display: "grid", gap: 16, overflow: "auto" }}>
              <label style={{ display: "grid", gap: 6, color: "#334155", fontSize: 13, fontWeight: 700 }}>
                Titlu
                <input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", fontSize: 14 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, color: "#334155", fontSize: 13, fontWeight: 700 }}>
                Proiect / Workspace
                <input
                  value={draft.project}
                  onChange={(event) => setDraft({ ...draft, project: event.target.value })}
                  style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", fontSize: 14 }}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "grid", gap: 6, color: "#334155", fontSize: 13, fontWeight: 700 }}>
                  Responsabil
                  <input
                    value={draft.owner}
                    onChange={(event) => setDraft({ ...draft, owner: event.target.value })}
                    style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", fontSize: 14 }}
                  />
                </label>

                <label style={{ display: "grid", gap: 6, color: "#334155", fontSize: 13, fontWeight: 700 }}>
                  Prioritate
                  <select
                    value={draft.priority}
                    onChange={(event) => setDraft({ ...draft, priority: event.target.value as SingleDialogDraft["priority"] })}
                    style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", fontSize: 14 }}
                  >
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </label>
              </div>

              <label style={{ display: "grid", gap: 6, color: "#334155", fontSize: 13, fontWeight: 700 }}>
                Deadline
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
                  style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", fontSize: 14 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, color: "#334155", fontSize: 13, fontWeight: 700 }}>
                Detalii
                <textarea
                  value={draft.details}
                  onChange={(event) => setDraft({ ...draft, details: event.target.value })}
                  rows={5}
                  style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 12px", fontSize: 14, resize: "vertical" }}
                />
              </label>
            </div>

            <footer style={{ marginTop: "auto", padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={closeDialog}
                style={{ border: "1px solid #cbd5e1", background: "#ffffff", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}
              >
                Anulează
              </button>
              <button
                type="button"
                onClick={submitDraft}
                style={{ border: "1px solid #00843d", background: "#00843d", color: "#ffffff", borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 800 }}
              >
                {draft.type === "ticket" ? "Creează ticket" : "Creează task"}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}

declare global {
  interface Window {
    __SERVELECT_V2208_SINGLE_DIALOG_OWNER__?: boolean;
  }
}
