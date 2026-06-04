import type {
  ActivityLog,
  ApprovalRequest,
  AuditCase,
  CalendarEvent,
  Client,
  CRMLead,
  EnergyInstallation,
  Equipment,
  FundingCase,
  InventoryItem,
  IoTAlert,
  MaintenanceTicket,
  Notification,
  Project,
  Task,
  User,
  Workspace
} from "./types";

export const workspace: Workspace = {
  id: "ws-servelect",
  name: "SERVELECT SRL",
  plan: "Enterprise",
  tenantSlug: "servelect"
};

const permissions = [
  "project:read", "project:write", "task:read", "task:write", "task:assign", "crm:read", "crm:write",
  "iot:read", "equipment:read", "maintenance:read", "finance:read", "hr:read"
] as const;

export const users: User[] = [
  { id: "u1", name: "Andrei Popescu", email: "andrei.popescu@servelect.ro", role: "Administrator", title: "Manager proiect", avatar: "AP", team: "Management", workload: 80, online: true, phone: "+40 741 123 456", certifications: ["Manager proiect", "SSM"], permissions: [...permissions, "admin:manage"] },
  { id: "u2", name: "Ioana Marinescu", email: "ioana.marinescu@servelect.ro", role: "Manager", title: "Inginer proiectant", avatar: "IM", team: "Proiectare", workload: 70, online: true, certifications: ["ANRE", "CAD"], permissions: [...permissions] },
  { id: "u3", name: "Mihai Ionescu", email: "mihai.ionescu@servelect.ro", role: "Tehnician", title: "Tehnician senior", avatar: "MI", team: "Teren", workload: 110, online: true, certifications: ["ANRE Grad II", "SSM"], permissions: ["project:read", "task:read", "task:write", "iot:read", "maintenance:read", "maintenance:write"] },
  { id: "u4", name: "Cristian Radu", email: "cristian.radu@servelect.ro", role: "Tehnician", title: "Tehnician", avatar: "CR", team: "Teren", workload: 90, online: false, certifications: ["SSM"], permissions: ["project:read", "task:read", "task:write", "maintenance:read", "maintenance:write"] },
  { id: "u5", name: "Alexandra Rusu", email: "alexandra.rusu@servelect.ro", role: "Financiar", title: "Responsabil financiar", avatar: "AR", team: "Financiar", workload: 60, online: true, permissions: ["finance:read", "finance:write", "crm:read", "project:read", "task:read", "task:write"] },
  { id: "u6", name: "George Stan", email: "george.stan@servelect.ro", role: "Tehnician", title: "Tehnician", avatar: "GS", team: "Teren", workload: 92, online: true, certifications: ["ANRE"], permissions: ["project:read", "task:read", "task:write", "maintenance:read", "maintenance:write"] },
  { id: "u7", name: "Vlad Neagu", email: "vlad.neagu@servelect.ro", role: "Tehnician", title: "Electrician", avatar: "VN", team: "Teren", workload: 58, online: false, certifications: ["Electrician"], permissions: ["project:read", "task:read", "task:write"] }
];

export const clients: Client[] = [
  { id: "c1", name: "Andrei Popescu", industry: "Rezidențial", location: "Cluj-Napoca", email: "client@demo.ro", phone: "+40 722 000 111", contactPerson: "Andrei Popescu", status: "Client activ", segment: "Rezidențial" },
  { id: "c2", name: "TechConstruct SRL", industry: "Construcții", location: "Timișoara", email: "office@techconstruct.ro", phone: "+40 256 222 333", contactPerson: "Marius Ionescu", status: "Client activ", segment: "B2B" },
  { id: "c3", name: "GreenFactory SA", industry: "Industrial", location: "București", email: "energy@greenfactory.ro", phone: "+40 21 222 444", contactPerson: "Roxana Marinescu", status: "Client activ", segment: "Industrial" },
  { id: "c4", name: "RetailMax SRL", industry: "Retail", location: "Ploiești", email: "admin@retailmax.ro", phone: "+40 244 331 100", contactPerson: "Dan Petrescu", status: "Client activ", segment: "B2B" },
  { id: "c5", name: "AgroSol Farm SRL", industry: "Agricultură", location: "Constanța", email: "contact@agrosol.ro", phone: "+40 241 441 200", contactPerson: "Elena Marin", status: "Prospect", segment: "Industrial" }
];

