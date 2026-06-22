import V210GoodDayRealMutationBridge from "@/components/tasks/V210GoodDayRealMutationBridge";
import V150GoodDayStructuralTaskuriWorkspace from "@/components/tasks/V150GoodDayStructuralTaskuriWorkspace";
import V200GoodDayCompleteInteractionLayer from "@/components/tasks/V200GoodDayCompleteInteractionLayer";

export default function TaskuriPage() {
  return (
    <>
      <V150GoodDayStructuralTaskuriWorkspace routeKey="automations" />
      <V200GoodDayCompleteInteractionLayer routeKey="automations" />
      <V210GoodDayRealMutationBridge routeKey="automations" />
    </>
  );
}





// data-v210-goodday-real-mutation-bridge source binding marker
