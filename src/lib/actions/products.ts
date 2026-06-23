"use server";

import { getProducts } from "@/lib/shopify";
import type { ProductFilters } from "@/lib/shopify/types";

export async function loadMoreProductsAction(filters: ProductFilters & { first?: number }) {
  return getProducts(filters);
}
