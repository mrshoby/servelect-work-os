import type { Permission, Priority, TaskStatus } from "@servelect/shared";

export type WorkflowCategory = "IoT" | "CRM" | "Mentenanță" | "Finanțări" | "HR" | "Proiecte";

export type WorkflowTemplate = {
  id: string;
  category: WorkflowCategory;
  name: string;
  trigger: string;
  description: string;
  requiredPermission: Permission;
  creates: Array<"task" | "approval" | "ticket" | "notification">;
  defaultTask: {
    title: string;
    status: TaskStatus;
    priority: Priority;
    tags: string[];
    estimateHours: number;
  };
  steps: string[];
};

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "iot-inverter-offline-task",
    category: "IoT",
    name: "Invertor offline → task mentenanță",
    trigger: "Alertă IoT critică / invertor offline peste 10 minute",
    description: "Creează automat task pentru diagnostic, alocare tehnician și verificare revenire producție.",
    requiredPermission: "task:write",
    creates: ["task", "notification"],
    defaultTask: {
      title: "Diagnostic invertor offline",
      status: "De făcut",
      priority: "Critic",
      tags: ["iot", "mentenanță", "automat"],
      estimateHours: 2
    },
    steps: [
      "Preia alerta IoT și proiectul asociat",
      "Creează task critic în proiect",
      "Notifică managerul de operațiuni",
      "Sugerează tehnician disponibil",
      "Actualizează alerta ca În lucru"
    ]
  },
  {
    id: "crm-offer-approval",
    category: "CRM",
    name: "Ofertă emisă → aprobare manager",
    trigger: "Oportunitate trece în etapa Ofertă emisă",
    description: "Generează task de aprobare buget/ofertă și urmărește următorul pas comercial.",
    requiredPermission: "crm:write",
    creates: ["task", "approval"],
    defaultTask: {
      title: "Aprobare ofertă comercială",
      status: "Review / QA",
      priority: "Ridicat",
      tags: ["crm", "ofertă", "aprobare"],
      estimateHours: 1
    },
    steps: [
      "Verifică valoarea oportunității",
      "Creează cerere de aprobare",
      "Atașează oferta PDF când există",
      "Notifică owner-ul oportunității"
    ]
  },
  {
    id: "maintenance-sla-risk",
    category: "Mentenanță",
    name: "SLA în risc → escaladare",
    trigger: "Ticket nerezolvat aproape de termenul SLA",
    description: "Creează task urgent pentru manager și marchează ticketul pentru escaladare.",
    requiredPermission: "maintenance:write",
    creates: ["task", "notification"],
    defaultTask: {
      title: "Escaladare ticket SLA în risc",
      status: "De făcut",
      priority: "Urgent",
      tags: ["sla", "dispatch", "escaladare"],
      estimateHours: 0.5
    },
    steps: [
      "Calculează timpul rămas până la SLA",
      "Creează task urgent de escaladare",
      "Notifică managerul operațional",
      "Propune re-alocare tehnician"
    ]
  },
  {
    id: "funding-missing-documents",
    category: "Finanțări",
    name: "Dosar finanțare → documente lipsă",
    trigger: "Dosar finanțare are anexe obligatorii lipsă",
    description: "Creează taskuri pentru colectare documente, owner și scadență pe dosar.",
    requiredPermission: "finance:write",
    creates: ["task", "approval"],
    defaultTask: {
      title: "Completare anexe dosar finanțare",
      status: "De făcut",
      priority: "Ridicat",
      tags: ["finanțare", "documente", "audit"],
      estimateHours: 3
    },
    steps: [
      "Identifică anexele lipsă",
      "Creează task pe owner financiar",
      "Setează deadline înainte de depunere",
      "Pregătește cerere de aprobare finală"
    ]
  }
];

export function getWorkflowTemplate(id: string) {
  return workflowTemplates.find((template) => template.id === id);
}
