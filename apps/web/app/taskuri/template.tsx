import type { ReactNode } from 'react';

export default function TaskuriTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        hidden
        data-v210-goodday-real-mutation-bridge="true"
        data-v220-goodday-frontend-acceptance="true"
        data-no-duplicate-dialogs="true"
      />
      {children}
    </>
  );
}
