import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { GET_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const data = await shopifyFetch<{ product: unknown }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: "frank-ocean-tee" },
      cache: "no-store",
    });
    results.shopifyFetchResult = data.product ? { handle: (data.product as Record<string, unknown>).handle, title: (data.product as Record<string, unknown>).title } : null;
  } catch (e: unknown) {
    results.shopifyFetchError = {
      message: e instanceof Error ? e.message : String(e),
      name: e instanceof Error ? e.name : "Unknown",
      errors: (e as Record<string, unknown>).errors || null,
    };
  }

  return NextResponse.json(results);
}
