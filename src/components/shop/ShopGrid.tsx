"use client";

import { useState, useTransition } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { loadMoreProductsAction } from "@/lib/actions/products";
import type { ProductCardData, ProductFilters } from "@/lib/shopify/types";

type ShopGridProps = {
  initialProducts: ProductCardData[];
  initialHasNextPage: boolean;
  initialEndCursor: string | null;
  filters: ProductFilters;
};

export default function ShopGrid({
  initialProducts,
  initialHasNextPage,
  initialEndCursor,
  filters,
}: ShopGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    startTransition(async () => {
      const result = await loadMoreProductsAction({ ...filters, after: endCursor });
      setProducts((prev) => [...prev, ...result.products]);
      setHasNextPage(result.hasNextPage);
      setEndCursor(result.endCursor);
    });
  }

  return (
    <div>
      <ProductGrid products={products} />
      {hasNextPage && (
        <div className="mt-16 flex justify-center">
          <button type="button" onClick={loadMore} disabled={isPending} className="btn-outline">
            {isPending ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
