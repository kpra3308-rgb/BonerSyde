import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function BrandStory() {
  const { products } = await getProducts({ first: 2 });
  const [imgA, imgB] = products;

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

        <AnimatedSection delay={0.15} className="relative h-[480px] sm:h-[560px]">
          {imgA?.featuredImage && (
            <div className="absolute left-0 top-0 h-[65%] w-[55%] overflow-hidden">
              <Image
                src={imgA.featuredImage.url}
                alt={imgA.featuredImage.altText ?? "BONESYDE garment detail"}
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          )}
          {imgB?.featuredImage && (
            <div className="absolute bottom-0 right-0 h-[75%] w-[65%] overflow-hidden border-4 border-background">
              <Image
                src={imgB.featuredImage.url}
                alt={imgB.featuredImage.altText ?? "BONESYDE garment detail"}
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          )}
          {!imgA && !imgB && (
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/brand-story.jpg"
                alt="BONESYDE brand story"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