export const projects: Project[] = [
  { id: "p1", code: "P-2024-0187", name: "Sistem FV 9.6 kWp", clientId: "c1", clientName: "Andrei Popescu", location: "Cluj-Napoca", powerKwp: 9.6, phase: "În desfășurare", progress: 72, health: "Bun", ownerId: "u1", ownerName: "Andrei Popescu", deadline: "2024-05-30", budgetRon: 48500, workedHours: 84, risks: 1, documents: 12, coordinates: { lat: 46.7712, lng: 23.6236 } },
  { id: "p2", code: "P-2024-0142", name: "Stație încărcare EV", clientId: "c2", clientName: "TechConstruct SRL", location: "Timișoara", powerKwp: 0, phase: "Montaj", progress: 48, health: "Atenție", ownerId: "u2", ownerName: "Ioana Marinescu", deadline: "2024-05-31", budgetRon: 125000, workedHours: 57, risks: 2, documents: 8, coordinates: { lat: 45.7489, lng: 21.2087 } },
  { id: "p3", code: "P-2024-0103", name: "Sistem FV 500 kWp", clientId: "c3", clientName: "GreenFactory SA", location: "București", powerKwp: 500, phase: "Testare", progress: 90, health: "Bun", ownerId: "u1", ownerName: "Andrei Popescu", deadline: "2024-06-02", budgetRon: 2450000, workedHours: 420, risks: 1, documents: 36, coordinates: { lat: 44.4268, lng: 26.1025 } },
  { id: "p4", code: "P-2024-0098", name: "RetailMax SRL", clientId: "c4", clientName: "RetailMax SRL", location: "Ploiești", powerKwp: 90, phase: "Proiectare", progress: 65, health: "Risc", ownerId: "u2", ownerName: "Ioana Marinescu", deadline: "2024-05-17", budgetRon: 420000, workedHours: 133, risks: 4, documents: 18, coordinates: { lat: 44.9367, lng: 26.0129 } },
  { id: "p5", code: "P-2024-0077", name: "AgroSol Farm SRL", clientId: "c5", clientName: "AgroSol Farm SRL", location: "Constanța", powerKwp: 300, phase: "Avizare", progress: 30, health: "Atenție", ownerId: "u5", ownerName: "Alexandra Rusu", deadline: "2024-05-20", budgetRon: 980000, workedHours: 52, risks: 3, documents: 7, coordinates: { lat: 44.1598, lng: 28.6348 } }
];

const baseLog: ActivityLog[] = [
  { id: "a1", userId: "u2", userName: "Ioana Marinescu", action: "a actualizat progresul", target: "P-2024-0187", createdAt: "2024-05-18T09:31:00" },
  { id: "a2", userId: "u3", userName: "Mihai Ionescu", action: "a încărcat poze", target: "Montaj structură", createdAt: "2024-05-18T08:45:00" }
];

