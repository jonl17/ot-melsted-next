import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Prismic webhook target: purges cached Prismic data so publishes show up instantly.
 * Required: set PRISMIC_WEBHOOK_SECRET in the host env and the same secret in the Prismic webhook.
 * Fails closed: if the variable is unset, every request is refused.
 */
export async function POST(request: Request) {
  const secret = process.env.PRISMIC_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Revalidation is not configured" }, { status: 500 });
  }
  const body = await request.json().catch(() => ({}));
  if (body?.secret !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  revalidateTag("prismic", "max");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
