"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatedSection
      as="section"
      className="container-px max-w-container mx-auto py-24 border-t border-line"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-5">Stay Inside</p>
        <h2 className="font-display text-display-sm font-semibold text-foreground mb-4">
          Get early access to drops.
        </h2>
        <p className="text-sm text-foreground-secondary mb-10">
          Join the list for early product access, restocks, and members-only pricing.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 border border-white/20 bg-transparent px-5 py-3.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent transition-colors duration-300 outline-none"
          />
          <button type="submit" disabled={status === "loading"} className="btn-primary">
            {status === "loading" ? "Joining..." : "Join"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm text-accent">You&rsquo;re on the list.</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-foreground-secondary">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </AnimatedSection>
  );
}
