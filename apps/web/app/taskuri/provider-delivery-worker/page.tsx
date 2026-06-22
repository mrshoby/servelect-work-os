import V150GoodDayStructuralTaskuriWorkspace from "@/components/tasks/V150GoodDayStructuralTaskuriWorkspace";
import V200GoodDayCompleteInteractionLayer from "@/components/tasks/V200GoodDayCompleteInteractionLayer";

export default function TaskuriPage() {
  return (<><V150GoodDayStructuralTaskuriWorkspace routeKey="provider-delivery-worker" />
      <V200GoodDayCompleteInteractionLayer routeKey="provider-delivery-worker" />
    </>);
}







