"use client";

import { useState } from "react";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-[60] bg-[#E91E8C] text-white text-center py-2.5 px-4 text-sm font-medium tracking-wide">
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
