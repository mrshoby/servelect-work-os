import type { ReactNode } from "react";
import { V220GoodDayFrontendAcceptanceLayer } from "../../components/tasks/V220GoodDayFrontendAcceptanceLayer";

export default function TaskuriTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        data-v210-goodday-real-mutation-bridge="true"
        data-v210-production-marker="GOODDAY_REAL_MUTATION_BRIDGE_ON_V15_V200_SHELL"
        data-v210-api-shadow="API_SHADOW_MUTATION_BRIDGE"
        data-v220-goodday-frontend-acceptance="true"
        data-v220-marker="GOODDAY_FRONTEND_ACCEPTANCE_LAYER"
        data-v220-bridge="REAL_VISIBLE_INTERACTION_CONTRACT"
        data-v220-persistence="REAL_LOCAL_PERSISTENT"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <V220GoodDayFrontendAcceptanceLayer />
      {children}
    </>
  );
}
