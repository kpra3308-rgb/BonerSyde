import Link from "next/link";
import { getProducts, getProductByHandle } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FeaturedSlider from "./FeaturedSlider";

export default async function NewArrivals() {
  const pinnedHandles = ["frank-ocean-tee", "tyler-the-creator-tee"];

  const [newProductsResult, ...pinnedProducts] = await Promise.all([
    getProducts({ first: 2, sortKey: "CREATED_AT", reverse: true }),
    ...pinnedHandles.map((handle) => getProductByHandle(handle)),
  ]);

  const pinned = pinnedProducts.filter(Boolean);
  const allProducts = [...pinned, ...newProductsResult.products];

  if (allProducts.length === 0) return null;

  return (
    <AnimatedSection as="section" className="container-px max-w-container mx-auto py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">Curated Picks</p>
          <h2 className="font-display text-display-sm font-semibold text-foreground">
            Staff Favorites
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline text-sm uppercase tracking-widest2 text-foreground-secondary hover:text-accent transition-colors link-underline"
        >
          Shop All
        </Link>
      </div>

      <FeaturedSlider products={allProducts} />
    </AnimatedSection>
  );
}
