import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/shopify";
import ShopGrid from "@/components/shop/ShopGrid";
import { mapSortToShopify } from "@/lib/sort";
import SortDropdown from "@/components/shop/SortDropdown";

export const dynamic = "force-dynamic";

type CollectionPageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const { collection } = await getCollectionByHandle(handle, { first: 1 });
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description || `Shop the ${collection.title} collection.`,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { handle } = await params;
  const { sort } = await searchParams;
  const mapped = mapSortToShopify(sort ?? null);
  const sortKey = mapped.sortKey === "CREATED_AT" ? "CREATED" : mapped.sortKey;

  const { collection, hasNextPage, endCursor } = await getCollectionByHandle(handle, {
    first: 24,
    sortKey,
    reverse: mapped.reverse,
  });

  if (!collection) notFound();

  const filters = {
    collectionHandle: handle,
    sortKey: sortKey as "RELEVANCE" | "BEST_SELLING" | "CREATED" | "PRICE" | "TITLE",
    reverse,
  };

  return (
    <div className="pb-24">
      <div className="relative h-[55vh] min-h-[360px] w-full overflow-hidden mt-[76px]">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : collection.products.length > 0 && collection.products[0].featuredImage ? (
          <Image
            src={collection.products[0].featuredImage.url}
            alt={collection.products[0].featuredImage.altText ?? collection.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-background-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container-px max-w-container mx-auto pb-10">
          <p className="eyebrow mb-3">Collection</p>
          <h1 className="font-display text-display-md font-semibold text-foreground">
            {collection.title}
          </h1>
        </div>
      </div>

      <div className="container-px max-w-container mx-auto pt-10">
        {collection.description && (
          <p className="max-w-2xl text-sm leading-relaxed text-foreground-secondary mb-10">
            {collection.description}
          </p>
        )}

        <div className="mb-8 flex justify-end">
          <SortDropdown basePath={`/collections/${handle}`} />
        </div>

        <ShopGrid
          initialProducts={collection.products}
          initialHasNextPage={hasNextPage}
          initialEndCursor={endCursor}
          filters={filters}
        />
      </div>
    </div>
  );
}
