import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "SERVELECT WORK OS",
  description: "Task-first enterprise Work OS for photovoltaic projects and energy operations."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
