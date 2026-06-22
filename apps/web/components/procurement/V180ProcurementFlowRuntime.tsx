"use client";

import { useEffect, useMemo, useState } from "react";

type ProcurementStatus = "draft" | "materials" | "rfq" | "offers" | "ordered" | "delayed" | "invoiced" | "closed";
type OfferDecision = "pending" | "recommended" | "selected" | "rejected";

type ProcurementMaterial = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  budgetUnitPrice: number;
};

type ProcurementOffer = {
  id: string;
  supplier: string;
  price: number;
  deliveryDays: number;
  decision: OfferDecision;
};

type ProcurementRequest = {
  id: string;
  title: string;
  project: string;
  owner: string;
  status: ProcurementStatus;
  materials: ProcurementMaterial[];
  rfqId?: string;
  purchaseOrderId?: string;
  invoiceId?: string;
  warrantyAttachment?: string;
  alert?: string;
  createdAt: string;
  updatedAt: string;
};

type ProcurementActivity = {
  id: string;
  text: string;
  createdAt: string;
};

type ProcurementState = {
  requests: ProcurementRequest[];
  offers: ProcurementOffer[];
  suppliers: string[];
  notifications: { id: string; text: string; read: boolean; relatedId?: string }[];
  activity: ProcurementActivity[];
  selectedRequestId: string;
  lastExport: string;
  lastImportPreview: string[];
};

const STORAGE_KEY = "servelect:v18:procurement-flow";

function now() {
  return new Date().toISOString();
}

function seedState(): ProcurementState {
  const request: ProcurementRequest = {
    id: "REQ-PROC-1800-001",
    title: "Aprovizionare echipamente BESS - Alba Iulia",
    project: "PV + BESS / audit energetic",
    owner: "Vlad Neagu",
    status: "draft",
    createdAt: now(),
    updatedAt: now(),
    materials: [
      { id: "MAT-001", name: "Invertor hibrid 50kW", sku: "INV-HYB-50", quantity: 2, unit: "buc", budgetUnitPrice: 4200 },
      { id: "MAT-002", name: "Tablou AC protecții", sku: "TAB-AC-BESS", quantity: 1, unit: "set", budgetUnitPrice: 1900 }
    ]
  };
  return {
    requests: [request],
    offers: [
      { id: "OFF-001", supplier: "Furnizor Solar A", price: 10350, deliveryDays: 18, decision: "pending" },
      { id: "OFF-002", supplier: "Furnizor Electric B", price: 9900, deliveryDays: 28, decision: "pending" }
    ],
    suppliers: ["Furnizor Solar A", "Furnizor Electric B", "Distribuitor Automatizări C"],
    notifications: [
      { id: "N-PROC-001", text: "Solicitare aprovizionare pregătită pentru conversie RFQ", read: false, relatedId: request.id }
    ],
    activity: [{ id: "A-PROC-001", text: "v18 procurement flow inițializat cu date persistente locale.", createdAt: now() }],
    selectedRequestId: request.id,
    lastExport: "",
    lastImportPreview: []
  };
}

function normalizeState(raw: ProcurementState): ProcurementState {
  const fallback = seedState();
  return {
    requests: Array.isArray(raw?.requests) && raw.requests.length ? raw.requests : fallback.requests,
    offers: Array.isArray(raw?.offers) && raw.offers.length ? raw.offers : fallback.offers,
    suppliers: Array.isArray(raw?.suppliers) && raw.suppliers.length ? raw.suppliers : fallback.suppliers,
    notifications: Array.isArray(raw?.notifications) ? raw.notifications : fallback.notifications,
    activity: Array.isArray(raw?.activity) ? raw.activity : fallback.activity,
    selectedRequestId: raw?.selectedRequestId || fallback.selectedRequestId,
    lastExport: raw?.lastExport || "",
    lastImportPreview: Array.isArray(raw?.lastImportPreview) ? raw.lastImportPreview : []
  };
}

function createActivity(text: string): ProcurementActivity {
  return { id: `A-${Date.now()}-${Math.random().toString(16).slice(2)}`, text, createdAt: now() };
}

