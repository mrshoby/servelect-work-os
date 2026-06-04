import type { Priority, ProjectHealth, TaskStatus } from "./types";

export function formatRon(value: number): string {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("ro-RO", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function statusTone(status: TaskStatus): "gray" | "green" | "blue" | "orange" | "red" | "purple" {
  switch (status) {
    case "Finalizat": return "green";
    case "În lucru": return "blue";
    case "Review / QA": return "purple";
    case "Blocat": return "red";
    case "Anulat": return "gray";
    case "Backlog": return "orange";
    default: return "gray";
  }
}

export function priorityTone(priority: Priority): "green" | "orange" | "red" | "purple" | "gray" {
  switch (priority) {
    case "Critic": return "purple";
    case "Urgent": return "red";
    case "Ridicat": return "orange";
    case "Mediu": return "orange";
    case "Scăzut": return "green";
    default: return "gray";
  }
}

export function healthTone(health: ProjectHealth): "green" | "orange" | "red" | "purple" {
  switch (health) {
    case "Bun": return "green";
    case "Atenție": return "orange";
    case "Risc": return "red";
    case "Critic": return "purple";
  }
}

export function cn(...classes: Array<string | undefined | false | null>): string {
  return classes.filter(Boolean).join(" ");
}
