import Image from "next/image";
import { getProducts } from "@/lib/shopify";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default async function BrandStory() {
  const { products } = await getProducts({ first: 2 });
  const [imgA, imgB] = products;

  return (
    <section className="container-px max-w-container mx-auto py-24 border-t border-line">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <AnimatedSection>
          <p className="eyebrow mb-5">The Brand</p>
          <h2 className="font-display text-display-md font-semibold text-foreground mb-6">
            Quiet confidence,
            <br />
            engineered to last.
          </h2>
          <p className="text-base leading-relaxed text-foreground-secondary max-w-md mb-5">
            BONESYDE is built for people who dress with intention. Every piece begins with
            structure — pattern, fabric, weight — before it ever becomes a design.
          </p>
          <p className="text-base leading-relaxed text-foreground-secondary max-w-md">
            We work in small batches, with mills and makers who share our obsession with
            permanence over hype. No noise. No filler. Just garments designed to outlast the
            season they were made for.
          </p>
          <div className="mt-10 flex gap-12">
            <div>
              <p className="font-display text-3xl font-bold text-accent">100%</p>
              <p className="mt-1 text-xs uppercase tracking-widest2 text-foreground-muted">
                Small Batch Production
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-accent">EST.</p>
              <p className="mt-1 text-xs uppercase tracking-widest2 text-foreground-muted">
                Built For Permanence
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="relative h-[480px] sm:h-[560px]">
          {imgA?.featuredImage && (
            <div className="absolute left-0 top-0 h-[70%] w-[65%] overflow-hidden">
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
            <div className="absolute bottom-0 right-0 h-[60%] w-[55%] overflow-hidden border-4 border-background">
              <Image
                src={imgB.featuredImage.url}
                alt={imgB.featuredImage.altText ?? "BONESYDE garment detail"}
                fill
                sizes="35vw"
                className="object-cover"
              />
            </div>
          )}
          {!imgA && !imgB && <div className="absolute inset-0 bg-background-secondary/15" />}
        </AnimatedSection>
      </div>
    </section>
  );
}
