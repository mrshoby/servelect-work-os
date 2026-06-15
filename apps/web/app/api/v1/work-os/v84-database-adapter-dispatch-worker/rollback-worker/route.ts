      import { NextResponse } from "next/server";
      import { getV84ApiPayload } from "../data";

      export const dynamic = "force-dynamic";

      export async function GET() {
        const payload = getV84ApiPayload();
return NextResponse.json({ version: payload.version, rollbackReady: payload.queue.filter((item) => item.rollbackCheckpoint), globalProductionWrites: false });
      }
