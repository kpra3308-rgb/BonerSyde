import { NextResponse } from "next/server";

// Integration point: forward to your support inbox / helpdesk of choice
// (e.g. Resend, SendGrid, Zendesk, or a Shopify customer service app).
// Keep any API keys server-side via process.env — never NEXT_PUBLIC_.

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // TODO: send `{ name, email, message }` to your email/helpdesk provider.

  return NextResponse.json({ success: true });
}
