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
    results.shopifyFetch = data.product ? "FOUND" : "NULL";
  } catch (e: unknown) {
    results.shopifyFetchError = e instanceof Error ? e.message : String(e);
  }

  try {
    const { getProductByHandle } = await import("@/lib/shopify");
    const product = await getProductByHandle("frank-ocean-tee");
    results.getProductByHandle = product ? "FOUND" : "NULL";
  } catch (e: unknown) {
    results.getProductByHandleError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results);
}
