import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-01";
  const endpoint = `https://${domain}/api/${version}/graphql.json`;

  const productQuery = `query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id handle title
    }
  }`;

  const collectionsQuery = `query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id handle title
    }
  }`;

  const results: Record<string, unknown> = {};

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token!,
      },
      body: JSON.stringify({ query: productQuery, variables: { handle: "frank-ocean-tee" } }),
      cache: "no-store",
    });
    const body = await res.json();
    results.directProduct = body;
  } catch (e: unknown) {
    results.directProduct = { error: e instanceof Error ? e.message : String(e) };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token!,
      },
      body: JSON.stringify({ query: collectionsQuery, variables: { handle: "new-arrivals" } }),
      cache: "no-store",
    });
    const body = await res.json();
    results.directCollection = body;
  } catch (e: unknown) {
    results.directCollection = { error: e instanceof Error ? e.message : String(e) };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token!,
      },
      body: JSON.stringify({ query: `{ collections(first: 5) { nodes { id handle title } } }` }),
      cache: "no-store",
    });
    const body = await res.json();
    results.allCollections = body;
  } catch (e: unknown) {
    results.allCollections = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(results);
}
