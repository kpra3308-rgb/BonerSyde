import { getProducts } from "@/lib/shopify";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/ui/Marquee";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import BestSellers from "@/components/home/BestSellers";
import CollectionGrid from "@/components/home/CollectionGrid";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";
import InstagramGallery from "@/components/home/InstagramGallery";

export default async function HomePage() {
  const { products } = await getProducts({ first: 1, sortKey: "CREATED", reverse: true });
  const heroImage = products[0]?.featuredImage ?? null;

  return (
    <>
      <Hero image={heroImage} />
      <Marquee />
      <NewArrivals />
      <FeaturedCollection />
      <BestSellers />
      <CollectionGrid />
      <BrandStory />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
