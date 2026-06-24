"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const DEFAULT_ITEMS = [
  "PREMIUM STREETWEAR",
  "BUILT TO OUTLAST TREND",
  "SMALL BATCH PRODUCTION",
  "POP-CULTURE STARTS HERE",
  "NEW DROPS WEEKLY",
];

export default function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Duplicate content is already rendered in markup (two copies) so the
    // loop can be perfectly seamless — GSAP just animates the combined
    // track left by exactly one copy's width, then resets instantly.
    const distance = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -distance,
      duration: items.join("").length * 0.09,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [items]);

  return (
    <div className="relative overflow-hidden border-y border-line bg-background py-4">
      <div ref={trackRef} className="flex w-max items-center gap-10 will-change-transform">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-xs uppercase tracking-widest2 text-foreground-secondary whitespace-nowrap"
          >
            {item}
            <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
