import { getV89Payload } from "@/lib/enterprise/work-os-v89-provider-delivery-ci-webhook";

export async function GET() {
  return Response.json(getV89Payload("health"));
}
