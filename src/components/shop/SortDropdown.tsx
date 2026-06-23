"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { mapSortToShopify } from "@/lib/sort";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A–Z", value: "title-asc" },
];

export { mapSortToShopify };

export default function SortDropdown({ basePath = "/shop" }: { basePath?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="relative">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none border border-white/20 bg-transparent px-4 py-2.5 pr-9 text-sm text-foreground focus:border-accent transition-colors duration-300 outline-none cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-background">
            {option.label}
          </option>
        ))}
      </select>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-secondary"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}


