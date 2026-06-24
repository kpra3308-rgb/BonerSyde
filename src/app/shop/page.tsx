import type { Metadata } from "next";
import { getCollections, getProducts } from "@/lib/shopify";
import SearchBar from "@/components/shop/SearchBar";
import { mapSortToShopify } from "@/lib/sort";
import SortDropdown from "@/components/shop/SortDropdown";
import Filters from "@/components/shop/Filters";
import ShopGrid from "@/components/shop/ShopGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop the full BONESYDE collection.",
};

type ShopPageProps = {
  searchParams: Promise<{ q?: string; sort?: string; collection?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q, sort, collection } = await searchParams;
  const { sortKey, reverse } = mapSortToShopify(sort ?? null);

  const filters = {
    query: q,
    sortKey: sortKey as "RELEVANCE" | "BEST_SELLING" | "CREATED" | "PRICE" | "TITLE",
    reverse,
    collectionHandle: collection,
  };

  const [{ products, hasNextPage, endCursor }, collections] = await Promise.all([
    getProducts({ ...filters, first: 24 }),
    getCollections(20),
  ]);

  return (
    <div className="pt-32 pb-24">
      <div className="container-px max-w-container mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">All Products</p>
          <h1 className="font-display text-display-md font-semibold text-foreground">Shop</h1>
        </div>

        <div className="flex flex-col gap-6 mb-10 lg:flex-row lg:items-center lg:justify-between">
          <Filters collections={collections} />
          <div className="flex items-center gap-3">
            <SearchBar />
            <SortDropdown />
          </div>
        </div>

        <ShopGrid
          initialProducts={products}
          initialHasNextPage={hasNextPage}
          initialEndCursor={endCursor}
          filters={filters}
        />
      </div>
    </div>
  );
}
