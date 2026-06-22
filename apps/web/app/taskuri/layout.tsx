import type { ReactNode } from "react";
import V171V15InPlaceFunctionalRuntime from "@/components/tasks/V171V15InPlaceFunctionalRuntime";
import V180ProcurementFlowRuntime from "@/components/procurement/V180ProcurementFlowRuntime";

export default function TaskuriLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <V171V15InPlaceFunctionalRuntime />
      <V180ProcurementFlowRuntime />
    </>
  );
}
