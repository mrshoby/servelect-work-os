export type DataProviderMode = "mock" | "prisma";

export function getDataProviderMode(): DataProviderMode {
  const value = (process.env.SERVELECT_DATA_PROVIDER ?? process.env.NEXT_PUBLIC_SERVELECT_DATA_PROVIDER ?? "mock").toLowerCase();
  if (value === "prisma" && process.env.DATABASE_URL) return "prisma";
  return "mock";
}

export function getDatabaseStatus() {
  const requested = (process.env.SERVELECT_DATA_PROVIDER ?? "mock").toLowerCase();
  const active = getDataProviderMode();
  return {
    requested,
    active,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    prismaReady: active === "prisma",
    message:
      active === "prisma"
        ? "Prisma/PostgreSQL provider activ. API-ul folosește baza de date reală."
        : "Mock provider activ. API-ul folosește date server-side temporare; setează SERVELECT_DATA_PROVIDER=prisma și DATABASE_URL pentru DB real."
  };
}
