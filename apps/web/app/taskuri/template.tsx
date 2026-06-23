import type { ReactNode } from 'react';
import V220SingleDialogOwnerGuard from "@/components/tasks/V220SingleDialogOwnerGuard";

export default function TaskuriTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        hidden
        data-v210-goodday-real-mutation-bridge="true"
        data-v220-goodday-frontend-acceptance="true"
        data-no-duplicate-dialogs="true"
      />
      <V220SingleDialogOwnerGuard />
      {children}
    </>
  );
}
