import V210GoodDayRealMutationBridge from "@/components/tasks/V210GoodDayRealMutationBridge";
import V150GoodDayStructuralTaskuriWorkspace from "@/components/tasks/V150GoodDayStructuralTaskuriWorkspace";
import V200GoodDayCompleteInteractionLayer from "@/components/tasks/V200GoodDayCompleteInteractionLayer";

export default function TaskuriPage() {
  return (<><V150GoodDayStructuralTaskuriWorkspace routeKey="workload-capacity-map" />
      <V200GoodDayCompleteInteractionLayer routeKey="workload-capacity-map" />
      <V210GoodDayRealMutationBridge routeKey="workload-capacity-map" />
    </>);
}









// data-v210-goodday-real-mutation-bridge source binding marker
