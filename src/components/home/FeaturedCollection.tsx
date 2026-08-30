import Image from "next/image";
import Link from "next/link";
import { getCollectionByHandle, getCollections } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function FeaturedCollection() {
  const collections = await getCollections(10);
  if (collections.length === 0) return null;

  // Prefer a collection explicitly handled "featured" in Shopify, otherwise
  // fall back to the first collection returned by the store.
  const preferredHandle =
    collections.find((c) => c.handle === "featured")?.handle ?? collections[0].handle;

  const { collection } = await getCollectionByHandle(preferredHandle, { first: 1 });
  if (!collection) return null;

  return (
    <AnimatedSection as="section" className="relative">
      <div className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-background-secondary/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 container-px max-w-container mx-auto pb-16">
          <p className="eyebrow mb-4">Featured Collection</p>
          <h2 className="font-display text-display-md font-semibold text-foreground max-w-xl">
            {collection.title}
          </h2>
          {collection.description && (
            <p className="mt-4 max-w-lg text-sm text-foreground-secondary leading-relaxed">
              {collection.description}
            </p>
          )}
          <Link href={`/collections/${collection.handle}`} className="btn-primary mt-8 inline-flex">
            Shop The Collection
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
