import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";
import BrandStorySlider from "./BrandStorySlider";

export default async function BrandStory() {
  const { products } = await getProducts({ first: 8 });
  const displayProducts = products.length > 0 ? products : [];

  return (
    <section className="container-px max-w-container mx-auto py-24 border-t border-line">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <AnimatedSection className="flex flex-col items-center lg:items-start gap-8">
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center border border-white/25 bg-transparent px-14 py-6 text-base font-semibold uppercase tracking-widest2 text-foreground transition-all duration-300 ease-premium hover:border-accent hover:text-accent hover:-translate-y-[2px]"
          >
            Shop All
            <svg className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          {displayProducts.length > 0 ? (
            <BrandStorySlider products={displayProducts} />
          ) : (
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src="/brand-story.jpg" alt="BONESYDE" className="w-full h-full object-cover" />
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
