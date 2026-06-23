import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function CollectionGrid() {
  const collections = await getCollections(6);
  if (collections.length === 0) return null;

  return (
    <AnimatedSection as="section" className="container-px max-w-container mx-auto py-24 border-t border-line">
      <div className="mb-10">
        <p className="eyebrow mb-3">Shop By</p>
        <h2 className="font-display text-display-sm font-semibold text-foreground">Collections</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.handle}`}
            className="group relative aspect-[4/5] overflow-hidden bg-background-secondary/10"
          >
            {collection.image && (
              <Image
                src={collection.image.url}
                alt={collection.image.altText ?? collection.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                {collection.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  );
}
