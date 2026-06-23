import { NextResponse } from "next/server";

// This is an integration point, not a hardcoded data source. Wire it up to
// whichever email platform you use:
//
//  - Klaviyo: POST to https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs
//  - Shopify customer list: use the Admin API to create/update a customer
//    with acceptsMarketing: true (requires an Admin API token, kept server-side)
//
// Keeping this as a route handler means the email/API key never reaches the
// client bundle.

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO: forward `email` to your email platform of choice here.

  return NextResponse.json({ success: true });
}
