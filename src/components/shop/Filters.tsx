"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Collection } from "@/lib/shopify/types";

export default function Filters({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("collection");

  function setCollection(handle: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (handle) {
      params.set("collection", handle);
    } else {
      params.delete("collection");
    }
    router.push(`/shop?${params.toString()}`);
  }

  if (collections.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setCollection(null)}
        className={`border px-5 py-2.5 text-xs font-medium uppercase tracking-widest2 transition-all duration-300 ${
          !active
            ? "border-accent bg-accent/10 text-accent"
            : "border-white/15 text-foreground-secondary hover:border-white/40 hover:text-foreground"
        }`}
      >
        All
      </button>
      {collections.map((collection) => (
        <button
          key={collection.id}
          type="button"
          onClick={() => setCollection(collection.handle)}
          className={`border px-5 py-2.5 text-xs font-medium uppercase tracking-widest2 transition-all duration-300 ${
            active === collection.handle
              ? "border-accent bg-accent/10 text-accent"
              : "border-white/15 text-foreground-secondary hover:border-white/40 hover:text-foreground"
          }`}
        >
          {collection.title}
        </button>
      ))}
    </div>
  );
}
