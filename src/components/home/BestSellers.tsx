import Link from "next/link";
import { getProductByHandle } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FeaturedSlider from "./FeaturedSlider";

const PINNED_HANDLES = [
  "frank-ocean-tee",
  "tyler-the-creator-tee",
  "playboi-carti-tee",
  "kanye-west-tee",
];

export default async function BestSellers() {
  const products = (
    await Promise.all(PINNED_HANDLES.map((handle) => getProductByHandle(handle)))
  ).filter(Boolean);

  if (products.length === 0) return null;

  return (
    <AnimatedSection
      as="section"
      className="container-px max-w-container mx-auto py-24 border-t border-line"
    >
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">Most Wanted</p>
          <h2 className="font-display text-display-sm font-semibold text-foreground">
            Best Sellers
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline text-sm uppercase tracking-widest2 text-foreground-secondary hover:text-accent transition-colors link-underline"
        >
          Shop All
        </Link>
      </div>

      <FeaturedSlider products={products} />
    </AnimatedSection>
  );
}
