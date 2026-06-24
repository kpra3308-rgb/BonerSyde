import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/shopify";
import ProductGallery from "@/components/product/ProductGallery";
import ProductForm from "@/components/product/ProductForm";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};
  return { title: product.title };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  return (
    <div className="pt-32 pb-24 container-px">
      <h1>{product.title}</h1>
      <ProductGallery images={product.images} title={product.title} />
      <ProductForm product={product} />
    </div>
  );
}
