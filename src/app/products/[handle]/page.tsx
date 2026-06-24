import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/shopify";
import ProductGallery from "@/components/product/ProductGallery";
import ProductForm from "@/components/product/ProductForm";
import RelatedProducts from "@/components/product/RelatedProducts";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};

  return {
    title: product.title,
    description: product.description || `Shop ${product.title} from BONESYDE.`,
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0].url }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  return (
    <div className="pt-32 pb-24">
      <div className="container-px max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery images={product.images} title={product.title} />

          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow mb-3">{product.vendor || "BONESYDE"}</p>
            <h1 className="font-display text-display-sm font-semibold text-foreground mb-6">
              {product.title}
            </h1>

            <ProductForm product={product} />

            {product.descriptionHtml && (
              <details className="group mt-10 border-t border-line py-5" open>
                <summary className="flex cursor-pointer items-center justify-between text-sm uppercase tracking-widest2 text-foreground">
                  Description
                  <span className="transition-transform duration-300 group-open:rotate-45 text-accent">+</span>
                </summary>
                <div
                  className="prose-invert mt-4 text-sm leading-relaxed text-foreground-secondary [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </details>
            )}

            <details className="group border-t border-line py-5">
              <summary className="flex cursor-pointer items-center justify-between text-sm uppercase tracking-widest2 text-foreground">
                Shipping & Returns
                <span className="transition-transform duration-300 group-open:rotate-45 text-accent">+</span>
              </summary>
              <div className="mt-4 text-sm leading-relaxed text-foreground-secondary">
                <p className="mb-3">
                  Orders are processed within 1–2 business days. Standard shipping arrives in
                  3–7 business days; expedited options are available at checkout.
                </p>
                <p>
                  Unworn items in original condition may be returned within 30 days of
                  delivery. See our return policy for full details.
                </p>
              </div>
            </details>

            <details className="group border-t border-b border-line py-5">
              <summary className="flex cursor-pointer items-center justify-between text-sm uppercase tracking-widest2 text-foreground">
                Size & Fit
                <span className="transition-transform duration-300 group-open:rotate-45 text-accent">+</span>
              </summary>
              <div className="mt-4 text-sm leading-relaxed text-foreground-secondary">
                <p>
                  Designed for a true-to-size, considered fit. For an oversized look, size up
                  one size.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <RelatedProducts productId={product.id} />
    </div>
  );
}
