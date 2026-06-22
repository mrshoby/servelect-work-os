import V210GoodDayRealMutationBridge from "@/components/tasks/V210GoodDayRealMutationBridge";
import V150GoodDayStructuralTaskuriWorkspace from "@/components/tasks/V150GoodDayStructuralTaskuriWorkspace";
import V200GoodDayCompleteInteractionLayer from "@/components/tasks/V200GoodDayCompleteInteractionLayer";

export default function TaskuriPage() {
  return (<><V150GoodDayStructuralTaskuriWorkspace routeKey="tickets-notificari" />
      <V200GoodDayCompleteInteractionLayer routeKey="tickets-notificari" />
      <V210GoodDayRealMutationBridge routeKey="tickets-notificari" />
    </>);
}









// data-v210-goodday-real-mutation-bridge source binding marker
