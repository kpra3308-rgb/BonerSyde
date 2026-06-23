import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse every BONESYDE collection.",
};

export default async function CollectionsPage() {
  const collections = await getCollections(50);

  return (
    <div className="pt-32 pb-24">
      <div className="container-px max-w-container mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">Browse</p>
          <h1 className="font-display text-display-md font-semibold text-foreground">Collections</h1>
        </div>

        {collections.length === 0 ? (
          <p className="text-foreground-secondary">No collections found yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {collections.map((collection, i) => (
              <AnimatedSection key={collection.id} delay={Math.min(i, 4) * 0.05}>
                <Link
                  href={`/collections/${collection.handle}`}
                  className="group relative aspect-[4/5] overflow-hidden bg-background-secondary/10 block"
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
                    <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                      {collection.title}
                    </h2>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
