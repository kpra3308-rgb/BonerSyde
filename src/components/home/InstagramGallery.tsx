import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function InstagramGallery() {
  const { products } = await getProducts({ first: 6 });
  const items = products.filter((p) => p.featuredImage);

  if (items.length === 0) return null;

  return (
    <AnimatedSection as="section" className="border-t border-line">
      <div className="container-px max-w-container mx-auto py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Shop The Feed</p>
            <h2 className="font-display text-display-sm font-semibold text-foreground">@bonesyde</h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline text-sm uppercase tracking-widest2 text-foreground-secondary hover:text-accent transition-colors link-underline"
          >
            Follow
          </a>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {items.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group relative aspect-square overflow-hidden bg-background-secondary/10"
            >
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-300 group-hover:bg-background/50 group-hover:opacity-100">
                <span className="text-[11px] uppercase tracking-widest2 text-foreground">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
