"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-accent/30 bg-accent/5 px-6 py-8">
        <p className="text-foreground">Thanks — we&rsquo;ve received your message and will reply shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className="eyebrow mb-2 block">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-foreground focus:border-accent transition-colors duration-300 outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="eyebrow mb-2 block">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-foreground focus:border-accent transition-colors duration-300 outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="eyebrow mb-2 block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-foreground focus:border-accent transition-colors duration-300 outline-none resize-none"
        />
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary mt-2 self-start">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>

      {status === "error" && (
        <p className="text-sm text-foreground-secondary">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