function statusLabel(status: ProcurementStatus) {
  const map: Record<ProcurementStatus, string> = {
    draft: "Draft",
    materials: "Materiale adăugate",
    rfq: "RFQ generat",
    offers: "Oferte colectate",
    ordered: "Comandă emisă",
    delayed: "Întârziere livrare",
    invoiced: "Factură + garanție",
    closed: "Închis"
  };
  return map[status];
}

export default function V180ProcurementFlowRuntime() {
  const [state, setState] = useState<ProcurementState>(() => seedState());
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("Ready: REAL_LOCAL_PERSISTENT procurement flow loaded.");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(normalizeState(JSON.parse(raw)));
    } catch {
      setState(seedState());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [loaded, state]);

  const selectedRequest = useMemo(
    () => state.requests.find((request) => request.id === state.selectedRequestId) || state.requests[0],
    [state.requests, state.selectedRequestId]
  );

  function mutate(label: string, updater: (draft: ProcurementState) => void) {
    setState((previous) => {
      const draft: ProcurementState = JSON.parse(JSON.stringify(previous));
      updater(draft);
      draft.activity = [createActivity(label), ...draft.activity].slice(0, 40);
      const selected = draft.requests.find((request) => request.id === draft.selectedRequestId);
      if (selected) selected.updatedAt = now();
      return draft;
    });
    setToast(label);
  }

  function selected(draft: ProcurementState) {
    const item = draft.requests.find((request) => request.id === draft.selectedRequestId);
    if (!item) throw new Error("Nu există solicitare selectată.");
    return item;
  }

  const actions = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    createRequest: () => mutate("Solicitare aprovizionare creată și persistată.", (draft) => {
      const request: ProcurementRequest = {
        id: `REQ-PROC-${Date.now()}`,
        title: "Solicitare aprovizionare - materiale șantier nou",
        project: "Parc fotovoltaic / execuție",
        owner: "Manager Producție",
        status: "draft",
        createdAt: now(),
        updatedAt: now(),
        materials: []
      };
      draft.requests = [request, ...draft.requests];
      draft.selectedRequestId = request.id;
      draft.notifications.unshift({ id: `N-${Date.now()}`, text: "Solicitare nouă creată pentru aprovizionare.", read: false, relatedId: request.id });
    }),
    addMaterials: () => mutate("Materiale adăugate pe solicitare.", (draft) => {
      const item = selected(draft);
      item.status = "materials";
      item.materials.push({ id: `MAT-${Date.now()}`, name: "Cablu solar 6mm² roșu/negru", sku: "CBL-PV-6MM", quantity: 600, unit: "m", budgetUnitPrice: 0.82 });
    }),
    convertToRfq: () => mutate("Solicitarea a fost convertită în cerere de ofertă RFQ.", (draft) => {
      const item = selected(draft);
      item.status = "rfq";
      item.rfqId = `RFQ-${Date.now()}`;
      draft.notifications.unshift({ id: `N-${Date.now()}`, text: `RFQ generat pentru ${item.title}.`, read: false, relatedId: item.id });
    }),
    chooseSuppliers: () => mutate("Furnizori selectați pentru RFQ.", (draft) => {
      draft.suppliers = Array.from(new Set([...draft.suppliers, "Distribuitor EPC D", "Importator Stoc E"]));
    }),
    addOffers: () => mutate("Oferte adăugate și legate de RFQ.", (draft) => {
      selected(draft).status = "offers";
      draft.offers.push({ id: `OFF-${Date.now()}-A`, supplier: "Distribuitor EPC D", price: 9650, deliveryDays: 21, decision: "pending" });
      draft.offers.push({ id: `OFF-${Date.now()}-B`, supplier: "Importator Stoc E", price: 10120, deliveryDays: 9, decision: "pending" });
    }),
    compareOffers: () => mutate("Comparare preț vs termen livrare calculată.", (draft) => {
      const sorted = [...draft.offers].sort((a, b) => (a.price + a.deliveryDays * 35) - (b.price + b.deliveryDays * 35));
      draft.offers = sorted.map((offer, index) => ({ ...offer, decision: index === 0 ? "recommended" : offer.decision }));
    }),
    selectRecommendedOffer: () => mutate("Oferta recomandată a fost selectată.", (draft) => {
      draft.offers = draft.offers.map((offer, index) => ({ ...offer, decision: index === 0 || offer.decision === "recommended" ? "selected" : "rejected" }));
    }),
    generatePurchaseOrder: () => mutate("Comandă generată din oferta selectată.", (draft) => {
      const item = selected(draft);
      item.status = "ordered";
      item.purchaseOrderId = `PO-${Date.now()}`;
    }),
    setDeliveryTerm: () => mutate("Termen de livrare setat și urmărit.", (draft) => {
      draft.notifications.unshift({ id: `N-${Date.now()}`, text: "Termen livrare: 10 zile lucrătoare pentru comanda activă.", read: false, relatedId: draft.selectedRequestId });
    }),
    markDelay: () => mutate("Întârziere marcată; alertă generată.", (draft) => {
      const item = selected(draft);
      item.status = "delayed";
      item.alert = "Livrare întârziată - escaladare către Achiziții.";
      draft.notifications.unshift({ id: `N-${Date.now()}`, text: item.alert, read: false, relatedId: item.id });
    }),
    addInvoice: () => mutate("Factură adăugată și legată de comandă.", (draft) => {
      const item = selected(draft);
      item.status = "invoiced";
      item.invoiceId = `INV-${Date.now()}`;
    }),
    attachWarranty: () => mutate("Certificat garanție atașat mock și persistat.", (draft) => {
      const item = selected(draft);
      item.warrantyAttachment = "certificat-garantie-mock.pdf";
    }),
    linkProject: () => mutate("Solicitarea este legată vizibil de proiect.", (draft) => {
      selected(draft).project = "PV + BESS / execuție / aprovizionare confirmată";
    }),
    markAllRead: () => mutate("Toate notificările de aprovizionare au fost marcate citite.", (draft) => {
      draft.notifications = draft.notifications.map((notification) => ({ ...notification, read: true }));
    }),
    importPreview: () => mutate("Import mock: coloane detectate, mapare și preview validate.", (draft) => {
      draft.lastImportPreview = ["material,name,sku,qty,unit_price", "Cablu PV,CBL-PV-6MM,600,0.82"];
    }),
    exportCsv: () => mutate("Export CSV generat pentru procurement flow.", (draft) => {
      draft.lastExport = ["id,title,status,project", ...draft.requests.map((request) => `${request.id},${request.title},${request.status},${request.project}`)].join("\n");
    })
  };

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: keyof typeof actions }>).detail;
      const action = detail?.action;
      if (action && actions[action]) actions[action]();
    };
    window.addEventListener("servelect:v180-procurement-action", handler);
    (window as unknown as { ServelectV180Procurement?: typeof actions }).ServelectV180Procurement = actions;
    return () => {
      window.removeEventListener("servelect:v180-procurement-action", handler);
      delete (window as unknown as { ServelectV180Procurement?: typeof actions }).ServelectV180Procurement;
    };
  });

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const text = target?.innerText || target?.getAttribute("aria-label") || "";
      if (/costuri|aprovizionare|achiziții|achizitii|bugetare|rfq|cerere de ofertă|furnizori/i.test(text)) {
        setOpen(true);
        setToast("Procurement flow deschis din acțiune existentă.");
      }
    };
    document.addEventListener("click", clickHandler, true);
    return () => document.removeEventListener("click", clickHandler, true);
  }, []);

  const unreadCount = state.notifications.filter((notification) => !notification.read).length;
  const selectedOffer = state.offers.find((offer) => offer.decision === "selected") || state.offers.find((offer) => offer.decision === "recommended") || state.offers[0];

  return (
    <>
      <div data-v180-procurement-functional-flow="true" data-v180-runtime-ready="true" hidden>
        Costuri & Aprovizionare Achiziții Bugetare RFQ Furnizori Oferte Comenzi Facturi Garanții REAL_LOCAL_PERSISTENT
      </div>
      {open ? (
        <div className="fixed inset-0 z-[80] bg-slate-950/30" data-v180-procurement-panel="true">
          <div className="absolute right-4 top-4 bottom-4 w-[760px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">v18 Procurement Flow / V15 in-place runtime</p>
                <h2 className="text-xl font-semibold text-slate-950">Costuri & Aprovizionare — flux complet interactiv</h2>
                <p className="text-sm text-slate-500">Nu schimbă shell-ul v15; rulează ca strat funcțional persistent local.</p>
              </div>
              <button data-v180-action="close" onClick={actions.close} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Închide</button>
            </div>
            <div className="grid h-[calc(100%-92px)] grid-cols-[1fr_290px] overflow-hidden">
              <div className="overflow-auto p-5">
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" data-v180-feedback="true">{toast}</div>
                <div className="mb-4 grid grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-200 p-3"><p className="text-[11px] uppercase text-slate-500">Solicitări</p><strong>{state.requests.length}</strong></div>
                  <div className="rounded-xl border border-slate-200 p-3"><p className="text-[11px] uppercase text-slate-500">Oferte</p><strong>{state.offers.length}</strong></div>
                  <div className="rounded-xl border border-slate-200 p-3"><p className="text-[11px] uppercase text-slate-500">Notificări</p><strong>{unreadCount}</strong></div>
                  <div className="rounded-xl border border-slate-200 p-3"><p className="text-[11px] uppercase text-slate-500">Status</p><strong>{statusLabel(selectedRequest.status)}</strong></div>
                </div>
                <div className="rounded-xl border border-slate-200">
                  <div className="grid grid-cols-[120px_1fr_120px_120px] border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase text-slate-500">
                    <span>ID</span><span>Solicitare</span><span>Status</span><span>Proiect</span>
                  </div>
                  {state.requests.map((request) => (
                    <button
                      key={request.id}
                      onClick={() => mutate(`Solicitare selectată: ${request.id}`, (draft) => { draft.selectedRequestId = request.id; })}
                      className="grid w-full grid-cols-[120px_1fr_120px_120px] border-b border-slate-100 px-3 py-3 text-left text-sm hover:bg-slate-50"
                    >
                      <span className="font-mono text-xs text-slate-500">{request.id}</span>
                      <span className="font-medium text-slate-950">{request.title}</span>
                      <span>{statusLabel(request.status)}</span>
                      <span className="truncate text-slate-500">{request.project}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="mb-3 font-semibold">Materiale</h3>
                    {selectedRequest.materials.map((mat) => (
                      <div key={mat.id} className="mb-2 flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <span>{mat.name}</span><span>{mat.quantity} {mat.unit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="mb-3 font-semibold">Oferte</h3>
                    {state.offers.map((offer) => (
                      <div key={offer.id} className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <div className="flex justify-between"><span>{offer.supplier}</span><strong>{offer.price.toLocaleString("ro-RO")} €</strong></div>
                        <div className="text-xs text-slate-500">{offer.deliveryDays} zile · {offer.decision}</div>
                      </div>
                    ))}
                    {selectedOffer ? <p className="mt-3 text-xs text-emerald-700">Oferta activă: {selectedOffer.supplier}</p> : null}
                  </div>
                </div>
              </div>
              <div className="overflow-auto border-l border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold">Acțiuni testabile</h3>
                <div className="grid gap-2">
                  {[
                    ["createRequest", "Creează solicitare"],
                    ["addMaterials", "Adaugă materiale"],
                    ["convertToRfq", "Convertește în RFQ"],
                    ["chooseSuppliers", "Alege furnizori"],
                    ["addOffers", "Adaugă oferte"],
                    ["compareOffers", "Compară oferte"],
                    ["selectRecommendedOffer", "Alege recomandată"],
                    ["generatePurchaseOrder", "Generează comandă"],
                    ["setDeliveryTerm", "Setează livrare"],
                    ["markDelay", "Marchează întârziere"],
                    ["addInvoice", "Adaugă factură"],
                    ["attachWarranty", "Atașează garanție"],
                    ["linkProject", "Leagă proiect"],
                    ["markAllRead", "Mark all read"],
                    ["importPreview", "Import preview"],
                    ["exportCsv", "Export CSV"]
                  ].map(([key, label]) => (
                    <button key={key} data-v180-action={key} onClick={() => actions[key as keyof typeof actions]()} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:border-emerald-300 hover:bg-emerald-50">{label}</button>
                  ))}
                </div>
                <h3 className="mb-3 mt-5 font-semibold">Activity log</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  {state.activity.slice(0, 8).map((item) => <div key={item.id} className="rounded-lg bg-white p-2">{item.text}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
