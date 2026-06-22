import V210GoodDayRealMutationBridge from "@/components/tasks/V210GoodDayRealMutationBridge";
import V150GoodDayStructuralTaskuriWorkspace from "@/components/tasks/V150GoodDayStructuralTaskuriWorkspace";
import V200GoodDayCompleteInteractionLayer from "@/components/tasks/V200GoodDayCompleteInteractionLayer";

export default function TaskuriPage() {
  return (<><V150GoodDayStructuralTaskuriWorkspace routeKey="checklists-quality-v95" />
      <V200GoodDayCompleteInteractionLayer routeKey="checklists-quality-v95" />
      <V210GoodDayRealMutationBridge routeKey="checklists-quality-v95" />
    </>);
}









// data-v210-goodday-real-mutation-bridge source binding marker
