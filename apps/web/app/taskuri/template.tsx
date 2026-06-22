import type { ReactNode } from "react";

export default function TaskuriTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        data-v210-goodday-real-mutation-bridge="true"
        data-v210-production-marker="GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL"
        data-v210-api-shadow="API_SHADOW_MUTATION_BRIDGE"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      {children}
    </>
  );
}
