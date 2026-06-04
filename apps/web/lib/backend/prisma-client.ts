type PrismaClientLike = Record<string, any> & {
  $connect?: () => Promise<void>;
  $disconnect?: () => Promise<void>;
  $transaction?: <T>(fn: (client: any) => Promise<T>) => Promise<T>;
};

declare global {
  // eslint-disable-next-line no-var
  var __servelectPrismaClient: PrismaClientLike | undefined;
}

async function importPrismaClientConstructor() {
  // Keep this dynamic so the app still builds in mock mode before @prisma/client is installed/generated.
  const dynamicImport = new Function("specifier", "return import(specifier)") as (specifier: string) => Promise<any>;
  const mod = await dynamicImport("@prisma/client");
  return mod.PrismaClient;
}

export async function getPrisma(): Promise<PrismaClientLike> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL lipsește. Setează connection string-ul PostgreSQL în Vercel Environment Variables.");
  }

  if (!globalThis.__servelectPrismaClient) {
    const PrismaClient = await importPrismaClientConstructor();
    globalThis.__servelectPrismaClient = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
    });
  }

  return globalThis.__servelectPrismaClient;
}

export async function testPrismaConnection() {
  const prisma = await getPrisma();
  await prisma.$connect?.();
  return true;
}
