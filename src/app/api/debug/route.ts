import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION;

  const hasDomain = !!domain;
  const hasToken = !!token;

  let apiTest: string = "not attempted";
  if (hasDomain && hasToken) {
    try {
      const endpoint = `https://${domain}/api/${version || "2025-01"}/graphql.json`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query: "{ shop { name } }" }),
        cache: "no-store",
      });
      const body = await res.json();
      apiTest = res.ok ? `OK - shop: ${body.data?.shop?.name}` : `FAIL ${res.status}: ${JSON.stringify(body.errors || body)}`;
    } catch (e: unknown) {
      apiTest = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: hasDomain ? domain : "MISSING",
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: hasToken ? token!.slice(0, 8) + "..." : "MISSING",
      SHOPIFY_STOREFRONT_API_VERSION: version || "2025-01 (default)",
    },
    isShopifyConfigured: hasDomain && hasToken,
    apiTest,
  });
}