export const tasks: Task[] = [
  {
    id: "t1", title: "Verificare amplasament", description: "Culegere date inițiale, verificare acoperiș, orientare, umbriri și acces pentru echipa de montaj.", projectId: "p1", projectCode: "P-2024-0187", projectName: "Sistem FV 9.6 kWp", status: "În lucru", priority: "Urgent", assigneeId: "u1", assigneeName: "Andrei Popescu", ownerId: "u1", startDate: "2024-05-01", dueDate: "2024-05-18", estimateHours: 6, trackedHours: 4.2, tags: ["teren", "check-in", "foto"], dependencies: [], customFields: { SLA: "Astăzi", Client: "Andrei Popescu" },
    subtasks: [{ id: "st1", title: "Verifică orientarea acoperișului", done: true }, { id: "st2", title: "Atașează poze locație", done: true }, { id: "st3", title: "Confirmă acces echipă", done: false }],
    comments: [{ id: "cm1", authorId: "u2", authorName: "Ioana Marinescu", body: "Am nevoie de confirmarea pentru traseul cablurilor DC.", createdAt: "2024-05-18T09:00:00" }], attachments: [{ id: "att1", name: "poze-amplasament.zip", type: "ZIP", size: "18 MB" }], activityLog: baseLog
  },
  { id: "t2", title: "Montaj structură", description: "Instalarea profilelor și prinderilor conform planului de montaj.", projectId: "p2", projectCode: "P-2024-0142", projectName: "Stație încărcare EV", status: "În lucru", priority: "Urgent", assigneeId: "u3", assigneeName: "Mihai Ionescu", ownerId: "u2", startDate: "2024-05-02", dueDate: "2024-05-18", estimateHours: 12, trackedHours: 7.4, tags: ["montaj", "teren"], dependencies: ["t1"], customFields: { Progres: "60%" }, subtasks: [{ id: "st21", title: "Verificare prinderi", done: true }, { id: "st22", title: "Strângere șuruburi", done: false }], comments: [], attachments: [], activityLog: baseLog },
  { id: "t3", title: "Instalare panouri", description: "Poziționare, fixare și etichetare panouri fotovoltaice.", projectId: "p1", projectCode: "P-2024-0187", projectName: "Sistem FV 9.6 kWp", status: "În lucru", priority: "Mediu", assigneeId: "u3", assigneeName: "Mihai Ionescu", ownerId: "u1", startDate: "2024-05-06", dueDate: "2024-05-20", estimateHours: 16, trackedHours: 10, tags: ["panouri", "QR"], dependencies: ["t2"], customFields: { Panouri: 24 }, subtasks: [{ id: "st31", title: "Scanează QR panouri", done: false }, { id: "st32", title: "Foto obligatorie fiecare string", done: false }], comments: [], attachments: [], activityLog: baseLog },
  { id: "t4", title: "Racordare AC", description: "Conectare AC, verificare protecții și etichetare tablou.", projectId: "p1", projectCode: "P-2024-0187", projectName: "Sistem FV 9.6 kWp", status: "De făcut", priority: "Ridicat", assigneeId: "u4", assigneeName: "Cristian Radu", ownerId: "u1", startDate: "2024-05-18", dueDate: "2024-05-21", estimateHours: 8, trackedHours: 0, tags: ["AC", "tablou"], dependencies: ["t3"], customFields: { Obligatoriu: true }, subtasks: [], comments: [], attachments: [], activityLog: [] },
  { id: "t5", title: "Configurare invertor", description: "Setare parametri grid code, monitorizare și test comunicare.", projectId: "p1", projectCode: "P-2024-0187", projectName: "Sistem FV 9.6 kWp", status: "Review / QA", priority: "Mediu", assigneeId: "u3", assigneeName: "Mihai Ionescu", ownerId: "u1", startDate: "2024-05-19", dueDate: "2024-05-22", estimateHours: 4, trackedHours: 2, tags: ["invertor", "monitorizare"], dependencies: ["t4"], customFields: { Brand: "Huawei" }, subtasks: [], comments: [], attachments: [], activityLog: [] },
  { id: "t6", title: "Testare & PIF", description: "Teste finale, punere în funcțiune și raport PIF.", projectId: "p3", projectCode: "P-2024-0103", projectName: "Sistem FV 500 kWp", status: "De făcut", priority: "Mediu", assigneeId: "u4", assigneeName: "Cristian Radu", ownerId: "u1", startDate: "2024-05-20", dueDate: "2024-05-24", estimateHours: 10, trackedHours: 0, tags: ["PIF", "test"], dependencies: ["t5"], customFields: {}, subtasks: [], comments: [], attachments: [], activityLog: [] },
  { id: "t7", title: "Predare documentație", description: "Pregătire documentație finală, garanții și PV recepție.", projectId: "p3", projectCode: "P-2024-0103", projectName: "Sistem FV 500 kWp", status: "Finalizat", priority: "Scăzut", assigneeId: "u2", assigneeName: "Ioana Marinescu", ownerId: "u1", startDate: "2024-05-08", dueDate: "2024-05-16", estimateHours: 6, trackedHours: 6.5, tags: ["documente", "client"], dependencies: [], customFields: {}, subtasks: [], comments: [], attachments: [{ id: "att2", name: "Raport-PIF.pdf", type: "PDF", size: "1.2 MB" }], activityLog: [] },
  { id: "t8", title: "Obținere aviz de racordare", description: "Urmărire dosar la distribuitor și completare anexe lipsă.", projectId: "p5", projectCode: "P-2024-0077", projectName: "AgroSol Farm SRL", status: "Blocat", priority: "Urgent", assigneeId: "u5", assigneeName: "Alexandra Rusu", ownerId: "u5", startDate: "2024-05-03", dueDate: "2024-05-19", estimateHours: 5, trackedHours: 2, tags: ["aviz", "distribuitor"], dependencies: [], customFields: { Blocaj: "Lipsește extras CF" }, subtasks: [], comments: [], attachments: [], activityLog: [] },
  { id: "t9", title: "Întocmire ofertă", description: "Generare ofertă tehnico-financiară și calcul ROI.", projectId: "p4", projectCode: "P-2024-0098", projectName: "RetailMax SRL", status: "Review / QA", priority: "Mediu", assigneeId: "u2", assigneeName: "Ioana Marinescu", ownerId: "u1", startDate: "2024-05-10", dueDate: "2024-05-22", estimateHours: 8, trackedHours: 5.3, tags: ["ofertă", "ROI"], dependencies: [], customFields: { Valoare: "420000 RON" }, subtasks: [], comments: [], attachments: [], activityLog: [] },
  { id: "t10", title: "Verificare randament scăzut", description: "Analiză MPPT și stringuri pentru producție sub estimat.", projectId: "p2", projectCode: "P-2024-0142", projectName: "Stație încărcare EV", status: "De făcut", priority: "Critic", assigneeId: "u6", assigneeName: "George Stan", ownerId: "u1", startDate: "2024-05-18", dueDate: "2024-05-18", estimateHours: 3, trackedHours: 0, tags: ["IoT", "alertă"], dependencies: [], customFields: { Alertă: "Randament scăzut" }, subtasks: [], comments: [], attachments: [], activityLog: [] }
];

