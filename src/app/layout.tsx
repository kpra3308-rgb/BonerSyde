import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import Loader from "@/components/ui/Loader";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bonesyde.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BONESYDE — Premium Streetwear",
    template: "%s — BONESYDE",
  },
  description:
    "BONESYDE is a luxury streetwear label built on precision construction, considered silhouettes, and uncompromising quality.",
  keywords: ["BONESYDE", "streetwear", "luxury streetwear", "premium clothing"],
  openGraph: {
    type: "website",
    siteName: "BONESYDE",
    title: "BONESYDE — Premium Streetwear",
    description:
      "BONESYDE is a luxury streetwear label built on precision construction, considered silhouettes, and uncompromising quality.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BONESYDE — Premium Streetwear",
  },
};

export const viewport: Viewport = {
  themeColor: "#020E0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body>
        <Loader />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
