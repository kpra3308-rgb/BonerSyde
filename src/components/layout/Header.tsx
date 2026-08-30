"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import MobileMenu from "@/components/layout/MobileMenu";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [bannerHidden, setBannerHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { cart, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 40) {
        setBannerHidden(true);
      } else {
        setBannerHidden(false);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <>
      {bannerVisible && (
        <div
          className={`fixed top-0 left-0 right-0 z-[60] bg-[#00D26A] text-white text-center py-2.5 px-4 text-sm font-medium tracking-wide transition-transform duration-300 ease-in-out ${
            bannerHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <span>Use Code &quot;SIXTWOSIX&quot; for 5% off</span>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            aria-label="Close banner"
          >
            ✕
          </button>
        </div>
      )}

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-premium ${
          bannerVisible && !bannerHidden ? "top-[40px]" : "top-0"
        } ${
          isScrolled
            ? "bg-background/85 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container-px max-w-container mx-auto flex items-center justify-between h-[76px]">
          <Link
            href="/"
            className="font-article text-lg sm:text-xl font-bold tracking-widest2 text-foreground"
          >
            Bonesyde°
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] uppercase tracking-widest2 text-foreground-secondary hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/shop"
              aria-label="Search products"
              className="hidden sm:inline-flex text-foreground-secondary hover:text-accent transition-colors duration-300"
            >
              <SearchIcon />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${itemCount} items`}
              className="relative inline-flex text-foreground hover:text-accent transition-colors duration-300"
            >
              <BagIcon />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center h-4 w-4 rounded-full bg-accent text-background text-[10px] font-semibold">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden inline-flex text-foreground"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={NAV_LINKS}
      />
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l1.2 12.2A2 2 0 0 1 17.2 22H6.8a2 2 0 0 1-2-1.8L6 8z" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