export const calendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Verificare amplasament", type: "Task", startsAt: "2024-05-18T09:00:00", endsAt: "2024-05-18T10:00:00", projectId: "p1", ownerId: "u1" },
  { id: "ev2", title: "Montaj structură", type: "Task", startsAt: "2024-05-18T11:00:00", endsAt: "2024-05-18T13:00:00", projectId: "p2", ownerId: "u3" },
  { id: "ev3", title: "Review proiect", type: "Meeting", startsAt: "2024-05-18T14:00:00", endsAt: "2024-05-18T15:00:00", projectId: "p4", ownerId: "u2" },
  { id: "ev4", title: "Testare & PIF", type: "Milestone", startsAt: "2024-05-20T09:00:00", endsAt: "2024-05-20T16:00:00", projectId: "p3", ownerId: "u4" }
];

export const crmLeads: CRMLead[] = [
  { id: "crm1", company: "Primăria Or. Mioveni", contact: "Achiziții publice", valueRon: 210000, stage: "Lead nou", probability: 20, ownerId: "u5", nextStep: "Calificare lead" },
  { id: "crm2", company: "TechConstruct SRL", contact: "Marius Ionescu", valueRon: 450000, stage: "Calificat", probability: 45, ownerId: "u1", nextStep: "Discuție soluție financiară" },
  { id: "crm3", company: "Mega Image SRL", contact: "Facility Manager", valueRon: 1250000, stage: "Ofertă emisă", probability: 72, ownerId: "u1", nextStep: "Follow-up ofertă" },
  { id: "crm4", company: "Spitalul Județean Bacău", contact: "Director tehnic", valueRon: 1600000, stage: "Negociere", probability: 60, ownerId: "u2", nextStep: "Aprobare internă ofertă" },
  { id: "crm5", company: "Lidl România", contact: "Energy Lead", valueRon: 950000, stage: "Câștigat", probability: 100, ownerId: "u1", nextStep: "Semnare contract" },
  { id: "crm6", company: "Project X SRL", contact: "CFO", valueRon: 280000, stage: "Pierdut", probability: 0, ownerId: "u5", nextStep: "Analiză pierdere" }
];

