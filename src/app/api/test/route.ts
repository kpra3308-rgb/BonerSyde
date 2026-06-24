import { NextResponse } from "next/server";
import { getProductByHandle, getProducts, getCollections, getCollectionByHandle } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const products = await getProducts({ first: 3 });
    results.getProducts = { count: products.products.length, handles: products.products.map((p) => p.handle) };
  } catch (e: unknown) {
    results.getProducts = { error: e instanceof Error ? e.message : String(e) };
  }

  try {
    const product = await getProductByHandle("frank-ocean-tee");
    results.getProductByHandle = product ? { handle: product.handle, title: product.title } : null;
  } catch (e: unknown) {
    results.getProductByHandle = { error: e instanceof Error ? e.message : String(e) };
  }

  try {
    const collections = await getCollections(5);
    results.getCollections = { count: collections.length, handles: collections.map((c) => c.handle) };
  } catch (e: unknown) {
    results.getCollections = { error: e instanceof Error ? e.message : String(e) };
  }

  try {
    const col = await getCollectionByHandle("new-arrivals");
    results.getCollectionByHandle = col.collection ? { handle: col.collection.handle, title: col.collection.title } : null;
  } catch (e: unknown) {
    results.getCollectionByHandle = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(results);
}
