"use client";

import { useState, useEffect, useRef } from "react";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 40) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-[#00D26A] text-white text-center py-2.5 px-4 text-sm font-medium tracking-wide transition-transform duration-300 ease-in-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <span>Use Code "SIXTWOSIX" for 5% off</span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Close banner"
      >
        ✕
      </button>
    </div>
  );
}