export const energyInstallations: EnergyInstallation[] = [
  { id: "i1", projectId: "p1", name: "P-2024-0187", location: "Cluj-Napoca", powerKwp: 9.6, livePowerKw: 8.42, energyTodayKwh: 42.85, yieldKwhKwp: 1.28, status: "Online", inverterBrand: "Huawei", co2AvoidedKg: 28.6 },
  { id: "i2", projectId: "p2", name: "P-2024-0142", location: "Timișoara", powerKwp: 50, livePowerKw: 31.4, energyTodayKwh: 180.2, yieldKwhKwp: 1.23, status: "Atenție", inverterBrand: "Fronius", co2AvoidedKg: 121 },
  { id: "i3", projectId: "p3", name: "P-2024-0103", location: "București", powerKwp: 500, livePowerKw: 410.5, energyTodayKwh: 2450, yieldKwhKwp: 1.34, status: "Online", inverterBrand: "SolarEdge", co2AvoidedKg: 1640 },
  { id: "i4", projectId: "p4", name: "P-2024-0098", location: "Ploiești", powerKwp: 90, livePowerKw: 0, energyTodayKwh: 0, yieldKwhKwp: 0, status: "Alarmă", inverterBrand: "Sungrow", co2AvoidedKg: 0 }
];

export const iotAlerts: IoTAlert[] = [
  { id: "al1", installationId: "i4", projectId: "p4", title: "Invertor offline", severity: "Critică", createdAt: "2024-05-18T08:12:00", status: "Deschis", recommendedAction: "Creează ticket urgent și alocă tehnician" },
  { id: "al2", installationId: "i2", projectId: "p2", title: "Randament scăzut", severity: "Atenționare", createdAt: "2024-05-18T09:21:00", status: "Deschis", recommendedAction: "Creează task verificare stringuri" },
  { id: "al3", installationId: "i1", projectId: "p1", title: "Temperatură ridicată panou", severity: "Atenționare", createdAt: "2024-05-18T09:28:00", status: "În lucru", recommendedAction: "Verificare ventilație și curățare" }
];

export const equipments: Equipment[] = [
  { id: "eq1", name: "Jinko Solar Tiger Neo 540W", category: "Panou", manufacturer: "Jinko Solar", model: "JKM540N-72HL4-BDV", power: "540 Wp", datasheet: "jinko-540.pdf" },
  { id: "eq2", name: "Huawei SUN2000-10KTL-M1", category: "Invertor", manufacturer: "Huawei", model: "SUN2000-10KTL-M1", power: "10 kW", datasheet: "huawei-10ktl.pdf" },
  { id: "eq3", name: "Pylontech US5000", category: "Baterie", manufacturer: "Pylontech", model: "US5000", power: "4.8 kWh", datasheet: "pylontech-us5000.pdf" },
  { id: "eq4", name: "SMA STP 50-40", category: "Invertor", manufacturer: "SMA", model: "STP 50-40", power: "50 kW", datasheet: "sma-stp.pdf" }
];

export const inventory: InventoryItem[] = [
  { id: "inv1", equipmentId: "eq1", serialNumber: "JKS40N72HL4BDV12345678", qrCode: "QR-JKS-001", status: "În stoc", warehouse: "Depozit Central Cluj", locationCode: "RA-03-02", warrantyUntil: "2036-05-18" },
  { id: "inv2", equipmentId: "eq2", serialNumber: "SUN2000-10KTL-M1-2305231234", qrCode: "QR-HW-002", status: "Alocat proiect", warehouse: "Depozit Central Cluj", locationCode: "INV-02", projectId: "p1", warrantyUntil: "2034-05-18" },
  { id: "inv3", equipmentId: "eq3", serialNumber: "PYLONTECH-US5000-123456", qrCode: "QR-PYL-003", status: "În stoc", warehouse: "Depozit Est Iași", locationCode: "BA-01-01", warrantyUntil: "2034-05-18" },
  { id: "inv4", equipmentId: "eq4", serialNumber: "SMA-STP50-40-2109876543", qrCode: "QR-SMA-004", status: "Garanție expiră", warehouse: "Depozit Vest Timișoara", locationCode: "INV-03", projectId: "p2", warrantyUntil: "2024-06-16" }
];

