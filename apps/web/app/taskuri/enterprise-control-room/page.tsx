import V210GoodDayRealMutationBridge from "@/components/tasks/V210GoodDayRealMutationBridge";
import V150GoodDayStructuralTaskuriWorkspace from "@/components/tasks/V150GoodDayStructuralTaskuriWorkspace";
import V200GoodDayCompleteInteractionLayer from "@/components/tasks/V200GoodDayCompleteInteractionLayer";

export default function TaskuriPage() {
  return (<><V150GoodDayStructuralTaskuriWorkspace routeKey="enterprise-control-room" />
      <V200GoodDayCompleteInteractionLayer routeKey="enterprise-control-room" />
      <V210GoodDayRealMutationBridge routeKey="enterprise-control-room" />
    </>);
}









// data-v210-goodday-real-mutation-bridge source binding marker
