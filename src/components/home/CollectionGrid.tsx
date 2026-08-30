import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function CollectionGrid() {
  const collections = await getCollections(6);
  if (collections.length === 0) return null;

  return (
    <AnimatedSection as="section" className="py-24">
      <div className="container-px max-w-container mx-auto mb-10">
        <p className="eyebrow mb-3">Shop By</p>
        <h2 className="font-display text-display-sm font-semibold text-foreground">Collections</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.handle}`}
            className="group relative aspect-[3/4] overflow-hidden bg-background-secondary/10"
          >
            {collection.handle === "oversized-tees" ? (
              <img
                src="/hero.jpg"
                alt={collection.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
            ) : collection.image && (
              <Image
                src={collection.image.url}
                alt={collection.image.altText ?? collection.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <h3 className="font-article text-3xl sm:text-4xl lg:text-5xl text-white drop-shadow-lg lowercase">
                {collection.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  );
}