export const maintenanceTickets: MaintenanceTicket[] = [
  { id: "tk1", projectId: "p1", title: "Defecțiune invertor FRONIUS", severity: "Critic", status: "Alocat", slaDueAt: "2024-05-18T10:32:14", assigneeId: "u3", etaMinutes: 18 },
  { id: "tk2", projectId: "p2", title: "Panou AC fără tensiune", severity: "Ridicat", status: "Nou", slaDueAt: "2024-05-18T11:14:53", assigneeId: "u4", etaMinutes: 50 },
  { id: "tk3", projectId: "p3", title: "Alarmă izolație scăzută", severity: "Mediu", status: "În lucru", slaDueAt: "2024-05-18T13:42:09", assigneeId: "u6", etaMinutes: 120 }
];

export const fundingCases: FundingCase[] = [
  { id: "fc1", program: "PNRR", projectId: "p1", valueRon: 48120, stage: "Verificare eligibilitate", progress: 72, deadline: "2024-05-20", ownerId: "u5" },
  { id: "fc2", program: "SEE Grants", projectId: "p3", valueRon: 320000, stage: "Evaluare", progress: 68, deadline: "2024-06-20", ownerId: "u5" },
  { id: "fc3", program: "Electric Up", projectId: "p2", valueRon: 210000, stage: "Contractare", progress: 84, deadline: "2024-05-14", ownerId: "u5" }
];

export const auditCases: AuditCase[] = [
  { id: "ac1", code: "AE-2024-012", clientName: "TechConstruct SRL", progress: 90, deadline: "2024-05-20", ownerId: "u2" },
  { id: "ac2", code: "AE-2024-015", clientName: "Hală producție", progress: 65, deadline: "2024-05-31", ownerId: "u1" },
  { id: "ac3", code: "AE-2024-024", clientName: "Centru comercial", progress: 10, deadline: "2024-06-25", ownerId: "u5" }
];

export const approvals: ApprovalRequest[] = [
  { id: "ap1", title: "Aviz de racordare", requesterId: "u2", ownerId: "u1", projectId: "p5", status: "În așteptare", dueDate: "2024-05-19", priority: "Mediu" },
  { id: "ap2", title: "Plan de securitate", requesterId: "u3", ownerId: "u1", projectId: "p1", status: "În așteptare", dueDate: "2024-05-20", priority: "Mediu" },
  { id: "ap3", title: "Modificare layout", requesterId: "u2", ownerId: "u1", projectId: "p4", status: "În așteptare", dueDate: "2024-05-22", priority: "Scăzut" }
];

export const notifications: Notification[] = [
  { id: "n1", title: "Task critic nou", body: "Verificare randament scăzut a fost alocat lui George Stan.", type: "Task", read: false, createdAt: "2024-05-18T09:31:00" },
  { id: "n2", title: "Aprobare ofertă", body: "OF-2024-0321 are nevoie de aprobare.", type: "Approval", read: false, createdAt: "2024-05-18T09:15:00" },
  { id: "n3", title: "Invertor offline", body: "P-2024-0098 are alarmă critică.", type: "Alert", read: false, createdAt: "2024-05-18T08:12:00" }
];

export const sparklineData = [
  { name: "L", value: 12 }, { name: "M", value: 14 }, { name: "M", value: 13 }, { name: "J", value: 16 }, { name: "V", value: 18 }, { name: "S", value: 17 }, { name: "D", value: 21 }, { name: "A", value: 24 }
];

export const energyCurve = [
  { time: "00:00", real: 0.2, estimate: 0.1, yesterday: 0.3 },
  { time: "04:00", real: 1.2, estimate: 1.0, yesterday: 0.9 },
  { time: "08:00", real: 6.4, estimate: 6.1, yesterday: 5.3 },
  { time: "10:00", real: 9.2, estimate: 8.4, yesterday: 8.1 },
  { time: "12:00", real: 10.1, estimate: 9.6, yesterday: 7.5 },
  { time: "14:00", real: 8.6, estimate: 9.0, yesterday: 7.2 },
  { time: "16:00", real: 6.2, estimate: 6.8, yesterday: 5.2 },
  { time: "20:00", real: 1.3, estimate: 2.1, yesterday: 1.6 },
  { time: "24:00", real: 0.1, estimate: 0.2, yesterday: 0.1 }
];
